
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Check if this is an admin login attempt (you might want to add a role selector or detect admin emails)
      const isAdminLogin = formData.email.toLowerCase().includes('admin') ||
                          formData.email.toLowerCase().includes('shilpa') ||
                          formData.email.toLowerCase().includes('priya');

      let loginEndpoint = 'http://localhost:5001/api/login';
      let loginData = {
        email: formData.email.toLowerCase(),
        password: formData.password,
      };

      // Use admin-specific endpoint for admin logins
      if (isAdminLogin) {
        loginEndpoint = 'http://localhost:5001/auth/login';
        loginData = {
          ...loginData,
          role: 'ADMIN'
        };
      }

      const response = await fetch(loginEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      if (response.ok && result.token) {
        const user = result;
        const role = user.role === 'ADMIN' ? 'admin' : user.role;

        // Store user data and JWT in localStorage
        const sessionData = {
          ...user,
          role: role,
          token: result.token
        };
        localStorage.setItem('currentUser', JSON.stringify(sessionData));
        localStorage.setItem('userRole', role);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', `${user.firstName} ${user.lastName}`);
        localStorage.setItem('token', result.token);

        // Store parent-specific data
        if (role === 'parent' && user.children) {
          localStorage.setItem('parentName', `${user.firstName} ${user.lastName}`);
          localStorage.setItem('childName', user.children.length > 0 ? user.children[0].name : '');
          localStorage.setItem('childGrade', user.children.length > 0 ? user.children[0].grade : '');
        }

        // Check if it's first login and redirect to password change
        if (user.isFirstLogin) {
          navigate('/change-password');
          return;
        }

        // Redirect based on role
        switch (role) {
          case 'admin': navigate('/admin'); break;
          case 'student': navigate('/student'); break;
          case 'parent': navigate('/parent'); break;
          case 'teacher': navigate('/teacher'); break;
          case 'staff': navigate('/staff'); break;
          default: navigate('/');
        }
      } else {
        setError(result.message || result.error || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 mb-4">
              <img src="/assets/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-500 mt-2">Please sign in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 animate-fadeIn">
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <button type="button" className="text-indigo-600 font-semibold hover:text-indigo-700">
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account? <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">Sign Up (Admin)</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
