import { Bell, Mail, Menu } from 'lucide-react';

function Header({ name, setSidebarOpen, showNotification, setShowNotification }) {
  return (
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
  );
}

export default Header;