import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search, X, AlertCircle, CheckCircle } from 'lucide-react';
import { validateAuth, logout } from '../utils/auth';

export default function UserManagement() {
  const navigate = useNavigate();

  // State for users list
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // State for modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // State for form
  const [formData, setFormData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'student',
    status: 'active',
    joinDate: '',
    rollNumber: '',
    className: '',
    designation: '',
    subject: '',
    childName: '',
    relationship: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [, setShowPassword] = useState(false);
  const [tempPassword, setTempPassword] = useState('');

  // Load users from API on mount
  useEffect(() => {
    loadUsersFromAPI();
  }, []);

  // Filter users when search term or role filter changes
  useEffect(() => {
    filterUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, roleFilter, users]);

  const loadUsersFromAPI = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/users');
      const result = await response.json();

      if (result.success) {
        setUsers(result.users);
      } else {
        console.error('Failed to load users:', result.error);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      // Fallback to demo users if API is not available
      const demoUsers = [
        {
          id: 1,
          firstName: 'Raj',
          lastName: 'Kumar',
          email: 'raj.kumar@school.com',
          phone: '9876543210',
          role: 'student',
          status: 'active',
          joinDate: '2024-01-15',
          rollNumber: 'STU001',
          className: '10-A',
        },
        {
          id: 2,
          firstName: 'Priya',
          lastName: 'Singh',
          email: 'priya.singh@school.com',
          phone: '9876543211',
          role: 'teacher',
          status: 'active',
          joinDate: '2023-06-01',
          designation: 'Math Teacher',
          subject: 'Mathematics',
        },
        {
          id: 3,
          firstName: 'Anita',
          lastName: 'Patel',
          email: 'anita.patel@school.com',
          phone: '9876543212',
          role: 'parent',
          status: 'active',
          joinDate: '2024-01-20',
          childName: 'Raj Kumar',
          relationship: 'Mother',
        },
      ];
      setUsers(demoUsers);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((user) =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
      );
    }

    // Filter by role
    if (roleFilter !== 'all') {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.phone.trim()) errors.phone = 'Phone is required';
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) errors.phone = 'Phone must be 10 digits';
    if (!formData.role) errors.role = 'Role is required';

    // Role-specific validation
    if (formData.role === 'student') {
      if (!formData.rollNumber.trim()) errors.rollNumber = 'Roll number is required';
      if (!formData.className.trim()) errors.className = 'Class is required';
    }

    if (formData.role === 'teacher') {
      if (!formData.designation.trim()) errors.designation = 'Designation is required';
      if (!formData.subject.trim()) errors.subject = 'Subject is required';
    }

    if (formData.role === 'parent') {
      if (!formData.childName.trim()) errors.childName = 'Child name is required';
      if (!formData.relationship.trim()) errors.relationship = 'Relationship is required';
      if (!formData.className.trim()) errors.className = 'Child class is required';
    }

    if (formData.role === 'staff') {
      if (!formData.designation.trim()) errors.designation = 'Designation is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'student',
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0],
      rollNumber: '',
      className: '',
      designation: '',
      subject: '',
      childName: '',
      relationship: '',
    });
    setFormErrors({});
    setTempPassword('');
    setShowPassword(false);
  };

  const openAddModal = () => {
    resetForm();
    setSelectedUser(null);
    setShowAddModal(true);
  };

  const openEditModal = (user) => {
    setFormData({ ...user, joinDate: user.joinDate || new Date().toISOString().split('T')[0] });
    setSelectedUser(user);
    setShowAddModal(false);
    setShowEditModal(true);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Validate authentication before proceeding
    const authValidation = validateAuth();
    if (!authValidation.isValid) {
      if (authValidation.error === 'Session expired. Please login again.') {
        alert('Your session has expired. Please login again.');
        logout();
        return;
      }
      setFormErrors({ general: authValidation.error });
      return;
    }

    setSubmitLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authValidation.token}`,
        },
        body: JSON.stringify({ ...formData, password: tempPassword }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccessMessage('User registered successfully! Email sent with login credentials.');
        // Reload users from API
        loadUsersFromAPI();
        setTimeout(() => {
          setShowAddModal(false);
          setSuccessMessage('');
          resetForm();
        }, 2000);
      } else {
        if (result.error === 'Invalid token or authorization error.' ||
          result.error === 'Unauthorized. Admin access required.') {
          alert('Your session has expired. Please login again.');
          logout();
          return;
        }
        setFormErrors({ general: result.error || 'Failed to register user' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setFormErrors({ general: 'Failed to connect to server. Please try again.' });
    }

    setSubmitLoading(false);
  };

  const handleEditUser = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitLoading(true);
    setTimeout(() => {
      const updatedUsers = users.map((user) =>
        user.id === selectedUser.id ? { ...formData } : user
      );

      setUsers(updatedUsers);
      localStorage.setItem('edumind_users', JSON.stringify(updatedUsers));

      setSuccessMessage('User updated successfully!');
      setTimeout(() => {
        setShowEditModal(false);
        setSuccessMessage('');
        resetForm();
      }, 1500);
      setSubmitLoading(false);
    }, 1000);
  };

  const handleDeleteUser = () => {
    setSubmitLoading(true);
    setTimeout(() => {
      const updatedUsers = users.filter((user) => user.id !== selectedUser.id);
      setUsers(updatedUsers);
      localStorage.setItem('edumind_users', JSON.stringify(updatedUsers));

      setSuccessMessage('User deleted successfully!');
      setTimeout(() => {
        setShowDeleteConfirm(false);
        setSuccessMessage('');
        setSelectedUser(null);
      }, 1500);
      setSubmitLoading(false);
    }, 1000);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'student':
        return 'bg-blue-100 text-blue-800';
      case 'teacher':
        return 'bg-green-100 text-green-800';
      case 'parent':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'text-green-600' : 'text-red-600';
  };

  const getRoleLabel = (role) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
        >
          ← Back
        </button>
        <h1 className="text-4xl font-bold text-slate-800 mb-2">User Management</h1>
        <p className="text-slate-600">Manage all school users (students, teachers, parents)</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-100 border-2 border-green-400 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="text-green-600" size={24} />
          <p className="text-green-800 font-semibold">{successMessage}</p>
        </div>
      )}

      {/* Controls */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="parent">Parents</option>
            <option value="teacher">Teachers / Staff</option>
            <option value="staff">Non-Staff</option>
          </select>

          {/* Add User Button */}
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus size={20} />
            Add User
          </button>
        </div>

        {/* Results Counter */}
        <p className="text-slate-600 font-semibold">
          Showing {filteredUsers.length} of {users.length} users
        </p>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        {filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100 border-b-2 border-slate-200">
                <tr>
                  <th className="text-left px-6 py-4 font-bold text-slate-700">Name</th>
                  <th className="text-left px-6 py-4 font-bold text-slate-700">Email</th>
                  <th className="text-left px-6 py-4 font-bold text-slate-700">Phone</th>
                  <th className="text-left px-6 py-4 font-bold text-slate-700">Role</th>
                  <th className="text-left px-6 py-4 font-bold text-slate-700">Status</th>
                  <th className="text-left px-6 py-4 font-bold text-slate-700">Join Date</th>
                  <th className="text-center px-6 py-4 font-bold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className={`border-b border-slate-200 hover:bg-slate-50 transition ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                      }`}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-800">
                          {user.firstName} {user.lastName}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{user.email}</td>
                    <td className="px-6 py-4 text-slate-700">{user.phone}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRoleColor(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold capitalize ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{user.joinDate}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition"
                          title="Edit user"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDeleteConfirm(true);
                          }}
                          className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition"
                          title="Delete user"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <AlertCircle className="mx-auto text-slate-400 mb-4" size={48} />
            <p className="text-slate-600 font-semibold text-lg">No users found</p>
            <p className="text-slate-500 mt-2">Try adjusting your search filters</p>
          </div>
        )}
      </div>

      {/* Add/Edit User Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-center sticky top-0">
              <h2 className="text-2xl font-bold text-white">
                {showAddModal ? 'Add New User' : 'Edit User'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  resetForm();
                }}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={showAddModal ? handleAddUser : handleEditUser} className="p-6 space-y-6">
              {/* Success Message */}
              {successMessage && (
                <div className="bg-green-100 border-2 border-green-400 rounded-xl p-4 flex items-center gap-3">
                  <CheckCircle className="text-green-600" size={24} />
                  <p className="text-green-800 font-semibold">{successMessage}</p>
                </div>
              )}

              {/* Basic Information */}
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">First Name *</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => {
                        setFormData({ ...formData, firstName: e.target.value });
                        if (formErrors.firstName) setFormErrors({ ...formErrors, firstName: '' });
                      }}
                      className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition ${formErrors.firstName
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                        : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
                        }`}
                      placeholder="First name"
                    />
                    {formErrors.firstName && <p className="text-red-600 text-sm mt-1">{formErrors.firstName}</p>}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name *</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => {
                        setFormData({ ...formData, lastName: e.target.value });
                        if (formErrors.lastName) setFormErrors({ ...formErrors, lastName: '' });
                      }}
                      className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition ${formErrors.lastName
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                        : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
                        }`}
                      placeholder="Last name"
                    />
                    {formErrors.lastName && <p className="text-red-600 text-sm mt-1">{formErrors.lastName}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                      }}
                      className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition ${formErrors.email
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                        : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
                        }`}
                      placeholder="email@school.com"
                    />
                    {formErrors.email && <p className="text-red-600 text-sm mt-1">{formErrors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Phone *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (formErrors.phone) setFormErrors({ ...formErrors, phone: '' });
                      }}
                      className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition ${formErrors.phone
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                        : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
                        }`}
                      placeholder="9876543210"
                    />
                    {formErrors.phone && <p className="text-red-600 text-sm mt-1">{formErrors.phone}</p>}
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Role *</label>
                    <select
                      value={formData.role}
                      onChange={(e) => {
                        setFormData({ ...formData, role: e.target.value });
                        if (formErrors.role) setFormErrors({ ...formErrors, role: '' });
                      }}
                      className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition ${formErrors.role
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                        : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
                        }`}
                    >
                      <option value="student">Student</option>
                      <option value="parent">Parent</option>                      <option value="teacher">Teaching Staff</option>
                      <option value="staff">Non-Teaching Staff</option>
                    </select>
                    {formErrors.role && <p className="text-red-600 text-sm mt-1">{formErrors.role}</p>}
                  </div>

                  {/* Password (Optional) */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Password (Optional)</label>
                    <input
                      type="password"
                      value={tempPassword}
                      onChange={(e) => setTempPassword(e.target.value)}
                      className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-blue-200"
                      placeholder="Leave blank to auto-generate"
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Role-Specific Fields */}
              {formData.role === 'student' && (
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Student Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Roll Number *</label>
                      <input
                        type="text"
                        value={formData.rollNumber}
                        onChange={(e) => {
                          setFormData({ ...formData, rollNumber: e.target.value });
                          if (formErrors.rollNumber) setFormErrors({ ...formErrors, rollNumber: '' });
                        }}
                        className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition ${formErrors.rollNumber
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                          : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
                          }`}
                        placeholder="STU001"
                      />
                      {formErrors.rollNumber && <p className="text-red-600 text-sm mt-1">{formErrors.rollNumber}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Class/Year *</label>
                      <input
                        type="text"
                        value={formData.className}
                        onChange={(e) => {
                          setFormData({ ...formData, className: e.target.value });
                          if (formErrors.className) setFormErrors({ ...formErrors, className: '' });
                        }}
                        className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition ${formErrors.className
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                          : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
                          }`}
                        placeholder="10-A"
                      />
                      {formErrors.className && <p className="text-red-600 text-sm mt-1">{formErrors.className}</p>}
                    </div>
                  </div>
                </div>
              )}

              {formData.role === 'teacher' && (
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Teacher Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Designation *</label>
                      <input
                        type="text"
                        value={formData.designation}
                        onChange={(e) => {
                          setFormData({ ...formData, designation: e.target.value });
                          if (formErrors.designation) setFormErrors({ ...formErrors, designation: '' });
                        }}
                        className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition ${formErrors.designation
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                          : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
                          }`}
                        placeholder="Math Teacher"
                      />
                      {formErrors.designation && <p className="text-red-600 text-sm mt-1">{formErrors.designation}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Subject *</label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => {
                          setFormData({ ...formData, subject: e.target.value });
                          if (formErrors.subject) setFormErrors({ ...formErrors, subject: '' });
                        }}
                        className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition ${formErrors.subject
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                          : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
                          }`}
                        placeholder="Mathematics"
                      />
                      {formErrors.subject && <p className="text-red-600 text-sm mt-1">{formErrors.subject}</p>}
                    </div>
                  </div>
                </div>
              )}

              {formData.role === 'parent' && (
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Parent Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Child Name *</label>
                      <input
                        type="text"
                        value={formData.childName}
                        onChange={(e) => {
                          setFormData({ ...formData, childName: e.target.value });
                          if (formErrors.childName) setFormErrors({ ...formErrors, childName: '' });
                        }}
                        className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition ${formErrors.childName
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                          : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
                          }`}
                        placeholder="Student name"
                      />
                      {formErrors.childName && <p className="text-red-600 text-sm mt-1">{formErrors.childName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Relationship *</label>
                      <select
                        value={formData.relationship}
                        onChange={(e) => {
                          setFormData({ ...formData, relationship: e.target.value });
                          if (formErrors.relationship) setFormErrors({ ...formErrors, relationship: '' });
                        }}
                        className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition ${formErrors.relationship
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                          : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
                          }`}
                      >
                        <option value="">Select relationship</option>
                        <option value="Mother">Mother</option>
                        <option value="Father">Father</option>
                        <option value="Guardian">Guardian</option>
                      </select>
                      {formErrors.relationship && <p className="text-red-600 text-sm mt-1">{formErrors.relationship}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Child's Class *</label>
                      <input
                        type="text"
                        value={formData.className}
                        onChange={(e) => {
                          setFormData({ ...formData, className: e.target.value });
                          if (formErrors.className) setFormErrors({ ...formErrors, className: '' });
                        }}
                        className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition ${formErrors.className
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                          : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
                          }`}
                        placeholder="10-A"
                      />
                      {formErrors.className && <p className="text-red-600 text-sm mt-1">{formErrors.className}</p>}
                    </div>
                  </div>
                </div>
              )}

              {formData.role === 'staff' && (
                <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Staff Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Designation *</label>
                      <input
                        type="text"
                        value={formData.designation}
                        onChange={(e) => {
                          setFormData({ ...formData, designation: e.target.value });
                          if (formErrors.designation) setFormErrors({ ...formErrors, designation: '' });
                        }}
                        className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none focus:ring-2 transition ${formErrors.designation
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                          : 'border-slate-200 focus:border-blue-500 focus:ring-blue-200'
                          }`}
                        placeholder="Librarian, Accountant, etc."
                      />
                      {formErrors.designation && <p className="text-red-600 text-sm mt-1">{formErrors.designation}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex gap-4 pt-6 border-t border-slate-200">
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-3 rounded-xl transition-all duration-200"
                >
                  {submitLoading ? 'Saving...' : showAddModal ? 'Add User' : 'Update User'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-3 rounded-xl transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
            <div className="mb-6">
              <div className="flex justify-center mb-4">
                <div className="bg-red-100 rounded-full p-4">
                  <AlertCircle className="text-red-600" size={48} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">Delete User?</h2>
              <p className="text-slate-600 text-center">
                Are you sure you want to delete{' '}
                <strong>
                  {selectedUser.firstName} {selectedUser.lastName}
                </strong>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleDeleteUser}
                disabled={submitLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-slate-400 text-white font-bold py-3 rounded-xl transition-all duration-200"
              >
                {submitLoading ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-3 rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

