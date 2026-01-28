import React, { useState, useEffect, useRef } from 'react';
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
  Settings,
  Camera,
  Mail,
  Phone,
  MapPin,
  Shield,
  Save,
  Edit2,
  Lock,
  X,
  CheckCircle,
  AlertCircle,
  Trash2,
  ShieldCheck
} from 'lucide-react';

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

const AdminProfilePage = ({ onLogout }) => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showCropModal, setShowCropModal] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [cropScale, setCropScale] = useState(1);
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  
  const [profileData, setProfileData] = useState({
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@edumind.com',
    phone: '+1 234 567 890',
    role: 'Administrator',
    location: 'New York, USA',
    bio: 'Experienced school administrator with a passion for education technology and management.',
    notifications: true
  });

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        const response = await fetch('http://localhost:5000/admin/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const profileData = await response.json();
          setProfileData({
            firstName: profileData.firstName || 'Admin',
            lastName: profileData.lastName || 'User',
            email: profileData.emailId || 'admin@edumind.com',
            phone: profileData.mobile || '+1 234 567 890',
            role: 'Administrator',
            location: 'New York, USA',
            bio: 'Experienced school administrator with a passion for education technology and management.',
            notifications: true
          });

          const fullName = `${profileData.firstName || 'Admin'} ${profileData.lastName || 'User'}`;
          setAdminName(fullName);

          if (profileData.profilePicture) {
            setProfileImage(profileData.profilePicture);
          }
        } else {
          console.error('Failed to fetch admin profile');
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };
    fetchAdminData();
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

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await fetch('http://localhost:5000/admin/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          mobile: profileData.phone
        })
      });

      if (response.ok) {
        setIsEditing(false);
        const fullName = `${profileData.firstName} ${profileData.lastName}`;
        setAdminName(fullName);
        setSuccessMessage('Profile updated successfully!');
        setTimeout(() => setSuccessMessage(''), 5000);
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const toggleNotifications = () => {
    const newStatus = !profileData.notifications;
    setProfileData(prev => ({ ...prev, notifications: newStatus }));
    
    try {
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
        if (registeredUsers.admin) {
            registeredUsers.admin.notifications = newStatus;
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        }
    } catch (e) {
        console.error("Failed to save notification preference:", e);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setPasswordError('Authentication token not found');
        return;
      }

      const response = await fetch('http://localhost:5000/admin/change-password', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      if (response.ok) {
        setPasswordSuccess('Password updated successfully');
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
          setPasswordSuccess('');
        }, 1500);
      } else {
        const errorData = await response.json();
        setPasswordError(errorData.message || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordError('Failed to update password. Please try again.');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImage(reader.result);
        setShowCropModal(true);
        setCropScale(1);
        setCropPosition({ x: 0, y: 0 });
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleCropSave = () => {
    const canvas = document.createElement('canvas');
    const size = 250;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.src = tempImage;
    img.onload = () => {
        const imgWidth = img.naturalWidth * cropScale;
        const imgHeight = img.naturalHeight * cropScale;
        const dx = (size - imgWidth) / 2 + cropPosition.x;
        const dy = (size - imgHeight) / 2 + cropPosition.y;

        ctx.drawImage(img, dx, dy, imgWidth, imgHeight);
        
        const base64String = canvas.toDataURL('image/png');
        
        setProfileImage(base64String);
        setSuccessMessage('Profile picture updated successfully!');
        setTimeout(() => setSuccessMessage(''), 5000);
        setShowCropModal(false);

        try {
          const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
          if (registeredUsers.admin) {
            registeredUsers.admin.profileImage = base64String;
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
          }
        } catch (e) {
          console.error("Failed to save profile image:", e);
        }
    };
  };

  const handleMouseDown = (e) => { e.preventDefault(); setIsDragging(true); setDragStart({ x: e.clientX - cropPosition.x, y: e.clientY - cropPosition.y }); };
  const handleMouseMove = (e) => { if (isDragging) { setCropPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); } };
  const handleMouseUp = () => { setIsDragging(false); };


  const handleRemoveImage = (e) => {
    e.stopPropagation();
    setProfileImage(null);
    try {
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      if (registeredUsers.admin) {
        delete registeredUsers.admin.profileImage;
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      }
    } catch (error) { console.error(error); }
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
            <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/admin/notifications')}
              className="relative p-2 text-gray-400 hover:text-indigo-600 transition-colors"
            >
              <Bell size={28} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-gray-900">{adminName}</p>
                <p className="text-xs text-gray-500 font-medium">Admin Administrator</p>
              </div>
              <img
                src={profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(adminName)}&background=c7d2fe&color=3730a3`}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-100">
          {successMessage && (
            <div className="fixed top-24 right-8 z-50 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fadeIn">
              <CheckCircle size={20} />
              <span className="font-medium">{successMessage}</span>
            </div>
          )}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Cover Image */}
              <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
                <button className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/30 transition-colors">
                  <Camera size={20} />
                </button>
              </div>

              <div className="px-8 pb-8">
                {/* Profile Header */}
                <div className="relative flex justify-between items-end -mt-16 mb-8">
                  <div className="flex items-end gap-6 relative">
                    <div className="relative group">
                      <img 
                        src={profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(adminName)}&background=c7d2fe&color=3730a3&size=128`}
                        alt="Profile" 
                        className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-white object-cover"
                      />
                      <div className="absolute inset-0 rounded-full bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="text-white" size={24} />
                      </div>
                      <button onClick={() => fileInputRef.current.click()} className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors shadow-sm border-2 border-white z-10">
                        <Camera size={16} />
                      </button>
                      {profileImage && (
                        <button 
                          onClick={handleRemoveImage}
                          className="absolute top-0 right-0 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-sm border-2 border-white z-20"
                          title="Remove photo"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </div>
                    <div className="mb-2">
                      <h2 className="text-3xl font-bold text-gray-900">{adminName}</h2>
                      <p className="text-gray-500 font-medium">{profileData.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                        onClick={() => setShowPasswordModal(true)}
                        className="px-4 py-2.5 rounded-xl font-semibold transition-colors flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm"
                    >
                        <Lock size={18} />
                        Change Password
                    </button>
                    <button 
                        onClick={() => setIsEditing(!isEditing)}
                        className={`px-6 py-2.5 rounded-xl font-semibold transition-colors flex items-center gap-2 ${
                        isEditing 
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                    >
                        {isEditing ? (
                        <>Cancel</>
                        ) : (
                        <>
                            <Edit2 size={18} />
                            Edit Profile
                        </>
                        )}
                    </button>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Left Column - Contact Info */}
                  <div className="md:col-span-1 space-y-6">
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                      <h3 className="font-bold text-gray-900 mb-4">Contact Information</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-gray-600">
                          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-indigo-600 shadow-sm">
                            <Mail size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-400">Email Address</p>
                            <p className="text-sm font-medium truncate" title={profileData.email}>{profileData.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-indigo-600 shadow-sm">
                            <Phone size={16} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Phone Number</p>
                            <p className="text-sm font-medium">{profileData.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600">
                          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-indigo-600 shadow-sm">
                            <MapPin size={16} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Location</p>
                            <p className="text-sm font-medium">{profileData.location}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900">Notifications</h3>
                        <Bell size={20} className="text-gray-400" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Email Alerts</span>
                        <button
                          onClick={toggleNotifications}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                            profileData.notifications ? 'bg-indigo-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              profileData.notifications ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Receive email updates about school activities and alerts.
                      </p>
                    </div>

                    <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                      <div className="flex items-center gap-3 mb-2">
                        <Shield className="text-indigo-600" size={20} />
                        <h3 className="font-bold text-indigo-900">Admin Privileges</h3>
                      </div>
                      <p className="text-sm text-indigo-700 leading-relaxed">
                        You have full access to manage students, teachers, finance, and system settings.
                      </p>
                    </div>
                  </div>

                  {/* Right Column - Edit Form */}
                  <div className="md:col-span-2">
                    <div className="bg-white rounded-xl">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Personal Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                          <input
                            type="text"
                            disabled={!isEditing}
                            value={profileData.firstName}
                            onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                          <input
                            type="text"
                            disabled={!isEditing}
                            value={profileData.lastName}
                            onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                          <textarea
                            rows="4"
                            disabled={!isEditing}
                            value={profileData.bio}
                            onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 resize-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                          <input
                            type="email"
                            disabled={!isEditing}
                            value={profileData.email}
                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                          <input
                            type="tel"
                            disabled={!isEditing}
                            value={profileData.phone}
                            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                      </div>

                      {isEditing && (
                        <div className="mt-8 flex justify-end">
                          <button 
                            onClick={handleSave}
                            className="bg-indigo-600 text-white px-8 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-200"
                          >
                            <Save size={18} />
                            Save Changes
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handlePasswordSave} className="p-6 space-y-4">
              {passwordError && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                  <AlertCircle size={16} />
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="p-3 bg-green-50 text-green-600 text-sm rounded-lg flex items-center gap-2">
                  <CheckCircle size={16} />
                  {passwordSuccess}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Crop Modal */}
      {showCropModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Adjust Profile Picture</h3>
              <button onClick={() => setShowCropModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 flex flex-col items-center">
              <div className="relative w-[250px] h-[250px] rounded-full overflow-hidden border-4 border-indigo-100 bg-gray-50 cursor-move mb-6 flex items-center justify-center">
                <img 
                  src={tempImage} 
                  alt="Crop preview"
                  className="max-w-none"
                  style={{ transform: `translate(${cropPosition.x}px, ${cropPosition.y}px) scale(${cropScale})`, pointerEvents: 'auto' }}
                  onMouseDown={handleMouseDown}
                  draggable={false}
                />
              </div>
              
              <div className="w-full px-4 flex items-center gap-4">
                <span className="text-xs font-medium text-gray-500">Zoom</span>
                <input 
                  type="range" min="0.5" max="3" step="0.1" value={cropScale}
                  onChange={(e) => setCropScale(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowCropModal(false)} className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-medium">
                Cancel
              </button>
              <button onClick={handleCropSave} className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium">
                Save Picture
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AdminProfilePage;