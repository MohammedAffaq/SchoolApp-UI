
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, RefreshCw, Upload, Shield, GraduationCap, Users, Briefcase, X, Mail, CheckCircle, Trash2 } from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [isRobot, setIsRobot] = useState(false);
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const navigate = useNavigate();
  const [staffType, setStaffType] = useState('teaching');

  // Helper function for email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Generate random CAPTCHA
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
    setCaptchaInput('');
  };

  // Initialize CAPTCHA on mount
  useEffect(() => {
    generateCaptcha();
  }, []);

  // Check if already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');

    if (isLoggedIn && userRole) {
      if (userRole === 'admin') navigate('/admin');
      else if (userRole === 'student') navigate('/student');
      else if (userRole === 'parent') navigate('/parent');
      else if (userRole === 'teacher') navigate('/teacher');
      else if (userRole === 'staff') navigate('/staff');
    }
  }, [navigate]);

  // Set parent data when parent tab is selected
  useEffect(() => {
    if (activeTab === 'parent') {
      setParentData({
        name: 'Jagannath k',
        childName: 'Prajwal',
        email: '',
        password: '',
        rememberMe: false,
      });
    }
  }, [activeTab]);

  // Admin Form
  const [adminData, setAdminData] = useState({ email: '', password: '', rememberMe: false });

  // Student Form
  const [studentData, setStudentData] = useState({
    name: '',
    email: '',
    password: '',
    dob: '',
    phone: '',
    age: '',
    document: null,
    rememberMe: false,
  });

  // Parent Form
  const [parentData, setParentData] = useState({ name: '', childName: '', email: '', password: '', rememberMe: false });

  // Staff Form
  const [staffData, setStaffData] = useState({ staffId: '', password: '', staffType: 'teaching' }); // Removed rememberMe

  // Forgot Password State
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [fpEmail, setFpEmail] = useState('');
  const [fpErrors, setFpErrors] = useState({});
  const [fpSubmitted, setFpSubmitted] = useState(false);
  const [fpLoading, setFpLoading] = useState(false);

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fpEmail) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(fpEmail)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setFpErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setFpLoading(true);
      // Simulate API call
      setTimeout(() => {
        setFpSubmitted(true);
        setFpLoading(false);
      }, 1500);
    }
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
    setFpEmail('');
    setFpErrors({});
    setFpSubmitted(false);
    setFpLoading(false);
  };

  const validateCaptcha = () => {
    if (!captcha) {
      alert('⚠️ CAPTCHA not loaded. Please refresh the page.');
      return false;
    }
    if (captchaInput.trim() === '') {
      alert('⚠️ Please enter the CAPTCHA text');
      return false;
    }
    if (captchaInput.trim() !== captcha) {
      alert('❌ Invalid CAPTCHA. Please try again.');
      generateCaptcha();
      return false;
    }
    if (!isRobot) {
      alert('❌ Please verify you are not a robot');
      return false;
    }
    return true;
  };

  const performLogin = async (email, password, role, targetPath) => {
    // 1. Try Backend Login First (to get valid Token)
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.toLowerCase(), password }),
      });
      const result = await response.json();

      if (result.success) {
        const user = result.user;
        if (result.token) {
          user.token = result.token;
        }
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', `${user.firstName} ${user.lastName}`);
        
        alert('✅ Login successful!');
        navigate(targetPath);
        return;
      }
    } catch (error) {
      console.log('Backend unreachable, trying local storage...');
    }

    // 2. Local Storage Fallback (Offline/Demo Mode)
    try {
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '{}');
      let localUser = null;

      // Check generic role structure
      if (registeredUsers[role]) {
        const roleData = registeredUsers[role];
        if (Array.isArray(roleData)) {
          localUser = roleData.find((u) => (u.email || u.staffId || '').toLowerCase() === email.toLowerCase() && u.password === password);
        } else if ((roleData.email || roleData.staffId || '').toLowerCase() === email.toLowerCase() && roleData.password === password) {
          localUser = roleData;
        }
      }
      
      // Legacy admin check
      if (!localUser && role === 'admin' && registeredUsers.admin && !Array.isArray(registeredUsers.admin)) {
         if (registeredUsers.admin.email === email.toLowerCase() && registeredUsers.admin.password === password) {
            localUser = registeredUsers.admin;
         }
      }

      if (localUser) {
        localStorage.setItem('currentUser', JSON.stringify(localUser));
        localStorage.setItem('userRole', localUser.role);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', `${localUser.firstName} ${localUser.lastName}`);
        
        alert('✅ Login successful! (Local Mode)');
        navigate(targetPath);
        return;
      }
    } catch (error) {
      console.error('Local login error:', error);
    }

    alert('❌ Login failed: Invalid credentials or server unreachable.');
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    if (!validateCaptcha()) return;
    if (!validateEmail(adminData.email)) {
      alert('Please enter a valid email address for Admin.');
      return;
    }
    performLogin(adminData.email, adminData.password, 'admin', '/admin');
  };

  const handleStudentSubmit = (e) => {
    e.preventDefault();
    if (!validateCaptcha()) return;
    if (!validateEmail(studentData.email)) {
      alert('Please enter a valid email address for Student.');
      return;
    }
    performLogin(studentData.email, studentData.password, 'student', '/student');
  };

  const handleParentSubmit = (e) => {
    e.preventDefault();
    if (!validateCaptcha()) return;
    if (!validateEmail(parentData.email)) {
      alert('Please enter a valid email address for Parent.');
      return;
    }
    performLogin(parentData.email, parentData.password, 'parent', '/parent');
  };

  const handleStaffSubmit = (e) => {
    e.preventDefault();
    if (!validateCaptcha()) return;
    if (!validateEmail(staffData.staffId)) { // staffId is used as email
      alert('Please enter a valid email address for Staff.');
      return;
    }
    performLogin(staffData.staffId, staffData.password, 'staff', '/teacher');
  };

  const handleResetSystem = () => {
    if (window.confirm('⚠️ Are you sure you want to clear ALL registered users and system data? This cannot be undone.')) {
      localStorage.clear();
      // Re-initialize empty structure
      localStorage.setItem('registeredUsers', JSON.stringify({}));
      alert('✅ System reset complete. You can now register fresh users.');
      window.location.reload();
    }
  };

  const renderCaptcha = () => (
    <div className="my-3 space-y-3">
      {/* CAPTCHA Row */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-lg font-bold text-gray-800 bg-gray-100 px-3 py-2 rounded border">
          {captcha}
        </span>
        <button
          type="button"
          onClick={generateCaptcha}
          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          title="Refresh CAPTCHA"
        >
          <RefreshCw size={16} />
        </button>
        <input
          type="text"
          value={captchaInput}
          onChange={(e) => setCaptchaInput(e.target.value)}
          placeholder="Enter CAPTCHA"
          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          required
        />
      </div>

      {/* Robot Checkbox */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isRobot}
          onChange={(e) => setIsRobot(e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
        />
        <span className="text-sm text-gray-600">I'm not a robot</span>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full font-sans antialiased overflow-hidden bg-gray-50">
      {/* Left Section: Soft light blue to white gradient */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-sky-50 via-white to-sky-100 items-center justify-center relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-sky-200/20 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        {/* Logo at top left */}
        <div className="absolute top-8 left-8">
          <img src="/assets/logo.png" alt="EduMind Logo" className="h-40 w-auto mb-2 object-contain animate-fadeInScale" />
        </div>

        {/* Illustration centered horizontally and vertically */}
        <div className="flex flex-col items-center max-w-lg">
          <div className="animate-float w-full flex justify-center">
            <img 
              src="/assets/Img01.png" 
              alt="Education Illustration" 
              className="w-[120%] max-w-none h-auto object-contain mb-8 hover:scale-105 transition-transform duration-500" 
            />
          </div>
          
          {/* Tagline text */}
          <p className="text-xl text-gray-500 italic font-medium text-center leading-relaxed">
            "Seamlessly Connecting Students, Parents, and Educators"
          </p>
        </div>
      </div>

      {/* Right Section: Login Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <button 
          onClick={handleResetSystem}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
          title="Reset System Data (Clear All Users)"
        >
          <Trash2 size={20} />
        </button>

        <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 max-h-[95vh] overflow-y-auto">
          {/* Title & Subtitle */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-sky-600 tracking-tight transition-colors duration-300 hover:text-sky-700">LOGIN</h1>
          </div>

          {/* Role Tabs (Pill Style) */}
          <div className="flex p-1.5 bg-gray-100/80 rounded-2xl mb-8 border border-gray-200">
            {[
              { role: 'admin', icon: <Shield size={18} /> },
              { role: 'student', icon: <GraduationCap size={18} /> },
              { role: 'parent', icon: <Users size={18} /> },
              { role: 'staff', icon: <Briefcase size={18} /> }
            ].map(({ role, icon }) => (
              <button
                key={role}
                onClick={() => {
                  setActiveTab(role);
                  setIsRobot(false);
                }}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 capitalize flex flex-col sm:flex-row items-center justify-center gap-2 ${
                  activeTab === role
                    ? 'bg-white text-blue-600 shadow-md ring-1 ring-black/5 transform scale-[1.02]'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                }`}
              >
                {icon}
                <span>{role}</span>
              </button>
            ))}
          </div>

          {/* Forms */}
          <div className="space-y-4">
            {/* ADMIN FORM */}
            {activeTab === 'admin' && (
              <form onSubmit={handleAdminSubmit} className="space-y-3 animate-fadeIn">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={adminData.email}
                    onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                    placeholder="admin@edumind.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    required
                  />
                </div>

                {/* Password with Toggle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={adminData.password}
                      onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* CAPTCHA */}
                {renderCaptcha()}

                {/* Login Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Login as Admin
                </button>

                {/* Forgot Password */}
                <div className="text-center mt-3">
                  <button type="button" onClick={() => setShowForgotPasswordModal(true)} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Forgot password?
                  </button>
                </div>

                <p className="text-xs text-gray-400 text-center mt-2">For Admin access only</p>
              </form>
            )}

            {/* STUDENT FORM */}
            {activeTab === 'student' && (
              <form onSubmit={handleStudentSubmit} className="space-y-2 animate-fadeIn">
                <div>
                  {/* Name */}
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={studentData.name}
                      onChange={(e) => setStudentData({ ...studentData, name: e.target.value })}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                      required
                    />
                  </div> */}

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={studentData.email}
                      onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
                      placeholder="student@edumind.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={studentData.password}
                      onChange={(e) => setStudentData({ ...studentData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 pr-10 text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>



                {/* CAPTCHA */}
                {renderCaptcha()}

                {/* Login Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Login as Student
                </button>

                {/* Forgot Password */}
                <div className="text-center mt-2">
                  <button type="button" onClick={() => setShowForgotPasswordModal(true)} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                    Forgot password?
                  </button>
                </div>
              </form>
            )}

            {/* PARENT FORM */}
            {activeTab === 'parent' && (
              <form onSubmit={handleParentSubmit} className="space-y-2 animate-fadeIn">
                <div>
                  {/* Parent Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Parent Name</label>
                    <input
                      type="text"
                      value={parentData.name}
                      onChange={(e) => setParentData({ ...parentData, name: e.target.value })}
                      placeholder="Enter parent name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                      required
                    />
                  </div>

                  

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={parentData.email}
                      onChange={(e) => setParentData({ ...parentData, email: e.target.value })}
                      placeholder="Enter your email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={parentData.password}
                        onChange={(e) => setParentData({ ...parentData, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 pr-10 text-sm"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-500"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* CAPTCHA */}
                {renderCaptcha()}

                {/* Login Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Login as Parent
                </button>

                {/* Forgot Password */}
                <div className="text-center mt-3">
                  <button type="button" onClick={() => setShowForgotPasswordModal(true)} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Forgot password?
                  </button>
                </div>
              </form>
            )}

            {/* STAFF FORM */}
            {activeTab === 'staff' && (
              <form onSubmit={handleStaffSubmit} className="space-y-3 animate-fadeIn">
                {/* Staff Type Selection */}
                <div className="flex gap-4 mb-2 p-1 bg-gray-50 rounded-lg">
                  {['teaching', 'non-teaching'].map((type) => (
                    <label key={type} className="flex-1 flex items-center justify-center gap-2 cursor-pointer py-2 rounded-md transition-all hover:bg-white hover:shadow-sm">
                      <input
                        type="radio"
                        name="staffType"
                        value={type}
                        checked={staffType === type}
                        onChange={(e) => setStaffType(e.target.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-xs font-medium text-gray-700 capitalize">{type.replace('-', ' ')}</span>
                    </label>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Staff ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={staffData.staffId}
                      onChange={(e) => setStaffData({ ...staffData, staffId: e.target.value })}
                      placeholder="staff@edumind.com"
                      className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      required
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={staffData.password}
                        onChange={(e) => setStaffData({ ...staffData, password: e.target.value })}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-500"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* CAPTCHA */}
                {renderCaptcha()}

                {/* Login Button */}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Login as Staff
                </button>

                {/* Forgot Password */}
                <div className="text-center mt-3">
                  <button type="button" onClick={() => setShowForgotPasswordModal(true)} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Forgot password?
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 mt-2 pt-4 border-t border-gray-100">
            {activeTab === 'admin' ? (
              <p className="text-gray-600">
                Don't have an account? 
                <button 
                  onClick={() => navigate('/signup')}
                  className="ml-2 text-blue-600 hover:text-blue-700 font-medium underline"
                >
                  Admin Sign up
                </button>
              </p>
            ) : (
              <p className="text-gray-600">
                Don't have an account? <span className="font-medium text-gray-700">Contact Administrator to register.</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative animate-fadeInScale">
            <button 
              onClick={closeForgotPasswordModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="p-8">
              {fpSubmitted ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Sent!</h2>
                  <p className="text-gray-600 mb-6">
                    We've sent a password reset link to <strong>{fpEmail}</strong>
                  </p>
                  <button 
                    onClick={closeForgotPasswordModal}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all"
                  >
                    Back to Login
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
                    <p className="text-gray-600 text-sm">
                      Enter your email address and we'll send you a link to reset your password.
                    </p>
                  </div>

                  <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                      <input
                        type="email"
                        value={fpEmail}
                        onChange={(e) => {
                          setFpEmail(e.target.value);
                          if (fpErrors.email) setFpErrors({});
                        }}
                        placeholder="Enter your email"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                          fpErrors.email 
                            ? 'border-red-500 focus:ring-red-200' 
                            : 'border-gray-300 focus:ring-blue-500/20 focus:border-blue-500'
                        }`}
                      />
                      {fpErrors.email && (
                        <p className="text-red-500 text-xs mt-1">{fpErrors.email}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={fpLoading}
                      className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all ${
                        fpLoading ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {fpLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInDown {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInDown {
          animation: fadeInDown 0.8s ease-out forwards;
        }
        @keyframes fadeInScale {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fadeInScale {
          animation: fadeInScale 0.8s ease-out forwards;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
