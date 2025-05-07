import React, { useState, useEffect } from 'react';
import { Plus,FileText, GraduationCap, Calendar,Users,Menu,Bell, AlertCircle, X, Bookmark, Check,MapPin, Home,BookOpen,Sidebar ,Settings,ClipboardList,User } from 'lucide-react';
import { ExamTable } from '../components/ExamTable';
import { ExamForm } from '../components/ExamForm';
import { useNavigate } from 'react-router-dom';
import axios from "axios";


function AddExam() {
  const [exams, setExams] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExam, setEditingExam] = useState(undefined);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [notification, setNotification] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    published: 0,
    completed: 0
  });
  
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const token = localStorage.getItem("token"); // ✅ Retrieve token
  
        if (!token) {
          console.error("No token found in localStorage");
          return; // Stop execution if token is missing
        }
    
        const response = await axios.get("http://localhost:8000/api/exams", {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Pass token in headers
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
    
        if (Array.isArray(response.data)) {
          // ✅ Add `duration` (in minutes) & `status: "DRAFT"` to each exam
          const examsWithExtraFields = response.data.map(exam => ({
            ...exam,
            id: exam.examId,
            duration: calculateDuration(exam.startTime,exam.endTime), // Convert ms to minutes
            status: "draft", // Default status
            department:exam.departmentName,
            date:exam.examDate,
            start_time: removeSeconds(exam.startTime),
          }));

          setExams(examsWithExtraFields);
          } else {
          console.error("Expected an array but got:", response.data);
        }
      } catch (error) {
        console.error("Failed to fetch exams:", error.response ? error.response.data : error);
      }
    };

    fetchExams();
  }, []);

  const removeExam = async (examId) => {
    try {
      const token = localStorage.getItem("token"); // ✅ Retrieve token
  
      if (!token) {
        console.error("No token found in localStorage");
        return; // Stop execution if token is missing
      }
  
      const response = await axios.delete(`http://localhost:8000/api/exams/${examId}`, { // ✅ Fixed URL
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Pass token in headers
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
    } catch (error) {
      console.error("Error deleting exam:", error.response ? error.response.data : error);
    }
    setExams(prev => prev.filter(exam => exam.id !== examId));
    showNotification('Exam deleted successfully!', 'warning');
  };
  const sidebarItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard/admin/'},
    { icon: BookOpen, label: 'Exams', path: '/dashboard/admin/exams' , active: true },
    { icon: Calendar, label: 'Schedule', path: '/dashboard/admin/schedule' },
    { icon: Users, label: 'Supervisors', path: '/dashboard/admin/supervisors' },
    { icon: MapPin, label: 'Rooms', path: '/dashboard/admin/rooms' },
    { icon: FileText, label: 'Reports', path: '/reports' },
    { icon: ClipboardList, label: 'Validations', path: '/validations' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];



  const removeSeconds = (time) => time ? time.slice(0, 5) : ""; 
  // Update stats when exams change
  useEffect(() => {
    const newStats = {
      total: exams.length,
      draft: exams.filter(exam => exam.status === 'draft').length,
      published: exams.filter(exam => exam.status === 'published').length,
      completed: exams.filter(exam => exam.status === 'completed').length
    };
    setStats(newStats);
  }, [exams]);

  // Show notification and auto-dismiss after 3 seconds
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };
  const handleAddExam = (examData) => {
    const newExam = {
      ...examData,
      id: crypto.randomUUID()
    };
    setExams(prev => [...prev, newExam]);
    setIsFormOpen(false);
    showNotification('Exam added successfully!');
  };

// Function to calculate duration
const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return 0; // Return 0 if either time is missing

  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);

  const diffMinutes = Math.floor((end - start) / (1000 * 60)); // Convert ms to minutes

  return diffMinutes >= 0 ? diffMinutes : 0; // Ensure non-negative duration
};

  const handleEditExam = (examData) => {
    if (!editingExam) return;
    setExams(prev =>
      prev.map(exam =>
        exam.id === editingExam.id ? { ...examData, id: exam.id } : exam
      )
    );
    setEditingExam(undefined);
    setIsFormOpen(false);
    showNotification('Exam updated successfully!');
  };

  const handleDuplicateExam = (exam) => {
    const duplicatedExam = {
      ...exam,
      id: crypto.randomUUID(),
      subject: `${exam.subject} (Copy)`,
      status: 'draft'
    };
    setExams(prev => [...prev, duplicatedExam]);
    showNotification('Exam duplicated successfully!');
  };

  const handleDeleteExam = (examId) => {
      removeExam(examId);
  };

  // Add drag and drop functionality
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    // Process dropped file (e.g., CSV or Excel import)
    const file = e.dataTransfer.files[0];
    if (file) {
      // Simulate file processing (in a real app, you'd parse the file)
      setTimeout(() => {
        showNotification(`File "${file.name}" received. Processing...`);
        // In a real implementation, you would parse the file and add exams
      }, 500);
    }
  };

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

      {/* Notification toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center px-4 py-3 rounded-lg shadow-lg transition-all duration-300 ${
          notification.type === 'success' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' : 
          notification.type === 'warning' ? 'bg-amber-100 text-amber-800 border-l-4 border-amber-500' : 
          'bg-blue-100 text-blue-800 border-l-4 border-blue-500'
        }`}>
          {notification.type === 'success' ? <Check className="h-5 w-5 mr-2" /> : 
           notification.type === 'warning' ? <AlertCircle className="h-5 w-5 mr-2" /> : 
           <BookOpen className="h-5 w-5 mr-2" />}
          <p>{notification.message}</p>
          <button 
            onClick={() => setNotification(null)}
            className="ml-4 text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-md">
          <div className="px-4 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-md lg:hidden hover:bg-gray-100">
                  <Menu className="w-6 h-6 text-gray-600" />
                </button>
                  <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center mr-4">
                    <FileText className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">Exam Management</h1>
                    <p className="text-muted-foreground">Create and manage you examination schedule</p>
                  </div>
              </div>
              <div className="flex items-center space-x-4">
                <button onClick={() => showNotification(!showNotification)} className="p-2 rounded-full hover:bg-gray-100">
                  <Bell className="h-6 w-6 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-gray-100 px-4 py-6">

        {/* Stats cards */}
        {exams.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-5 border-l-4 border-indigo-500">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-indigo-100 mr-4">
                  <BookOpen className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Exams</p>
                  <p className="text-xl font-semibold">{stats.total}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-5 border-l-4 border-amber-500">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-amber-100 mr-4">
                  <Bookmark className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Draft</p>
                  <p className="text-xl font-semibold">{stats.draft}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-5 border-l-4 border-green-500">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 mr-4">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Published</p>
                  <p className="text-xl font-semibold">{stats.published}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-5 border-l-4 border-blue-500">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 mr-4">
                  <Check className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Completed</p>
                  <p className="text-xl font-semibold">{stats.completed}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form section */}
        {isFormOpen && (
          <div className="mb-8">
              <ExamForm
                exam={editingExam}
                onSubmit={editingExam ? handleEditExam : handleAddExam}
                onCancel={() => {
                  setIsFormOpen(false);
                  setEditingExam(undefined);
                }}
              />
          </div>
        )}

        {/* Drop area and table section */}
        {exams.length > 0 ? (
          <div 
            className={`bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 ${
              isDragging ? 'ring-2 ring-indigo-500 ring-opacity-50' : ''
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {isDragging && (
              <div className="absolute inset-0 bg-indigo-500 bg-opacity-10 flex items-center justify-center z-10 pointer-events-none">
                <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                  <Plus className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
                  <p className="text-lg font-medium">Drop file to import exams</p>
                  <p className="text-sm text-gray-500">Supports CSV and Excel formats</p>
                </div>
              </div>
            )}
            
            <ExamTable
              exams={exams}
              onEdit={(exam) => {
                setEditingExam(exam);
                setIsFormOpen(true);
              }}
              onDuplicate={handleDuplicateExam}
              onDelete={handleDeleteExam}
              onCreateNew={() => {
                setEditingExam(undefined);
                setIsFormOpen(true);
              }}
            />
          </div>
        ) : (
          <div 
            className={`relative text-center py-16 bg-white shadow-lg rounded-xl transition-all duration-300 ${
              isDragging ? 'ring-2 ring-indigo-500 border-2 border-dashed border-indigo-300' : ''
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {isDragging ? (
              <div className="absolute inset-0 bg-indigo-50 flex items-center justify-center rounded-xl">
                <div className="text-center">
                  <Plus className="h-16 w-16 text-indigo-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-indigo-600 mb-2">Drop to Import</h3>
                  <p className="text-gray-500">Release to upload your exam data file</p>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-indigo-100 h-20 w-20 flex items-center justify-center rounded-full mx-auto mb-6">
                  <GraduationCap className="h-12 w-12 text-indigo-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">No Exams Available</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Get started by creating your first exam or drag and drop a file to import multiple exams at once.
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => {
                      setEditingExam(undefined);
                      setIsFormOpen(true);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-105"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    <span>Create Exam</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
              </main>
      </div>
    </div>
  );
}

export default AddExam;