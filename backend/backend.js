const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// Import student request functions
const {
  createStudentRequest,
  getPendingRequests,
  getAllRequests,
  approveRequest,
  rejectRequest,
  getRequestsByTeacher,
  loadRequests
} = require('./student_requests');

// Path to users data file
const USERS_FILE = path.join(__dirname, 'users.json');
const MARKS_FILE = path.join(__dirname, 'marks.json');

// Function to load users from file
function loadUsers() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf8');
      userDatabase = JSON.parse(data);
      console.log('Users loaded from file:', userDatabase.length);
    } else {
      userDatabase = [];
      console.log('No users file found, starting with empty database');
    }
  } catch (error) {
    console.error('Error loading users:', error);
    userDatabase = [];
  }
}

// Function to save users to file
function saveUsers() {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(userDatabase, null, 2));
    console.log('Users saved to file');
  } catch (error) {
    console.error('Error saving users:', error);
  }
}

// Function to load marks from file
function loadMarks() {
  try {
    if (fs.existsSync(MARKS_FILE)) {
      const data = fs.readFileSync(MARKS_FILE, 'utf8');
      marksDatabase = JSON.parse(data);
      console.log('Marks loaded from file:', marksDatabase.length);
    } else {
      marksDatabase = [];
      console.log('No marks file found, starting with empty database');
    }
  } catch (error) {
    console.error('Error loading marks:', error);
    marksDatabase = [];
  }
}

// Function to save marks to file
function saveMarks() {
  try {
    fs.writeFileSync(MARKS_FILE, JSON.stringify(marksDatabase, null, 2));
    console.log('Marks saved to file');
  } catch (error) {
    console.error('Error saving marks:', error);
  }
}

// Simulated database - in production, this would be a real database
let userDatabase = [];
let marksDatabase = [];

// Create default admin user on startup
async function createDefaultAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = userDatabase.find(user => user.role === 'admin');
    if (existingAdmin) {
      console.log('Default admin already exists');
      return;
    }

    console.log('⚠️  No admin user found. Please register as admin first through the signup page.');
    console.log('Go to: http://localhost:3000/signup');
    console.log('After registering as admin, you can login and manage the system.');

  } catch (error) {
    console.error('Error checking admin:', error);
  }
}
// Function to generate a secure random password
function generateSecurePassword() {
  const length = Math.floor(Math.random() * 3) + 10; // 10-12 characters
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  const allChars = uppercase + lowercase + numbers + specialChars;
  let password = '';

  // Ensure at least one character from each category
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += specialChars[Math.floor(Math.random() * specialChars.length)];

  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

// Function to hash password using bcrypt
async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

// Function to send email using Gmail
async function sendPasswordEmail(email, password, userName, role) {
  // Create transporter with Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'aedumind@gmail.com',
      pass: 'rspb mkpm evdm anve' // 16-character App Password
    }
  });

  const roleDisplay = role.charAt(0).toUpperCase() + role.slice(1);
  const loginUrl = 'http://localhost:3000/login'; // Update this with your actual login URL

  const mailOptions = {
    from: 'aedumind@gmail.com',
    to: email,
    subject: 'Your EduMind Account Credentials',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to EduMind!</h2>
        <p>Dear ${userName},</p>
        <p>Your EduMind account has been created successfully as a <strong>${roleDisplay}</strong>. Here are your login details:</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Login ID (Email):</strong> ${email}</p>
          <p><strong>Generated Password:</strong> <code style="background-color: #e5e7eb; padding: 2px 4px; border-radius: 4px;">${password}</code></p>
          <p><strong>Login URL:</strong> <a href="${loginUrl}" style="color: #2563eb;">${loginUrl}</a></p>
        </div>
        <p><strong>Important:</strong> Please change your password after your first login for security purposes.</p>
        <p>If you have any questions, feel free to contact our support team.</p>
        <p>Best regards,<br>EduMind Admin Team</p>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

// Function to create admin user (no password generation or email)
async function createAdminUser(userData) {
  try {
    const { firstName, lastName, email, password } = userData;

    // Check if admin already exists
    const existingAdmin = userDatabase.find(user => user.role === 'admin');
    if (existingAdmin) {
      return {
        success: false,
        error: 'An admin account already exists'
      };
    }

    // Hash the provided password
    const hashedPassword = await hashPassword(password);

    // Create admin user record
    const adminRecord = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      role: 'admin',
      password: hashedPassword,
      isFirstLogin: false, // Admin sets their own password
      createdAt: new Date().toISOString(),
      status: 'active',
    };

    // Store in simulated database
    userDatabase.push(adminRecord);
    saveUsers();
    console.log('Admin user record stored in database');

    return {
      success: true,
      userId: adminRecord.id,
      message: 'Admin user created successfully'
    };

  } catch (error) {
    console.error('Error creating admin user:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Function to verify password
async function verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

// Main function to create user and send password
async function createUserAndSendPassword(userData) {
  try {
    const { firstName, lastName, email, role, className, rollNumber, designation, subject, childName, relationship, password } = userData;

    // Check if user already exists by email (Case insensitive)
    const existingUserIndex = userDatabase.findIndex(user => user.email.toLowerCase() === email.toLowerCase());
    if (existingUserIndex !== -1) {
      return {
        success: false,
        error: 'User with this email already exists'
      };
    }

    // Check if user already exists by name and role (same person)
    const existingPersonIndex = userDatabase.findIndex(user =>
      user.firstName === firstName &&
      user.lastName === lastName &&
      user.role === role
    );
    if (existingPersonIndex !== -1) {
      return {
        success: false,
        error: 'User with this name and role already exists'
      };
    }

    let generatedPassword;
    let isFirstLogin = true;

    // If password is provided (for admin), use it; otherwise generate one
    if (password) {
      generatedPassword = password;
      isFirstLogin = false; // Admin sets their own password
    } else {
      // Generate secure password only for non-admin users
      generatedPassword = generateSecurePassword();
      console.log('Generated password for', email, ':', generatedPassword);
    }

    // Hash the password
    const hashedPassword = await hashPassword(generatedPassword);
    console.log('Password hashed successfully');

    // Create user record
    const userRecord = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      role,
      password: hashedPassword,
      isFirstLogin,
      createdAt: new Date().toISOString(),
      status: 'active',
      // Role-specific fields
      ...(role === 'student' && { rollNumber, className }),
      ...(role === 'teacher' && { designation, subject }),
      ...(role === 'parent' && {
        children: userData.children || [{ name: childName || 'Child', grade: className || 'Grade 10' }],
        relationship
      }),
      ...(role === 'staff' && { designation }),
    };

    // Store in simulated database
    userDatabase.push(userRecord);
    saveUsers();
    console.log('User record stored in database');

    // Send email with generated password only if password was generated (not for admin)
    if (!password) {
      const fullName = `${firstName} ${lastName}`;
      await sendPasswordEmail(email, generatedPassword, fullName, role);
      console.log('Password email sent successfully');
    }

    return {
      success: true,
      userId: userRecord.id,
      message: password ? 'User created successfully' : 'User created successfully and password sent via email'
    };

  } catch (error) {
    console.error('Error creating user:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Function to authenticate user
async function authenticateUser(email, password) {
  try {
    const user = userDatabase.find(u => u.email === email);

    if (!user) {
      return {
        success: false,
        error: 'User not registered. Please contact Admin.'
      };
    }

    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return {
        success: false,
        error: 'Invalid credentials'
      };
    }

    // Return user data without password
    const { password: _, ...userData } = user;
    return {
      success: true,
      user: userData
    };

  } catch (error) {
    console.error('Error authenticating user:', error);
    return {
      success: false,
      error: 'Authentication failed'
    };
  }
}

// Function to change password
async function changePassword(userId, currentPassword, newPassword) {
  try {
    const user = userDatabase.find(u => u.id === userId);

    if (!user) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    // Verify current password
    const isValidCurrentPassword = await verifyPassword(currentPassword, user.password);
    if (!isValidCurrentPassword) {
      return {
        success: false,
        error: 'Current password is incorrect'
      };
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update user record
    user.password = hashedNewPassword;
    user.isFirstLogin = false;
    saveUsers();

    return {
      success: true,
      message: 'Password changed successfully'
    };

  } catch (error) {
    console.error('Error changing password:', error);
    return {
      success: false,
      error: 'Failed to change password'
    };
  }
}

// Function to get all users (for admin)
function getAllUsers() {
  return userDatabase.map(user => {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  });
}

// Express server setup
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/admin/register', async (req, res) => {
  try {
    const result = await createAdminUser(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    // Check if user is admin - require authorization header with admin token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Unauthorized. Admin access required.' });
    }

    const token = authHeader.substring(7);
    // Verify the token matches an admin user
    const adminUser = userDatabase.find(user => user.role === 'admin' && user.id === token);
    if (!adminUser) {
      return res.status(401).json({ success: false, error: 'Unauthorized. Admin access required.' });
    }

    const result = await createUserAndSendPassword(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authenticateUser(email, password);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/change-password', async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;
    const result = await changePassword(userId, currentPassword, newPassword);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/users', (req, res) => {
  try {
    const users = getAllUsers();
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/marks/:studentId', (req, res) => {
  try {
    const { studentId } = req.params;
    const studentMarks = marksDatabase.filter(m => m.studentId === studentId);
    res.json({ success: true, marks: studentMarks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/marks', (req, res) => {
  try {
    const { studentId, examType, subjects } = req.body;
    
    const newMark = {
      id: Date.now().toString(),
      studentId,
      examType, // "Internal 1", "Internal 2", "Internal 3", "Mid Term", "Final Exam"
      subjects, // Array of { subject, marks, total }
      date: new Date().toISOString()
    };

    marksDatabase.push(newMark);
    saveMarks();

    res.json({ success: true, message: 'Marks added successfully', markId: newMark.id });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/marks/:studentId/download', (req, res) => {
  try {
    const { studentId } = req.params;
    const studentMarks = marksDatabase.filter(m => m.studentId === studentId);
    const student = userDatabase.find(u => u.id === studentId);
    const studentName = student ? `${student.firstName} ${student.lastName}` : 'Student';

    let csvContent = 'Exam Type,Subject,Marks Obtained,Total Marks,Percentage,Date\n';

    studentMarks.forEach(record => {
      record.subjects.forEach(sub => {
        const percentage = sub.total > 0 ? ((sub.marks / sub.total) * 100).toFixed(2) : '0.00';
        csvContent += `"${record.examType}","${sub.subject}",${sub.marks},${sub.total},${percentage}%,${new Date(record.date).toLocaleDateString()}\n`;
      });
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="Report_${studentName.replace(/\s+/g, '_')}.csv"`);
    res.send(csvContent);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Student Request Routes
app.post('/api/student-requests', async (req, res) => {
  try {
    // Check if user is teacher - require authorization header with teacher token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Unauthorized. Teacher access required.' });
    }

    const token = authHeader.substring(7);
    // Verify the token matches a teacher user
    const teacherUser = userDatabase.find(user => user.role === 'teacher' && user.id === token);
    if (!teacherUser) {
      return res.status(401).json({ success: false, error: 'Unauthorized. Teacher access required.' });
    }

    const requestData = {
      ...req.body,
      teacherId: teacherUser.id,
      teacherName: `${teacherUser.firstName} ${teacherUser.lastName}`
    };

    const result = createStudentRequest(requestData);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/student-requests', (req, res) => {
  try {
    // Check if user is admin - require authorization header with admin token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Unauthorized. Admin access required.' });
    }

    const token = authHeader.substring(7);
    // Verify the token matches an admin user
    const adminUser = userDatabase.find(user => user.role === 'admin' && user.id === token);
    if (!adminUser) {
      return res.status(401).json({ success: false, error: 'Unauthorized. Admin access required.' });
    }

    const requests = getAllRequests();
    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/student-requests/:id/approve', async (req, res) => {
  try {
    // Check if user is admin - require authorization header with admin token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Unauthorized. Admin access required.' });
    }

    const token = authHeader.substring(7);
    // Verify the token matches an admin user
    const adminUser = userDatabase.find(user => user.role === 'admin' && user.id === token);
    if (!adminUser) {
      return res.status(401).json({ success: false, error: 'Unauthorized. Admin access required.' });
    }

    const { id } = req.params;
    const { note } = req.body;

    const result = approveRequest(id, adminUser.id, `${adminUser.firstName} ${adminUser.lastName}`, note);

    if (result.success) {
      const request = result.request;

      // If it's an add request, register the student
      if (request.type === 'add') {
        const userData = {
          ...request.studentData,
          role: 'student'
        };

        const registerResult = await createUserAndSendPassword(userData);
        if (!registerResult.success) {
          return res.status(500).json({
            success: false,
            error: `Request approved but student registration failed: ${registerResult.error}`
          });
        }
      }
      // For delete requests, we would need additional logic to remove the student
      // This would require finding and removing the student from userDatabase
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/student-requests/:id/reject', (req, res) => {
  try {
    // Check if user is admin - require authorization header with admin token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Unauthorized. Admin access required.' });
    }

    const token = authHeader.substring(7);
    // Verify the token matches an admin user
    const adminUser = userDatabase.find(user => user.role === 'admin' && user.id === token);
    if (!adminUser) {
      return res.status(401).json({ success: false, error: 'Unauthorized. Admin access required.' });
    }

    const { id } = req.params;
    const { note } = req.body;

    const result = rejectRequest(id, adminUser.id, `${adminUser.firstName} ${adminUser.lastName}`, note);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`EduMind Backend Server running on port ${PORT}`);
  loadUsers();
  loadMarks();
  await createDefaultAdmin();
});

// Example usage
async function main() {
  const userData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    role: 'student',
    className: '10-A',
    rollNumber: 'STU001'
  };

  const result = await createUserAndSendPassword(userData);

  if (result.success) {
    console.log('✅ User creation completed successfully!');
    console.log('User ID:', result.userId);
    console.log('Database contents:', userDatabase);
  } else {
    console.log('❌ User creation failed:', result.error);
  }
}

// Run the script if called directly
if (require.main === module) {
  main();
}

module.exports = {
  createUserAndSendPassword,
  createAdminUser,
  generateSecurePassword,
  hashPassword,
  sendPasswordEmail,
  authenticateUser,
  changePassword,
  getAllUsers,
  app
};
