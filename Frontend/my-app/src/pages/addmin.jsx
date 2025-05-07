import React, { useState } from 'react';
import { Calendar, Users,User, BookOpen, MapPin, Bell, Mail, Menu, X, Home, Settings, FileText, ClipboardList } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showNotification, setShowNotification] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const filters = [
    { id: 'date', label: 'Date', icon: Calendar },
    { id: 'subject', label: 'Subject', icon: BookOpen },
    { id: 'teacher', label: 'Teacher', icon: Users },
    { id: 'room', label: 'Room', icon: MapPin },
  ];

  const quickActions = [
    { title: 'Add Exam', count: '', color: 'bg-purple-500' },
    { title: 'Assign Supervisors', count: '4', color: 'bg-green-500' },
    { title: 'Room Booking', count: '6', color: 'bg-blue-500' },
    { title: 'Pending Validations', count: '2', color: 'bg-yellow-500' },
  ];

  const examSessions = [
    {
      id: 1,
      subject: 'Mathematics',
      date: '2024-03-20',
      time: '09:00',
      room: 'A101',
      supervisor: 'Dr. Smith',
      status: 'Validated',
    },
    {
      id: 2,
      subject: 'Physics',
      date: '2024-03-21',
      time: '14:00',
      room: 'B202',
      supervisor: 'Dr. Johnson',
      status: 'Pending',
    },
  ];

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard/admin/', active: true },
    { icon: BookOpen, label: 'Exams', path: '/dashboard/admin/exams' },
    { icon: Calendar, label: 'Schedule', path: '/dashboard/admin/schedule' },
    { icon: Users, label: 'Supervisors', path: '/dashboard/admin/supervisors' },
    { icon: MapPin, label: 'Rooms', path: '/dashboard/admin/rooms' },
    { icon: FileText, label: 'Reports', path: '/reports' },
    { icon: ClipboardList, label: 'Validations', path: '/validations' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
<aside
  className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-all duration-300 ease-in-out ${
    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
  } lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200`}
  aria-hidden={!isSidebarOpen}
>
  {/* Header */}
  <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
    <div className="flex items-center">
      <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center mr-3">
        <ClipboardList className="w-5 h-5 text-white" />
      </div>
      <h2 className="text-xl font-bold text-gray-800">Exam Admin</h2>
    </div>
    <button
      onClick={() => setSidebarOpen(false)}
      className="p-2 rounded-md lg:hidden hover:bg-gray-100 transition-colors"
      aria-label="Close sidebar"
    >
      <X className="w-5 h-5 text-gray-600" />
    </button>
  </div>

  {/* Navigation */}
  <nav className="mt-6 px-4" aria-label="Main Navigation">
    <ul className="space-y-1">
      {sidebarItems.map((item, index) => (
        <li key={index}>
          <button
            onClick={() => navigate(item.path)}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-all duration-200 ${
              item.active
                ? "bg-blue-50 text-blue-700 font-medium shadow-sm"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            aria-current={item.active ? "page" : undefined}
          >
            <item.icon className={`w-5 h-5 mr-3 ${item.active ? "text-blue-600" : "text-gray-500"}`} />
            <span className={item.active ? "font-medium" : ""}>{item.label}</span>
            {item.active && (
              <div className="ml-auto bg-blue-600 w-1.5 h-5 rounded-full" />
            )}
          </button>
        </li>
      ))}
    </ul>
  </nav>

  {/* Footer */}
  <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
    <div className="flex items-center space-x-3 px-2">
    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
    <User className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
        <p className="text-xs text-gray-500 truncate">admin@example.com</p>
      </div>
      <button 
        className="p-1.5 rounded-full hover:bg-gray-100"
        aria-label="User settings"
      >
        <Settings className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  </div>
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
                <h1 className="text-3xl font-bold text-gray-900 ml-4">Exam Management</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setShowNotification(!showNotification)}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <Bell className="h-6 w-6 text-gray-600" />
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
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {quickActions.map((action, index) => (
                <div
                  key={index}
                  className={`${action.color} rounded-lg shadow-lg p-6 text-white transform transition-transform hover:scale-105`}
                >
                  <h3 className="text-lg font-semibold">{action.title}</h3>
                  {action.count && (
                    <p className="text-2xl font-bold mt-2">{action.count}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-8">
              <div className="flex flex-wrap gap-4">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedFilter(filter.id)}
                    className={`flex items-center px-4 py-2 rounded-md transition-colors
                      ${selectedFilter === filter.id 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    <filter.icon className="w-5 h-5 mr-2" />
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Exam Sessions Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Exam Sessions</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Room
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Supervisor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {examSessions.map((session) => (
                      <tr key={session.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {session.subject}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {session.date}
                          </div>
                          <div className="text-sm text-gray-500">
                            {session.time}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{session.room}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {session.supervisor}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${session.status === 'Validated' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {session.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            Delete
                          </button>
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

      {/* Notification Panel */}
      {showNotification && (
        <div className="fixed right-0 top-20 w-80 bg-white shadow-lg rounded-l-lg p-4 transform transition-transform">
          <h3 className="text-lg font-semibold mb-4">Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-start p-3 bg-blue-50 rounded-lg">
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">
                  New exam schedule validated
                </p>
                <p className="text-sm text-blue-600">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start p-3 bg-yellow-50 rounded-lg">
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-800">
                  Pending supervisor assignment
                </p>
                <p className="text-sm text-yellow-600">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;