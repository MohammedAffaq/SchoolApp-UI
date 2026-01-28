import React, { useState, useEffect } from 'react';
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
  Bell,
  Menu,
  User,
  Settings as SettingsIcon,
  Save,
  Shield,
  Database,
  School,
  Lock,
  ShieldCheck
} from 'lucide-react';

const Settings = ({ onLogout }) => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  
  // Settings State
  const [generalSettings, setGeneralSettings] = useState({
    schoolName: 'EduMind High School',
    email: 'admin@edumind.com',
    phone: '+1 234 567 890',
    address: '123 Education Lane, Knowledge City',
    academicYear: '2023-2024',
    website: 'www.edumind-school.com'
  });

  const [systemSettings, setSystemSettings] = useState({
    allowRegistration: true,
    maintenanceMode: false,
    autoBackup: true,
    backupFrequency: 'daily'
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: false,
    sessionTimeout: '30',
    passwordExpiry: '90'
  });

  useEffect(() => {
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

  useEffect(() => {
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

  const handleSave = () => {
    // Simulate save
    alert('Settings saved successfully!');
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
          <NavItem icon={<SettingsIcon size={20} />} label="Settings" active onClick={() => navigate('/admin/settings')} />
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
            <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/admin/notifications')}
              className="relative p-2 text-gray-400 hover:text-indigo-600 transition-colors"
            >
              <Bell size={28} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
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
          <div className="max-w-4xl mx-auto">
            
            {/* Tabs */}
            <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm mb-6 w-fit">
              <TabButton active={activeTab === 'general'} onClick={() => setActiveTab('general')} icon={<School size={18} />} label="School Info" />
              <TabButton active={activeTab === 'system'} onClick={() => setActiveTab('system')} icon={<Database size={18} />} label="System" />
              <TabButton active={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={<Shield size={18} />} label="Security" />
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">School Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label="School Name" value={generalSettings.schoolName} onChange={(v) => setGeneralSettings({...generalSettings, schoolName: v})} />
                    <InputGroup label="Official Email" value={generalSettings.email} onChange={(v) => setGeneralSettings({...generalSettings, email: v})} />
                    <InputGroup label="Contact Phone" value={generalSettings.phone} onChange={(v) => setGeneralSettings({...generalSettings, phone: v})} />
                    <InputGroup label="Website" value={generalSettings.website} onChange={(v) => setGeneralSettings({...generalSettings, website: v})} />
                    <div className="md:col-span-2">
                      <InputGroup label="Address" value={generalSettings.address} onChange={(v) => setGeneralSettings({...generalSettings, address: v})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Academic Year</label>
                      <select 
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                        value={generalSettings.academicYear}
                        onChange={(e) => setGeneralSettings({...generalSettings, academicYear: e.target.value})}
                      >
                        <option>2023-2024</option>
                        <option>2024-2025</option>
                        <option>2025-2026</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* System Settings */}
              {activeTab === 'system' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">System Configuration</h2>
                  <div className="space-y-4">
                    <ToggleSwitch 
                      label="Allow Student Registration" 
                      desc="Enable or disable public registration for students" 
                      checked={systemSettings.allowRegistration} 
                      onChange={() => setSystemSettings({...systemSettings, allowRegistration: !systemSettings.allowRegistration})} 
                    />
                    <ToggleSwitch 
                      label="Maintenance Mode" 
                      desc="Put the system in maintenance mode (only admins can login)" 
                      checked={systemSettings.maintenanceMode} 
                      onChange={() => setSystemSettings({...systemSettings, maintenanceMode: !systemSettings.maintenanceMode})} 
                    />
                    <div className="border-t border-gray-100 pt-4 mt-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Backup Settings</h3>
                      <ToggleSwitch 
                        label="Automatic Daily Backup" 
                        desc="Backup database every night at 00:00" 
                        checked={systemSettings.autoBackup} 
                        onChange={() => setSystemSettings({...systemSettings, autoBackup: !systemSettings.autoBackup})} 
                      />
                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Backup Frequency</label>
                        <select 
                          className="w-full md:w-1/2 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                          value={systemSettings.backupFrequency}
                          onChange={(e) => setSystemSettings({...systemSettings, backupFrequency: e.target.value})}
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Security Settings</h2>
                  <div className="space-y-6">
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <div className="flex items-start gap-3">
                        <Lock className="text-blue-600 mt-1" size={20} />
                        <div>
                          <h3 className="font-bold text-blue-900">Admin Password</h3>
                          <p className="text-sm text-blue-700 mt-1">Ensure your admin account has a strong password.</p>
                          <button 
                            onClick={() => alert('Change Password functionality coming soon!')}
                            className="mt-3 px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors"
                          >
                            Change Password
                          </button>
                        </div>
                      </div>
                    </div>

                    <ToggleSwitch 
                      label="Two-Factor Authentication (2FA)" 
                      desc="Require 2FA for all admin logins" 
                      checked={securitySettings.twoFactor} 
                      onChange={() => setSecuritySettings({...securitySettings, twoFactor: !securitySettings.twoFactor})} 
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (Minutes)</label>
                        <select 
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                          value={securitySettings.sessionTimeout}
                          onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: e.target.value})}
                        >
                          <option value="15">15 Minutes</option>
                          <option value="30">30 Minutes</option>
                          <option value="60">1 Hour</option>
                          <option value="120">2 Hours</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password Expiry (Days)</label>
                        <select 
                          className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                          value={securitySettings.passwordExpiry}
                          onChange={(e) => setSecuritySettings({...securitySettings, passwordExpiry: e.target.value})}
                        >
                          <option value="30">30 Days</option>
                          <option value="60">60 Days</option>
                          <option value="90">90 Days</option>
                          <option value="never">Never</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={handleSave}
                  className="bg-sky-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-sky-700 transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Save size={18} />
                  Save Changes
                </button>
              </div>

            </div>
          </div>
        </main>
      </div>
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

const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
      active ? 'bg-sky-100 text-sky-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    {icon}
    {label}
  </button>
);

const InputGroup = ({ label, value, onChange, type = "text" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
    />
  </div>
);

const ToggleSwitch = ({ label, desc, checked, onChange }) => (
  <div className="flex items-center justify-between py-2">
    <div>
      <p className="font-medium text-gray-900">{label}</p>
      <p className="text-sm text-gray-500">{desc}</p>
    </div>
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 ${
        checked ? 'bg-sky-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

export default Settings;
