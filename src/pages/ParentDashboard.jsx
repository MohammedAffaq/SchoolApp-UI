import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  TrendingUp,
  Clock,
  CreditCard,
  User,
  LogOut,
  Menu,
  Bell,
  ChevronDown,
  Download,
  FileText,
  CheckCircle,
  X,
  Loader2,
  Save,
  Edit2,
  Calendar,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Bus,
  MessageSquare,
  Settings,
  Phone,
  MapPin,
  Camera,
  Trash2
} from 'lucide-react';

const SimpleBarChart = ({ data, dataKey, color, id, barRatio = 0.5 }) => {
  const [hoveredIndex, setHoveredIndex] = React.useState(null);
  const maxVal = Math.max(...data.map(d => d[dataKey]), 0);
  let niceMaxVal;
  if (maxVal <= 100) {
    niceMaxVal = 100;
  } else {
    niceMaxVal = Math.ceil(maxVal / 5000) * 5000 || 5000;
  }

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
            <stop offset="0%" stopColor={color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} stopOpacity="1" />
          </linearGradient>
        </defs>
        {Array.from({ length: 5 }).map((_, i) => {
          const y = padding.top + (chartHeight / 4) * i;
          const value = Math.round(niceMaxVal - (niceMaxVal / 4) * i);
          const displayValue = value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value;
          return (
            <g key={i}>
              <text x={padding.left - 4} y={y} textAnchor="end" alignmentBaseline="middle" fontSize="3.5" fill="#9ca3af">{displayValue}</text>
              <line x1={padding.left} y1={y} x2={width} y2={y} stroke="#f3f4f6" strokeWidth="0.5" />
            </g>
          );
        })}
        {data.map((d, i) => {
          const val = d[dataKey];
          const barHeight = (val / niceMaxVal) * chartHeight;
          const x = padding.left + (chartWidth / data.length) * i + gap / 2;
          const y = padding.top + chartHeight - barHeight;
          return (
            <g key={i} onMouseEnter={() => setHoveredIndex(i)} onMouseLeave={() => setHoveredIndex(null)}>
              <rect x={x} y={y} width={barWidth} height={barHeight} fill={`url(#barGradient-${id})`} rx="1" className="transition-all duration-300 hover:opacity-80" />
              <text x={x + barWidth / 2} y={height - 5} textAnchor="middle" fontSize="3" fill="#6b7280">{d.label || d.month || d.subject}</text>
              {hoveredIndex === i && (
                <g>
                  <rect x={x + barWidth / 2 - 12} y={y - 12} width="24" height="8" rx="2" fill="#1f2937" opacity="0.9" />
                  <text x={x + barWidth / 2} y={y - 7} textAnchor="middle" fill="white" fontSize="3" fontWeight="bold" alignmentBaseline="middle">{typeof val === 'number' ? val.toLocaleString() : val}</text>
                  <polygon points={`${x + barWidth / 2 - 3},${y - 4} ${x + barWidth / 2 + 3},${y - 4} ${x + barWidth / 2},${y - 1}`} fill="#1f2937" opacity="0.9" />
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const SimplePieChart = ({ data, colors }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercent = 0;

  const getCoordinatesForPercent = (percent) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="relative w-40 h-40">
        <svg viewBox="-1 -1 2 2" className="w-full h-full transform -rotate-90 overflow-visible">
          {data.map((slice, i) => {
            const start = cumulativePercent;
            const end = start + slice.value / total;
            cumulativePercent = end;

            const [startX, startY] = getCoordinatesForPercent(start);
            const [endX, endY] = getCoordinatesForPercent(end);

            const largeArcFlag = slice.value / total > 0.5 ? 1 : 0;

            const pathData = [
              `M 0 0`,
              `L ${startX} ${startY}`,
              `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              `Z`
            ].join(' ');

            return (
              <path
                key={i}
                d={pathData}
                fill={colors[i % colors.length]}
                stroke="white"
                strokeWidth="0.05"
                className="hover:opacity-90 transition-opacity"
              />
            );
          })}
        </svg>
      </div>
      <div className="ml-6 space-y-2">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[i % colors.length] }}></div>
            <span className="text-xs text-gray-600">{item.label}</span>
            <span className="text-xs font-bold text-gray-900">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ParentDashboard = ({ onLogout }) => {
  const [user, setUser] = useState(null);
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [marksData, setMarksData] = useState([]);
  const [fees] = useState([
    { id: 1, month: 'January', amount: '$500', status: 'Paid', date: 'Jan 5' },
    { id: 2, month: 'December', amount: '$500', status: 'Paid', date: 'Dec 15' },
    { id: 3, month: 'February', amount: '$500', status: 'Pending', date: 'Due Feb 5' },
  ]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: ''
  });
  const [calendarDate, setCalendarDate] = useState(new Date('2026-01-01'));
  const [calendarView, setCalendarView] = useState('month');
  const [activeReportTab, setActiveReportTab] = useState('internals1');
  const [assignmentFilter, setAssignmentFilter] = useState('Pending');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedReportClass, setSelectedReportClass] = useState('Class 10');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAllAnnouncements, setShowAllAnnouncements] = useState(false);
  const [parentImage, setParentImage] = useState(null);
  const fileInputRef = useRef(null);
  const [examFilter, setExamFilter] = useState('All');
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('parentNotifications');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Fee Due', message: 'School fees for March are due tomorrow. Please pay to avoid late fees.', time: 'Tomorrow', type: 'fee', read: false },
      { id: 2, title: 'Assignment Submitted', message: 'Math homework "Algebra Worksheet" submitted successfully.', time: '4 hours ago', type: 'assignment', read: false },
      { id: 3, title: 'Parent-Teacher Meeting', message: 'Reminder: PTM scheduled for Nov 20, 2023 from 9 AM to 12 PM.', time: '2 days ago', type: 'meeting', read: false },
    ];
  });

  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'Class Teacher', message: 'Please ensure Aarjav brings his sports kit tomorrow.', time: '10:30 AM', unread: true },
    { id: 2, sender: 'Math Teacher', message: 'Aarjav is doing great in Algebra!', time: 'Yesterday', unread: false },
    { id: 3, sender: 'School Admin', message: 'School will remain closed on Friday due to public holiday.', time: '2 days ago', unread: false, attachment: 'notice.pdf' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    const msg = { id: Date.now(), sender: 'You', message: newMessage, time: 'Just now', unread: false };
    setChatMessages([...chatMessages, msg]);
    setNewMessage('');
  };

  useEffect(() => {
    localStorage.setItem('parentNotifications', JSON.stringify(notifications));
  }, [notifications]);

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    if (calendarView === 'year') {
      setCalendarDate(new Date(calendarDate.getFullYear() - 1, calendarDate.getMonth(), 1));
    } else {
      setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
    }
  };

  const handleNextMonth = () => {
    if (calendarView === 'year') {
      setCalendarDate(new Date(calendarDate.getFullYear() + 1, calendarDate.getMonth(), 1));
    } else {
      setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
    }
  };

  const getEventsForDay = (day, month, year) => {
    const events = [];
    if (day === 15) events.push({ type: 'exam', title: 'Unit Test' });
    if (day === 25) events.push({ type: 'holiday', title: 'Public Holiday' });
    return events;
  };

  const reportData = {
    internals1: {
      title: 'Internal Assessment 1', subjects: [
        { name: 'Mathematics', marks: '85/100', grade: 'A' },
        { name: 'Science', marks: '92/100', grade: 'A+' },
        { name: 'English', marks: '78/100', grade: 'B+' },
        { name: 'Social Studies', marks: '85/100', grade: 'A' },
        { name: 'Hindi', marks: '82/100', grade: 'A-' },
        { name: 'Computer Science', marks: '90/100', grade: 'A+' },
        { name: 'General Knowledge', marks: '88/100', grade: 'A' }
      ]
    },
    internals2: {
      title: 'Internal Assessment 2', subjects: [
        { name: 'Mathematics', marks: '88/100', grade: 'A' },
        { name: 'Science', marks: '89/100', grade: 'A' },
        { name: 'English', marks: '82/100', grade: 'A-' },
        { name: 'Social Studies', marks: '86/100', grade: 'A' },
        { name: 'Hindi', marks: '84/100', grade: 'A' },
        { name: 'Computer Science', marks: '92/100', grade: 'A+' },
        { name: 'General Knowledge', marks: '85/100', grade: 'A' }
      ]
    },
    internals3: {
      title: 'Internal Assessment 3', subjects: [
        { name: 'Mathematics', marks: '90/100', grade: 'A+' },
        { name: 'Science', marks: '94/100', grade: 'A+' },
        { name: 'English', marks: '85/100', grade: 'A' },
        { name: 'Social Studies', marks: '88/100', grade: 'A' },
        { name: 'Hindi', marks: '86/100', grade: 'A' },
        { name: 'Computer Science', marks: '95/100', grade: 'A+' },
        { name: 'General Knowledge', marks: '92/100', grade: 'A+' }
      ]
    },
    midterm: {
      title: 'Mid Term Examination', subjects: [
        { name: 'Mathematics', marks: '80/100', grade: 'B+' },
        { name: 'Science', marks: '95/100', grade: 'A+' },
        { name: 'English', marks: '85/100', grade: 'A' },
        { name: 'Social Studies', marks: '82/100', grade: 'A-' },
        { name: 'Hindi', marks: '78/100', grade: 'B+' },
        { name: 'Computer Science', marks: '90/100', grade: 'A+' },
        { name: 'General Knowledge', marks: '85/100', grade: 'A' }
      ]
    },
    final: {
      title: 'Final Examination', subjects: [
        { name: 'Mathematics', marks: '92/100', grade: 'A+' },
        { name: 'Science', marks: '96/100', grade: 'A+' },
        { name: 'English', marks: '88/100', grade: 'A' },
        { name: 'Social Studies', marks: '90/100', grade: 'A+' },
        { name: 'Hindi', marks: '85/100', grade: 'A' },
        { name: 'Computer Science', marks: '98/100', grade: 'A+' },
        { name: 'General Knowledge', marks: '94/100', grade: 'A+' }
      ]
    }
  };

  const assignments = [
    { id: 1, subject: 'Mathematics', teacher: 'Mr. Anderson', title: 'Algebra Worksheet', dueDate: 'Oct 25, 2023', status: 'Pending', description: 'Complete exercises 5.1 to 5.4 from the textbook.' },
    { id: 2, subject: 'Science', teacher: 'Ms. Roberts', title: 'Physics Lab Report', dueDate: 'Oct 28, 2023', status: 'Submitted', description: 'Submit the lab report for the pendulum experiment.' },
    { id: 3, subject: 'English', teacher: 'Mrs. Smith', title: 'Essay on Shakespeare', dueDate: 'Nov 01, 2023', status: 'Pending', description: 'Write a 500-word essay on Macbeth.' },
    { id: 4, subject: 'History', teacher: 'Mr. Clark', title: 'World War II Timeline', dueDate: 'Nov 05, 2023', status: 'Overdue', description: 'Create a timeline of major events in WWII.' },
  ];

  const announcements = [
    { id: 1, title: 'Annual Sports Day', date: 'Nov 15, 2023', content: 'Registration open for all track events.' },
    { id: 2, title: 'Parent-Teacher Meeting', date: 'Nov 20, 2023', content: 'Meeting scheduled from 9 AM to 12 PM.' },
    { id: 3, title: 'Science Exhibition', date: 'Dec 05, 2023', content: 'Students to submit project ideas by Nov 30.' },
    { id: 4, title: 'Winter Break', date: 'Dec 20, 2023', content: 'School closed from Dec 24 to Jan 2.' },
  ];

  const examSchedule = [
    { id: 1, subject: 'Mathematics', date: 'Mar 15, 2026', time: '09:00 AM - 12:00 PM', room: 'Hall A', type: 'Final' },
    { id: 2, subject: 'Science', date: 'Mar 18, 2026', time: '09:00 AM - 12:00 PM', room: 'Hall B', type: 'Final' },
    { id: 3, subject: 'English', date: 'Mar 20, 2026', time: '09:00 AM - 12:00 PM', room: 'Hall A', type: 'Final' },
    { id: 4, subject: 'History', date: 'Mar 22, 2026', time: '09:00 AM - 12:00 PM', room: 'Hall C', type: 'Final' },
    { id: 5, subject: 'Computer Science', date: 'Mar 25, 2026', time: '09:00 AM - 11:00 AM', room: 'Lab 1', type: 'Final' },
    { id: 6, subject: 'Physics', date: 'Oct 10, 2025', time: '10:00 AM - 11:30 AM', room: 'Hall B', type: 'Midterm' },
    { id: 7, subject: 'Chemistry', date: 'Oct 12, 2025', time: '10:00 AM - 11:30 AM', room: 'Hall C', type: 'Midterm' },
    { id: 8, subject: 'Biology', date: 'Aug 15, 2025', time: '09:00 AM - 10:00 AM', room: 'Class 10-A', type: 'Unit Test' },
    { id: 9, subject: 'Geography', date: 'Aug 18, 2025', time: '09:00 AM - 10:00 AM', room: 'Class 10-A', type: 'Unit Test' },
  ];

  const filteredExamSchedule = examFilter === 'All'
    ? examSchedule
    : examSchedule.filter(exam => exam.type === examFilter);

  const handleDownloadSchedule = () => {
    const headers = ['Subject', 'Date', 'Time', 'Room', 'Type'];
    const csvRows = [
      headers.join(','),
      ...filteredExamSchedule.map(exam => [
        `"${exam.subject}"`,
        `"${exam.date}"`,
        `"${exam.time}"`,
        `"${exam.room}"`,
        `"${exam.type}"`
      ].join(','))
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'exam_schedule.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredAssignments = assignmentFilter === 'All'
    ? assignments
    : assignments.filter(a => a.status === assignmentFilter);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchChildrenDetails(parsedUser);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      setProfileFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '123 Education Lane, Knowledge City'
      });
      if (user.profileImage) {
        setParentImage(user.profileImage);
      }
    }
  }, [user]);

  const fetchChildrenDetails = async (parentUser) => {
    try {
      const response = await fetch('http://localhost:5000/api/users');
      const data = await response.json();

      if (data.success && parentUser.children) {
        const students = data.users.filter(u => u.role === 'student');
        const matchedChildren = [];

        parentUser.children.forEach(child => {
          const student = students.find(s =>
            `${s.firstName} ${s.lastName}`.toLowerCase() === child.name.toLowerCase() ||
            s.firstName.toLowerCase() === child.name.toLowerCase()
          );

          if (student) {
            matchedChildren.push({
              id: student.id,
              name: child.name,
              grade: student.className || child.grade
            });
          } else {
            // Fallback for demo/unmatched
            matchedChildren.push({
              id: `STU-${Math.floor(100000 + Math.random() * 900000)}`,
              name: child.name,
              grade: child.grade
            });
          }
        });

        setChildren(matchedChildren);
        if (matchedChildren.length > 0) {
          setSelectedChildId(matchedChildren[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching children details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChildId && !selectedChildId.startsWith('STU-')) {
      fetchMarks(selectedChildId);
    }
  }, [selectedChildId]);

  const fetchMarks = async (studentId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/marks/${studentId}`);
      const data = await response.json();
      if (data.success) {
        setMarksData(data.marks);
      }
    } catch (error) {
      console.error('Error fetching marks:', error);
    }
  };

  const handleDownloadReport = () => {
    if (selectedChildId && !selectedChildId.startsWith('STU-')) {
      window.location.href = `http://localhost:5000/api/marks/${selectedChildId}/download`;
    } else {
      // Demo download
      const csvContent = "Subject,Marks,Grade\nMathematics,85,A\nScience,92,A+\nEnglish,78,B+\nHistory,88,A\nArt,95,A+";
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'report_card_demo.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    const updatedUser = { ...user, ...profileFormData };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setIsEditingProfile(false);
    alert("Profile updated successfully!");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setParentImage(reader.result);
        const updatedUser = { ...user, profileImage: reader.result };
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setParentImage(null);
    const updatedUser = { ...user, profileImage: null };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    onLogout();
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    // Simulate password change
    alert("Password changed successfully!");
    setShowPasswordModal(false);
  };

  const handlePayFee = (fee) => {
    alert(`Initiating payment of ${fee.amount} for ${fee.month}. Redirecting to payment gateway...`);
  };

  const handleDownloadReceipt = (fee) => {
    const content = `RECEIPT\n\nMonth: ${fee.month}\nAmount: ${fee.amount}\nStatus: ${fee.status}\nDate: ${fee.date}\n\nPaid via EduMind Portal`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `receipt_${fee.month}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStudentDetails = () => {
    const child = children.find(c => c.id === selectedChildId);
    return child || { name: 'Unknown', grade: '', id: '' };
  };

  const getAttendanceData = () => {
    // Mock data based on child ID to simulate dynamic content
    if (!selectedChildId) return [];

    // Generate 10 days of attendance data from Nov 1 to Nov 10
    const attendanceData = [];
    for (let i = 0; i < 10; i++) {
      const day = 10 - i; // Start from Nov 10 and go backwards to Nov 1
      const date = `Nov ${day}, 2023`;
      const isPresent = i % 2 === 0; // Alternate between present and absent

      if (isPresent) {
        attendanceData.push({
          date,
          status: 'Present',
          in: '08:00 AM',
          out: '03:00 PM'
        });
      } else {
        attendanceData.push({
          date,
          status: 'Absent',
          in: '-',
          out: '-'
        });
      }
    }

    return attendanceData;
  };

  const attendanceTrendData = [
    { month: 'Jan', percentage: 98 },
    { month: 'Feb', percentage: 96 },
    { month: 'Mar', percentage: 94 },
    { month: 'Apr', percentage: 97 },
    { month: 'May', percentage: 92 },
    { month: 'Jun', percentage: 95 }
  ];

  const feeTrendData = [
    { month: 'Jan', amount: 25000 },
    { month: 'Feb', amount: 25000 },
    { month: 'Mar', amount: 25000 },
    { month: 'Apr', amount: 25000 },
    { month: 'May', amount: 30000 },
    { month: 'Jun', amount: 32000 },
  ];

  const feeBreakdownData = [
    { label: 'Tuition', value: 60 },
    { label: 'Transport', value: 20 },
    { label: 'Library', value: 10 },
    { label: 'Lab', value: 10 },
  ];

  const performanceData = [
    { subject: 'Math', marks: 85, grade: 'A', remark: 'Very Good' },
    { subject: 'Science', marks: 92, grade: 'A+', remark: 'Excellent' },
    { subject: 'English', marks: 78, grade: 'B+', remark: 'Good' },
    { subject: 'History', marks: 88, grade: 'A', remark: 'Very Good' },
    { subject: 'Art', marks: 95, grade: 'A+', remark: 'Outstanding' }
  ];

  const NavItem = ({ icon, label, active, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group w-full text-left ${active ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'}`}
    >
      <span className={`${active ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600 transition-colors'}`}>{icon}</span>
      <span>{label}</span>
    </button>
  );

  const QuickActionButton = ({ icon, label, onClick, color }) => (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 rounded-xl ${color} text-white shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1`}
    >
      <div className="mb-2">{icon}</div>
      <span className="text-sm font-semibold">{label}</span>
    </button>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-100">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-gray-800 overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out shadow-sm ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-4 flex items-center justify-center gap-3">
          <img src="/assets/logo.png" alt="EduMind Logo" className="h-32 w-auto max-w-full object-contain" />
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeSection === 'Dashboard'} onClick={() => setActiveSection('Dashboard')} />
          <NavItem icon={<TrendingUp size={20} />} label="Performance" active={activeSection === 'Performance'} onClick={() => setActiveSection('Performance')} />
          <NavItem icon={<Clock size={20} />} label="Attendance" active={activeSection === 'Attendance'} onClick={() => setActiveSection('Attendance')} />
          <NavItem icon={<CreditCard size={20} />} label="Fee Payment" active={activeSection === 'Fee Payment'} onClick={() => setActiveSection('Fee Payment')} />
          <NavItem icon={<FileText size={20} />} label="Report Cards" active={activeSection === 'Report Cards'} onClick={() => setActiveSection('Report Cards')} />
          <NavItem icon={<BookOpen size={20} />} label="Assignments" active={activeSection === 'Assignments'} onClick={() => setActiveSection('Assignments')} />
          <NavItem icon={<Calendar size={20} />} label="Exam Schedule" active={activeSection === 'Exam Schedule'} onClick={() => setActiveSection('Exam Schedule')} />
          <NavItem icon={<Bus size={20} />} label="Bus Tracker" active={activeSection === 'Bus Tracker'} onClick={() => setActiveSection('Bus Tracker')} />
          <NavItem icon={<MessageSquare size={20} />} label="Chats" active={activeSection === 'Chats'} onClick={() => setActiveSection('Chats')} />
          <NavItem icon={<Settings size={20} />} label="Settings" active={activeSection === 'Settings'} onClick={() => setActiveSection('Settings')} />
          <NavItem icon={<User size={20} />} label="Student Profile" active={activeSection === 'Student Profile'} onClick={() => setActiveSection('Student Profile')} />
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-3 text-gray-600 hover:text-red-600 hover:bg-red-50 w-full p-3 rounded-xl transition-colors duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col h-screen">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex justify-between items-center px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">{activeSection}</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <button
                onClick={() => setActiveSection('Notifications')}
                className={`relative p-2 rounded-full transition-colors ${activeSection === 'Notifications' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Bell size={24} />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>
            </div>

            <div className="relative">
              <select
                value={selectedChildId}
                onChange={(e) => setSelectedChildId(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
              >
                {children.map(child => (
                  <option key={child.id} value={child.id}>
                    {child.name} ({child.grade})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>

            <div
              className="flex items-center gap-3 pl-6 border-l border-gray-100 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
              onClick={() => setActiveSection('Parent Profile')}
            >
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-gray-900">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-500 font-medium">Parent</p>
              </div>
              {parentImage ? (
                <img src={parentImage} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                  {user?.firstName?.charAt(0)}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-100">
          <div className="max-w-7xl mx-auto space-y-8">

            {activeSection === 'Dashboard' && (
              <>
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <h2 className="text-2xl font-bold mb-2 text-gray-900">Welcome, {user?.firstName || 'Parent'}!</h2>
                  <p className="text-gray-600">Here is an overview of <span className="font-semibold text-indigo-600">{children.find(c => c.id === selectedChildId)?.name || 'your child'}</span>'s progress.</p>
                  <div className="mt-4 flex gap-4 text-sm text-gray-500">
                    <span className="px-3 py-1 bg-gray-100 rounded-full">Class: {children.find(c => c.id === selectedChildId)?.grade || '10-A'}</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full">Roll No: 24</span>
                    <span className="px-3 py-1 bg-gray-100 rounded-full">Section: A</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-green-50 text-green-600">
                        <TrendingUp size={24} />
                      </div>
                      <span className="text-sm font-bold text-green-600">Good</span>
                    </div>
                    <h4 className="text-gray-600 text-sm mb-1">Academic Performance</h4>
                    <h2 className="text-2xl font-bold text-gray-900">A Grade</h2>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                        <Clock size={24} />
                      </div>
                      <span className="text-sm font-bold text-blue-600">95%</span>
                    </div>
                    <h4 className="text-gray-600 text-sm mb-1">Attendance</h4>
                    <h2 className="text-2xl font-bold text-gray-900">Present</h2>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-orange-50 text-orange-600">
                        <CreditCard size={24} />
                      </div>
                      <span className="text-sm font-bold text-orange-600">Due</span>
                    </div>
                    <h4 className="text-gray-600 text-sm mb-1">Next Fee Payment</h4>
                    <h2 className="text-2xl font-bold text-gray-900">$500</h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4">Attendance Trend</h3>
                    <div className="h-56">
                      <SimpleBarChart data={attendanceTrendData} dataKey="percentage" color="#10b981" id="dash-attendance-chart" />
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4">Fee Trend</h3>
                    <div className="h-56">
                      <SimpleBarChart data={feeTrendData} dataKey="amount" color="#f97316" id="dash-fee-chart" barRatio={0.3} />
                    </div>
                  </div>
                </div>

                {/* School Calendar in Dashboard */}
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                      {calendarView === 'month'
                        ? `${months[calendarDate.getMonth()]} ${calendarDate.getFullYear()}`
                        : `Year ${calendarDate.getFullYear()}`
                      }
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCalendarView(calendarView === 'month' ? 'year' : 'month')}
                        className="px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors mr-2"
                      >
                        {calendarView === 'month' ? 'Year View' : 'Month View'}
                      </button>
                      <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ChevronLeft size={20} className="text-gray-600" /></button>
                      <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ChevronRight size={20} className="text-gray-600" /></button>
                    </div>
                  </div>

                  {calendarView === 'month' ? (
                    <>
                      <div className="grid grid-cols-7 gap-1 mb-4">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="p-2 text-center text-sm font-semibold text-gray-600">{day}</div>)}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: getFirstDayOfMonth(calendarDate) }).map((_, i) => <div key={`empty-${i}`} className="p-2 min-h-[60px] bg-gray-50/30 rounded-lg"></div>)}
                        {Array.from({ length: getDaysInMonth(calendarDate) }, (_, i) => {
                          const day = i + 1;
                          const events = getEventsForDay(day, calendarDate.getMonth(), calendarDate.getFullYear());
                          const isToday = new Date().toDateString() === new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day).toDateString();
                          return (
                            <div key={day} className={`p-1 min-h-[60px] border border-gray-100 rounded-lg transition-colors relative ${isToday ? 'bg-indigo-50 border-indigo-200' : 'hover:bg-gray-50'}`}>
                              <span className={`text-sm font-medium ${isToday ? 'text-indigo-700' : 'text-gray-700'}`}>{day}</span>
                              <div className="mt-1 space-y-1">
                                {events.map((e, idx) => (
                                  <div key={idx} className={`text-xs p-1 rounded truncate ${e.type === 'holiday' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`} title={e.title}>{e.title}</div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {months.map((monthName, monthIndex) => {
                        const daysInMonth = getDaysInMonth(new Date(calendarDate.getFullYear(), monthIndex, 1));
                        const firstDay = getFirstDayOfMonth(new Date(calendarDate.getFullYear(), monthIndex, 1));
                        return (
                          <div key={monthName} className="border border-gray-100 rounded-xl p-3">
                            <h4 className="font-bold text-gray-800 mb-2 text-center">{monthName}</h4>
                            <div className="grid grid-cols-7 gap-0.5 text-xs">
                              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d} className="text-center text-gray-400 font-medium">{d}</div>)}
                              {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
                              {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const events = getEventsForDay(day, monthIndex, calendarDate.getFullYear());
                                const hasEvent = events.length > 0;
                                const isHoliday = events.some(e => e.type === 'holiday');
                                return (
                                  <div key={day} className={`text-center p-0.5 rounded-full ${hasEvent ? (isHoliday ? 'bg-red-100 text-red-700 font-bold' : 'bg-blue-100 text-blue-700 font-bold') : 'text-gray-600'}`}>
                                    {day}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <QuickActionButton icon={<FileText size={24} />} label="Report Card" onClick={() => setActiveSection('Report Cards')} color="bg-indigo-500" />
                      <QuickActionButton icon={<MessageSquare size={24} />} label="Chat with Teacher" onClick={() => setActiveSection('Chats')} color="bg-pink-500" />
                      <QuickActionButton icon={<Bus size={24} />} label="Track Bus" onClick={() => setActiveSection('Bus Tracker')} color="bg-orange-500" />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-900">Latest Announcements</h3>
                      <span onClick={() => setShowAllAnnouncements(true)} className="text-xs text-indigo-600 font-semibold cursor-pointer hover:underline">View All</span>
                    </div>
                    <div className="space-y-4">
                      {announcements.slice(0, 2).map(ann => (
                        <div key={ann.id} className="p-3 bg-gray-50 rounded-xl border-l-4 border-indigo-500">
                          <h4 className="font-bold text-gray-800 text-sm">{ann.title}</h4>
                          <p className="text-xs text-gray-500 mt-1">{ann.content}</p>
                          <span className="text-[10px] text-gray-400 mt-2 block">{ann.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-600 rounded-2xl p-6 text-white flex justify-between items-center shadow-lg">
                  <div>
                    <h3 className="font-bold text-lg">Bus Status</h3>
                    <p className="text-indigo-100 text-sm">Route 12 - On Time</p>
                  </div>
                  <div onClick={() => setActiveSection('Bus Tracker')} className="px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm font-semibold text-sm cursor-pointer hover:bg-white/30 transition-colors">
                    Live
                  </div>
                </div>
              </>
            )}

            {activeSection === 'Performance' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">Academic Report</h2>
                  <button
                    onClick={handleDownloadReport}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <Download size={18} />
                    Download Report
                  </button>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm mb-6">
                  <h3 className="font-bold text-gray-700 mb-4">Performance Trends</h3>
                  <div className="h-56">
                    <SimpleBarChart
                      data={performanceData}
                      dataKey="marks"
                      color="#8b5cf6"
                      id="performance-chart"
                      barRatio={0.2}
                    />
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900">Subject-wise Performance</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Marks</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Grade</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Remark</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {performanceData.map((sub, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{sub.subject}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{sub.marks}</td>
                            <td className="px-6 py-4 text-sm font-bold text-indigo-600">{sub.grade}</td>
                            <td className="px-6 py-4 text-sm">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${sub.remark === 'Outstanding' ? 'bg-purple-100 text-purple-700' :
                                  sub.remark === 'Excellent' ? 'bg-green-100 text-green-700' :
                                    sub.remark === 'Good' ? 'bg-blue-100 text-blue-700' :
                                      'bg-yellow-100 text-yellow-700'
                                }`}>
                                {sub.remark}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {marksData.length > 0 ? (
                  marksData.map((record, idx) => (
                    <div key={idx} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-gray-100">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-bold text-gray-900">{record.examType}</h3>
                          <span className="text-sm text-gray-500">{new Date(record.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</th>
                              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Marks</th>
                              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Percentage</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {record.subjects.map((sub, i) => (
                              <tr key={i} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{sub.subject}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{sub.marks}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{sub.total}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                  {sub.total > 0 ? ((sub.marks / sub.total) * 100).toFixed(2) : '0.00'}%
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                    <FileText className="mx-auto text-gray-300 mb-4" size={48} />
                    <h3 className="text-lg font-medium text-gray-900">No performance records found</h3>
                    <p className="text-gray-500 mt-1">Marks will appear here once uploaded by teachers.</p>
                  </div>
                )}
              </div>
            )}

            {activeSection === 'Attendance' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">Attendance Overview</h2>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors text-sm">Request Leave</button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                    <p className="text-xs text-green-600 font-bold uppercase">Present Days</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">205</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                    <p className="text-xs text-red-600 font-bold uppercase">Absent Days</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">15</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-xs text-blue-600 font-bold uppercase">Percentage</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">93%</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                    <p className="text-xs text-purple-600 font-bold uppercase">Working Days</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">220</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="font-bold text-gray-700 mb-4">Monthly Attendance</h3>
                    <div className="h-56">
                      <SimpleBarChart
                        data={attendanceTrendData}
                        dataKey="percentage"
                        color="#10b981"
                        id="attendance-chart"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm">
                  <h3 className="font-bold text-gray-700 mb-4">Recent Attendance Log</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Student Name</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Check In</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Check Out</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {getAttendanceData().map((row, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">{getStudentDetails().name}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{row.date}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${row.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {row.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">{row.in}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{row.out}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'Fee Payment' && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Fee Status</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4">Fee Payment Trend</h3>
                    <div className="h-56">
                      <SimpleBarChart data={feeTrendData} dataKey="amount" color="#f97316" id="fee-payment-trend-chart" barRatio={0.3} />
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4">Fee Breakdown</h3>
                    <div className="h-56">
                      <SimplePieChart data={feeBreakdownData} colors={['#8b5cf6', '#f97316', '#10b981', '#3b82f6']} />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Month</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Due Date</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {fees.map((fee) => (
                          <tr key={fee.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{fee.month}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{fee.amount}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{fee.date}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${fee.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {fee.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {fee.status === 'Paid' ? (
                                <button onClick={() => handleDownloadReceipt(fee)} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1">
                                  <Download size={14} /> Receipt
                                </button>
                              ) : (
                                <button onClick={() => handlePayFee(fee)} className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                                  Pay Now
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'Report Cards' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-gray-900">Report Cards</h2>
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="relative">
                      <select
                        value={selectedReportClass}
                        onChange={(e) => setSelectedReportClass(e.target.value)}
                        className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-gray-700"
                      >
                        {['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map(cls => <option key={cls} value={cls}>{cls}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    </div>
                    <button
                      onClick={handleDownloadReport}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Download size={18} /> Download PDF
                    </button>
                  </div>

                  <div className="flex gap-4 border-b border-gray-200 mb-6 overflow-x-auto">
                    {Object.keys(reportData).map((key) => (
                      <button
                        key={key}
                        onClick={() => setActiveReportTab(key)}
                        className={`pb-3 px-4 text-sm font-medium transition-colors whitespace-nowrap ${activeReportTab === key ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        {reportData[key].title}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">{reportData[activeReportTab].title} - {selectedReportClass}</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Marks</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {reportData[activeReportTab].subjects.map((subject, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{subject.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{subject.marks}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${subject.grade.startsWith('A') ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{subject.grade}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <h4 className="font-bold text-gray-800 mb-2">Teacher Feedback</h4>
                    <p className="text-gray-600 text-sm italic">"Excellent performance in Science and Mathematics. Needs to focus more on English literature. Overall a very good term."</p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'Assignments' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-gray-900">Assignments</h2>

                <div className="flex gap-2 overflow-x-auto pb-2">
                  {['All', 'Pending', 'Submitted', 'Overdue'].map(filter => (
                    <button
                      key={filter}
                      onClick={() => setAssignmentFilter(filter)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${assignmentFilter === filter ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                        }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredAssignments.map((assignment) => (
                    <div key={assignment.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded uppercase tracking-wide">{assignment.subject}</span>
                          <h3 className="text-lg font-bold text-gray-900 mt-2">{assignment.title}</h3>
                          <p className="text-xs text-gray-500 mt-1">Teacher: {assignment.teacher}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${assignment.status === 'Submitted' ? 'bg-green-100 text-green-800' :
                            assignment.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                              'bg-orange-100 text-orange-800'
                          }`}>
                          {assignment.status}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{assignment.description}</p>
                      <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                        <div className="text-sm text-gray-500">
                          <span className="block text-xs text-gray-400">Due Date</span>
                          {assignment.dueDate}
                        </div>
                        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                          View Details →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'Exam Schedule' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-gray-900">Exam Schedule</h2>
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900">Upcoming Exams</h3>
                    <div className="flex items-center gap-4">
                      <select
                        value={examFilter}
                        onChange={(e) => setExamFilter(e.target.value)}
                        className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 outline-none"
                      >
                        <option value="All">All Types</option>
                        <option value="Final">Final</option>
                        <option value="Midterm">Midterm</option>
                        <option value="Unit Test">Unit Test</option>
                      </select>
                      <button onClick={handleDownloadSchedule} className="text-indigo-600 text-sm font-medium hover:underline">Download Schedule</button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Subject</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Time</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Room</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {filteredExamSchedule.map((exam) => (
                          <tr key={exam.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{exam.subject}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{exam.date}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{exam.time}</td>
                            <td className="px-6 py-4 text-sm text-gray-600">{exam.room}</td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 rounded text-xs font-bold bg-indigo-100 text-indigo-800">
                                {exam.type}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'Bus Tracker' && (
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-900">Bus Tracker</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-gray-200 rounded-2xl h-96 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
                      <span className="text-gray-400 font-medium flex items-center gap-2"><MapPin /> Map View Placeholder</span>
                    </div>
                    {/* Mock Map UI */}
                    <div className="absolute bottom-4 left-4 bg-white p-4 rounded-xl shadow-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><Bus size={20} /></div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">Bus No. 42</p>
                          <p className="text-xs text-gray-500">Arriving in 5 mins</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                      <h3 className="font-bold text-gray-900 mb-4">Driver Details</h3>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500"><User /></div>
                        <div>
                          <p className="font-bold text-gray-900">Rajesh Kumar</p>
                          <p className="text-sm text-gray-500">Driver</p>
                          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Phone size={12} /> +91 98765 43210</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => window.open('tel:+919876543210', '_self')}
                          className="flex-1 py-2 bg-green-50 text-green-700 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-green-100 transition-colors"
                        >
                          <Phone size={16} /> Call
                        </button>
                        <button
                          onClick={() => window.open('https://wa.me/919876543210', '_blank')}
                          className="flex-1 py-2 bg-green-50 text-green-700 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-green-100 transition-colors"
                        >
                          <MessageSquare size={16} /> WhatsApp
                        </button>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                      <h3 className="font-bold text-gray-900 mb-4">Route Info</h3>
                      <div className="space-y-4 relative">
                        <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gray-100"></div>
                        <div className="relative pl-6">
                          <div className="absolute left-0 top-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                          <p className="text-sm font-bold text-gray-900">School</p>
                          <p className="text-xs text-gray-500">Departed 2:30 PM</p>
                        </div>
                        <div className="relative pl-6">
                          <div className="absolute left-0 top-1 w-4 h-4 bg-indigo-500 rounded-full border-2 border-white animate-pulse"></div>
                          <p className="text-sm font-bold text-gray-900">Current Location</p>
                          <p className="text-xs text-indigo-600 font-medium">Main Street</p>
                        </div>
                        <div className="relative pl-6">
                          <div className="absolute left-0 top-1 w-4 h-4 bg-gray-300 rounded-full border-2 border-white"></div>
                          <p className="text-sm font-bold text-gray-900">Home Drop</p>
                          <p className="text-xs text-gray-500">Est. 3:15 PM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'Chats' && (
              <div className="h-[calc(100vh-140px)] flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h2 className="text-xl font-bold text-gray-900">Chats</h2>
                  <button className="text-indigo-600 text-sm font-medium hover:underline">New Message</button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map(chat => (
                    <div key={chat.id} className={`flex gap-4 p-4 rounded-xl transition-colors cursor-pointer ${chat.unread ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-gray-50 border border-transparent'}`}>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-sm">
                        {chat.sender.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className={`text-sm font-bold ${chat.unread ? 'text-indigo-900' : 'text-gray-900'}`}>{chat.sender}</h4>
                          <span className="text-xs text-gray-400">{chat.time}</span>
                        </div>
                        <p className={`text-sm mt-1 line-clamp-1 ${chat.unread ? 'text-indigo-700 font-medium' : 'text-gray-600'}`}>{chat.message}</p>
                        {chat.attachment && (
                          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-white rounded-lg border border-gray-200 text-xs text-gray-600">
                            <FileText size={12} className="text-red-500" />
                            {chat.attachment}
                          </div>
                        )}
                      </div>
                      {chat.unread && <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>}
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-gray-100 bg-gray-50">
                  <div className="relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                    <button onClick={handleSendMessage} className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'Settings' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Email Notifications</span>
                      <button className="w-12 h-6 bg-indigo-600 rounded-full relative">
                        <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">SMS Alerts</span>
                      <button className="w-12 h-6 bg-gray-200 rounded-full relative">
                        <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></span>
                      </button>
                    </div>
                    <div className="pt-4 border-t border-gray-100">
                      <h4 className="font-semibold text-gray-900 mb-4">Security</h4>
                      <button onClick={() => setShowPasswordModal(true)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">Change Password</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'Parent Profile' && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                  <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-8">
                      <div className="flex items-end gap-6">
                        <div className="relative group">
                          {parentImage ? (
                            <img src={parentImage} alt="Profile" className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover bg-white" />
                          ) : (
                            <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-md flex items-center justify-center text-3xl font-bold text-indigo-600">
                              {user?.firstName?.charAt(0)}
                            </div>
                          )}
                          {isEditingProfile && (
                            <>
                              <button onClick={() => fileInputRef.current.click()} className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1.5 rounded-full hover:bg-indigo-700 transition-colors shadow-sm border-2 border-white z-10">
                                <Camera size={14} />
                              </button>
                              {parentImage && (
                                <button onClick={handleRemoveImage} className="absolute top-0 right-0 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors shadow-sm border-2 border-white z-10">
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                        <div className="mb-2">
                          <h2 className="text-2xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h2>
                          <p className="text-gray-500">Parent / Guardian</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsEditingProfile(!isEditingProfile)}
                        className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg font-medium hover:bg-indigo-100 transition-colors flex items-center gap-2"
                      >
                        {isEditingProfile ? <X size={18} /> : <Edit2 size={18} />}
                        {isEditingProfile ? 'Cancel' : 'Edit Profile'}
                      </button>
                    </div>

                    <form onSubmit={handleProfileUpdate}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                          <input
                            type="text"
                            disabled={!isEditingProfile}
                            value={profileFormData.firstName}
                            onChange={(e) => setProfileFormData({ ...profileFormData, firstName: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                          <input
                            type="text"
                            disabled={!isEditingProfile}
                            value={profileFormData.lastName}
                            onChange={(e) => setProfileFormData({ ...profileFormData, lastName: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                          <input
                            type="email"
                            disabled={!isEditingProfile}
                            value={profileFormData.email}
                            onChange={(e) => setProfileFormData({ ...profileFormData, email: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                          <input
                            type="tel"
                            disabled={!isEditingProfile}
                            value={profileFormData.phone}
                            onChange={(e) => setProfileFormData({ ...profileFormData, phone: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                          <input
                            type="text"
                            disabled={!isEditingProfile}
                            value={profileFormData.address}
                            onChange={(e) => setProfileFormData({ ...profileFormData, address: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                          />
                        </div>
                      </div>

                      {isEditingProfile && (
                        <div className="mt-8 flex justify-end">
                          <button
                            type="submit"
                            className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                          >
                            <Save size={18} />
                            Save Changes
                          </button>
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'Notifications' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold text-gray-900">Notifications</h2>
                  <div className="flex gap-4">
                    {notifications.some(n => !n.read) && (
                      <button
                        onClick={markAllAsRead}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        Mark all as read
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="space-y-4">
                    {notifications.map((notification) => {
                      let icon, styles;
                      switch (notification.type) {
                        case 'fee':
                          icon = <Bell size={20} />;
                          styles = { bg: 'bg-blue-50', border: 'border-blue-100', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' };
                          break;
                        case 'assignment':
                          icon = <CheckCircle size={20} />;
                          styles = { bg: 'bg-green-50', border: 'border-green-100', iconBg: 'bg-green-100', iconColor: 'text-green-600' };
                          break;
                        case 'meeting':
                          icon = <Calendar size={20} />;
                          styles = { bg: 'bg-yellow-50', border: 'border-yellow-100', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600' };
                          break;
                        default:
                          icon = <Bell size={20} />;
                          styles = { bg: 'bg-gray-50', border: 'border-gray-100', iconBg: 'bg-gray-100', iconColor: 'text-gray-600' };
                      }

                      return (
                        <div
                          key={notification.id}
                          className={`p-4 rounded-xl border flex gap-4 transition-all ${notification.read
                              ? 'bg-white border-gray-100 opacity-60'
                              : `${styles.bg} ${styles.border}`
                            }`}
                        >
                          <div className={`p-2 rounded-full h-fit ${styles.iconBg} ${styles.iconColor}`}>
                            {icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className={`font-bold ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                                {notification.title}
                              </h4>
                              <span className="text-xs text-gray-500">{notification.time}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            {!notification.read && (
                              <button
                                onClick={() => markNotificationAsRead(notification.id)}
                                className="text-xs font-semibold text-indigo-600 mt-2 hover:text-indigo-800"
                              >
                                Mark as read
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {notifications.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No notifications available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'Student Profile' && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="h-32 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                  <div className="px-8 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 mb-8">
                      <div className="flex items-end gap-6">
                        <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-md flex items-center justify-center text-3xl font-bold text-blue-600">
                          {getStudentDetails().name.charAt(0)}
                        </div>
                        <div className="mb-2">
                          <h2 className="text-2xl font-bold text-gray-900">{getStudentDetails().name}</h2>
                          <p className="text-gray-500">Student</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="border-b border-gray-100 pb-4">
                        <p className="text-sm text-gray-500 mb-1">Class & Section</p>
                        <p className="font-semibold text-gray-900 text-lg">{getStudentDetails().grade} - A</p>
                      </div>
                      <div className="border-b border-gray-100 pb-4">
                        <p className="text-sm text-gray-500 mb-1">Student ID</p>
                        <p className="font-semibold text-gray-900 text-lg">{getStudentDetails().id}</p>
                      </div>
                      <div className="border-b border-gray-100 pb-4">
                        <p className="text-sm text-gray-500 mb-1">Date of Birth</p>
                        <p className="font-semibold text-gray-900 text-lg">12 Aug 2008</p>
                      </div>
                      <div className="border-b border-gray-100 pb-4">
                        <p className="text-sm text-gray-500 mb-1">Blood Group</p>
                        <p className="font-semibold text-gray-900 text-lg">B+</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut className="text-red-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Logout?</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to logout from your account?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input type="password" required className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input type="password" required className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input type="password" required className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setShowPasswordModal(false)} className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-medium">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium">Update Password</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Announcements Modal */}
      {showAllAnnouncements && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">All Announcements</h3>
              <button onClick={() => setShowAllAnnouncements(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {announcements.map(ann => (
                <div key={ann.id} className="p-4 bg-gray-50 rounded-xl border-l-4 border-indigo-500">
                  <h4 className="font-bold text-gray-800 text-sm">{ann.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{ann.content}</p>
                  <span className="text-xs text-gray-400 mt-2 block">{ann.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;
