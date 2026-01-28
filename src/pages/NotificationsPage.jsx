import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Bus,
  DollarSign,
  CalendarCheck,
  Wrench,
  LogOut,
  Search,
  Menu,
  Bell,
  User,
  FileText,
  Image,
  Clock,
  Settings,
  ShieldCheck
} from 'lucide-react';

const NotificationItem = ({ avatar, name, action, target, time, type, attachment, read }) => (
  <div className={`flex gap-4 p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors rounded-xl group ${!read ? 'bg-blue-50/40' : ''}`}>
    <div className="flex-shrink-0 relative">
      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-sm ${
        type === 'alert' ? 'bg-red-500' : 
        type === 'success' ? 'bg-green-500' : 'bg-indigo-500'
      }`}>
        {avatar}
      </div>
      {!read && <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border-2 border-white rounded-full"></span>}
    </div>
    <div className="flex-1">
      <p className="text-sm text-gray-800 leading-relaxed">
        <span className="font-bold">{name}</span> {action} <span className="font-medium text-indigo-600">{target}</span>
      </p>
      {attachment && (
        <div className="mt-2 flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg border border-gray-100 w-fit hover:bg-gray-100 transition-colors cursor-pointer">
          {attachment.type === 'pdf' ? <FileText size={18} className="text-red-500" /> : <Image size={18} className="text-blue-500" />}
          <span className="text-xs text-gray-600 font-medium">{attachment.name}</span>
        </div>
      )}
      <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1.5">
        <Clock size={12} /> {time}
      </p>
    </div>
  </div>
);

const NotificationsPage = ({ onLogout }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [adminName, setAdminName] = useState('');
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [loading, setLoading] = useState(true);

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
        const response = await fetch('http://localhost:5000/api/student-requests');
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
    const fetchNotificationFlag = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:5000/api/notifications/flag', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setHasNewNotifications(data.hasNewNotification);
        }
      } catch (error) {
        console.error('Error fetching notification flag:', error);
      }
    };
    fetchNotificationFlag();
  }, []);

  const [notifications, setNotifications] = useState({
    today: [
      { id: 1, avatar: 'JD', name: 'John Doe', action: 'submitted leave request for', target: '2 days', time: '2 hours ago', type: 'info', read: false },
      { id: 2, avatar: 'AS', name: 'Admin System', action: 'generated monthly report', target: 'Finance_July.pdf', time: '4 hours ago', type: 'success', attachment: { type: 'pdf', name: 'Finance_July.pdf' }, read: false },
      { id: 3, avatar: 'SM', name: 'Sarah Miller', action: 'flagged an issue in', target: 'Maintenance', time: '5 hours ago', type: 'alert', read: false },
    ],
    yesterday: [
      { id: 4, avatar: 'RK', name: 'Robert King', action: 'updated profile picture', target: '', time: 'Yesterday, 10:30 AM', type: 'info', attachment: { type: 'image', name: 'profile_new.jpg' }, read: true },
      { id: 5, avatar: 'Sys', name: 'System', action: 'completed backup', target: 'Server', time: 'Yesterday, 02:00 AM', type: 'success', read: true },
    ]
  });

  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  const handleMarkAllRead = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('http://localhost:5000/api/notifications/read-all', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Update local state
        setNotifications(prev => ({
          today: prev.today.map(n => ({ ...n, read: true })),
          yesterday: prev.yesterday.map(n => ({ ...n, read: true }))
        }));

        // Reset notification flag
        setHasNewNotifications(false);
      } else {
        console.error('Failed to mark notifications as read');
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    }
  };

  const handleClearAll = () => {
    setNotifications({
      today: [],
      yesterday: []
    });
  };

  const filterNotifications = (list) => {
    return list.filter(n =>
      n.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.target.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-gray-800 overflow-hidden">
      {/* Left Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out shadow-sm ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-4 flex items-center justify-center gap-3">
          <img src="/assets/logo.png" alt="EduMind Logo" className="h-32 w-auto max-w-full object-contain" />
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" onClick={() => navigate('/admin')} />
          <NavItem icon={<ShieldCheck size={20} />} label="Verification" onClick={() => navigate('/admin', { state: { activeView: 'verification' } })} badge={pendingRequestsCount} />
          <NavItem icon={<GraduationCap size={20} />} label="Students" onClick={() => navigate('/admin/students')} />
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
            className="flex items-center gap-3 text-gray-600 hover:text-red-600 hover:bg-red-50 w-full p-3 rounded-xl transition-colors duration-200"
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
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex justify-between items-center px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden"
            >
              <Menu size={24} />
            </button>
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search notifications..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all outline-none text-sm text-gray-600 placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/admin/notifications')}
              className="relative p-2 text-gray-400 hover:text-indigo-600 transition-colors"
            >
              <Bell size={28} />
              {hasNewNotifications && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>}
            </button>
            <button onClick={() => navigate('/admin/profile')} className="flex items-center gap-3 pl-6 border-l border-gray-100 hover:bg-gray-50 rounded-lg -ml-2 p-2 transition-colors">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-gray-900">{adminName}</p>
                <p className="text-xs text-gray-500 font-medium">Admin Administrator</p>
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
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-end mb-2">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
                <p className="text-sm text-gray-500 mt-1">Stay updated with latest activities</p>
              </div>
              <div className="flex gap-4">
                <button onClick={handleMarkAllRead} className="text-sm text-indigo-600 font-medium hover:text-indigo-700 hover:underline transition-all">Mark all as read</button>
                <button onClick={handleClearAll} className="text-sm text-red-600 font-medium hover:text-red-700 hover:underline transition-all">Clear all</button>
              </div>
            </div>

            <div className="bg-white rounded-[18px] shadow-sm border border-gray-100 p-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 pl-2">Today</h3>
              <div className="space-y-1 mb-8">
                {filterNotifications(notifications.today).map(n => <NotificationItem key={n.id} {...n} />)}
              </div>

              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 pl-2">Yesterday</h3>
              <div className="space-y-1">
                {filterNotifications(notifications.yesterday).map(n => <NotificationItem key={n.id} {...n} />)}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick, badge }) => (
  <button onClick={onClick} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group w-full ${active ? 'bg-sky-50 text-sky-600 font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'}`}>
    <span className={`${active ? 'text-sky-600' : 'text-gray-400 group-hover:text-sky-600 transition-colors'}`}>{icon}</span>
    <span className="flex-1 text-left">{label}</span>
    {badge > 0 && (
      <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg ring-2 ring-white">
        {badge}
      </span>
    )}
  </button>
);

export default NotificationsPage;