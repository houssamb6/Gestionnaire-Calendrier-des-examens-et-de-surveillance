import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode
import { Calendar, Users, BookOpen, MapPin, Bell, CheckCircle, Mail, Menu, X, Home, AlertTriangle, FileText, ClipboardList, UserCheck, GraduationCap } from 'lucide-react';

function ChefDashboard() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showNotification, setShowNotification] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  const [departmentName, setDepartmentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name , setName] = useState("");

  const filters = [
    { id: 'date', label: 'Date', icon: Calendar },
    { id: 'subject', label: 'Subject', icon: BookOpen },
    { id: 'teacher', label: 'Teacher', icon: Users },
    { id: 'room', label: 'Room', icon: MapPin },
  ];

  const validationStats = [
    { title: 'Pending Validations', count: '4', color: 'bg-yellow-500' },
    { title: 'Validated Today', count: '12', color: 'bg-green-500' },
    { title: 'Student Lists', count: '6', color: 'bg-blue-500' },
    { title: 'Requires Attention', count: '2', color: 'bg-red-500' },
  ];

  const pendingValidations = [
    {
      id: 1,
      type: 'Supervisor Assignment',
      subject: 'Database Systems',
      details: 'Dr. Smith assigned to DB101 Final',
      date: '2024-03-20',
      status: 'Pending',
      priority: 'High',
    },
    {
      id: 2,
      type: 'Student List',
      subject: 'Algorithms',
      details: '45 students registered for ALG202',
      date: '2024-03-21',
      status: 'Pending',
      priority: 'Medium',
    },
  ];

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', active: true },
    { icon: CheckCircle, label: 'Validations' },
    { icon: UserCheck, label: 'Supervisors' },
    { icon: GraduationCap, label: 'Students' },
    { icon: Calendar, label: 'Schedule' },
    { icon: FileText, label: 'Reports' },
  ];

  const notifications = [
    {
      id: 1,
      title: 'New Supervisor Assignment',
      message: 'Dr. Johnson assigned to Algorithm exam',
      time: '5 minutes ago',
      type: 'validation',
    },
    {
      id: 2,
      title: 'Schedule Change',
      message: 'Database Systems exam time updated',
      time: '1 hour ago',
      type: 'change',
    },
    {
      id: 3,
      title: 'Student List Updated',
      message: 'New students added to Programming 101',
      time: '2 hours ago',
      type: 'info',
    },
  ];

  const fetchDepartmentName = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (token) {
        const decodedToken = jwtDecode(token);
        const department = decodedToken.department;
        const f = decodedToken.name;
        setName(f);

        // Map department to user-friendly name
        let displayName = department;
        switch (department) {
          case "Math":
            displayName = "Math";
            break;
          case "Info":
            displayName = "Informatique";
            break;
          case "Technique":
            displayName = "Technique";
            break;
          default:
            displayName = department;
        }

        setDepartmentName(displayName);
      } else {
        setError("Token not found");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error loading data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartmentName();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Department Head</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md lg:hidden hover:bg-gray-100"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        <div className="px-4 py-3 border-b border-gray-200 bg-blue-50">
          <p className="text-sm text-gray-600">Department</p>
          <p className="font-semibold text-blue-700">{departmentName}</p>
        </div>
        <nav className="mt-6 px-4">
          <ul className="space-y-2">
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <a
                  href="#"
                  className={`flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors ${
                    item.active ? 'bg-blue-50 text-blue-700' : ''
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-md">
          <div className="px-4 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-md lg:hidden hover:bg-gray-100"
                >
                  <Menu className="w-6 h-6 text-gray-600" />
                </button>
                <h1 className="text-3xl font-bold text-gray-900 ml-4">Department Dashboard, Welcome {name}</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setShowNotification(!showNotification)}
                  className="p-2 rounded-full hover:bg-gray-100 relative"
                >
                  <Bell className="h-6 w-6 text-gray-600" />
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    3
                  </span>
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Mail className="h-6 w-6 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 px-4 py-6">
          <div className="max-w-7xl mx-auto">
            {/* Validation Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {validationStats.map((stat, index) => (
                <div
                  key={index}
                  className={`${stat.color} rounded-lg shadow-lg p-6 text-white transform transition-transform hover:scale-105`}
                >
                  <h3 className="text-lg font-semibold">{stat.title}</h3>
                  <p className="text-2xl font-bold mt-2">{stat.count}</p>
                </div>
              ))}
            </div>

            {/* Validation Tabs */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-4 px-4" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('pending')}
                    className={`px-3 py-4 text-sm font-medium border-b-2 ${
                      activeTab === 'pending'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Pending Validations
                  </button>
                  <button
                    onClick={() => setActiveTab('validated')}
                    className={`px-3 py-4 text-sm font-medium border-b-2 ${
                      activeTab === 'validated'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Validated Items
                  </button>
                </nav>
              </div>

              {/* Validation List */}
              <div className="p-4">
                <div className="space-y-4">
                  {pendingValidations.map((item) => (
                    <div key={item.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              item.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {item.priority}
                            </span>
                            <span className="ml-2 text-sm text-gray-500">{item.date}</span>
                          </div>
                          <h3 className="mt-2 text-lg font-semibold text-gray-900">{item.type}</h3>
                          <p className="text-sm text-gray-600">{item.subject}</p>
                          <p className="mt-1 text-sm text-gray-500">{item.details}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
                            Validate
                          </button>
                          <button className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Notification Panel */}
      {showNotification && (
        <div className="fixed right-0 top-20 w-80 bg-white shadow-lg rounded-l-lg p-4 transform transition-transform">
          <h3 className="text-lg font-semibold mb-4">Notifications</h3>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ChefDashboard;