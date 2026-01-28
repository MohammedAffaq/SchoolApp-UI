import React from 'react';
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
  Bell,
  TrendingUp,
  DollarSign as DollarIcon,
  AlertTriangle,
  User,
  Download,
  Menu,
  ArrowUpDown,
  Settings,
  Plus,
  X,
  Mail,
  ShieldCheck
} from 'lucide-react';

const FinancePage = ({ onLogout }) => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = React.useState('');
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterHighDefaulters, setFilterHighDefaulters] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;
  const [sortConfig, setSortConfig] = React.useState({ key: null, direction: 'ascending' });
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [newDefaulter, setNewDefaulter] = React.useState({
    name: '',
    class: '',
    pendingFees: '',
    percentage: '',
    dueDate: ''
  });
  const [chartDuration, setChartDuration] = React.useState('12m');
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
    setCurrentPage(1);
  }, [startDate, endDate, searchTerm, filterHighDefaulters]);

  // Sample data for charts and tables
  const yearlyFeeCollectionData = [
    { month: 'Jan', collected: 45000 },
    { month: 'Feb', collected: 52000 },
    { month: 'Mar', collected: 48000 },
    { month: 'Apr', collected: 61000 },
    { month: 'May', collected: 55000 },
    { month: 'Jun', collected: 67000 },
    { month: 'Jul', collected: 62000 },
    { month: 'Aug', collected: 72000 },
    { month: 'Sep', collected: 68000 },
    { month: 'Oct', collected: 75000 },
    { month: 'Nov', collected: 71000 },
    { month: 'Dec', collected: 82000 },
  ];

  const displayedFeeData = chartDuration === '6m'
    ? yearlyFeeCollectionData.slice(-6)
    : yearlyFeeCollectionData;

  const [defaultersData, setDefaultersData] = React.useState([
    { name: 'John Smith', class: '10-A', pendingFees: 2500, percentage: 15, dueDate: '2024-01-15' },
    { name: 'Sarah Johnson', class: '9-B', pendingFees: 3200, percentage: 20, dueDate: '2024-02-01' },
    { name: 'Mike Davis', class: '11-C', pendingFees: 1800, percentage: 10, dueDate: '2024-01-20' },
    { name: 'Emma Wilson', class: '8-A', pendingFees: 4100, percentage: 25, dueDate: '2024-01-10' },
    { name: 'Alex Brown', class: '7-B', pendingFees: 2900, percentage: 18, dueDate: '2024-02-15' },
  ]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleSendReminder = (defaulter) => {
    const subject = `Fee Reminder: ${defaulter.name}`;
    const body = `Dear Parent/Guardian,\n\nThis is a reminder regarding the pending fees of $${defaulter.pendingFees} for ${defaulter.name} (Class ${defaulter.class}).\n\nPlease clear the dues by ${defaulter.dueDate}.\n\nRegards,\nSchool Administration`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const handleAddDefaulter = (e) => {
    e.preventDefault();
    const defaulter = {
      ...newDefaulter,
      pendingFees: Number(newDefaulter.pendingFees)
    };
    setDefaultersData([...defaultersData, defaulter]);
    setShowAddModal(false);
    setNewDefaulter({ name: '', class: '', pendingFees: '', percentage: '', dueDate: '' });
  };

  let processedDefaulters = defaultersData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterHighDefaulters ? item.percentage > 50 : true;

    if (!startDate && !endDate) return matchesSearch && matchesFilter;
    const itemDate = new Date(item.dueDate);
    const start = startDate ? new Date(startDate) : new Date('1900-01-01');
    const end = endDate ? new Date(endDate) : new Date('2100-01-01');
    return matchesSearch && matchesFilter && itemDate >= start && itemDate <= end;
  });

  if (sortConfig.key) {
    processedDefaulters.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = processedDefaulters.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(processedDefaulters.length / itemsPerPage);

  const handleDownloadReport = () => {
    // Define headers
    const headers = ['Student Name', 'Class', 'Pending Fees', 'Remaining %', 'Due Date'];
    
    // Convert data to CSV rows
    const csvRows = [
      headers.join(','), // Header row
      ...processedDefaulters.map(row => [
        `"${row.name}"`,
        `"${row.class}"`,
        row.pendingFees,
        `${row.percentage}%`,
        `"${row.dueDate}"`
      ].join(','))
    ];

    // Create blob and download link
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'fee_defaulters_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportChart = (chartId, fileName) => {
    const svgElement = document.getElementById(chartId)?.querySelector('svg');
    if (!svgElement) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = svgElement.clientWidth * 2 || 1000;
      canvas.height = svgElement.clientHeight * 2 || 600;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `${fileName}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  // Custom Simple Charts Components
  const SimpleBarChart = ({ data, dataKey, color, id, barRatio = 0.5 }) => {
    const [hoveredIndex, setHoveredIndex] = React.useState(null);
    const maxVal = Math.max(...data.map(d => d[dataKey]), 0);
    const niceMaxVal = Math.ceil(maxVal / 20000) * 20000 || 20000;

    // SVG Dimensions
    const width = 100;
    const height = 100;
    const padding = { top: 10, right: 10, bottom: 20, left: 25 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const barWidth = (chartWidth / data.length) * barRatio;
    const gap = (chartWidth / data.length) * (1 - barRatio);

    const yAxisTicks = 4;
    const yLabels = Array.from({ length: yAxisTicks + 1 }, (_, i) => {
      const val = niceMaxVal - (niceMaxVal / yAxisTicks) * i;
      return val >= 1000 ? `${val / 1000}k` : val;
    });

    return (
      <div className="w-full h-full" id={id}>
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-full overflow-visible">
           <defs>
             <linearGradient id={`barGradient-${id}`} x1="0" y1="0" x2="0" y2="1">
               <stop offset="0%" stopColor="#38bdf8" />
               <stop offset="100%" stopColor="#0284c7" />
             </linearGradient>
           </defs>
           {/* Y-Axis Labels & Grid */}
           {yLabels.map((label, i) => {
             const y = padding.top + (chartHeight / yAxisTicks) * i;
             return (
               <g key={i}>
                 <text x={padding.left - 4} y={y} textAnchor="end" alignmentBaseline="middle" fontSize="3.5" fill="#9ca3af">{label}</text>
                 <line x1={padding.left} y1={y} x2={width} y2={y} stroke="#f3f4f6" strokeWidth="0.5" />
               </g>
             );
           })}

           {/* Bars */}
           {data.map((d, i) => {
             const val = d[dataKey];
             const barHeight = (val / niceMaxVal) * chartHeight;
             const x = padding.left + (chartWidth / data.length) * i + gap / 2;
             const y = padding.top + chartHeight - barHeight;

             return (
               <g key={i} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
                 <rect x={x} y={y} width={barWidth} height={barHeight} fill={`url(#barGradient-${id})`} rx="2" className="transition-all duration-300 hover:opacity-80 cursor-pointer" />
                 {(data.length < 8 || i % 2 === 0) && (
                  <text x={x + barWidth/2} y={height - 5} textAnchor="middle" fontSize="3.5" fill="#9ca3af">{d.month}</text>
                 )}
                 {hoveredIndex === i && (
                   <g>
                     <rect x={x + barWidth/2 - 12} y={y - 12} width="24" height="8" rx="2" fill="#1f2937" />
                     <text x={x + barWidth/2} y={y - 7} textAnchor="middle" fill="white" fontSize="3" alignmentBaseline="middle">${val.toLocaleString()}</text>
                     <polygon points={`${x + barWidth/2 - 2},${y-4} ${x + barWidth/2 + 2},${y-4} ${x + barWidth/2},${y-2}`} fill="#1f2937" />
                   </g>
                 )}
               </g>
             );
           })}
           <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} stroke="transparent" strokeWidth="0" />
           <line x1={padding.left} y1={height - padding.bottom} x2={width} y2={height - padding.bottom} stroke="#e5e7eb" strokeWidth="0.5" />
        </svg>
      </div>
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
          <NavItem icon={<DollarSign size={20} />} label="Finance" active onClick={() => navigate('/admin/finance')} />
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
        <header className="h-20 bg-card/80 backdrop-blur-md border-b border-gray-100 flex justify-between items-center px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 hover:text-indigo-600 transition-colors border border-gray-200 lg:hidden"
            >
              <Menu size={24} />
            </button>
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
            {/* Page Title */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-text mb-2">Finance</h1>
                <p className="text-text-secondary">Manage school fees, payments, and financial records</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 items-end">
                <div className="flex gap-2">
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1">Start Date</label>
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1">End Date</label>
                    <input 
                      type="date" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>
                <button onClick={handleDownloadReport} className="bg-purple-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-sm h-[42px]">
                  <Download size={20} />
                  Download Report
                </button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SummaryCard
                icon={<DollarIcon className="text-success" />}
                label="Total Fees Collected"
                value="$287,000"
                trend="+12.5%"
                color="bg-green-50"
              />
              <SummaryCard
                icon={<AlertTriangle className="text-warning" />}
                label="Pending Fees"
                value="$27,100"
                trend="-8.2%"
                color="bg-yellow-50"
              />
              <SummaryCard
                icon={<TrendingUp className="text-primary" />}
                label="Expenses"
                value="$45,200"
                trend="+5.1%"
                color="bg-blue-50"
              />
            </div>

            {/* Monthly Fee Collection Graph */}
            <div className="bg-card p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-text">Yearly Fee Collection Trend</h3>
                <div className="flex items-center gap-3">
                  <button onClick={() => exportChart('fee-collection-chart', 'monthly_fee_collection')} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500" title="Export as PNG"><Download size={18} /></button>
                  <select
                    value={chartDuration}
                    onChange={(e) => setChartDuration(e.target.value)}
                    className="bg-gray-50 border-none text-xs font-bold text-text-secondary rounded-lg px-3 py-2 outline-none cursor-pointer hover:bg-gray-100"
                  >
                    <option value="12m">This Year</option>
                    <option value="6m">Last 6 Months</option>
                  </select>
                </div>
              </div>
              <div className="h-80">
                <SimpleBarChart data={displayedFeeData} dataKey="collected" color="#5A4FCF" id="fee-collection-chart" />
              </div>
            </div>

            {/* Fee Defaulters Table */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h3 className="text-xl font-bold text-gray-900">Fee Defaulters</h3>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filterHighDefaulters}
                      onChange={(e) => setFilterHighDefaulters(e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-600 whitespace-nowrap">&gt; 50% Remaining</span>
                  </label>
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search student..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                  <button 
                    onClick={() => setShowAddModal(true)}
                    className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors flex-shrink-0"
                    title="Add Defaulter"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 font-bold text-gray-600 text-sm cursor-pointer hover:bg-gray-50" onClick={() => requestSort('name')}>
                        <div className="flex items-center gap-1">
                          Student Name
                          <ArrowUpDown size={14} className="text-gray-400" />
                        </div>
                      </th>
                      <th className="text-left py-3 px-4 font-bold text-gray-600 text-sm cursor-pointer hover:bg-gray-50" onClick={() => requestSort('class')}>
                        <div className="flex items-center gap-1">
                          Class
                          <ArrowUpDown size={14} className="text-gray-400" />
                        </div>
                      </th>
                      <th className="text-left py-3 px-4 font-bold text-gray-600 text-sm cursor-pointer hover:bg-gray-50" onClick={() => requestSort('pendingFees')}>
                        <div className="flex items-center gap-1">
                          Pending Fees
                          <ArrowUpDown size={14} className="text-gray-400" />
                        </div>
                      </th>
                      <th className="text-left py-3 px-4 font-bold text-gray-600 text-sm cursor-pointer hover:bg-gray-50" onClick={() => requestSort('percentage')}>
                        <div className="flex items-center gap-1">
                          Remaining %
                          <ArrowUpDown size={14} className="text-gray-400" />
                        </div>
                      </th>
                      <th className="text-left py-3 px-4 font-bold text-gray-600 text-sm cursor-pointer hover:bg-gray-50" onClick={() => requestSort('dueDate')}>
                        <div className="flex items-center gap-1">
                          Due Date
                          <ArrowUpDown size={14} className="text-gray-400" />
                        </div>
                      </th>
                      <th className="text-left py-3 px-4 font-bold text-gray-600 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((defaulter, index) => (
                      <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="py-4 px-4 font-medium text-gray-900">{defaulter.name}</td>
                        <td className="py-4 px-4 text-gray-600">{defaulter.class}</td>
                        <td className="py-4 px-4 text-gray-700">${defaulter.pendingFees.toLocaleString()}</td>
                        <td className="py-4 px-4">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600">
                            {defaulter.percentage}%
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{defaulter.dueDate}</td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleSendReminder(defaulter)}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                          >
                            <Mail size={14} />
                            Send Reminder
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4 border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-500">
                  Showing {processedDefaulters.length > 0 ? indexOfFirstItem + 1 : 0} to {Math.min(indexOfLastItem, processedDefaulters.length)} of {processedDefaulters.length} entries
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-3 py-1 text-sm border rounded-lg ${
                        currentPage === index + 1
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Defaulter Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Add Fee Defaulter</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddDefaulter} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  value={newDefaulter.name}
                  onChange={(e) => setNewDefaulter({...newDefaulter, name: e.target.value})}
                  placeholder="e.g., John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  value={newDefaulter.class}
                  onChange={(e) => setNewDefaulter({...newDefaulter, class: e.target.value})}
                  placeholder="e.g., 10-A"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pending Fees</label>
                <input
                  type="number"
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  value={newDefaulter.pendingFees}
                  onChange={(e) => setNewDefaulter({...newDefaulter, pendingFees: e.target.value})}
                  placeholder="e.g., 5000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remaining Percentage (%)</label>
                <input
                  type="number"
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  value={newDefaulter.percentage}
                  onChange={(e) => setNewDefaulter({...newDefaulter, percentage: e.target.value})}
                  placeholder="e.g., 25"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  value={newDefaulter.dueDate}
                  onChange={(e) => setNewDefaulter({...newDefaulter, dueDate: e.target.value})}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-purple-600 text-white py-2 rounded-xl font-semibold hover:bg-purple-700 transition-colors mt-4"
              >
                Add Defaulter
              </button>
            </form>
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

const SummaryCard = ({ icon, label, value, trend, color }) => (
  <div className="bg-card p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-default">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3.5 rounded-xl ${color}`}>{icon}</div>
      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${trend.includes('+') ? 'bg-green-50 text-success' : trend.includes('-') ? 'bg-red-50 text-danger' : 'bg-blue-50 text-primary'}`}>{trend}</span>
    </div>
    <h4 className="text-text-secondary text-sm font-semibold mb-1">{label}</h4>
    <h2 className="text-2xl font-bold text-text">{value}</h2>
  </div>
);

export default FinancePage;
