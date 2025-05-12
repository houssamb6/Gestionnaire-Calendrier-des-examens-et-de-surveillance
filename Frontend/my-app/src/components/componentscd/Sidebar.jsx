import { useLocation, Link } from "react-router-dom";
import { Home, CheckCircle, UserCheck, GraduationCap, Calendar, FileText, X } from 'lucide-react';

function Sidebar({ departmentName, isSidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const sidebarItems = [
    { path: "/dashboard/chef", icon: Home, label: 'Dashboard' },
    { path: "/dashboard/chef/validations", icon: CheckCircle, label: 'Validations' },
    { path: "/dashboard/chef/supervisors", icon: UserCheck, label: 'Supervisors' },
    { path: "/dashboard/chef/students", icon: GraduationCap, label: 'Students' },
    { path: "/dashboard/chef/schedule", icon: Calendar, label: 'Schedule' },
    { path: "/dashboard/chef/reports", icon: FileText, label: 'Reports' },
  ];

  return (
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
          {sidebarItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors ${
                  currentPath === item.path ? 'bg-blue-50 text-blue-700' : ''
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;