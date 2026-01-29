import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  Bus,
  DollarSign,
  CalendarCheck,
  LogOut,
  Search,
  Bell,
  Plus,
  UserCheck,
  Truck,
  MapPin,
  User,
  Menu,
  Settings,
  X,
  Trash2,
  AlertCircle,
  Edit,
  ShieldCheck
} from 'lucide-react';

const DriversPage = ({ onLogout }) => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = React.useState('');
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [newDriver, setNewDriver] = React.useState({
    name: '',
    route: '',
    vehicle: '',
    status: 'Active'
  });
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [driverToDelete, setDriverToDelete] = React.useState(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editId, setEditId] = React.useState(null);
  const [pendingRequestsCount, setPendingRequestsCount] = React.useState(0);

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
        const response = await fetch('http://localhost:5001/api/student-requests');
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

  // Sample data for drivers
  const [drivers, setDrivers] = React.useState([
    {
      id: 'DRV-001',
      name: 'Robert Johnson',
      avatar: 'https://ui-avatars.com/api/?name=Robert+Johnson&background=5A4FCF&color=fff',
      route: 'Route A - Downtown',
      vehicle: 'Bus-101',
      status: 'Active'
    },
    {
      id: 'DRV-002',
      name: 'Maria Garcia',
      avatar: 'https://ui-avatars.com/api/?name=Maria+Garcia&background=5A4FCF&color=fff',
      route: 'Route B - Uptown',
      vehicle: 'Bus-102',
      status: 'Active'
    },
    {
      id: 'DRV-003',
      name: 'James Wilson',
      avatar: 'https://ui-avatars.com/api/?name=James+Wilson&background=5A4FCF&color=fff',
      route: 'Route C - Suburbs',
      vehicle: 'Bus-103',
      status: 'Inactive'
    },
    {
      id: 'DRV-004',
      name: 'Sarah Brown',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Brown&background=5A4FCF&color=fff',
      route: 'Route D - Airport',
      vehicle: 'Bus-104',
      status: 'Active'
    },
    {
      id: 'DRV-005',
      name: 'Michael Davis',
      avatar: 'https://ui-avatars.com/api/?name=Michael+Davis&background=5A4FCF&color=fff',
      route: 'Route E - Industrial',
      vehicle: 'Bus-105',
      status: 'Active'
    }
  ]);

  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddDriver = (e) => {
    e.preventDefault();
    if (isEditing) {
      setDrivers(drivers.map(d => d.id === editId ? { ...d, ...newDriver } : d));
    } else {
      const driver = {
        id: `DRV-00${drivers.length + 1}`,
        ...newDriver,
        avatar: `https://ui-avatars.com/api/?name=${newDriver.name}&background=5A4FCF&color=fff`
      };
      setDrivers([...drivers, driver]);
    }
    setShowAddModal(false);
    setNewDriver({ name: '', route: '', vehicle: '', status: 'Active' });
    setIsEditing(false);
    setEditId(null);
  };

  const openEditModal = (driver) => {
    setIsEditing(true);
    setEditId(driver.id);
    setNewDriver({ ...driver });
    setShowAddModal(true);
  };

  const openAddModal = () => {
    setIsEditing(false);
    setNewDriver({ name: '', route: '', vehicle: '', status: 'Active' });
    setShowAddModal(true);
  };

  const confirmDelete = (driver) => {
    setDriverToDelete(driver);
    setShowDeleteModal(true);
  };

  const handleDeleteDriver = () => {
    setDrivers(drivers.filter(d => d.id !== driverToDelete.id));
    setShowDeleteModal(false);
    setDriverToDelete(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
          <NavItem icon={<Bus size={20} />} label="Driver & Vehicles" active onClick={() => navigate('/admin/drivers')} />
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
                placeholder="Search drivers..."
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
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Driver & Transport</h1>
              <p className="text-gray-600">Manage drivers, vehicles, and transportation routes</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <KPICard
                icon={<UserCheck className="text-green-600" />}
                label="Total Drivers"
                value="24"
                trend="+2"
              />
              <KPICard
                icon={<Truck className="text-blue-600" />}
                label="Active Routes"
                value="18"
                trend="Stable"
              />
              <KPICard
                icon={<Bus className="text-purple-600" />}
                label="Vehicles Assigned"
                value="22"
                trend="+1"
              />
            </div>

            {/* Driver Management Table */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Driver Management</h3>
                <button
                  onClick={openAddModal}
                  className="bg-purple-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add Driver
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 font-bold text-gray-600 text-sm">Driver</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-600 text-sm">Route</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-600 text-sm">Vehicle</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-600 text-sm">Status</th>
                      <th className="text-left py-3 px-4 font-bold text-gray-600 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDrivers.map((driver, index) => (
                      <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={driver.avatar}
                              alt={driver.name}
                              className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{driver.name}</p>
                              <p className="text-sm text-gray-500">{driver.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-gray-400" />
                            <span className="text-gray-700">{driver.route}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-700">{driver.vehicle}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(driver.status)}`}>
                            {driver.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditModal(driver)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => confirmDelete(driver)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
            </div>
          </div>
        </main>
      </div>

      {/* Add Driver Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">{isEditing ? 'Edit Driver' : 'Add New Driver'}</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddDriver} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  value={newDriver.name}
                  onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                  placeholder="e.g., John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  value={newDriver.route}
                  onChange={(e) => setNewDriver({ ...newDriver, route: e.target.value })}
                  placeholder="e.g., Route A - Downtown"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  value={newDriver.vehicle}
                  onChange={(e) => setNewDriver({ ...newDriver, vehicle: e.target.value })}
                  placeholder="e.g., Bus-101"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  value={newDriver.status}
                  onChange={(e) => setNewDriver({ ...newDriver, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded-xl font-semibold hover:bg-purple-700 transition-colors mt-4"
              >
                {isEditing ? 'Save Changes' : 'Add Driver'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && driverToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="text-red-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Driver?</h3>
              <p className="text-gray-600">
                Are you sure you want to delete <strong>{driverToDelete.name}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteDriver}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium"
              >
                Delete
              </button>
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
    <span className={`${active ? 'text-sky-600' : 'text-gray-400 group-hover:text-sky-600 transition-colors'}`}>{icon}</span>
    <span className="flex-1 text-left">{label}</span>
    {badge > 0 && (
      <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg ring-2 ring-white">
        {badge}
      </span>
    )}
  </button>
);

const KPICard = ({ icon, label, value, trend }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 rounded-xl bg-gray-50">{icon}</div>
      <span className="text-sm font-semibold text-green-600">{trend}</span>
    </div>
    <h4 className="text-gray-600 text-sm mb-2">{label}</h4>
    <h2 className="text-2xl font-bold text-gray-900">{value}</h2>
  </div>
);

export default DriversPage;

