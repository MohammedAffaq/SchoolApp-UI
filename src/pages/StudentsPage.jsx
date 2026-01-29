import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Bus,
  DollarSign,
  CalendarCheck,
  LogOut,
  Search,
  Bell,
  Phone,
  Mail,
  Plus,
  User,
  X,
  Trash2,
  AlertCircle,
  Menu,
  Settings,
  Download,
  CheckCircle,
  Copy,
  ShieldCheck
} from 'lucide-react';
import { validateAuth, logout } from '../utils/auth';

const StudentsPage = ({ onLogout }) => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Newest');
  const [selectedGrade, setSelectedGrade] = useState('All Grades');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    rollNumber: '',
    className: ''
  });
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  React.useEffect(() => {
    const fetchAdminName = () => {
      const storedName = localStorage.getItem('userName');
      if (storedName) {
        setAdminName(storedName);
        return;
      }
      try {
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
        if (registeredUsers.admin && registeredUsers.admin.firstName) {
          setAdminName(`${registeredUsers.admin.firstName} ${registeredUsers.admin.lastName}`);
        } else {
          setAdminName('Admin');
        }
      } catch (error) {
        console.error('Error fetching admin name:', error);
      }
    };
    fetchAdminName();
  }, []);

  React.useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/student-requests');
        const result = await response.json();
        if (result.success) {
          setPendingRequestsCount(result.requests.filter(req => req.status === 'pending').length);
        }
      } catch (error) {
        console.error('Error fetching pending requests:', error);
      }
    };
    fetchPendingRequests();
  }, []);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedFilter, selectedGrade]);

  // Sample student data
  const [students, setStudents] = useState([
    {
      id: 'STU001',
      name: 'Alice Johnson',
      avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson&background=5A4FCF&color=fff',
      date: '2023-10-15',
      parentName: 'Robert Johnson',
      city: 'New York',
      grade: 'Grade 10',
      contact: { phone: '+1-555-0123', email: 'alice.johnson@email.com' }
    },
    {
      id: 'STU002',
      name: 'Michael Chen',
      avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=5A4FCF&color=fff',
      date: '2023-09-20',
      parentName: 'Sarah Chen',
      city: 'Los Angeles',
      grade: 'Grade 9',
      contact: { phone: '+1-555-0124', email: 'michael.chen@email.com' }
    },
    {
      id: 'STU003',
      name: 'Emma Davis',
      avatar: 'https://ui-avatars.com/api/?name=Emma+Davis&background=5A4FCF&color=fff',
      date: '2023-08-10',
      parentName: 'James Davis',
      city: 'Chicago',
      grade: 'Grade 11',
      contact: { phone: '+1-555-0125', email: 'emma.davis@email.com' }
    },
    {
      id: 'STU004',
      name: 'Ryan Wilson',
      avatar: 'https://ui-avatars.com/api/?name=Ryan+Wilson&background=5A4FCF&color=fff',
      date: '2023-07-05',
      parentName: 'Lisa Wilson',
      city: 'Houston',
      grade: 'Grade 8',
      contact: { phone: '+1-555-0126', email: 'ryan.wilson@email.com' }
    },
    {
      id: 'STU005',
      name: 'Sophia Brown',
      avatar: 'https://ui-avatars.com/api/?name=Sophia+Brown&background=5A4FCF&color=fff',
      date: '2023-06-15',
      parentName: 'David Brown',
      city: 'Phoenix',
      grade: 'Grade 12',
      contact: { phone: '+1-555-0127', email: 'sophia.brown@email.com' }
    },
    {
      id: 'STU006',
      name: 'Daniel Lee',
      avatar: 'https://ui-avatars.com/api/?name=Daniel+Lee&background=5A4FCF&color=fff',
      date: '2023-05-20',
      parentName: 'Christopher Lee',
      city: 'San Francisco',
      grade: 'Grade 10',
      contact: { phone: '+1-555-0128', email: 'daniel.lee@email.com' }
    },
    {
      id: 'STU007',
      name: 'Olivia Martinez',
      avatar: 'https://ui-avatars.com/api/?name=Olivia+Martinez&background=5A4FCF&color=fff',
      date: '2023-04-12',
      parentName: 'Jennifer Martinez',
      city: 'Miami',
      grade: 'Grade 9',
      contact: { phone: '+1-555-0129', email: 'olivia.martinez@email.com' }
    },
    {
      id: 'STU008',
      name: 'Lucas Taylor',
      avatar: 'https://ui-avatars.com/api/?name=Lucas+Taylor&background=5A4FCF&color=fff',
      date: '2023-03-25',
      parentName: 'William Taylor',
      city: 'Seattle',
      grade: 'Grade 11',
      contact: { phone: '+1-555-0130', email: 'lucas.taylor@email.com' }
    },
    {
      id: 'STU009',
      name: 'Ava Anderson',
      avatar: 'https://ui-avatars.com/api/?name=Ava+Anderson&background=5A4FCF&color=fff',
      date: '2023-02-18',
      parentName: 'Elizabeth Anderson',
      city: 'Boston',
      grade: 'Grade 8',
      contact: { phone: '+1-555-0131', email: 'ava.anderson@email.com' }
    },
    {
      id: 'STU010',
      name: 'Ethan Jackson',
      avatar: 'https://ui-avatars.com/api/?name=Ethan+Jackson&background=5A4FCF&color=fff',
      date: '2023-01-30',
      parentName: 'Patricia Jackson',
      city: 'Denver',
      grade: 'Grade 12',
      contact: { phone: '+1-555-0132', email: 'ethan.jackson@email.com' }
    },
  ]);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.parentName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'All Grades' || student.grade === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExportCSV = () => {
    // Define headers
    const headers = ['ID', 'Name', 'Date', 'Parent Name', 'City', 'Grade', 'Phone', 'Email'];

    // Convert data to CSV rows
    const csvRows = [
      headers.join(','), // Header row
      ...filteredStudents.map(student => [
        `"${student.id}"`,
        `"${student.name}"`,
        `"${student.date}"`,
        `"${student.parentName}"`,
        `"${student.city}"`,
        `"${student.grade}"`,
        `"${student.contact.phone}"`,
        `"${student.contact.email}"`
      ].join(','))
    ];

    // Create blob and download link
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'students_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewProfile = (student) => {
    setSelectedStudent(student);
    setShowProfileModal(true);
  };

  const confirmDelete = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  const handleDeleteStudent = () => {
    setStudents(students.filter(s => s.id !== studentToDelete.id));
    setShowDeleteModal(false);
    setStudentToDelete(null);
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();

    // Validate authentication before proceeding
    const authValidation = validateAuth();
    if (!authValidation.isValid) {
      if (authValidation.error === 'Session expired. Please login again.') {
        alert('Your session has expired. Please login again.');
        logout();
        return;
      }
      alert(authValidation.error);
      return;
    }

    const userData = {
      firstName: newStudent.firstName,
      lastName: newStudent.lastName,
      email: newStudent.email,
      phone: newStudent.phone,
      rollNumber: newStudent.rollNumber,
      className: newStudent.className,
      role: 'student'
    };

    try {
      const response = await fetch('http://localhost:5001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authValidation.token}`,
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Student registered successfully!');
        setCreatedCredentials({ email: newStudent.email, password: 'Sent via email', role: 'Student' });
        setShowCredentialsModal(true);

        // Also add to local students list for display
        const student = {
          id: `STU00${students.length + 1}`,
          name: `${newStudent.firstName} ${newStudent.lastName}`,
          avatar: `https://ui-avatars.com/api/?name=${newStudent.firstName}+${newStudent.lastName}&background=0EA5E9&color=fff`,
          date: new Date().toISOString().split('T')[0],
          parentName: 'N/A', // Parent info not collected here
          city: 'N/A',
          grade: newStudent.className,
          contact: { phone: newStudent.phone, email: newStudent.email }
        };
        setStudents([...students, student]);

        setShowAddModal(false);
        setNewStudent({ firstName: '', lastName: '', email: '', phone: '', rollNumber: '', className: '' });
      } else {
        if (result.error === 'Invalid token or authorization error.' ||
          result.error === 'Unauthorized. Admin access required.') {
          alert('Your session has expired. Please login again.');
          logout();
          return;
        }
        alert('Failed to register student: ' + result.error);
      }
    } catch (error) {
      console.error('Error registering student:', error);
      alert('Failed to connect to server.');
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-gray-800 overflow-hidden">
      {/* Left Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out shadow-sm ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-4 flex items-center justify-center gap-3">
          <img src="/assets/logo.png" alt="EduMind Logo" className="h-32 w-auto max-w-full object-contain" />
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" onClick={() => navigate('/admin')} />
          <NavItem icon={<ShieldCheck size={20} />} label="Verification" onClick={() => navigate('/admin', { state: { activeView: 'verification' } })} badge={pendingRequestsCount} />
          <NavItem icon={<GraduationCap size={20} />} label="Students" active onClick={() => navigate('/admin/students')} />
          <NavItem icon={<Users size={20} />} label="Teachers" onClick={() => navigate('/admin/teachers')} />
          <NavItem icon={<User size={20} />} label="Parents" onClick={() => navigate('/admin/parents')} />
          <NavItem icon={<Bus size={20} />} label="Driver & Vehicles" onClick={() => navigate('/admin/drivers')} />
          <NavItem icon={<DollarSign size={20} />} label="Finance" onClick={() => navigate('/admin/finance')} />
          <NavItem icon={<CalendarCheck size={20} />} label="Attendance" onClick={() => navigate('/admin/attendance')} />
          <NavItem icon={<Settings size={20} />} label="Settings" onClick={() => navigate('/admin/settings')} />
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 text-text-secondary hover:text-danger hover:bg-red-50 w-full p-3 rounded-xl transition-colors duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Wrapper */}
      <div className="flex-1 lg:ml-64 flex flex-col h-screen">
        {/* Top Header */}
        <header className="h-20 bg-card/80 backdrop-blur-md border-b border-gray-100 flex justify-between items-center px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden"
            >
              <Menu size={24} />
            </button>
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
              <input
                type="text"
                placeholder="Search students..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none text-sm text-text placeholder-text-secondary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/admin/notifications')}
              className="relative p-2 text-text-secondary hover:text-primary transition-colors"
            >
              <Bell size={28} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border-2 border-white"></span>
            </button>
            <button onClick={() => navigate('/admin/profile')} className="flex items-center gap-3 pl-6 border-l border-gray-100 hover:bg-gray-50 rounded-lg -ml-2 p-2 transition-colors">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-text">{adminName}</p>
                <p className="text-xs text-text-secondary font-medium">Admin Administrator</p>
              </div>
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(adminName)}&background=c7d2fe&color=3730a3`}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
              />
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-100">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-text mb-2">Students</h1>
                <p className="text-text-secondary">Manage and view all student information</p>
              </div>

              <div className="flex items-center gap-4">
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="bg-card border border-gray-200 text-text-secondary rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option>All Grades</option>
                  {[...new Set(students.map(s => s.grade))].sort().map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="bg-card border border-gray-200 text-text-secondary rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option>Newest</option>
                  <option>Oldest</option>
                  <option>A-Z</option>
                  <option>Z-A</option>
                </select>
                <button onClick={handleExportCSV} className="bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Download size={18} />
                  Export
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  <Plus size={18} />
                  New Student
                </button>
              </div>
            </div>

            {/* Students Table */}
            <div className="bg-card rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-text-secondary">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-text-secondary">ID</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-text-secondary">Date</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-text-secondary">Parent Name</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-text-secondary">City</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-text-secondary">Contact</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-text-secondary">Grade</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-text-secondary">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedStudents.map((student, index) => (
                      <tr key={student.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={student.avatar}
                              alt={student.name}
                              className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                            />
                            <span className="font-medium text-text">{student.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-text-secondary font-medium">{student.id}</td>
                        <td className="px-6 py-4 text-text-secondary">{student.date}</td>
                        <td className="px-6 py-4 text-text-secondary">{student.parentName}</td>
                        <td className="px-6 py-4 text-text-secondary">{student.city}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => window.open(`tel:${student.contact.phone}`, '_self')}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title={`Call ${student.contact.phone}`}
                            >
                              <Phone size={16} />
                            </button>
                            <button
                              onClick={() => window.open(`mailto:${student.contact.email}`, '_self')}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title={`Email ${student.contact.email}`}
                            >
                              <Mail size={16} />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                            {student.grade}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewProfile(student)}
                              className="p-2 text-text-secondary hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                              title="View Profile"
                            >
                              <User size={18} />
                            </button>
                            <button
                              onClick={() => confirmDelete(student)}
                              className="p-2 text-text-secondary hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Student"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-sm text-text-secondary">
                  Showing {paginatedStudents.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of {filteredStudents.length} students
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm text-text-secondary hover:text-primary hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${currentPage === page ? 'bg-primary text-white' : 'text-text-secondary hover:text-primary hover:bg-gray-50'}`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm text-text-secondary hover:text-primary hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Student Profile Modal */}
      {showProfileModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Student Details</h3>
              <button onClick={() => setShowProfileModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <img src={selectedStudent.avatar} alt={selectedStudent.name} className="w-20 h-20 rounded-full border-4 border-gray-50" />
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{selectedStudent.name}</h4>
                  <p className="text-gray-500 text-sm">{selectedStudent.id}</p>
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold mt-1 bg-blue-100 text-blue-800">
                    {selectedStudent.grade}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Contact Information</label>
                  <div className="mt-1 space-y-2">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Mail size={16} className="text-gray-400" />
                      <span>{selectedStudent.contact.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <Phone size={16} className="text-gray-400" />
                      <span>{selectedStudent.contact.phone}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Personal Information</label>
                  <div className="mt-1 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date of Birth:</span>
                      <span className="font-medium text-gray-900">{selectedStudent.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">City:</span>
                      <span className="font-medium text-gray-900">{selectedStudent.city}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Guardian Details</label>
                  <p className="mt-1 text-gray-700">{selectedStudent.parentName}</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && studentToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="text-red-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Student?</h3>
              <p className="text-gray-600">
                Are you sure you want to delete <strong>{studentToDelete.name}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteStudent}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Add New Student</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddStudent} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    value={newStudent.firstName}
                    onChange={(e) => setNewStudent({ ...newStudent, firstName: e.target.value })}
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    value={newStudent.lastName}
                    onChange={(e) => setNewStudent({ ...newStudent, lastName: e.target.value })}
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    value={newStudent.email}
                    onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    value={newStudent.phone}
                    onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                    placeholder="9876543210"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    value={newStudent.rollNumber}
                    onChange={(e) => setNewStudent({ ...newStudent, rollNumber: e.target.value })}
                    placeholder="12345"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
                  <select
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    value={newStudent.className}
                    onChange={(e) => setNewStudent({ ...newStudent, className: e.target.value })}
                  >
                    <option value="">Select Class</option>
                    {['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map((cls) => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-sky-600 text-white py-2 rounded-xl font-semibold hover:bg-sky-700 transition-colors mt-4"
              >
                Add Student
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Credentials Modal */}
      {showCredentialsModal && createdCredentials && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Registration Successful!</h3>
              <p className="text-gray-600 mb-4">
                Credentials have been generated.
              </p>

              <div className="w-full bg-gray-50 rounded-xl p-4 text-left space-y-3 border border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Login ID</p>
                  <p className="font-mono text-gray-900 font-medium">{createdCredentials.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Password</p>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <p className="font-mono text-gray-900 font-bold bg-white px-2 py-1 rounded border border-gray-200">{createdCredentials.password}</p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(createdCredentials.password);
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 2000);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${isCopied ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-indigo-600 hover:bg-indigo-50'}`}
                      title="Copy Password"
                    >
                      {isCopied ? <CheckCircle size={16} /> : <Copy size={16} />}
                      {isCopied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowCredentialsModal(false)}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Components
const NavItem = ({ icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group w-full ${active ? 'bg-sky-50 text-sky-600 font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'}`}
  >
    <span className={`${active ? 'text-sky-600' : 'text-gray-400 group-hover:text-sky-600 transition-colors'}`}>{icon}</span>
    <span className="flex-1 text-left">{label}</span>
    {badge > 0 && (
      <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg ring-2 ring-white">
        {badge}
      </span>
    )}
  </button>
);

export default StudentsPage;

