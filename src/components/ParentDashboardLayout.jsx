import React, { useState } from 'react';
import {
  LayoutDashboard, TrendingUp, Clock, FileText,
  BookOpen, MapPin, MessageSquare, LogOut,
  Bell, Search, Menu, CreditCard, User, Calendar
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-200 group w-full text-left touch-manipulation active:scale-95 ${
      active
        ? 'bg-sky-50 text-sky-600 font-bold shadow-sm border border-sky-200'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium hover:shadow-sm border border-transparent hover:border-gray-200'
    }`}
  >
    <span className={`${active ? 'text-sky-600' : 'text-gray-400 group-hover:text-sky-600 transition-colors'}`}>
      <Icon size={20} />
    </span>
    <span className="text-sm">{label}</span>
  </button>
);

const ParentDashboardLayout = ({ children, activePage = 'Dashboard', onNavigate, notificationCount = 0 }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'Performance', label: 'Performance', icon: TrendingUp },
    { id: 'Attendance', label: 'Attendance', icon: Clock },
    { id: 'Report Cards', label: 'Report Cards', icon: FileText },
    { id: 'Assignments', label: 'Assignments', icon: BookOpen },
    { id: 'Bus Tracker', label: 'Bus Tracker', icon: MapPin },
    { id: 'Messages', label: 'Messages', icon: MessageSquare },
    { id: 'Notifications', label: 'Notifications', icon: Bell },
    { id: 'Fee Payment', label: 'Fee Payment', icon: CreditCard },
    { id: 'Student Profile', label: 'Student Profile', icon: User },
    { id: 'Meetings', label: 'Meetings', icon: Calendar },
    { id: 'Logout', label: 'Logout', icon: LogOut },
  ];

  return (
    <div className="min-h-screen bg-slate-100 font-sans flex overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 text-gray-800 transition-transform duration-300 ease-in-out shadow-sm ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0`}
      >
        <div className="h-20 flex items-center px-8 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="EduMind Logo" className="h-20 w-auto object-contain" />
          </div>
        </div>

        <div className="py-6 overflow-y-auto h-[calc(100vh-5rem)]">
          <div className="px-7 mb-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Parent Menu
          </div>
          <nav>
            {menuItems.map((item) => (
              <SidebarItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                active={activePage === item.id}
                onClick={() => onNavigate(item.id)}
              />
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 overflow-hidden">

        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            {/* Hamburger Button */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors lg:hidden"
            >
              <Menu size={24} />
            </button>

            {/* Title */}
            <h1 className="text-xl font-bold text-gray-900">Parent Dashboard</h1>

            {/* Search Bar */}
            <div className="hidden md:flex items-center bg-gray-50 rounded-2xl px-4 py-2.5 w-96 border border-gray-100 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <Search size={18} className="text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Notification Bell */}
            <button
              onClick={() => onNavigate('Notifications')}
              className="relative p-2.5 rounded-xl hover:bg-indigo-50 text-gray-500 hover:text-indigo-600 transition-colors"
            >
              <Bell size={22} />
              {notificationCount > 0 && (
                <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
              )}
            </button>

            {/* Parent Avatar */}
            <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-gray-700">Mr. Doe</p>
                <p className="text-xs text-gray-500">Parent</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 cursor-pointer hover:shadow-md transition-shadow">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Parent"
                    alt="Parent"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ParentDashboardLayout;
