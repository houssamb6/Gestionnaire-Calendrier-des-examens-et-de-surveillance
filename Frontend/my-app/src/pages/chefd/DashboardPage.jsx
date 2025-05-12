import { useState } from "react";
import { Calendar, Users, BookOpen, MapPin } from 'lucide-react';

function DashboardPage({ userData }) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('pending');

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

  return (
    <>
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
    </>
  );
}

export default DashboardPage;