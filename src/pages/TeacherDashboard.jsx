import React, { useState, useEffect } from 'react';
import { Plus, UserMinus } from 'lucide-react';

export default function TeacherDashboard() {
  const [staffType, setStaffType] = useState('teaching');
  const [showAddRequestModal, setShowAddRequestModal] = useState(false);
  const [showDeleteRequestModal, setShowDeleteRequestModal] = useState(false);
  const [newStudentRequest, setNewStudentRequest] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    rollNumber: '',
    className: '',
    reason: ''
  });
  const [deleteStudentRequest, setDeleteStudentRequest] = useState({
    studentId: '',
    reason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    try {
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      if (registeredUsers.staff && registeredUsers.staff.staffType) {
        setStaffType(registeredUsers.staff.staffType);
      }
    } catch (error) {
      console.error('Error fetching staff type:', error);
    }
  }, []);

  const teacherStats = {
    totalStudents: 128,
    classesPerDay: 4,
    assignmentsPending: 45,
    attendanceAverage: '88%',
  };

  const classes = [
    { name: 'Class 10-A', subject: 'Mathematics', students: 32, status: 'Active' },
    { name: 'Class 10-B', subject: 'Mathematics', students: 30, status: 'Active' },
    { name: 'Class 11-A', subject: 'Mathematics', students: 33, status: 'Active' },
    { name: 'Class 12-B', subject: 'Mathematics', students: 33, status: 'Active' },
  ];

  const submittedAssignments = [
    { title: 'Chapter 5 Problems', class: 'Class 10-A', submitted: 28, total: 32, date: 'Jan 12' },
    { title: 'Project Work', class: 'Class 10-B', submitted: 25, total: 30, date: 'Jan 10' },
    { title: 'Test Paper', class: 'Class 11-A', submitted: 31, total: 33, date: 'Jan 8' },
  ];

  const todaySchedule = [
    { time: '09:00 AM', class: 'Class 10-A', subject: 'Mathematics' },
    { time: '10:15 AM', class: 'Class 10-B', subject: 'Mathematics' },
    { time: '11:30 AM', class: 'Class 11-A', subject: 'Mathematics' },
    { time: '02:00 PM', class: 'Class 12-B', subject: 'Mathematics' },
  ];

  // Non-Teaching Staff Data
  const staffStats = {
    tasksPending: 8,
    requestsProcessed: 24,
    hoursLogged: '160h',
    leaveBalance: '12 Days',
  };

  const tasks = [
    { title: 'Inventory Audit', department: 'Logistics', priority: 'High', status: 'In Progress', due: 'Jan 20' },
    { title: 'Submit Expense Report', department: 'Finance', priority: 'Medium', status: 'Pending', due: 'Jan 22' },
    { title: 'Update Staff Records', department: 'HR', priority: 'Low', status: 'Completed', due: 'Jan 15' },
    { title: 'Facility Maintenance Check', department: 'Admin', priority: 'High', status: 'Pending', due: 'Jan 25' },
  ];

  const recentActivities = [
    { action: 'Processed Leave Request', user: 'John Doe', time: '2 hours ago' },
    { action: 'Updated Inventory', user: 'System', time: '5 hours ago' },
    { action: 'Generated Monthly Report', user: 'System', time: '1 day ago' },
  ];

  if (staffType === 'non-teaching') {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your administrative tasks and overview.</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Statistics Cards */}
          <section className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm">Pending Tasks</p>
                <p className="text-3xl font-bold text-orange-600">{staffStats.tasksPending}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm">Requests Processed</p>
                <p className="text-3xl font-bold text-green-600">{staffStats.requestsProcessed}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm">Hours Logged</p>
                <p className="text-3xl font-bold text-blue-600">{staffStats.hoursLogged}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm">Leave Balance</p>
                <p className="text-3xl font-bold text-purple-600">{staffStats.leaveBalance}</p>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Task List */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">My Tasks</h2>
              <div className="space-y-3">
                {tasks.map((item, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded border-l-4 border-blue-500">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <p className="font-semibold text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-600">{item.department}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${item.priority === 'High' ? 'bg-red-100 text-red-800' :
                          item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                        }`}>
                        {item.priority}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">Due: {item.due}</span>
                      <span className="text-xs font-medium text-gray-700">{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivities.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                      {item.user.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.action}</p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your classes and track student progress.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Total Students</p>
              <p className="text-3xl font-bold text-blue-600">{teacherStats.totalStudents}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Classes/Day</p>
              <p className="text-3xl font-bold text-green-600">{teacherStats.classesPerDay}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Pending Review</p>
              <p className="text-3xl font-bold text-orange-600">{teacherStats.assignmentsPending}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Avg. Attendance</p>
              <p className="text-3xl font-bold text-purple-600">{teacherStats.attendanceAverage}</p>
            </div>
          </div>
        </section>

        {/* Today's Schedule & My Classes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Today's Schedule */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Schedule</h2>
            <div className="space-y-3">
              {todaySchedule.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                  <div className="text-2xl">📚</div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.class}</p>
                    <p className="text-sm text-gray-600">{item.subject}</p>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* My Classes */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">My Classes</h2>
            <div className="space-y-3">
              {classes.map((item, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.subject}</p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">👥 {item.students} Students</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Assignment Submissions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Assignment Submissions</h2>
          <div className="space-y-4">
            {submittedAssignments.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.class}</p>
                  </div>
                  <p className="text-xs text-gray-500">{item.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(item.submitted / item.total) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">
                    {item.submitted}/{item.total}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Management Requests */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Student Management</h2>
          <p className="text-gray-600 mb-6">Request to add or remove students from your classes. All requests require admin approval.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setShowAddRequestModal(true)}
              className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="p-2 bg-green-500 rounded-lg">
                <Plus className="text-white" size={20} />
              </div>
              <div className="text-left">
                <p className="font-semibold text-green-800">Add New Student</p>
                <p className="text-sm text-green-600">Request to enroll a new student</p>
              </div>
            </button>

            <button
              onClick={() => setShowDeleteRequestModal(true)}
              className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
            >
              <div className="p-2 bg-red-500 rounded-lg">
                <UserMinus className="text-white" size={20} />
              </div>
              <div className="text-left">
                <p className="font-semibold text-red-800">Remove Student</p>
                <p className="text-sm text-red-600">Request to remove a student</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
