
import React, { useState, useEffect } from 'react';
import {
    Users,
    Search,
    Plus,
    Mail,
    Phone,
    MapPin,
    Bell,
    Menu,
    X,
    Home,
    Calendar,
    User,
    BookOpen,
    Settings,
    FileText,
    ClipboardList
  } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode"; // Import jwt-decode

function Students() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    section: ''
  });
  const [modifyStudent, setModifyStudent] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    department: '',
    section: '',
    originalEmail: '',
    verifyPassword: ''
  });
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  // Function to fetch students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
  
      // Set up config with Authorization header
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
  
      // Fetch departments with token
      const deptResponse = await axios.get("http://localhost:8000/api/department", config);
      if (Array.isArray(deptResponse.data)) {
        setDepartments(deptResponse.data);
      } else {
        console.error("Expected departments array but got:", deptResponse.data);
        setDepartments([]);
      }
  
      // Fetch students using token
      const studentsResponse = await axios.get("http://localhost:8000/api/users/students", config);
      if (Array.isArray(studentsResponse.data)) {
        const formattedStudents = studentsResponse.data.map(student => ({
          id: student.userId,
          name: student.name,
          department: student.department,
          email: student.email,
          role: student.role,
          phone: student.phone || '+1 (555) 000-0000',
          enrollmentYear: student.enrollmentYear || 'Not specified',
          availability: student.isActive ? 'Active' : 'Inactive',
          currentSemester: student.currentSemester || 'Not specified',
          gpa: student.gpa || 'N/A',
          image: 'https://images.pexels.com/photos/3755755/pexels-photo-3755755.jpeg?auto=compress&cs=tinysrgb&w=150',
          section: student.section || 'Not specified'
        }));
        setStudents(formattedStudents);
      } else {
        console.error("Expected students array but got:", studentsResponse.data);
        setError("Failed to load students data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error loading data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { name, email, password, department } = newStudent;
    const confirmPassword = password; // Add a field if you want confirmation input
  
    if (!password || password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
  
    try {
      await axios.post("http://localhost:8000/api/auth/register", {
        name,
        email,
        password,
        role: "ETUDIANT", // Matching the role format for students
        department,
        section: newStudent.section,
      });
  
      alert("Student created successfully!");
      setShowAddModal(false);
      
      // Refresh the students list
      fetchStudents();
    } catch (error) {
      alert("Registration failed. Try again.");
      console.error("Error:", error.response?.data || error.message);
    }
  }; 

  // Filter students based on search term
  const filteredStudents = students.filter(
    student =>
      (student.name && student.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.department && student.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.section && student.section.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard/admin/' },
    { icon: BookOpen, label: 'Exams', path: '/dashboard/admin/exams' },
    { icon: Calendar, label: 'Schedule', path: '/dashboard/admin/schedule' },
    { icon: Users, label: 'Supervisors', path: '/dashboard/admin/supervisors' },
    { icon: Users, label: 'Students', path: '/dashboard/admin/students', active: true  },
    { icon: MapPin, label: 'Rooms', path: '/dashboard/admin/rooms'},
    { icon: FileText, label: 'Reports', path: '/reports' },
    { icon: ClipboardList, label: 'Validations', path: '/validations' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  
  const handleModifyStudent = (student) => {
    setModifyStudent({
      id: student.id,
      name: student.name,
      email: student.email,
      password: '',
      department: student.department,
      section: student.section || '',
      originalEmail: student.email,
      verifyPassword: ''
    });
    setShowModifyModal(true);
  };
  
  const handleModifySubmit = async (e) => {
    e.preventDefault();
  
    if (!modifyStudent.verifyPassword) {
      alert('Please enter your current password to verify');
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
  
      // Verify credentials
      const verifyResponse = await axios.post(
        'http://localhost:8000/api/auth/verify',
        {
          email: modifyStudent.originalEmail,
          password: modifyStudent.verifyPassword
        },
        config
      );
  
      // If verification passes, update the student
      const updateResponse = await axios.put(
        `http://localhost:8000/api/users/${modifyStudent.id}`,
        {
          userId: modifyStudent.id,
          name: modifyStudent.name,
          email: modifyStudent.email,
          role: "ETUDIANT",
          department: modifyStudent.department,
          section: modifyStudent.section,
          ...(modifyStudent.password && { password: modifyStudent.password })
        },
        config
      );
  
      alert('Student information updated successfully!');
      setShowModifyModal(false);
      fetchStudents();
  
    } catch (error) {
      console.error('Error updating student:', error);
      if (error.response?.status === 401) {
        alert('Password verification failed. Please check your password and try again.');
      } else {
        alert('Failed to update student information. Please try again.');
      }
    }
  };
  

  return (
<div className="flex h-screen bg-gray-50">
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
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-md lg:hidden hover:bg-gray-100">
                  <Menu className="w-6 h-6 text-gray-600" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900 ml-4">Students</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button onClick={() => setShowNotification(!showNotification)} className="p-2 rounded-full hover:bg-gray-100 relative">
                  <Bell className="h-6 w-6 text-gray-600" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 px-6 py-6">
          <div className="max-w-7xl mx-auto">
            {/* Search and Add Section */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <div className="relative w-full md:w-96">
                <input
                  type="text"
                  placeholder="Search students..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <div className="flex flex-col md:flex-row gap-2">
                <button onClick={() => setShowAddModal(true)} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                  <Plus className="h-5 w-5 mr-2" />
                  Add Student
                </button>
              </div>
            </div>

            {/* Loading and Error States */}
            {loading && (
              <div className="flex justify-center items-center h-64">
                <div className="text-lg text-gray-600">Loading students...</div>
              </div>
            )}
            
            {error && !loading && (
              <div className="bg-red-50 p-4 rounded-lg shadow-sm">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Students Grid */}
            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <div key={student.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 border border-gray-100">
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <img
                            src={student.image}
                            alt={student.name}
                            className="h-16 w-16 rounded-full object-cover ring-2 ring-blue-100"
                          />
                          <div className="ml-4">
                            <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
                            <p className="text-sm text-blue-600 font-medium">{student.department}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center text-gray-600">
                            <Mail className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="text-sm">{student.email}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Phone className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="text-sm">{student.phone}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <BookOpen className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="text-sm">Department: {student.currentSemester}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Users className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="text-sm">Section: {student.section}</span>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${student.availability === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {student.availability}
                          </span>
                          <span className="text-sm font-medium text-gray-700">
                            GPA: {student.gpa}
                          </span>
                        </div>
                      </div>
                      <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex space-x-2">
                        <button className="w-1/2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                          View Grades
                        </button>
                        <button 
                          onClick={() => handleModifyStudent(student)}
                          className="w-1/2 text-green-600 hover:text-green-800 text-sm font-medium transition-colors"
                        >
                          Modify
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm">
                    <Users className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-4 text-gray-500">No students found matching your search criteria.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add Student Modal - With blurred background */}
      {showAddModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-gray-800/30 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-xl transform transition-all duration-300 scale-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Student</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  id="department"
                  value={newStudent.department}
                  onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.departmentId} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={newStudent.password}
                  onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="section" className="block text-sm font-medium text-gray-700 mb-2">
                  Section
                </label>
                <select
                  id="section"
                  value={newStudent.section}
                  onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                >
                  <option value="" disabled>Select a section</option>
                  <option value="CPI1">CPI1</option>
                  <option value="CPI2">CPI2</option>
                  <option value="ING INFO 1">ING INFO 1</option>
                  <option value="ING INFO 2">ING INFO 2</option>
                  <option value="ING INFO 3">ING INFO 3</option>
                  <option value="L1 INFO">L1 INFO</option>
                  <option value="L2 INFO">L2 INFO</option>
                  <option value="L3 INFO">L3 INFO</option>
                  <option value="L1 MATH">L1 MATH</option>
                  <option value="L2 MATH">L2 MATH</option>
                  <option value="L3 MATH">L3 MATH</option>
                  <option value="L1 TIC">L1 TIC</option>
                  <option value="L2 TIC">L2 TIC</option>
                  <option value="L3 TIC">L3 TIC</option>
                  <option value="L1 EEA">L1 EEA</option>
                  <option value="L2 EEA">L2 EEA</option>
                  <option value="L3 EEA">L3 EEA</option>
                  <option value="ING ELEC 1">ING ELEC 1</option>
                  <option value="ING ELEC 2">ING ELEC 2</option>
                  <option value="ING ELEC 3">ING ELEC 3</option>
                </select>
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification Panel */}
      {showNotification && (
        <div className="fixed right-0 top-16 w-80 bg-white shadow-lg rounded-l-lg p-4 transform transition-transform z-40">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <button onClick={() => setShowNotification(false)} className="text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-start p-3 bg-blue-50 rounded-lg">
              <div className="ml-2">
                <p className="text-sm font-medium text-blue-800">New student registered</p>
                <p className="text-xs text-blue-600">5 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start p-3 bg-gray-50 rounded-lg">
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-800">System update completed</p>
                <p className="text-xs text-gray-600">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Modify Student Modal - With blurred background */}
      {showModifyModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-gray-800/30 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl max-h-screen">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Modify Student Account</h2>
              <button onClick={() => setShowModifyModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="overflow-y-auto max-h-96 pr-2 custom-scrollbar">
              <form onSubmit={handleModifySubmit} className="space-y-4">
                {/* Verification Section */}
                <div className="p-4 bg-yellow-50 rounded-lg mb-4 border border-yellow-200">
                  <h3 className="text-sm font-semibold text-yellow-800 mb-1">Account Verification</h3>
                  <p className="text-xs text-yellow-700 mb-3">Please enter your current password to verify your identity</p>
                  <div className="mb-3">
                    <label htmlFor="originalEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      Current Email
                    </label>
                    <input
                      type="email"
                      id="originalEmail"
                      value={modifyStudent.originalEmail}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-lg"
                    />
                  </div>
                  <div>
                    <label htmlFor="verifyPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="verifyPassword"
                      value={modifyStudent.verifyPassword}
                      onChange={(e) => setModifyStudent({ ...modifyStudent, verifyPassword: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                      required
                    />
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">New Information</h3>
                </div>
                
                <div>
                  <label htmlFor="modify-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="modify-name"
                    value={modifyStudent.name}
                    onChange={(e) => setModifyStudent({ ...modifyStudent, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="modify-email" className="block text-sm font-medium text-gray-700 mb-1">
                    New Email
                  </label>
                  <input
                    type="email"
                    id="modify-email"
                    value={modifyStudent.email}
                    onChange={(e) => setModifyStudent({ ...modifyStudent, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="modify-department" className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <select
                    id="modify-department"
                    value={modifyStudent.department}
                    onChange={(e) => setModifyStudent({ ...modifyStudent, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept.departmentId} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="modify-password" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="modify-password"
                    value={modifyStudent.password}
                    onChange={(e) => setModifyStudent({ ...modifyStudent, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    placeholder="Leave blank to keep current password"
                  />
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                  <button type="button" onClick={() => setShowModifyModal(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm">
                    Update Student
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Students;