import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  ChevronRight
} from 'lucide-react';

const ModernAdminDashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const [calendarDate, setCalendarDate] = useState(new Date());
  const [recentActivities, setRecentActivities] = useState([
    { id: 1, title: "New Student Registration", time: "10:30 AM - John Doe registered for Class 10-A" },
    { id: 2, title: "Fee Payment Received", time: "09:45 AM - $500 received from Sarah Smith (Class 8-B)" },
    { id: 3, title: "Staff Meeting Scheduled", time: "Yesterday - Monthly staff meeting scheduled for Friday" }
  ]);


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
  }, []);

  const clearActivities = () => {
    setRecentActivities([]);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    onLogout();
  };


  // Calendar Logic
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
  };

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

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-gray-800 overflow-hidden">
      {/* Left Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out shadow-sm ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-4 flex items-center justify-center gap-3">
          <img src="/assets/logo.png" alt="EduMind Logo" className="h-32 w-auto max-w-full object-contain" />
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active onClick={() => navigate('/admin')} />
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
            {/* Page Title */}
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

            {/* Welcome Section */}
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Welcome back, {adminName}!</h2>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/admin/analytics')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  View Reports
                </button>
                <button
                  onClick={() => navigate('/admin/students')}
                  className="bg-green-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                >
                  Add Student
                </button>
                <button
                  onClick={() => navigate('/admin/teachers')}
                  className="bg-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-purple-700 transition-colors"
                >
                  Add Staff
                </button>
                <button
                  onClick={() => navigate('/admin/parents')}
                  className="bg-orange-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-orange-700 transition-colors"
                >
                  Add Parent
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
    </div>
  );
};

// Helper Components
const NavItem = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${active ? 'bg-sky-50 text-sky-600 font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'}`}
  >
    <span className={`${active ? 'text-sky-600' : 'text-gray-400 group-hover:text-sky-600 transition-colors'}`}>{icon}</span>
    <span>{label}</span>
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