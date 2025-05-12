import { useState } from "react";
import { Search, Download, Upload, Filter, User, Users } from 'lucide-react';

function StudentsPage({ userData }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const students = [
    {
      id: 1,
      name: 'Emma Thompson',
      studentId: 'ST12345',
      year: 3,
      program: 'Computer Science',
      semester: 'Spring 2024',
      courses: ['Database Systems', 'Algorithms', 'Computer Networks'],
      status: 'Active',
      gpa: 3.8,
      email: 'emma.t@university.edu'
    },
    {
      id: 2,
      name: 'James Wilson',
      studentId: 'ST23456',
      year: 2,
      program: 'Information Technology',
      semester: 'Spring 2024',
      courses: ['Web Development', 'Operating Systems', 'Data Structures'],
      status: 'Active',
      gpa: 3.5,
      email: 'james.w@university.edu'
    },
    {
      id: 3,
      name: 'Sophia Chen',
      studentId: 'ST34567',
      year: 4,
      program: 'Computer Science',
      semester: 'Spring 2024',
      courses: ['Artificial Intelligence', 'Software Engineering', 'Database Systems'],
      status: 'Active',
      gpa: 4.0,
      email: 'sophia.c@university.edu'
    },
    {
      id: 4,
      name: 'Michael Rodriguez',
      studentId: 'ST45678',
      year: 1,
      program: 'Data Science',
      semester: 'Spring 2024',
      courses: ['Programming Fundamentals', 'Calculus', 'Statistics'],
      status: 'Active',
      gpa: 3.2,
      email: 'michael.r@university.edu'
    },
    {
      id: 5,
      name: 'Olivia Kim',
      studentId: 'ST56789',
      year: 3,
      program: 'Information Technology',
      semester: 'Spring 2024',
      courses: ['Database Systems', 'Web Development', 'System Analysis'],
      status: 'On leave',
      gpa: 3.7,
      email: 'olivia.k@university.edu'
    },
    {
      id: 6,
      name: 'William Johnson',
      studentId: 'ST67890',
      year: 2,
      program: 'Computer Science',
      semester: 'Spring 2024',
      courses: ['Data Structures', 'Computer Architecture', 'Discrete Math'],
      status: 'Active',
      gpa: 3.4,
      email: 'william.j@university.edu'
    },
    {
      id: 7,
      name: 'Ava Martinez',
      studentId: 'ST78901',
      year: 4,
      program: 'Data Science',
      semester: 'Spring 2024',
      courses: ['Machine Learning', 'Data Visualization', 'Big Data Analytics'],
      status: 'Probation',
      gpa: 2.8,
      email: 'ava.m@university.edu'
    },
    {
      id: 8,
      name: 'Noah Garcia',
      studentId: 'ST89012',
      year: 1,
      program: 'Information Technology',
      semester: 'Spring 2024',
      courses: ['Introduction to IT', 'Programming Fundamentals', 'Digital Logic'],
      status: 'Active',
      gpa: 3.1,
      email: 'noah.g@university.edu'
    }
  ];

  const programs = [...new Set(students.map(student => student.program))];
  const years = [...new Set(students.map(student => student.year))];
  const statuses = [...new Set(students.map(student => student.status))];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProgram = selectedProgram ? student.program === selectedProgram : true;
    const matchesYear = selectedYear ? student.year === selectedYear : true;
    const matchesStatus = selectedStatus ? student.status === selectedStatus : true;
    
    return matchesSearch && matchesProgram && matchesYear && matchesStatus;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'On leave':
        return 'bg-blue-100 text-blue-800';
      case 'Probation':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Students</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="px-3 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors flex items-center"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            <button className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </button>
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {filterOpen && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 transition-all">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Program</h3>
              <div className="space-y-2">
                <div>
                  <button
                    onClick={() => setSelectedProgram(null)}
                    className={`px-3 py-1 rounded-md ${!selectedProgram ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    All Programs
                  </button>
                </div>
                {programs.map(program => (
                  <div key={program}>
                    <button
                      onClick={() => setSelectedProgram(program)}
                      className={`px-3 py-1 rounded-md ${selectedProgram === program ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                    >
                      {program}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Year</h3>
              <div className="space-y-2">
                <div>
                  <button
                    onClick={() => setSelectedYear(null)}
                    className={`px-3 py-1 rounded-md ${!selectedYear ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    All Years
                  </button>
                </div>
                {years.map(year => (
                  <div key={year}>
                    <button
                      onClick={() => setSelectedYear(year)}
                      className={`px-3 py-1 rounded-md ${selectedYear === year ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                    >
                      Year {year}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Status</h3>
              <div className="space-y-2">
                <div>
                  <button
                    onClick={() => setSelectedStatus(null)}
                    className={`px-3 py-1 rounded-md ${!selectedStatus ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    All Statuses
                  </button>
                </div>
                {statuses.map(status => (
                  <div key={status}>
                    <button
                      onClick={() => setSelectedStatus(status)}
                      className={`px-3 py-1 rounded-md ${selectedStatus === status ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                    >
                      {status}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-blue-100 mr-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-2xl font-bold">{students.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-green-100 mr-4">
              <User className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Students</p>
              <p className="text-2xl font-bold">{students.filter(s => s.status === 'Active').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-yellow-100 mr-4">
              <User className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Probation</p>
              <p className="text-2xl font-bold">{students.filter(s => s.status === 'Probation').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center">
            <div className="rounded-full p-3 bg-blue-100 mr-4">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">On Leave</p>
              <p className="text-2xl font-bold">{students.filter(s => s.status === 'On leave').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Program & Year
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Courses
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GPA
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.studentId}</div>
                        <div className="text-sm text-gray-400">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.program}</div>
                    <div className="text-sm text-gray-500">Year {student.year}</div>
                    <div className="text-sm text-gray-400">{student.semester}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <ul className="list-disc pl-5">
                        {student.courses.map((course, idx) => (
                          <li key={idx} className="text-sm text-gray-600">{course}</li>
                        ))}
                      </ul>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(student.status)}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`font-medium ${
                      student.gpa >= 3.5 ? 'text-green-600' : 
                      student.gpa >= 3.0 ? 'text-blue-600' : 
                      student.gpa >= 2.5 ? 'text-yellow-600' : 
                      'text-red-600'
                    }`}>
                      {student.gpa.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                    <button className="text-gray-600 hover:text-gray-900">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default StudentsPage;