import React, { createContext, useContext, useState, useEffect } from 'react';
import { analyzeComplaintNLP, checkDuplicateComplaints } from '../services/aiEngine';

const AppContext = createContext();

const INITIAL_COMPLAINTS = [
  {
    id: 'TICK-101',
    title: 'Main Lobby Elevator Door Stuck & Noise',
    description: 'Elevator #2 in Tower A is making grinding noises and the outer door gets stuck on 4th floor.',
    category: 'Elevator',
    priority: 'Critical',
    slaHours: 2,
    status: 'In Progress',
    residentName: 'Aarav Sharma',
    flatNumber: 'A-402',
    phone: '+91 98765 43210',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    assignedStaff: 'Ramesh (Elevator Specialist)',
    beforeImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=600&auto=format&fit=crop&q=80',
    afterImage: null,
    visionVerification: null,
    tags: ['Elevator', 'Critical Priority', 'Tower A']
  },
  {
    id: 'TICK-102',
    title: 'Water Seepage in Basement Parking B-2',
    description: 'Continuous water leaking from ceiling near pillar B-14 in lower basement. Risk of slipping.',
    category: 'Plumbing',
    priority: 'High',
    slaHours: 12,
    status: 'Assigned',
    residentName: 'Priya Verma',
    flatNumber: 'B-104',
    phone: '+91 98111 22233',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    assignedStaff: 'Suresh (Plumber)',
    beforeImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
    afterImage: null,
    visionVerification: null,
    tags: ['Plumbing', 'High Priority', 'Basement']
  },
  {
    id: 'TICK-103',
    title: 'Clubhouse Outer Corridor Light Blinking',
    description: 'LED panel near gym entrance is flickering constantly causing eye strain.',
    category: 'Electrical',
    priority: 'Low',
    slaHours: 48,
    status: 'Pending',
    residentName: 'Rohan Mehta',
    flatNumber: 'C-701',
    phone: '+91 97777 88899',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    assignedStaff: 'Unassigned',
    beforeImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
    afterImage: null,
    visionVerification: null,
    tags: ['Electrical', 'Low Priority']
  },
  {
    id: 'TICK-100',
    title: 'Swimming Pool Pump Filter Replacement',
    description: 'Filter cleaned and backwashed. Water clarity restored to 100%.',
    category: 'Civil',
    priority: 'Medium',
    slaHours: 24,
    status: 'Resolved',
    residentName: 'Society Admin',
    flatNumber: 'Clubhouse',
    phone: '+91 99999 00000',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    assignedStaff: 'Vikram (Pool Maintenance)',
    beforeImage: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&auto=format&fit=crop&q=80',
    afterImage: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&auto=format&fit=crop&q=80',
    visionVerification: {
      verificationScore: 94,
      status: 'Verified Approved',
      isVerified: true,
      confidence: '96.4%',
      detections: ['Filter cleaned', 'Water clarity 100%', 'Pressure normal'],
      analysisSummary: 'Vision AI confirmed filter mesh replaced and visual water clarity match.'
    },
    tags: ['Civil', 'Resolved', 'AI Verified']
  }
];

const INITIAL_VISITORS = [
  {
    id: 'PASS-8901',
    visitorName: 'Rahul Gupta',
    visitorType: 'Delivery (Amazon)',
    vehicleNumber: 'MH 12 AB 4589',
    flatNumber: 'A-402',
    hostName: 'Aarav Sharma',
    entryCode: 'UP-8901',
    validUntil: 'Today, 8:00 PM',
    status: 'Expected',
    createdAt: new Date().toISOString()
  },
  {
    id: 'PASS-8902',
    visitorName: 'Dr. Sunita Rao',
    visitorType: 'Guest',
    vehicleNumber: 'MH 14 CD 9012',
    flatNumber: 'B-104',
    hostName: 'Priya Verma',
    entryCode: 'UP-8902',
    validUntil: 'Today, 11:30 PM',
    status: 'Checked In',
    entryTime: '04:15 PM',
    createdAt: new Date(Date.now() - 7200000).toISOString()
  }
];

const INITIAL_NOTICES = [
  {
    id: 'NOT-1',
    title: 'Notice: Scheduled Water Supply Maintenance',
    content: 'Dear Residents, Please be informed that scheduled maintenance of the primary overhead water tanks will take place tomorrow. Water supply will be temporarily paused between 10:00 AM and 02:00 PM.',
    category: 'Urgent Maintenance',
    postedBy: 'Secretary Committee',
    date: 'Sep 12, 2026',
    translations: {
      en: 'Dear Residents, Please be informed that scheduled maintenance of the primary overhead water tanks will take place tomorrow. Water supply will be temporarily paused between 10:00 AM and 02:00 PM.',
      hi: 'प्रिय निवासियों, कृपया ध्यान दें कि कल मुख्य ओवरहेड पानी की टंकियों का रखरखाव किया जाएगा। सुबह 10:00 बजे से दोपहर 02:00 बजे तक जलापूर्ति अस्थायी रूप से बंद रहेगी।',
      mr: 'सस्नेह नमस्कार रहिवासी, उद्या मुख्य पाण्याच्या टाक्यांची देखभाल केली जाईल. सकाळी १०:०० ते दुपारी ०२:०० दरम्यान पाणीपुरवठा बंद राहील.'
    }
  },
  {
    id: 'NOT-2',
    title: 'Notice: Annual Society General Body Meeting (AGM)',
    content: 'All flat owners are requested to attend the AGM this Sunday at 5:00 PM in the Grand Clubhouse. Key topics include solar installation & security upgrades.',
    category: 'General Meeting',
    postedBy: 'Chairman',
    date: 'Sep 10, 2026',
    translations: {
      en: 'All flat owners are requested to attend the AGM this Sunday at 5:00 PM in the Grand Clubhouse.',
      hi: 'सभी सदस्यों से अनुरोध है कि इस रविवार शाम 5:00 बजे क्लब हाउस में होने वाली एजीएम में भाग लें।',
      mr: 'सर्व सदस्यांना विनंती आहे की या रविवारी संध्याकाळी ५:०० वाजता होणाऱ्या वार्षिक सर्वसाधारण सभेला उपस्थित राहावे.'
    }
  }
];

const INITIAL_DUES = [
  { id: 'DUE-201', month: 'September 2026', amount: 4500, dueDate: 'Sep 25, 2026', status: 'Pending', flat: 'A-402' },
  { id: 'DUE-200', month: 'August 2026', amount: 4500, dueDate: 'Aug 25, 2026', status: 'Paid', flat: 'A-402' }
];

export const AppProvider = ({ children }) => {
  const [role, setRole] = useState('resident'); // 'resident' | 'staff' | 'guard' | 'admin'
  const [theme, setTheme] = useState('dark');
  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem('urbanpulse_complaints');
    return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
  });
  const [visitors, setVisitors] = useState(() => {
    const saved = localStorage.getItem('urbanpulse_visitors');
    return saved ? JSON.parse(saved) : INITIAL_VISITORS;
  });
  const [notices, setNotices] = useState(() => {
    const saved = localStorage.getItem('urbanpulse_notices');
    return saved ? JSON.parse(saved) : INITIAL_NOTICES;
  });
  const [dues, setDues] = useState(INITIAL_DUES);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Ticket TICK-101 assigned to Ramesh (Elevator Specialist)', time: '10m ago', read: false },
    { id: 2, text: 'New Society Notice: Water Tank Cleaning Scheduled', time: '1h ago', read: false },
    { id: 3, text: 'Visitor Rahul Gupta (Amazon) generated gate code UP-8901', time: '2h ago', read: true }
  ]);
  const [sosActive, setSosActive] = useState(null); // { resident: 'Aarav Sharma', flat: 'A-402', timestamp: ... }

  useEffect(() => {
    localStorage.setItem('urbanpulse_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('urbanpulse_visitors', JSON.stringify(visitors));
  }, [visitors]);

  useEffect(() => {
    localStorage.setItem('urbanpulse_notices', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Actions
  const addComplaint = (newComplaint) => {
    const aiAnalysis = analyzeComplaintNLP(newComplaint.title, newComplaint.description);
    const duplicates = checkDuplicateComplaints(newComplaint.title, newComplaint.description, complaints);

    const ticket = {
      id: `TICK-${Math.floor(100 + Math.random() * 900)}`,
      title: newComplaint.title,
      description: newComplaint.description,
      category: aiAnalysis.category,
      priority: aiAnalysis.priority,
      slaHours: aiAnalysis.slaHours,
      status: 'Pending',
      residentName: newComplaint.residentName || 'Aarav Sharma',
      flatNumber: newComplaint.flatNumber || 'A-402',
      phone: '+91 98765 43210',
      createdAt: new Date().toISOString(),
      assignedStaff: 'Unassigned',
      beforeImage: newComplaint.image || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
      afterImage: null,
      visionVerification: null,
      tags: aiAnalysis.tags,
      aiAnalysis,
      duplicatesFound: duplicates
    };

    setComplaints(prev => [ticket, ...prev]);

    // Add Notification
    setNotifications(prev => [
      {
        id: Date.now(),
        text: `New Ticket ${ticket.id} (${ticket.category}) created by ${ticket.residentName}`,
        time: 'Just now',
        read: false
      },
      ...prev
    ]);

    return ticket;
  };

  const updateTicketStatus = (ticketId, updates) => {
    setComplaints(prev => prev.map(t => {
      if (t.id === ticketId) {
        return { ...t, ...updates };
      }
      return t;
    }));

    setNotifications(prev => [
      {
        id: Date.now(),
        text: `Ticket ${ticketId} status updated to '${updates.status || 'Updated'}'`,
        time: 'Just now',
        read: false
      },
      ...prev
    ]);
  };

  const createGatePass = (visitorData) => {
    const codeNum = Math.floor(1000 + Math.random() * 9000);
    const pass = {
      id: `PASS-${codeNum}`,
      visitorName: visitorData.visitorName,
      visitorType: visitorData.visitorType || 'Guest',
      vehicleNumber: visitorData.vehicleNumber || 'N/A',
      flatNumber: visitorData.flatNumber || 'A-402',
      hostName: visitorData.hostName || 'Aarav Sharma',
      entryCode: `UP-${codeNum}`,
      validUntil: 'Today, 11:59 PM',
      status: 'Expected',
      createdAt: new Date().toISOString()
    };

    setVisitors(prev => [pass, ...prev]);
    return pass;
  };

  const scanGatePass = (code) => {
    const found = visitors.find(v => v.entryCode.toUpperCase() === code.trim().toUpperCase());
    if (!found) return { success: false, message: 'Invalid or Expired Entry Code!' };

    if (found.status === 'Checked In') {
      // Check Out
      setVisitors(prev => prev.map(v => v.id === found.id ? { ...v, status: 'Checked Out', exitTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : v));
      return { success: true, message: `Checked Out: ${found.visitorName} (${found.visitorType})`, pass: found };
    } else {
      // Check In
      setVisitors(prev => prev.map(v => v.id === found.id ? { ...v, status: 'Checked In', entryTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : v));
      return { success: true, message: `Checked In Approved: ${found.visitorName} -> Flat ${found.flatNumber}`, pass: found };
    }
  };

  const addNotice = (noticeObj) => {
    const newNotice = {
      id: `NOT-${Date.now()}`,
      title: noticeObj.title,
      content: noticeObj.content,
      category: noticeObj.category || 'General',
      postedBy: 'Admin Committee',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      translations: noticeObj.translations
    };

    setNotices(prev => [newNotice, ...prev]);
  };

  const triggerEmergencySOS = () => {
    const sosData = {
      resident: 'Aarav Sharma',
      flat: 'A-402',
      phone: '+91 98765 43210',
      timestamp: new Date().toLocaleTimeString()
    };
    setSosActive(sosData);
    setNotifications(prev => [
      {
        id: Date.now(),
        text: `🚨 EMERGENCY SOS ALERT from Flat A-402 (Aarav Sharma)! Guards Dispatched.`,
        time: 'JUST NOW',
        read: false,
        isSos: true
      },
      ...prev
    ]);
  };

  const payDues = (dueId) => {
    setDues(prev => prev.map(d => d.id === dueId ? { ...d, status: 'Paid' } : d));
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        theme,
        setTheme,
        complaints,
        visitors,
        notices,
        dues,
        notifications,
        sosActive,
        addComplaint,
        updateTicketStatus,
        createGatePass,
        scanGatePass,
        addNotice,
        triggerEmergencySOS,
        setSosActive,
        payDues
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
