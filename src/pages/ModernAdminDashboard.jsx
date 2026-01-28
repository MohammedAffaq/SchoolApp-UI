import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Bus,
  DollarSign,
  CalendarCheck,
  LogOut,
  Bell,
  Menu,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  UserMinus,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  X
} from 'lucide-react';

const ModernAdminDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [adminName, setAdminName] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requestHistory, setRequestHistory] = useState([]);
  const [activeView, setActiveView] = useState(location.state?.activeView || 'dashboard');
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    type: null, // 'approve' or 'reject'
    requestId: null,
    studentName: ''
  });
  const [actionNote, setActionNote] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerFormData, setRegisterFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'student',
    password: '',
    confirmPassword: '',
    rollNumber: '',
    className: '',
    designation: '',
    subject: '',
    childName: '',
    relationship: '',
  });
  const [registerErrors, setRegisterErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const [calendarDate, setCalendarDate] = useState(new Date());
  const [recentActivities, setRecentActivities] = useState([
    { id: 1, title: "New Student Registration", time: "10:30 AM - John Doe registered for Class 10-A" },
    { id: 2, title: "Fee Payment Received", time: "09:45 AM - $500 received from Sarah Smith (Class 8-B)" },
    { id: 3, title: "Staff Meeting Scheduled", time: "Yesterday - Monthly staff meeting scheduled for Friday" }
  ]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const getEventsForDay = (day, month, year) => {
    const events = [];
    // Fixed Holidays (Demo)
    if (month === 0 && day === 1) events.push({ type: 'holiday', title: "New Year's Day" });
    if (month === 0 && day === 26) events.push({ type: 'holiday', title: "Republic Day" });
    if (month === 1 && day === 14) events.push({ type: 'holiday', title: "Valentine's Day" });
    if (month === 7 && day === 15) events.push({ type: 'holiday', title: "Independence Day" });
    if (month === 9 && day === 2) events.push({ type: 'holiday', title: "Gandhi Jayanti" });
    if (month === 9 && day === 31) events.push({ type: 'holiday', title: "Halloween" });
    if (month === 11 && day === 25) events.push({ type: 'holiday', title: "Christmas" });

    // Mock Exams/Meetings
    if (day === 15) events.push({ type: 'exam', title: "Mid-term Exams" });
    if (day === 20) events.push({ type: 'meeting', title: "PTA Meeting" });
    if (day === 5) events.push({ type: 'event', title: "Sports Day" });

    return events;
  };

  const handlePrevMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    onLogout();
  };

  const clearActivities = () => {
    setRecentActivities([]);
  };

  useEffect(() => {
    if (location.state?.activeView) {
      setActiveView(location.state.activeView);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchAdminName = () => {
      // Try to get name from direct storage (set during signup)
      const storedName = localStorage.getItem('userName');
      if (storedName) {
        setAdminName(storedName);
        return;
      }

      // Fallback: Try to get from registeredUsers object
      try {
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
        if (registeredUsers.admin && registeredUsers.admin.firstName) {
          setAdminName(`${registeredUsers.admin.firstName} ${registeredUsers.admin.lastName}`);
        } else {
          setAdminName('Admin');
        }
        if (registeredUsers.admin && registeredUsers.admin.profileImage) {
          setProfileImage(registeredUsers.admin.profileImage);
        }
      } catch (error) {
        console.error('Error fetching admin name:', error);
      }
    };

    fetchAdminName();
    // Comment out fetchPendingRequests for now to test basic rendering
    // fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      // Get the admin token from localStorage
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (!currentUser || !currentUser.token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch('http://localhost:5000/api/student-requests', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setPendingRequests(result.requests.filter(req => req.status === 'pending'));
        setRequestHistory(result.requests.filter(req => req.status !== 'pending').sort((a, b) => new Date(b.reviewedAt || b.createdAt) - new Date(a.reviewedAt || a.createdAt)));
      } else {
        console.error('Failed to fetch requests:', result.error);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const initiateRequestAction = (type, request) => {
    setConfirmModal({
      isOpen: true,
      type,
      requestId: request.id,
      studentName: request.type === 'add'
        ? `${request.studentData.firstName} ${request.studentData.lastName}`
        : `Student ID: ${request.studentData.studentId}`
    });
    setActionNote('');
  };

  const handleConfirmAction = async () => {
    if (!confirmModal.requestId) return;

    setLoading(true);
    try {
      const endpoint = confirmModal.type === 'approve' ? 'approve' : 'reject';

      if (confirmModal.type === 'reject' && !actionNote.trim()) {
        alert('Please provide a reason for rejection.');
        setLoading(false);
        return;
      }

      const noteToSend = actionNote.trim() || (confirmModal.type === 'approve' ? 'Approved by admin' : 'Rejected by admin');

      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (!currentUser || !currentUser.token) {
        alert('Session expired. Please login again.');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/student-requests/${confirmModal.requestId}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify({ note: noteToSend }),
      });

      if (response.status === 401 || response.status === 403) {
        alert('Session expired. Please login again.');
        onLogout();
        return;
      }

      const result = await response.json();
      if (result.success) {
        alert(`Request ${confirmModal.type}ed successfully!`);
        fetchPendingRequests(); // Refresh the list
        setConfirmModal({ isOpen: false, type: null, requestId: null, studentName: '' });
      } else {
        alert(`Failed to ${confirmModal.type} request: ` + result.error);
      }
    } catch (error) {
      console.error(`Error ${confirmModal.type}ing request:`, error);
      alert('Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterUser = async (e) => {
    e.preventDefault();

    // Validate form
    const errors = {};
    if (!registerFormData.firstName.trim()) errors.firstName = 'First name is required';
    if (!registerFormData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!registerFormData.email.trim()) errors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerFormData.email)) errors.email = 'Email is invalid';
    if (!registerFormData.phone.trim()) errors.phone = 'Phone is required';
    if (!/^\d{10}$/.test(registerFormData.phone.replace(/\D/g, ''))) errors.phone = 'Phone must be 10 digits';
    if (!registerFormData.role) errors.role = 'Role is required';

    // Role-specific validation
    if (registerFormData.role === 'student') {
      if (!registerFormData.rollNumber.trim()) errors.rollNumber = 'Roll number is required';
      if (!registerFormData.className.trim()) errors.className = 'Class is required';
    }

    if (registerFormData.role === 'teacher') {
      if (!registerFormData.designation.trim()) errors.designation = 'Designation is required';
      if (!registerFormData.subject.trim()) errors.subject = 'Subject is required';
    }

    if (registerFormData.role === 'parent') {
      if (!registerFormData.childName.trim()) errors.childName = 'Child name is required';
      if (!registerFormData.relationship.trim()) errors.relationship = 'Relationship is required';
      if (!registerFormData.className.trim()) errors.className = 'Child class is required';
    }

    if (registerFormData.role === 'staff') {
      if (!registerFormData.designation.trim()) errors.designation = 'Designation is required';
    }

    setRegisterErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);

    try {
      // Get the admin token from localStorage
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (!currentUser || !currentUser.token) {
        setRegisterErrors({ general: 'Session expired. Please login again.' });
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`,
        },
        body: JSON.stringify(registerFormData),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          alert('Session expired. Please login again.');
          onLogout();
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        setRegisterErrors({ general: errorData.message || errorData.error || `Failed to register user: ${response.statusText}` });
        setLoading(false);
        return;
      }

      const result = await response.json();

      if (result.success) {
        setSuccessMessage('User registered successfully! Email sent with login credentials.');
        setTimeout(() => {
          setShowRegisterModal(false);
          setSuccessMessage('');
          setRegisterFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            role: 'student',
            password: '',
            confirmPassword: '',
            rollNumber: '',
            className: '',
            designation: '',
            subject: '',
            childName: '',
            relationship: '',
          });
        }, 2000);
      } else {
        setRegisterErrors({ general: result.error || 'Failed to register user' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setRegisterErrors({ general: 'Failed to connect to server. Please try again.' });
    }

    setLoading(false);
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-gray-800 overflow-hidden">
      {/* Left Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out shadow-sm ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-4 flex items-center justify-center gap-3">
          <img
            src="/assets/logo.png"
            alt="EduMind Logo"
            className="h-32 w-auto max-w-full object-contain cursor-pointer"
            onClick={() => setActiveView('dashboard')}
          />
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
          <NavItem icon={<ShieldCheck size={20} />} label="Verification" active={activeView === 'verification'} onClick={() => setActiveView('verification')} badge={pendingRequests.length} />
          <NavItem icon={<GraduationCap size={20} />} label="Students" onClick={() => navigate('/admin/students')} />
          <div>
            <NavItem icon={<Users size={20} />} label="Teachers" onClick={() => navigate('/admin/teachers')} />
            <SubNavItem label="Teaching Staff" onClick={() => navigate('/admin/teachers', { state: { activeTab: 'teaching' } })} />
            <SubNavItem label="Non-Teaching Staff" onClick={() => navigate('/admin/teachers', { state: { activeTab: 'non-teaching' } })} />
          </div>
          <NavItem icon={<User size={20} />} label="Parents" onClick={() => navigate('/admin/parents')} />
          <NavItem icon={<Bus size={20} />} label="Driver & Vehicles" onClick={() => navigate('/admin/drivers')} />
          <NavItem icon={<DollarSign size={20} />} label="Finance" onClick={() => navigate('/admin/finance')} />
          <NavItem icon={<CalendarCheck size={20} />} label="Attendance" onClick={() => navigate('/admin/attendance')} />
          <NavItem icon={<Settings size={20} />} label="Settings" onClick={() => navigate('/admin/settings')} />
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full p-3 rounded-xl transition-colors duration-200 font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)}></div>}

      {/* Main Content Wrapper */}
      <div className="flex-1 lg:ml-64 flex flex-col h-screen">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex justify-between items-center px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{activeView === 'dashboard' ? 'Admin Dashboard' : 'Verification Requests'}</h1>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/admin/notifications')}
              className="relative p-2 text-gray-400 hover:text-indigo-600 transition-colors"
            >
              <Bell size={28} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button type="button" onClick={() => navigate('/admin/profile')} className="flex items-center gap-3 pl-6 border-l border-gray-100 hover:bg-gray-50 rounded-lg -ml-2 p-2 transition-colors z-20 relative">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-gray-900">{adminName}</p>
                <p className="text-xs text-gray-500 font-medium">Admin Administrator</p>
              </div>
              <img
                src={profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(adminName)}&background=c7d2fe&color=3730a3`}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
              />
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-100">
          <div className="max-w-7xl mx-auto space-y-8">
            {activeView === 'dashboard' && (
              <>
                {/* Welcome Section */}
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900">Welcome back, {adminName}!</h2>
                  <div className="flex flex-wrap gap-4 mt-6">
                    <button
                      onClick={() => navigate('/admin/analytics')}
                      className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                    >
                      View Reports
                    </button>
                    <button
                      onClick={() => setShowRegisterModal(true)}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                    >
                      Register User
                    </button>
                  </div>
                </div>

                {/* KPI Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <KPICard
                    icon={<GraduationCap className="text-blue-600" />}
                    label="Total Teachers"
                    value="145"
                    trend="+4%"
                  />
                  <KPICard
                    icon={<Users className="text-cyan-600" />}
                    label="Total Students"
                    value="2,540"
                    trend="+12%"
                  />
                  <KPICard
                    icon={<Bus className="text-orange-600" />}
                    label="Vehicles / Drivers"
                    value="28"
                    trend="Stable"
                  />
                  <KPICard
                    icon={<DollarSign className="text-emerald-600" />}
                    label="Revenue"
                    value="$1.2M"
                    trend="+8.5%"
                  />
                </div>

                {/* Below KPI Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Live Attendance Card */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Live Attendance</h3>
                    <div className="space-y-4">
                      <AttendanceItem classLabel="Class 10-A" percentage={92} />
                      <AttendanceItem classLabel="Class 9-B" percentage={85} />
                      <AttendanceItem classLabel="Class 11-C" percentage={78} />
                      <AttendanceItem classLabel="Class 8-A" percentage={96} />
                    </div>
                  </div>

                  {/* Teachers Summary Card */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Teachers Summary</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-700">On Duty</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">142</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-700">On Leave</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">8</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-700">Absent</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">3</span>
                      </div>
                      <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Total Staff</span>
                          <span className="text-lg font-bold text-gray-900">153</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Student Performance Card */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Student Performance</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-700">Excellent (90-100%)</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">1,245</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-700">Good (80-89%)</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">892</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-700">Average (70-79%)</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">456</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-700">Needs Improvement</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">123</span>
                      </div>
                      <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Total Students</span>
                          <span className="text-lg font-bold text-gray-900">2,716</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Second Row - Drivers/Transport and Notice Board */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Drivers/Transport Summary Card */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Drivers & Transport</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-700">Active Routes</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">24</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-700">Vehicles Available</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">28</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm font-medium text-gray-700">Maintenance Due</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">4</span>
                      </div>
                      <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Total Drivers</span>
                          <span className="text-lg font-bold text-gray-900">32</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notice Board Card */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Notice Board</h3>
                    <div className="space-y-4">
                      <NoticeItem title="Mid-term exams schedule released" desc="Check the portal for detailed timetable." priority="high" />
                      <NoticeItem title="School closed for Columbus Day" desc="Classes will resume on Tuesday." priority="medium" />
                      <NoticeItem title="Annual Sports Day Registration" desc="Last date to register is Friday." priority="low" />
                      <div className="mt-4 flex flex-wrap gap-4 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-gray-600">High Priority</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="text-gray-600">Medium Priority</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-gray-600">Low Priority</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Third Row - Monthly Calendar */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Monthly Calendar Widget */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900">Monthly Calendar</h3>
                      <div className="flex items-center gap-2">
                        <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                          <ChevronLeft size={20} className="text-gray-600" />
                        </button>
                        <span className="text-lg font-semibold text-gray-900 w-32 text-center">{months[calendarDate.getMonth()]} {calendarDate.getFullYear()}</span>
                        <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                          <ChevronRight size={20} className="text-gray-600" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-1 mb-4">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="p-2 text-center text-sm font-semibold text-gray-600">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {/* Empty cells for days before start of month */}
                      {Array.from({ length: getFirstDayOfMonth(calendarDate) }).map((_, i) => (
                        <div key={`empty-${i}`} className="p-2"></div>
                      ))}

                      {/* Days of the month */}
                      {Array.from({ length: getDaysInMonth(calendarDate) }, (_, i) => {
                        const day = i + 1;
                        const events = getEventsForDay(day, calendarDate.getMonth(), calendarDate.getFullYear());
                        const isToday = new Date().toDateString() === new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day).toDateString();

                        let bgClass = 'hover:bg-gray-50 text-gray-700';
                        if (isToday) bgClass = 'bg-indigo-100 text-indigo-700 font-bold border border-indigo-200';
                        else if (events.some(e => e.type === 'holiday')) bgClass = 'bg-red-50 text-red-700 font-medium';
                        else if (events.some(e => e.type === 'exam')) bgClass = 'bg-blue-50 text-blue-700 font-medium';
                        else if (events.some(e => e.type === 'meeting')) bgClass = 'bg-green-50 text-green-700 font-medium';

                        return (
                          <div
                            key={day}
                            className={`p-2 h-10 flex items-center justify-center text-sm rounded-lg transition-colors cursor-pointer relative group ${bgClass}`}
                          >
                            {day}
                            {events.length > 0 && (
                              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-current opacity-50"></div>
                            )}
                            {events.length > 0 && (
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10 w-max max-w-[150px] bg-gray-800 text-white text-xs rounded py-1 px-2 shadow-lg">
                                {events.map((e, idx) => <div key={idx}>{e.title}</div>)}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-4 flex flex-wrap gap-4 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-600">Exams</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600">Meetings</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-gray-600">Holidays</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats Summary */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Stats</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Today's Attendance</span>
                        <span className="text-lg font-bold text-green-600">94.2%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Active Classes</span>
                        <span className="text-lg font-bold text-blue-600">28</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Pending Tasks</span>
                        <span className="text-lg font-bold text-orange-600">12</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">System Health</span>
                        <span className="text-lg font-bold text-green-600">98%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                    {recentActivities.length > 0 && (
                      <button onClick={clearActivities} className="text-sm text-red-500 hover:text-red-700 font-medium">Clear All</button>
                    )}
                  </div>
                  <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                    {recentActivities.length > 0 ? (
                      recentActivities.map(activity => (
                        <EventItem key={activity.id} title={activity.title} time={activity.time} />
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm text-center py-4">No recent activity.</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {activeView === 'verification' && (
              <div className="space-y-8">
                {/* Pending Student Requests */}
                <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <Clock size={20} className="text-orange-500" />
                      Pending Student Requests ({pendingRequests.length})
                    </h3>
                    <button
                      onClick={fetchPendingRequests}
                      className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-50"
                      title="Refresh"
                    >
                      <ArrowUpRight size={20} />
                    </button>
                  </div>
                  {pendingRequests.length > 0 ? (
                    <div className="space-y-4">
                      {pendingRequests.map((request) => (
                        <div key={request.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {request.type === 'add' ? (
                                  <UserPlus size={16} className="text-green-600" />
                                ) : (
                                  <UserMinus size={16} className="text-red-600" />
                                )}
                                <span className="text-sm font-bold text-gray-700 uppercase">
                                  {request.type === 'add' ? 'Add Student' : 'Remove Student'}
                                </span>
                                <span className="text-xs text-gray-500">
                                  by {request.teacherName}
                                </span>
                              </div>
                              {request.type === 'add' ? (
                                <div className="text-sm text-gray-700">
                                  <p><strong>Name:</strong> {request.studentData.firstName} {request.studentData.lastName}</p>
                                  <p><strong>Email:</strong> {request.studentData.email}</p>
                                  <p><strong>Class:</strong> {request.studentData.className}</p>
                                </div>
                              ) : (
                                <div className="text-sm text-gray-700">
                                  <p><strong>Student ID:</strong> {request.studentData.studentId}</p>
                                </div>
                              )}
                              <p className="text-sm text-gray-600 mt-2"><strong>Reason:</strong> {request.reason}</p>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <button onClick={() => initiateRequestAction('approve', request)} disabled={loading} className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50">
                                <CheckCircle size={14} /> Approve
                              </button>
                              <button onClick={() => initiateRequestAction('reject', request)} disabled={loading} className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">
                                <XCircle size={14} /> Reject
                              </button>
                            </div>
                          </div>
                          <div className="text-xs text-gray-400">
                            Requested on {new Date(request.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-4">No pending requests.</p>
                  )}
                </div>

                {/* Request History Log */}
                <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <Clock size={20} className="text-gray-400" />
                      Request History
                    </h3>
                  </div>
                  {requestHistory.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                      {requestHistory.map((request) => (
                        <div key={request.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              {request.status === 'approved' ? (
                                <CheckCircle size={16} className="text-green-600" />
                              ) : (
                                <XCircle size={16} className="text-red-600" />
                              )}
                              <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${request.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                {request.status}
                              </span>
                              <span className="text-sm font-semibold text-gray-700">
                                {request.type === 'add' ? 'Add Student' : 'Remove Student'}
                              </span>
                            </div>
                            <span className="text-xs text-gray-400">
                              {new Date(request.reviewedAt || request.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="pl-6">
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Teacher:</strong> {request.teacherName}
                            </p>
                            {request.type === 'add' ? (
                              <p className="text-sm text-gray-600">
                                <strong>Student:</strong> {request.studentData.firstName} {request.studentData.lastName} ({request.studentData.className})
                              </p>
                            ) : (
                              <p className="text-sm text-gray-600">
                                <strong>Student ID:</strong> {request.studentData.studentId}
                              </p>
                            )}
                            {request.reviewNote && (
                              <p className="text-xs text-gray-500 mt-2 italic border-t border-gray-200 pt-2">
                                Note: "{request.reviewNote}"
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-4">No history available.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut className="text-red-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Logout?</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to logout from your account?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Register User Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-gray-900">Register New User</h3>
              <button onClick={() => setShowRegisterModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleRegisterUser} className="p-6 space-y-4">
              {successMessage && (
                <div className="p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-2">
                  <CheckCircle size={20} />
                  {successMessage}
                </div>
              )}
              {registerErrors.general && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-2">
                  <AlertTriangle size={20} />
                  {registerErrors.general}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                  <select
                    value={registerFormData.role}
                    onChange={(e) => setRegisterFormData({ ...registerFormData, role: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teaching Staff</option>
                    <option value="parent">Parent</option>
                    <option value="staff">Non-Teaching Staff</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input type="text" value={registerFormData.firstName} onChange={(e) => setRegisterFormData({ ...registerFormData, firstName: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                  {registerErrors.firstName && <p className="text-red-500 text-xs mt-1">{registerErrors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input type="text" value={registerFormData.lastName} onChange={(e) => setRegisterFormData({ ...registerFormData, lastName: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                  {registerErrors.lastName && <p className="text-red-500 text-xs mt-1">{registerErrors.lastName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input type="email" value={registerFormData.email} onChange={(e) => setRegisterFormData({ ...registerFormData, email: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                  {registerErrors.email && <p className="text-red-500 text-xs mt-1">{registerErrors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input type="tel" value={registerFormData.phone} onChange={(e) => setRegisterFormData({ ...registerFormData, phone: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                  {registerErrors.phone && <p className="text-red-500 text-xs mt-1">{registerErrors.phone}</p>}
                </div>

                {/* Role Specific Fields */}
                {registerFormData.role === 'student' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number *</label>
                      <input type="text" value={registerFormData.rollNumber} onChange={(e) => setRegisterFormData({ ...registerFormData, rollNumber: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                      {registerErrors.rollNumber && <p className="text-red-500 text-xs mt-1">{registerErrors.rollNumber}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Class *</label>
                      <select value={registerFormData.className} onChange={(e) => setRegisterFormData({ ...registerFormData, className: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                        <option value="">Select Class</option>
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={`${i + 1}`}>
                            Class {i + 1}
                          </option>
                        ))}
                      </select>
                      {registerErrors.className && <p className="text-red-500 text-xs mt-1">{registerErrors.className}</p>}
                    </div>
                  </>
                )}

                {registerFormData.role === 'teacher' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Designation *</label>
                      <input type="text" value={registerFormData.designation} onChange={(e) => setRegisterFormData({ ...registerFormData, designation: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                      {registerErrors.designation && <p className="text-red-500 text-xs mt-1">{registerErrors.designation}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                      <input type="text" value={registerFormData.subject} onChange={(e) => setRegisterFormData({ ...registerFormData, subject: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                      {registerErrors.subject && <p className="text-red-500 text-xs mt-1">{registerErrors.subject}</p>}
                    </div>
                  </>
                )}

                {registerFormData.role === 'parent' && (
                  <>
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1 whitespace-nowrap">Child Name *</label>
                      <input type="text" value={registerFormData.childName} onChange={(e) => setRegisterFormData({ ...registerFormData, childName: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                      {registerErrors.childName && <p className="text-red-500 text-xs mt-1">{registerErrors.childName}</p>}
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1 whitespace-nowrap">Relationship *</label>
                      <select value={registerFormData.relationship} onChange={(e) => setRegisterFormData({ ...registerFormData, relationship: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                        <option value="">Select...</option>
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Guardian">Guardian</option>
                      </select>
                      {registerErrors.relationship && <p className="text-red-500 text-xs mt-1">{registerErrors.relationship}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1 whitespace-nowrap">Child's Class *</label>
                      <select value={registerFormData.className} onChange={(e) => setRegisterFormData({ ...registerFormData, className: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                        <option value="">Select Class</option>
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={`${i + 1}`}>
                            Class {i + 1}
                          </option>
                        ))}
                      </select>
                      {registerErrors.className && <p className="text-red-500 text-xs mt-1">{registerErrors.className}</p>}
                    </div>
                  </>
                )}

                {registerFormData.role === 'staff' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Designation *</label>
                    <input type="text" value={registerFormData.designation} onChange={(e) => setRegisterFormData({ ...registerFormData, designation: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                    {registerErrors.designation && <p className="text-red-500 text-xs mt-1">{registerErrors.designation}</p>}
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowRegisterModal(false)} className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-medium">Cancel</button>
                <button type="submit" disabled={loading} className="px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium disabled:opacity-50 flex items-center gap-2">
                  {loading ? 'Registering...' : 'Register User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all scale-100">
            <div className="p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${confirmModal.type === 'approve' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                  {confirmModal.type === 'approve' ? (
                    <CheckCircle className="text-green-600" size={24} />
                  ) : (
                    <AlertTriangle className="text-red-600" size={24} />
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {confirmModal.type === 'approve' ? 'Approve Request?' : 'Reject Request?'}
                </h3>
                <p className="text-gray-600">
                  Are you sure you want to {confirmModal.type} the request for <strong>{confirmModal.studentName}</strong>?
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {confirmModal.type === 'approve' ? 'Note (Optional)' : 'Reason for Rejection *'}
                  </label>
                  <textarea
                    value={actionNote}
                    onChange={(e) => setActionNote(e.target.value)}
                    placeholder={confirmModal.type === 'approve' ? "Add a note..." : "Please specify why..."}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 min-h-[80px]"
                    required={confirmModal.type === 'reject'}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmModal({ isOpen: false, type: null, requestId: null, studentName: '' })}
                    className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmAction}
                    disabled={loading}
                    className={`flex-1 px-4 py-2 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${confirmModal.type === 'approve'
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-red-600 hover:bg-red-700'
                      }`}
                  >
                    {loading ? 'Processing...' : (confirmModal.type === 'approve' ? 'Confirm Approve' : 'Confirm Reject')}
                  </button>
                </div>
              </div>
            </div>
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
    <span className="flex-1 text-left">{label}</span>
    {badge > 0 && (
      <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg ring-2 ring-white">
        {badge}
      </span>
    )}
  </button>
);

const SubNavItem = ({ label, onClick, active }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full pl-14 pr-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${active
        ? 'text-sky-600 font-bold bg-sky-50'
        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
      }`}
  >
    <span className={`w-1.5 h-1.5 rounded-full mr-3 ${active ? 'bg-sky-600' : 'bg-gray-300'}`}></span>
    {label}
  </button>
);

const KPICard = ({ icon, label, value, trend }) => {
  const getTrendColor = (trend) => {
    if (trend.includes('+')) return 'text-green-600';
    if (trend.includes('-')) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-xl bg-gray-50">{icon}</div>
        <span className={`text-sm font-semibold ${getTrendColor(trend)}`}>{trend}</span>
      </div>
      <h4 className="text-gray-600 text-sm mb-2">{label}</h4>
      <h2 className="text-2xl font-bold text-gray-900">{value}</h2>
    </div>
  );
};

const AttendanceItem = ({ classLabel, percentage, color }) => (
  <div className="flex items-center justify-between">
    <div>
      <h4 className="text-sm font-bold text-gray-800">{classLabel}</h4>
    </div>
    <div className="flex items-center gap-3">
      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color || 'bg-blue-500'}`} style={{ width: `${percentage}%` }}></div>
      </div>
      <span className="text-sm font-bold text-gray-700">{percentage}%</span>
    </div>
  </div>
);

const EventItem = ({ title, time }) => (
  <div className="border-l-4 border-sky-500 pl-4">
    <h4 className="text-gray-900 font-semibold">{title}</h4>
    <p className="text-gray-600 text-sm mt-1">{time}</p>
  </div>
);

const NoticeItem = ({ title, desc, priority = 'medium' }) => {
  const getBorderColor = () => {
    switch (priority) {
      case 'high': return 'border-red-500';
      case 'medium': return 'border-yellow-500';
      case 'low': return 'border-green-500';
      default: return 'border-blue-500';
    }
  };

  return (
    <div className={`border-l-4 ${getBorderColor()} pl-4`}>
      <h4 className="text-gray-900 font-semibold">{title}</h4>
      <p className="text-gray-600 text-sm mt-1">{desc}</p>
    </div>
  );
};

export default ModernAdminDashboard;