import { useState } from "react";
import { CheckCircle, AlertTriangle, Filter } from "lucide-react";

function ValidationsPage({ userData }) {
  const [activeTab, setActiveTab] = useState('pending');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  
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
    {
      id: 3,
      type: 'Room Assignment',
      subject: 'Operating Systems',
      details: 'Room 302 assigned for OS330 midterm',
      date: '2024-03-22',
      status: 'Pending',
      priority: 'Low',
    },
    {
      id: 4,
      type: 'Schedule Change',
      subject: 'Data Structures',
      details: 'Exam rescheduled from 10AM to 2PM',
      date: '2024-03-23',
      status: 'Pending',
      priority: 'High',
    },
  ];

  const completedValidations = [
    {
      id: 5,
      type: 'Supervisor Assignment',
      subject: 'Programming Fundamentals',
      details: 'Dr. Johnson assigned to PRG101 Final',
      date: '2024-03-19',
      validatedDate: '2024-03-19',
      status: 'Approved',
      priority: 'Medium',
    },
    {
      id: 6,
      type: 'Student List',
      subject: 'Computer Networks',
      details: '32 students registered for NET202',
      date: '2024-03-18',
      validatedDate: '2024-03-19',
      status: 'Approved',
      priority: 'Medium',
    },
    {
      id: 7,
      type: 'Room Assignment',
      subject: 'Artificial Intelligence',
      details: 'Main Hall assigned for AI440 final exam',
      date: '2024-03-17',
      validatedDate: '2024-03-18',
      status: 'Rejected',
      priority: 'High',
      reason: 'Capacity too small for enrolled students'
    },
  ];

  const filteredValidations = activeTab === 'pending' 
    ? pendingValidations.filter(item => 
        (!selectedPriority || item.priority === selectedPriority) &&
        (!selectedType || item.type === selectedType)
      )
    : completedValidations.filter(item => 
        (!selectedPriority || item.priority === selectedPriority) &&
        (!selectedType || item.type === selectedType)
      );

  const validationTypes = [...new Set([...pendingValidations, ...completedValidations].map(item => item.type))];
  const priorityLevels = ["High", "Medium", "Low"];

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Validations</h1>
        <button 
          onClick={() => setFilterOpen(!filterOpen)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filter Options
        </button>
      </div>

      {/* Filter Panel */}
      {filterOpen && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 transition-all">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Filter by Type</h3>
              <div className="space-y-2">
                <div>
                  <button
                    onClick={() => setSelectedType(null)}
                    className={`px-3 py-1 rounded-md ${selectedType === null ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    All Types
                  </button>
                </div>
                {validationTypes.map(type => (
                  <div key={type}>
                    <button
                      onClick={() => setSelectedType(type)}
                      className={`px-3 py-1 rounded-md ${selectedType === type ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                    >
                      {type}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Filter by Priority</h3>
              <div className="space-y-2">
                <div>
                  <button
                    onClick={() => setSelectedPriority(null)}
                    className={`px-3 py-1 rounded-md ${selectedPriority === null ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    All Priorities
                  </button>
                </div>
                {priorityLevels.map(priority => (
                  <div key={priority}>
                    <button
                      onClick={() => setSelectedPriority(priority)}
                      className={`px-3 py-1 rounded-md ${selectedPriority === priority ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                    >
                      {priority}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Validation Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
              onClick={() => setActiveTab('completed')}
              className={`px-3 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'completed'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Completed Validations
            </button>
          </nav>
        </div>

        {/* Validation List */}
        <div className="p-4">
          {filteredValidations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No validations found with the selected filters.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredValidations.map((item) => (
                <div key={item.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          item.priority === 'High' 
                            ? 'bg-red-100 text-red-800' 
                            : item.priority === 'Medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                        }`}>
                          {item.priority}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">{item.date}</span>
                        {activeTab === 'completed' && (
                          <span className={`ml-2 flex items-center text-xs px-2 py-1 rounded-full ${
                            item.status === 'Approved' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.status === 'Approved' ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : (
                              <AlertTriangle className="w-3 h-3 mr-1" />
                            )}
                            {item.status}
                          </span>
                        )}
                      </div>
                      <h3 className="mt-2 text-lg font-semibold text-gray-900">{item.type}</h3>
                      <p className="text-sm text-gray-600">{item.subject}</p>
                      <p className="mt-1 text-sm text-gray-500">{item.details}</p>
                      {activeTab === 'completed' && item.status === 'Rejected' && (
                        <p className="mt-2 text-sm text-red-600">Reason: {item.reason}</p>
                      )}
                      {activeTab === 'completed' && (
                        <p className="mt-2 text-xs text-gray-500">
                          Validated on: {item.validatedDate}
                        </p>
                      )}
                    </div>
                    {activeTab === 'pending' && (
                      <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
                          Validate
                        </button>
                        <button className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ValidationsPage;