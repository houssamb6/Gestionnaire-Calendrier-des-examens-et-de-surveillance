import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

function Layout({ children, userData }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  
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
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        departmentName={userData.departmentName} 
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header 
          name={userData.name}
          setSidebarOpen={setSidebarOpen}
          showNotification={showNotification}
          setShowNotification={setShowNotification}
        />

        <main className="flex-1 overflow-y-auto bg-gray-100 px-4 py-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Notification Panel */}
      {showNotification && (
        <div className="fixed right-0 top-20 w-80 bg-white shadow-lg rounded-l-lg p-4 transform transition-transform z-50">
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

export default Layout;