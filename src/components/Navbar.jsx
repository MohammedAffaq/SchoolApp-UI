import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar({ userRole, onLogout }) {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const handleLogoClick = () => {
    if (userRole === 'admin') {
      navigate('/admin');
    } else if (userRole === 'student') {
      navigate('/student');
    } else if (userRole === 'staff') {
      navigate('/teacher');
    } else if (userRole === 'parent') {
      navigate('/parent');
    } else {
      navigate('/'); // fallback to home
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-blue-600 cursor-pointer" onClick={handleLogoClick}>🎓 EDUMIND</h1>

          <div className="hidden md:flex gap-6">
            {userRole === 'admin' && (
              <>
                <a href="/admin" className="text-gray-700 hover:text-blue-600 font-medium">
                  Admin Dashboard
                </a>
                <a href="/user-management" className="text-gray-700 hover:text-blue-600 font-medium">
                  User Management
                </a>
              </>
            )}
            {userRole === 'student' && (
              <a href="/student" className="text-gray-700 hover:text-blue-600 font-medium">
                My Dashboard
              </a>
            )}
            {userRole === 'staff' && (
              <a href="/teacher" className="text-gray-700 hover:text-blue-600 font-medium">
                Classes
              </a>
            )}
            {userRole === 'parent' && (
              <a href="/parent" className="text-gray-700 hover:text-blue-600 font-medium">
                Children
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <span className="text-gray-700 font-semibold capitalize">{userRole}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="bg-white border-t border-gray-200 px-4 py-4">
          <div className="flex flex-col gap-4">
            {userRole === 'admin' && (
              <>
                <a href="/admin/students" className="text-gray-700 hover:text-blue-600 font-medium py-2">
                  Students
                </a>
                <div className="ml-4">
                  <a href="/admin/teachers" className="text-gray-700 hover:text-blue-600 font-medium py-2">
                    Teachers
                  </a>
                  <a href="/admin/teachers?tab=teaching" className="text-gray-600 hover:text-blue-600 font-medium py-2 pl-4 text-sm">
                    Teaching Staff
                  </a>
                  <a href="/admin/teachers?tab=non-teaching" className="text-gray-600 hover:text-blue-600 font-medium py-2 pl-4 text-sm">
                    Non-Teaching Staff
                  </a>
                </div>
                <a href="/admin/parents" className="text-gray-700 hover:text-blue-600 font-medium py-2">
                  Parents
                </a>
                <a href="/admin/drivers" className="text-gray-700 hover:text-blue-600 font-medium py-2">
                  Driver & Vehicles
                </a>
                <a href="/admin/finance" className="text-gray-700 hover:text-blue-600 font-medium py-2">
                  Finance
                </a>
                <a href="/admin/attendance" className="text-gray-700 hover:text-blue-600 font-medium py-2">
                  Attendance
                </a>
                <a href="/admin/settings" className="text-gray-700 hover:text-blue-600 font-medium py-2">
                  Settings
                </a>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-blue-600 font-medium py-2 text-left"
                >
                  Logout
                </button>
              </>
            )}
            {userRole === 'student' && (
              <a href="/student" className="text-gray-700 hover:text-blue-600 font-medium py-2">
                My Dashboard
              </a>
            )}
            {userRole === 'staff' && (
              <a href="/teacher" className="text-gray-700 hover:text-blue-600 font-medium py-2">
                Classes
              </a>
            )}
            {userRole === 'parent' && (
              <a href="/parent" className="text-gray-700 hover:text-blue-600 font-medium py-2">
                Children
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
