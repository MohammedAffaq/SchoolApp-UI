import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Phone,
  Mail,
  Plus,
  Menu,
  User,
  Briefcase,
  Trash2,

  AlertCircle,
  X,
  Edit,
  Settings,
  Eye,
  Download,
  CheckCircle,
  Copy,
  ShieldCheck
} from 'lucide-react';


const TeachersPage = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [adminName, setAdminName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All Subjects');
  const [sortOrder, setSortOrder] = useState('A-Z');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'teaching');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [, setEditId] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [newStaff, setNewStaff] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    designation: '',
    subject: '',
    staffType: activeTab === 'teaching' ? 'teaching' : 'non-teaching'
  });
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

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

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  useEffect(() => {
    setSelectedFilter(activeTab === 'teaching' ? 'All Subjects' : 'All Departments');
  }, [activeTab]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, selectedFilter, searchTerm, sortOrder]);

  // Sample teacher data
  const [teachers, setTeachers] = useState([
    {
      id: 'TCH001',
      name: 'Dr. Sarah Johnson',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=5A4FCF&color=fff',
      subject: 'Mathematics',
      designation: 'HOD',
      email: 'sarah.johnson@school.edu',
      phone: '+1-555-0101',
      classes: ['Grade 10-A', 'Grade 11-B']
    },
    {
      id: 'TCH002',
      name: 'Prof. Michael Chen',
      avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=5A4FCF&color=fff',
      subject: 'Physics',
      designation: 'Teacher',
      email: 'michael.chen@school.edu',
      phone: '+1-555-0102',
      classes: ['Grade 9-A', 'Grade 10-B']
    },
    {
      id: 'TCH003',
      name: 'Ms. Emma Davis',
      avatar: 'https://ui-avatars.com/api/?name=Emma+Davis&background=5A4FCF&color=fff',
      subject: 'English Literature',
      designation: 'Class Teacher',
      email: 'emma.davis@school.edu',
      phone: '+1-555-0103',
      classes: ['Grade 8-A', 'Grade 9-B']
    },
    {
      id: 'TCH004',
      name: 'Mr. James Wilson',
      avatar: 'https://ui-avatars.com/api/?name=James+Wilson&background=5A4FCF&color=fff',
      subject: 'Chemistry',
      designation: 'Teacher',
      email: 'james.wilson@school.edu',
      phone: '+1-555-0104',
      classes: ['Grade 11-A', 'Grade 12-B']
    },
    {
      id: 'TCH005',
      name: 'Mrs. Lisa Brown',
      avatar: 'https://ui-avatars.com/api/?name=Lisa+Brown&background=5A4FCF&color=fff',
      subject: 'History',
      designation: 'Teacher',
      email: 'lisa.brown@school.edu',
      phone: '+1-555-0105',
      classes: ['Grade 7-A', 'Grade 8-B']
    },
    {
      id: 'TCH006',
      name: 'Dr. Robert Taylor',
      avatar: 'https://ui-avatars.com/api/?name=Robert+Taylor&background=5A4FCF&color=fff',
      subject: 'Biology',
      designation: 'HOD',
      email: 'robert.taylor@school.edu',
      phone: '+1-555-0106',
      classes: ['Grade 10-A', 'Grade 11-C']
    },
    {
      id: 'TCH007',
      name: 'Mr. David Anderson',
      avatar: 'https://ui-avatars.com/api/?name=David+Anderson&background=5A4FCF&color=fff',
      subject: 'Computer Science',
      designation: 'Teacher',
      email: 'david.anderson@school.edu',
      phone: '+1-555-0107',
      classes: ['Grade 9-A', 'Grade 10-B']
    },
    {
      id: 'TCH008',
      name: 'Ms. Jennifer Martinez',
      avatar: 'https://ui-avatars.com/api/?name=Jennifer+Martinez&background=5A4FCF&color=fff',
      subject: 'Art',
      designation: 'Teacher',
      email: 'jennifer.martinez@school.edu',
      phone: '+1-555-0108',
      classes: ['Grade 7-A', 'Grade 8-B']
    },
    {
      id: 'TCH009',
      name: 'Mr. Christopher Lee',
      avatar: 'https://ui-avatars.com/api/?name=Christopher+Lee&background=5A4FCF&color=fff',
      subject: 'Music',
      designation: 'Teacher',
      email: 'christopher.lee@school.edu',
      phone: '+1-555-0109',
      classes: ['Grade 6-A', 'Grade 7-B']
    },
    {
      id: 'TCH010',
      name: 'Mrs. Patricia White',
      avatar: 'https://ui-avatars.com/api/?name=Patricia+White&background=5A4FCF&color=fff',
      subject: 'Mathematics',
      designation: 'Teacher',
      email: 'patricia.white@school.edu',
      phone: '+1-555-0110',
      classes: ['Grade 11-A', 'Grade 12-B']
    },
    {
      id: 'TCH011',
      name: 'Mr. Daniel Garcia',
      avatar: 'https://ui-avatars.com/api/?name=Daniel+Garcia&background=5A4FCF&color=fff',
      subject: 'Computer Science',
      designation: 'Teacher',
      email: 'daniel.garcia@school.edu',
      phone: '+1-555-0111',
      classes: ['Grade 10-A', 'Grade 11-B']
    },
    {
      id: 'TCH012',
      name: 'Ms. Sophia Rodriguez',
      avatar: 'https://ui-avatars.com/api/?name=Sophia+Rodriguez&background=5A4FCF&color=fff',
      subject: 'English Literature',
      designation: 'Teacher',
      email: 'sophia.rodriguez@school.edu',
      phone: '+1-555-0112',
      classes: ['Grade 9-A', 'Grade 10-B']
    },
    {
      id: 'TCH013',
      name: 'Dr. William Thompson',
      avatar: 'https://ui-avatars.com/api/?name=William+Thompson&background=5A4FCF&color=fff',
      subject: 'Physics',
      designation: 'Principal',
      email: 'william.thompson@school.edu',
      phone: '+1-555-0113',
      classes: ['Grade 12-A', 'Grade 11-C']
    },
    {
      id: 'TCH014',
      name: 'Mrs. Olivia Martinez',
      avatar: 'https://ui-avatars.com/api/?name=Olivia+Martinez&background=5A4FCF&color=fff',
      subject: 'Chemistry',
      designation: 'Teacher',
      email: 'olivia.martinez@school.edu',
      phone: '+1-555-0114',
      classes: ['Grade 10-A', 'Grade 12-B']
    },
    {
      id: 'TCH015',
      name: 'Mr. Ethan Johnson',
      avatar: 'https://ui-avatars.com/api/?name=Ethan+Johnson&background=5A4FCF&color=fff',
      subject: 'History',
      designation: 'Teacher',
      email: 'ethan.johnson@school.edu',
      phone: '+1-555-0115',
      classes: ['Grade 8-A', 'Grade 9-B']
    }
  ]);

  // Sample Non-Teaching Staff Data
  const [nonTeachingStaff, setNonTeachingStaff] = useState([
    {
      id: 'STF001',
      name: 'Alice Williams',
      avatar: 'https://ui-avatars.com/api/?name=Alice+Williams&background=EC4899&color=fff',
      role: 'School Counselor',
      email: 'alice.williams@school.edu',
      phone: '+1-555-0201',
      department: 'Student Services'
    },
    {
      id: 'STF002',
      name: 'David Miller',
      avatar: 'https://ui-avatars.com/api/?name=David+Miller&background=EC4899&color=fff',
      role: 'Librarian',
      email: 'david.miller@school.edu',
      phone: '+1-555-0202',
      department: 'Library'
    },
    {
      id: 'STF003',
      name: 'Susan Clark',
      avatar: 'https://ui-avatars.com/api/?name=Susan+Clark&background=EC4899&color=fff',
      role: 'Lab Assistant',
      email: 'susan.clark@school.edu',
      phone: '+1-555-0203',
      department: 'Science Lab'
    },
    {
      id: 'STF004',
      name: 'Robert Wilson',
      avatar: 'https://ui-avatars.com/api/?name=Robert+Wilson&background=EC4899&color=fff',
      role: 'IT Support',
      email: 'robert.wilson@school.edu',
      phone: '+1-555-0204',
      department: 'Administration'
    },
    {
      id: 'STF005',
      name: 'Emily Davis',
      avatar: 'https://ui-avatars.com/api/?name=Emily+Davis&background=EC4899&color=fff',
      role: 'Nurse',
      email: 'emily.davis@school.edu',
      phone: '+1-555-0205',
      department: 'Health Services'
    },
    {
      id: 'STF006',
      name: 'Michael Brown',
      avatar: 'https://ui-avatars.com/api/?name=Michael+Brown&background=EC4899&color=fff',
      role: 'Accountant',
      email: 'michael.brown@school.edu',
      phone: '+1-555-0206',
      department: 'Finance'
    },
    {
      id: 'STF007',
      name: 'Sarah Wilson',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Wilson&background=EC4899&color=fff',
      role: 'Receptionist',
      email: 'sarah.wilson@school.edu',
      phone: '+1-555-0207',
      department: 'Administration'
    },
    {
      id: 'STF008',
      name: 'James Moore',
      avatar: 'https://ui-avatars.com/api/?name=James+Moore&background=EC4899&color=fff',
      role: 'Security Guard',
      email: 'james.moore@school.edu',
      phone: '+1-555-0208',
      department: 'Security'
    },
    {
      id: 'STF009',
      name: 'Linda Taylor',
      avatar: 'https://ui-avatars.com/api/?name=Linda+Taylor&background=EC4899&color=fff',
      role: 'Cafeteria Manager',
      email: 'linda.taylor@school.edu',
      phone: '+1-555-0209',
      department: 'Food Services'
    },
    {
      id: 'STF010',
      name: 'Thomas Anderson',
      avatar: 'https://ui-avatars.com/api/?name=Thomas+Anderson&background=EC4899&color=fff',
      role: 'Bus Coordinator',
      email: 'thomas.anderson@school.edu',
      phone: '+1-555-0210',
      department: 'Administration'
    }
  ]);

  const displayedStaff = activeTab === 'teaching' ? teachers : nonTeachingStaff;
  const filteredStaff = displayedStaff.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (activeTab === 'teaching' ? person.subject.toLowerCase().includes(searchTerm.toLowerCase()) : person.role.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = activeTab === 'teaching'
      ? (selectedFilter === 'All Subjects' || person.subject === selectedFilter)
      : (selectedFilter === 'All Departments' || person.department === selectedFilter);
    return matchesSearch && matchesFilter;
  });

  const sortedStaff = [...filteredStaff].sort((a, b) => {
    if (sortOrder === 'A-Z') return a.name.localeCompare(b.name);
    if (sortOrder === 'Z-A') return b.name.localeCompare(a.name);
    return 0;
  });

  const totalPages = Math.ceil(sortedStaff.length / itemsPerPage);
  const paginatedStaff = sortedStaff.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExportCSV = () => {
    const headers = activeTab === 'teaching'
      ? ['ID', 'Name', 'Email', 'Phone', 'Subject', 'Classes']
      : ['ID', 'Name', 'Email', 'Phone', 'Role', 'Department'];

    const csvRows = [
      headers.join(','),
      ...filteredStaff.map(person => {
        if (activeTab === 'teaching') {
          return [
            `"${person.id}"`,
            `"${person.name}"`,
            `"${person.email}"`,
            `"${person.phone}"`,
            `"${person.subject}"`,
            `"${person.classes.join(', ')}"`
          ].join(',');
        } else {
          return [
            `"${person.id}"`,
            `"${person.name}"`,
            `"${person.email}"`,
            `"${person.phone}"`,
            `"${person.role}"`,
            `"${person.department}"`
          ].join(',');
        }
      })
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${activeTab}_staff_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const subjectColors = {
    'Mathematics': 'bg-blue-50 text-blue-700',
    'Physics': 'bg-purple-50 text-purple-700',
    'English Literature': 'bg-green-50 text-green-700',
    'Chemistry': 'bg-orange-50 text-orange-700',
    'History': 'bg-red-50 text-red-700',
    'Biology': 'bg-teal-50 text-teal-700'
  };

  const openAddModal = () => {
    setIsEditing(false);
    setNewStaff({ firstName: '', lastName: '', email: '', phone: '', subject: '', designation: '', role: '', department: '', classes: '', staffType: activeTab === 'teaching' ? 'teaching' : 'non-teaching' });
    setShowModal(true);
  };

  const openEditModal = (person) => {
    setIsEditing(true);
    setEditId(person.id);
    setNewStaff({
      name: person.name,
      email: person.email,
      phone: person.phone,
      subject: person.subject || '',
      designation: person.designation || '',
      role: person.role || '',
      department: person.department || '',
      classes: person.classes ? person.classes.join(', ') : ''
    });
    setShowModal(true);
  };

  const handleViewProfile = (person) => {
    setSelectedStaff(person);
    setShowViewModal(true);
  };

  const handleSaveStaff = async (e) => {
    e.preventDefault();

    const role = activeTab === 'teaching' ? 'teacher' : 'staff';
    const userData = {
      firstName: newStaff.firstName,
      lastName: newStaff.lastName,
      email: newStaff.email,
      phone: newStaff.phone,
      role: role,
      ...(role === 'teacher' && {
        subject: newStaff.subject,
        designation: newStaff.designation
      }),
      ...(role === 'staff' && {
        designation: newStaff.role // Mapping role input to designation for backend
      })
    };

    try {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      const token = currentUser?.token;

      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Staff registered successfully!');
        setCreatedCredentials({ email: newStaff.email, password: 'Sent via email', role: activeTab === 'teaching' ? 'Teacher' : 'Staff Member' });
        setShowCredentialsModal(true);

        // Also add to local staff list for display
        if (activeTab === 'teaching') {
          const newTeacher = {
            id: `TCH00${teachers.length + 1}`,
            name: `${newStaff.firstName} ${newStaff.lastName}`,
            avatar: `https://ui-avatars.com/api/?name=${newStaff.firstName}+${newStaff.lastName}&background=5A4FCF&color=fff`,
            subject: newStaff.subject,
            designation: newStaff.designation,
            email: newStaff.email,
            phone: newStaff.phone,
            classes: [] // Classes not collected here
          };
          setTeachers([...teachers, newTeacher]);
        } else {
          const newNonTeaching = {
            id: `STF00${nonTeachingStaff.length + 1}`,
            name: `${newStaff.firstName} ${newStaff.lastName}`,
            avatar: `https://ui-avatars.com/api/?name=${newStaff.firstName}+${newStaff.lastName}&background=EC4899&color=fff`,
            role: newStaff.role,
            email: newStaff.email,
            phone: newStaff.phone,
            department: newStaff.department || 'Administration'
          };
          setNonTeachingStaff([...nonTeachingStaff, newNonTeaching]);
        }

        setShowModal(false);
        setNewStaff({ firstName: '', lastName: '', email: '', phone: '', designation: '', subject: '', staffType: activeTab === 'teaching' ? 'teaching' : 'non-teaching', role: '', department: '', classes: '' });
      } else {
        alert('Failed to register staff: ' + result.error);
      }
    } catch (error) {
      console.error('Error registering staff:', error);
      alert('Failed to connect to server.');
    }
  };

  const confirmDelete = (person) => {
    setStaffToDelete(person);
    setShowDeleteModal(true);
  };

  const handleDeleteStaff = () => {
    if (activeTab === 'teaching') {
      setTeachers(teachers.filter(t => t.id !== staffToDelete.id));
    } else {
      setNonTeachingStaff(nonTeachingStaff.filter(s => s.id !== staffToDelete.id));
    }
    setShowDeleteModal(false);
    setStaffToDelete(null);
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
          <div>
            <NavItem icon={<Users size={20} />} label="Teachers" active onClick={() => navigate('/admin/teachers')} />
            <div className="mt-1 space-y-1">
              <SubNavItem label="Teaching Staff" onClick={() => setActiveTab('teaching')} active={activeTab === 'teaching'} />
              <SubNavItem label="Non-Teaching Staff" onClick={() => setActiveTab('non-teaching')} active={activeTab === 'non-teaching'} />
            </div>
          </div>
          <NavItem icon={<User size={20} />} label="Parents" onClick={() => navigate('/admin/parents')} />
          <NavItem icon={<Bus size={20} />} label="Driver & Vehicles" onClick={() => navigate('/admin/drivers')} />
          <NavItem icon={<DollarSign size={20} />} label="Finance" onClick={() => navigate('/admin/finance')} />
          <NavItem icon={<CalendarCheck size={20} />} label="Attendance" onClick={() => navigate('/admin/attendance')} />
          <NavItem icon={<Settings size={20} />} label="Settings" onClick={() => navigate('/admin/settings')} />
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 text-text-secondary hover:text-danger hover:bg-red-50 w-full p-3 rounded-xl transition-colors duration-200"
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
        <header className="h-20 bg-card/80 backdrop-blur-md border-b border-gray-100 flex justify-between items-center px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden"
            >
              <Menu size={24} />
            </button>
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
              <input
                type="text"
                placeholder={`Search ${activeTab === 'teaching' ? 'teachers' : 'staff'}...`}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:bg-white transition-all outline-none text-sm text-text placeholder-text-secondary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/admin/notifications')}
              className="relative p-2 text-text-secondary hover:text-primary transition-colors"
            >
              <Bell size={28} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border-2 border-white"></span>
            </button>
            <button onClick={() => navigate('/admin/profile')} className="flex items-center gap-3 pl-6 border-l border-gray-100 hover:bg-gray-50 rounded-lg -ml-2 p-2 transition-colors">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-text">{adminName}</p>
                <p className="text-xs text-text-secondary font-medium">Admin Administrator</p>
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
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-text mb-2">{activeTab === 'teaching' ? 'Teaching Staff' : 'Non-Teaching Staff'}</h1>
                <p className="text-text-secondary">Manage and view all {activeTab === 'teaching' ? 'teachers' : 'staff members'} information</p>
              </div>

              <div className="flex items-center gap-4">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="bg-card border border-gray-200 text-text-secondary rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500/20"
                >
                  <option value="A-Z">Name (A-Z)</option>
                  <option value="Z-A">Name (Z-A)</option>
                </select>
                {activeTab === 'teaching' ? (
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="bg-card border border-gray-200 text-text-secondary rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500/20"
                  >
                    <option>All Subjects</option>
                    {[...new Set(teachers.map(t => t.subject))].sort().map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                ) : (
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="bg-card border border-gray-200 text-text-secondary rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-500/20"
                  >
                    <option>All Departments</option>
                    {[...new Set(nonTeachingStaff.map(staff => staff.department))].sort().map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                )}
                <button onClick={handleExportCSV} className="bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Download size={18} />
                  Export
                </button>
                <button
                  onClick={openAddModal}
                  className="bg-sky-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-sky-700 transition-colors flex items-center gap-2"
                >
                  <Plus size={18} />
                  New {activeTab === 'teaching' ? 'Teacher' : 'Staff'}
                </button>
              </div>
            </div>

            {/* Teachers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedStaff.map((person) => (
                <div key={person.id} className="bg-card p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="w-16 h-16 rounded-full border-2 border-white shadow-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewProfile(person)}
                        className="p-2 text-text-secondary hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => openEditModal(person)}
                        className="p-2 text-text-secondary hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => confirmDelete(person)}
                        className="p-2 text-text-secondary hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-bold text-text text-lg">{person.name}</h3>
                      {activeTab === 'teaching' ? (
                        <>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${subjectColors[person.subject] || 'bg-gray-50 text-gray-700'}`}>
                            {person.subject}
                          </span>
                          {person.designation && (
                            <span className="block text-xs text-gray-500 mt-1 font-medium">{person.designation}</span>
                          )}
                        </>
                      ) : (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 bg-pink-50 text-pink-700">
                          {person.role}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-3 text-text-secondary text-sm">
                        <Mail size={16} />
                        <span className="truncate">{person.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-text-secondary text-sm">
                        <Phone size={16} />
                        <span>{person.phone}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100">
                      {activeTab === 'teaching' ? (
                        <>
                          <p className="text-xs text-text-secondary font-medium mb-2">Classes:</p>
                          <div className="flex flex-wrap gap-1">
                            {person.classes.map((className, index) => (
                              <span key={index} className="bg-gray-50 text-text-secondary px-2 py-1 rounded text-xs font-medium">
                                {className}
                              </span>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                          <Briefcase size={16} />
                          <span>{person.department}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm text-text-secondary hover:text-sky-600 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors ${currentPage === page ? 'bg-sky-600 text-white' : 'text-text-secondary hover:text-sky-600 hover:bg-gray-50'}`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm text-text-secondary hover:text-sky-600 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">
                {isEditing ? 'Edit' : 'Add New'} {activeTab === 'teaching' ? 'Teacher' : 'Staff Member'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSaveStaff} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    value={newStaff.firstName}
                    onChange={(e) => setNewStaff({ ...newStaff, firstName: e.target.value })}
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    value={newStaff.lastName}
                    onChange={(e) => setNewStaff({ ...newStaff, lastName: e.target.value })}
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                    placeholder="9876543210"
                  />
                </div>
              </div>
              {activeTab === 'teaching' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                      value={newStaff.subject}
                      onChange={(e) => setNewStaff({ ...newStaff, subject: e.target.value })}
                      placeholder="Mathematics"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Designation *</label>
                    <select
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                      value={newStaff.designation}
                      onChange={(e) => setNewStaff({ ...newStaff, designation: e.target.value })}
                    >
                      <option value="">Select Designation</option>
                      <option value="Teacher">Teacher</option>
                      <option value="Class Teacher">Class Teacher</option>
                      <option value="HOD">HOD</option>
                      <option value="Principal">Principal</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'teaching' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Classes (comma separated)</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    value={newStaff.classes}
                    onChange={(e) => setNewStaff({ ...newStaff, classes: e.target.value })}
                    placeholder="e.g., Grade 10-A, Grade 11-B"
                  />
                </div>
              )}

              {activeTab === 'non-teaching' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                      value={newStaff.role}
                      onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                      placeholder="e.g., Librarian"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                      value={newStaff.department}
                      onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}
                      placeholder="e.g., Library"
                    />
                  </div>
                </>
              )}

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-xl hover:bg-sky-700 font-medium"
                >
                  {isEditing ? 'Save Changes' : `Add ${activeTab === 'teaching' ? 'Teacher' : 'Staff'}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Staff Modal */}
      {showViewModal && selectedStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Staff Details</h3>
              <button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <img src={selectedStaff.avatar} alt={selectedStaff.name} className="w-20 h-20 rounded-full border-4 border-gray-50" />
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{selectedStaff.name}</h4>
                  <p className="text-gray-500 text-sm">{selectedStaff.id}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mt-1 ${activeTab === 'teaching' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'}`}>
                    {activeTab === 'teaching' ? 'Teaching Staff' : 'Non-Teaching Staff'}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Contact Information</label>
                  <div className="mt-1 space-y-2">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Mail size={16} className="text-gray-400" />
                      <span>{selectedStaff.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <Phone size={16} className="text-gray-400" />
                      <span>{selectedStaff.phone}</span>
                    </div>
                  </div>
                </div>

                {activeTab === 'teaching' ? (
                  <>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">Subject</label>
                      <p className="mt-1 text-gray-700">{selectedStaff.subject}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">Classes</label>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {selectedStaff.classes.map((cls, idx) => (
                          <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm">
                            {cls}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">Role</label>
                      <p className="mt-1 text-gray-700">{selectedStaff.role}</p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase">Department</label>
                      <p className="mt-1 text-gray-700">{selectedStaff.department}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && staffToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="text-red-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Staff Member?</h3>
              <p className="text-gray-600">
                Are you sure you want to delete <strong>{staffToDelete.name}</strong>? This action cannot be undone.
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
                onClick={handleDeleteStaff}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Credentials Modal */}
      {showCredentialsModal && createdCredentials && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Registration Successful!</h3>
              <p className="text-gray-600 mb-4">
                Credentials have been generated.
              </p>

              <div className="w-full bg-gray-50 rounded-xl p-4 text-left space-y-3 border border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Login ID</p>
                  <p className="font-mono text-gray-900 font-medium">{createdCredentials.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Password</p>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <p className="font-mono text-gray-900 font-bold bg-white px-2 py-1 rounded border border-gray-200">{createdCredentials.password}</p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(createdCredentials.password);
                        setIsCopied(true);
                        setTimeout(() => setIsCopied(false), 2000);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${isCopied ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-indigo-600 hover:bg-indigo-50'}`}
                      title="Copy Password"
                    >
                      {isCopied ? <CheckCircle size={16} /> : <Copy size={16} />}
                      {isCopied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowCredentialsModal(false)}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium transition-colors"
            >
              Done
            </button>
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

export default TeachersPage;
