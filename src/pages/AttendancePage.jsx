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
  MoreHorizontal,
  TrendingUp,
  UserCheck,
  UserX,
  User,
  Menu,
  Settings,
  Download,
  ShieldCheck
} from 'lucide-react';

const AttendancePage = ({ onLogout }) => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = React.useState('');
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedYear, setSelectedYear] = React.useState('2024');
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

  // Sample data for charts and tables
  const fullAttendanceTrendData = [
    { month: 'Jan', attendance: 100 },
    { month: 'Mar', attendance: 75 },
    { month: 'May', attendance: 50 },
    { month: 'Jul', attendance: 25 },
    { month: 'Sep', attendance: 0 },
    { month: 'Nov', attendance: 0 },
  ];

  const attendanceTrendData = chartDuration === '6m'
    ? fullAttendanceTrendData.slice(-6)
    : fullAttendanceTrendData;

  const classAttendanceData = [
    { class: 'Class 10-A', totalStudents: 45, present: 42, absent: 3, percentage: 93 },
    { class: 'Class 9-B', totalStudents: 48, present: 44, absent: 4, percentage: 92 },
    { class: 'Class 11-C', totalStudents: 42, present: 38, absent: 4, percentage: 90 },
    { class: 'Class 8-A', totalStudents: 50, present: 47, absent: 3, percentage: 94 },
    { class: 'Class 7-B', totalStudents: 46, present: 41, absent: 5, percentage: 89 },
  ];

  const filteredClassAttendance = classAttendanceData.filter(row =>
    row.class.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
  const SimpleLineChart = ({ data, dataKey, color }) => {
    const [hoveredPoint, setHoveredPoint] = React.useState(null);
    const maxVal = Math.max(...data.map(d => d[dataKey]), 0);
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (d[dataKey] / maxVal) * 80; // Scale to fit nicely
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="w-full h-full flex items-end justify-between px-2 pb-6 relative">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full overflow-visible">
          {/* Grid lines */}
          {[20, 40, 60, 80].map(y => (
            <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#e5e7eb" strokeWidth="0.5" />
          ))}
          {/* Line */}
          <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* Dots */}
          {data.map((d, i) => {
            const x = (i / (data.length - 1)) * 100;
            const y = 100 - (d[dataKey] / maxVal) * 80;
            return (
              <circle 
                key={i} 
                cx={x} 
                cy={y} 
                r={hoveredPoint === i ? 4 : 2} 
                fill={color} 
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredPoint(i)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            );
          })}
        </svg>
        {hoveredPoint !== null && (
          <div className="absolute bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 whitespace-nowrap shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full" style={{ left: `${(hoveredPoint / (data.length - 1)) * 100}%`, top: `calc(${100 - (data[hoveredPoint][dataKey] / maxVal) * 80}% - 8px)` }}>
            {data[hoveredPoint][dataKey]}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
          </div>
        )}
        {/* X Axis Labels */}
        {data.map((d, i) => (
          <div key={i} className="text-xs text-gray-600 absolute bottom-0 transform -translate-x-1/2" style={{ left: `${(i / (data.length - 1)) * 100}%` }}>
            {d.month}
          </div>
        ))}
      </div>
    );
  };

  const SimpleBarChart = ({ data, dataKey, color, id, barRatio = 0.5 }) => {
    const [hoveredIndex, setHoveredIndex] = React.useState(null);
    const maxVal = 100; // Attendance is a percentage
    
    // SVG Dimensions
    const width = 100;
    const height = 100;
    const padding = { top: 10, right: 10, bottom: 20, left: 25 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    const barWidth = (chartWidth / data.length) * barRatio;
    const gap = (chartWidth / data.length) * (1 - barRatio);

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
           {Array.from({ length: 5 }).map((_, i) => {
             const y = padding.top + (chartHeight / 4) * i;
             const value = Math.round(maxVal - (maxVal / 4) * i);
             const label = `${value}%`;
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
             const barHeight = (val / maxVal) * chartHeight;
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
                     <rect x={x + barWidth/2 - 10} y={y - 12} width="20" height="8" rx="2" fill="#1f2937" />
                     <text x={x + barWidth/2} y={y - 7} textAnchor="middle" fill="white" fontSize="3" alignmentBaseline="middle">{val}%</text>
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
    <div className="flex h-screen bg-slate-100 font-sans text-text overflow-hidden">
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
          <NavItem icon={<CalendarCheck size={20} />} label="Attendance" active onClick={() => navigate('/admin/attendance')} />
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
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
              <input
                type="text"
                placeholder="Search for students, teachers, documents..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all outline-none text-sm text-text placeholder-text-secondary"
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
            {/* Page Title */}
            <div>
              <h1 className="text-3xl font-bold text-text mb-2">Attendance</h1>
              <p className="text-text-secondary">Monitor and manage student attendance across all classes</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SummaryCard
                icon={<TrendingUp className="text-success" />}
                label="Average Attendance"
                value="92.8%"
                trend="+2.5%"
                color="bg-green-50"
              />
              <SummaryCard
                icon={<UserCheck className="text-success" />}
                label="Total Present"
                value="259"
                trend="+5.3%"
                color="bg-green-50"
              />
              <SummaryCard
                icon={<UserX className="text-danger" />}
                label="Total Absent"
                value="20"
                trend="-1.8%"
                color="bg-red-50"
              />
            </div>

            {/* Attendance Trend Chart */}
            <div className="bg-card p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-text">Attendance Trend</h3>
                <div className="flex items-center gap-3">
                  <button onClick={() => exportChart('attendance-trend-chart', 'attendance_trend')} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500" title="Export as PNG"><Download size={18} /></button>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="bg-gray-50 border-none text-xs font-bold text-text-secondary rounded-lg px-3 py-2 outline-none cursor-pointer hover:bg-gray-100"
                  >
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                  </select>
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
                <SimpleBarChart data={attendanceTrendData} dataKey="attendance" color="#5A4FCF" id="attendance-trend-chart" />
              </div>
            </div>

            {/* Attendance by Class Table */}
            <div className="bg-card p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-text">Attendance by Class</h3>
                <button className="text-text-secondary hover:text-primary p-1 rounded-lg hover:bg-gray-50">
                  <MoreHorizontal size={20} />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-4 font-bold text-text-secondary text-sm">Class</th>
                      <th className="text-left py-3 px-4 font-bold text-text-secondary text-sm">Total Students</th>
                      <th className="text-left py-3 px-4 font-bold text-text-secondary text-sm">Present</th>
                      <th className="text-left py-3 px-4 font-bold text-text-secondary text-sm">Absent</th>
                      <th className="text-left py-3 px-4 font-bold text-text-secondary text-sm">Attendance %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClassAttendance.map((row, index) => (
                      <tr key={index} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="py-4 px-4 font-medium text-text">{row.class}</td>
                        <td className="py-4 px-4 text-text-secondary">{row.totalStudents}</td>
                        <td className="py-4 px-4 text-success font-medium">{row.present}</td>
                        <td className="py-4 px-4 text-danger font-medium">{row.absent}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-text">{row.percentage}%</span>
                            <div className="flex-1 bg-gray-100 rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all duration-500"
                                style={{ width: `${row.percentage}%` }}
                              ></div>
                            </div>
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
      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${trend.includes('+') ? 'bg-green-50 text-success' : 'bg-red-50 text-danger'}`}>{trend}</span>
    </div>
    <h4 className="text-text-secondary text-sm font-semibold mb-1">{label}</h4>
    <h2 className="text-2xl font-bold text-text">{value}</h2>
  </div>
);

export default AttendancePage;
