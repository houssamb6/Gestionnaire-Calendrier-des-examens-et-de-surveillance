import { useState } from "react";
import { Search, UserPlus, Mail, Phone, MapPin, Star, Award } from 'lucide-react';

function SupervisorsPage({ userData }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  
  const supervisors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@university.edu',
      phone: '+1 (555) 123-4567',
      office: 'Science Building, Room 302',
      specialization: 'Database Systems',
      courseCount: 3,
      rating: 4.8,
      availability: ['Monday AM', 'Wednesday PM', 'Friday AM'],
      status: 'active',
      assignedExams: 2
    },
    {
      id: 2,
      name: 'Prof. Michael Chen',
      email: 'michael.chen@university.edu',
      phone: '+1 (555) 987-6543',
      office: 'Engineering Building, Room 201',
      specialization: 'Algorithms & AI',
      courseCount: 4,
      rating: 4.5,
      availability: ['Tuesday AM', 'Thursday AM', 'Friday PM'],
      status: 'busy',
      assignedExams: 3
    },
    {
      id: 3,
      name: 'Dr. Lisa Rodriguez',
      email: 'lisa.rodriguez@university.edu',
      phone: '+1 (555) 234-5678',
      office: 'Science Building, Room 405',
      specialization: 'Computer Networks',
      courseCount: 2,
      rating: 4.2,
      availability: ['Monday PM', 'Wednesday AM', 'Thursday PM'],
      status: 'active',
      assignedExams: 1
    },
    {
      id: 4,
      name: 'Prof. David Kim',
      email: 'david.kim@university.edu',
      phone: '+1 (555) 876-5432',
      office: 'Math Building, Room 110',
      specialization: 'Data Science',
      courseCount: 5,
      rating: 4.9,
      availability: ['Tuesday PM', 'Wednesday PM', 'Friday AM'],
      status: 'on-leave',
      assignedExams: 0
    },
    {
      id: 5,
      name: 'Dr. Maria Gonzalez',
      email: 'maria.gonzalez@university.edu',
      phone: '+1 (555) 345-6789',
      office: 'Engineering Building, Room 305',
      specialization: 'Software Engineering',
      courseCount: 3,
      rating: 4.4,
      availability: ['Monday AM', 'Tuesday AM', 'Thursday AM'],
      status: 'active',
      assignedExams: 2
    },
    {
      id: 6,
      name: 'Prof. James Wilson',
      email: 'james.wilson@university.edu',
      phone: '+1 (555) 456-7890',
      office: 'CS Building, Room 203',
      specialization: 'Programming Languages',
      courseCount: 4,
      rating: 4.6,
      availability: ['Monday PM', 'Wednesday AM', 'Friday PM'],
      status: 'active',
      assignedExams: 3
    }
  ];

  const filteredSupervisors = supervisors.filter((supervisor) => 
    supervisor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supervisor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'busy':
        return 'bg-yellow-100 text-yellow-800';
      case 'on-leave':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Supervisors</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search supervisors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-md ${viewMode === 'list' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
            >
              List
            </button>
            <button
              onClick={() => setShowAssignModal(true)}
              className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Assign
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSupervisors.map((supervisor) => (
            <div 
              key={supervisor.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-semibold text-gray-900">{supervisor.name}</h2>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(supervisor.status)}`}>
                    {supervisor.status.replace('-', ' ')}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">{supervisor.specialization}</p>
                
                <div className="mt-4">
                  <div className="flex items-center mt-2">
                    <Mail className="h-4 w-4 text-gray-500 mr-2" />
                    <a href={`mailto:${supervisor.email}`} className="text-sm text-blue-600 hover:underline">
                      {supervisor.email}
                    </a>
                  </div>
                  <div className="flex items-center mt-2">
                    <Phone className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">{supervisor.phone}</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">{supervisor.office}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{supervisor.rating}/5.0</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      {supervisor.assignedExams} exams assigned
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {supervisor.availability.map((time, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                      >
                        {time}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-3 bg-gray-50 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">
                  {supervisor.courseCount} courses
                </span>
                <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supervisor
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Specialization
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Availability
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exams
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSupervisors.map((supervisor) => (
                  <tr key={supervisor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{supervisor.name}</div>
                          <div className="text-sm text-gray-500">{supervisor.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{supervisor.specialization}</div>
                      <div className="text-sm text-gray-500">{supervisor.courseCount} courses</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(supervisor.status)}`}>
                        {supervisor.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {supervisor.availability.map((time, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                          >
                            {time}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {supervisor.assignedExams}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">{supervisor.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Assign</button>
                      <button className="text-gray-600 hover:text-gray-900">Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Supervisors</h3>
          <div className="space-y-4">
            {supervisors
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 3)
              .map((supervisor, index) => (
                <div key={supervisor.id} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' : 
                    index === 1 ? 'bg-gray-100 text-gray-800' : 
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {index === 0 && <Award className="w-4 h-4" />}
                    {index !== 0 && (index + 1)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{supervisor.name}</p>
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-400 mr-1" />
                      <span className="text-sm text-gray-600">{supervisor.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Supervisor Availability</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Morning Slots</span>
              <span className="text-sm font-medium">12 available</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
            
            <div className="flex justify-between mt-4">
              <span className="text-sm text-gray-600">Afternoon Slots</span>
              <span className="text-sm font-medium">9 available</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
            
            <div className="flex justify-between mt-4">
              <span className="text-sm text-gray-600">Evening Slots</span>
              <span className="text-sm font-medium">4 available</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '20%' }}></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Supervisor Status</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Active</span>
              <span className="ml-auto font-medium">{supervisors.filter(s => s.status === 'active').length}</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Busy</span>
              <span className="ml-auto font-medium">{supervisors.filter(s => s.status === 'busy').length}</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">On Leave</span>
              <span className="ml-auto font-medium">{supervisors.filter(s => s.status === 'on-leave').length}</span>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Supervisors</span>
                <span className="font-medium">{supervisors.length}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-sm text-gray-600">Total Exams Assigned</span>
                <span className="font-medium">{supervisors.reduce((sum, s) => sum + s.assignedExams, 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SupervisorsPage;