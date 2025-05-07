import { useState, useEffect } from "react";
import { 
  Calendar, 
  ClipboardList, 
  X, 
  User, 
  Settings, 
  Menu, 
  Bell, 
  Search, 
  Filter,
  ChevronLeft, 
  ChevronRight,
  Clock,
  MapPin,
  FileText,
  CheckCircle,
  AlertCircle,
  Home,
  BookOpen,
  Users,
} from "lucide-react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Component for the improved exam admin interface
const ExamAdminInterface = () => {
  // State management
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showExamDetails, setShowExamDetails] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [examRoom,setExamRoom] = useState(null);
  const [room, setRoom] = useState(null);
  const [showSelectedRoom, setShowSelectedRoom] = useState(false);
  const possibleTypes = ['quiz', 'midterm', 'final', 'project'];

 
  const sidebarItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard/admin/'},
    { icon: BookOpen, label: 'Exams', path: '/dashboard/admin/exams'  },
    { icon: Calendar, label: 'Schedule', path: '/dashboard/admin/schedule', active: true },
    { icon: Users, label: 'Supervisors', path: '/dashboard/admin/supervisors' },
    { icon: MapPin, label: 'Rooms', path: '/dashboard/admin/rooms' },
    { icon: FileText, label: 'Reports', path: '/reports' },
    { icon: ClipboardList, label: 'Validations', path: '/validations' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];


  useEffect(() => {
    const fetchAssignedRooms = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in localStorage");
          return;
        }
  
        const response = await axios.get("http://localhost:8000/api/exam-rooms", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
  
        if (Array.isArray(response.data)) {
          const assignments = response.data.map((item) => ({
            examId: item.exam.examId,
            roomId: item.room.roomId,
            roomName: item.room?.roomName || "Unknown",
            examSubject: item.exam?.subject || "Unknown",
          }));
  
          setExamRoom(assignments); // or use setAssignedRooms(assignments) for clarity
        } else {
          console.error("Expected an array but got:", response.data);
        }
      } catch (error) {
        console.error("Failed to fetch exam-room assignments:", error.response ? error.response.data : error);
      }
    };
  
    fetchAssignedRooms();
  }, []);  

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem("token"); // ✅ Retrieve token

        if (!token) {
          console.error("No token found in localStorage");
          return; // Stop execution if token is missing
        }

        const response = await axios.get("http://localhost:8000/api/rooms/available", {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Pass token in headers
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        if (Array.isArray(response.data)) {
          // ✅ Add `duration` (in minutes) & `status: "DRAFT"` to each exam
          const roomsWithExtraFields = response.data.map((room) => ({
            ...room,
            id: room.roomId,
            Name: room.roomName,
            capacity: room.capacity, // Default status
            location: room.location,
          }));

          setRooms(roomsWithExtraFields);
        } else {
          console.error("Expected an array but got:", response.data);
        }
      } catch (error) {
        console.error(
          "Failed to fetch exams:",
          error.response ? error.response.data : error
        );
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
  
        if (!token) {
          setError("No authentication token found. Please log in again.");
          setLoading(false);
          return;
        }
  
        // Step 1: Fetch assigned room info
        const assignedRes = await axios.get("http://localhost:8000/api/exam-rooms", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
  
        const assignedRooms = Array.isArray(assignedRes.data) ? assignedRes.data : [];
  
        // Step 2: Fetch exams
        const examRes = await axios.get("http://localhost:8000/api/exams", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });
  
        if (Array.isArray(examRes.data)) {
          const processedExams = examRes.data.map((exam) => {
            const examDate = exam.examDate ? new Date(exam.examDate) : new Date();
  
            // Step 3: Match examId to assigned room
            const matchedRoom = assignedRooms.find(
              (entry) => entry.exam.examId === exam.examId
            );
  
            return {
              id: exam.examId,
              title: exam.subject,
              date: examDate,
              startTime: removeSeconds(exam.startTime),
              endTime: removeSeconds(exam.endTime),
              room: matchedRoom?.room?.roomName || "Not assigned",
              location: matchedRoom?.room?.location || "No location", // ✅ Add location
              type: possibleTypes[Math.floor(Math.random() * possibleTypes.length)],
              subject: exam.departmentName,
              students: exam.enrolledStudents || 20,
              status: exam.status?.toLowerCase() || "draft",
              department: exam.departmentName,
              duration: calculateDuration(exam.startTime, exam.endTime),
              courseCode: exam.courseCode,
              rawData: exam,
            };
          });
  
          setExams(processedExams);
          setLoading(false);
        } else {
          setError("Received unexpected data format from server");
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch exams:", error.response?.data || error);
        setError("Failed to load exams. Please try again later.");
        setLoading(false);
      }
    };
  
    fetchExams();
  }, []);
  

  const removeSeconds = (time) => time ? time.slice(0, 5) : "";
  
  // Function to calculate duration
  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;

    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);

    const diffMinutes = Math.floor((end - start) / (1000 * 60));
    return diffMinutes >= 0 ? diffMinutes : 0;
  };
  
  // Filters state
  const [filters, setFilters] = useState({
    types: {
      quiz: true,
      midterm: true,
      final: true,
      project: true
    },
    subjects: {} // Will populate from actual exam data
  });
  
  // Update filters based on actual exam data
  useEffect(() => {
    if (exams.length > 0) {
      // Extract unique types and subjects
      const uniqueTypes = {};
      const uniqueSubjects = {};
      
      exams.forEach(exam => {
        if (exam.type) uniqueTypes[exam.type.toLowerCase()] = true;
        if (exam.subject) uniqueSubjects[exam.subject.toLowerCase()] = true;
      });
      
      setFilters(prev => ({
        types: { ...prev.types, ...uniqueTypes },
        subjects: { ...prev.subjects, ...uniqueSubjects }
      }));
    }
  }, [exams]);
  
  const typeColors = {
    quiz: 'bg-purple-700/50',
    midterm: 'bg-blue-700/50',
    final: 'bg-red-700/50',
    project: 'bg-indigo-700/50',
    default: 'bg-gray-700/50',
  };
  
  // Status color mapping
  const statusColors = {
    validated: 'bg-green-500',
    pending: 'bg-yellow-500',
    draft: 'bg-yellow-500',
  };
  
  const goToPreviousPeriod = () => {
    const newDate = new Date(currentDate);
    if (currentView === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (currentView === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };
  
  const goToNextPeriod = () => {
    const newDate = new Date(currentDate);
    if (currentView === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (currentView === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Helper functions
  const formatDate = (date) => {
    if (!(date instanceof Date)) return "Invalid date";
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  // Filter toggle functions
  const toggleTypeFilter = (type) => {
    setFilters({
      ...filters,
      types: {
        ...filters.types,
        [type]: !filters.types[type]
      }
    });
  };
  
  const toggleSubjectFilter = (subject) => {
    setFilters({
      ...filters,
      subjects: {
        ...filters.subjects,
        [subject]: !filters.subjects[subject]
      }
    });
  };
  
  // Function to filter exams based on filters and search term
  const filterExams = (examList) => {
    return examList.filter(exam => {
      // Check if exam type is in filters
      const typeMatch = exam.type && filters.types[exam.type.toLowerCase()];
      
      // Check if exam subject is in filters
      const subjectMatch = exam.subject && filters.subjects[exam.subject.toLowerCase()];
      
      // Check if exam title matches search term
      const searchMatch = !searchTerm || 
        (exam.title && exam.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (exam.courseCode && exam.courseCode.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return typeMatch !== false && subjectMatch !== false && searchMatch;
    });
  };
  
  // Get color for exam type
  const getTypeColor = (type) => {
    if (!type) return typeColors.default;
    return typeColors[type.toLowerCase()] || typeColors.default;
  };
  
  // Get color for exam status
  const getStatusColor = (status) => {
    if (!status) return statusColors.default;
    return statusColors[status.toLowerCase()] || statusColors.default;
  };
  
  // Placeholder for month view
  const renderMonthView = () => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    const endDate = new Date(monthEnd);
    if (endDate.getDay() !== 6) {
      endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    }
    
    const weeks = [];
    let days = [];
    const day = new Date(startDate);
    
    // Days of the week
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = new Date(day);
        days.push(cloneDay);
        day.setDate(day.getDate() + 1);
      }
      weeks.push(days);
      days = [];
    }
    
    // Filter exams
    const filteredExams = filterExams(exams);
    
    // Assign exams to days
    const daysWithExams = {};
    filteredExams.forEach(exam => {
      if (exam.date) {
        const dateStr = exam.date.toDateString();
        if (!daysWithExams[dateStr]) {
          daysWithExams[dateStr] = [];
        }
        daysWithExams[dateStr].push(exam);
      }
    });
    
    if (loading) {
      return <div className="p-8 text-center text-gray-500">Loading exams...</div>;
    }
    
    if (error) {
      return <div className="p-8 text-center text-red-500">{error}</div>;
    }
    
    return (
      <div className="min-w-full">
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b">
          {weekDays.map((day, i) => (
            <div key={i} className="py-2 font-medium text-center text-sm text-gray-600 border-r last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div>
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 min-h-24 border-b last:border-b-0">
              {week.map((day, dayIndex) => {
                const dateStr = day.toDateString();
                const dayExams = daysWithExams[dateStr] || [];
                const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                const isToday = day.toDateString() === new Date().toDateString();
                
                return (
                  <div 
                    key={dayIndex} 
                    className={`min-h-24 p-1 border-r last:border-r-0 ${
                      isCurrentMonth ? "bg-white" : "bg-gray-50"
                    } ${isToday ? "ring-2 ring-blue-200 ring-inset" : ""}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center ${
                        isToday ? "bg-blue-500 text-white" : ""
                      }`}>
                        {day.getDate()}
                      </span>
                      {dayExams.length > 0 && (
                        <span className="text-xs font-medium text-gray-500">{dayExams.length} exam{dayExams.length > 1 ? 's' : ''}</span>
                      )}
                    </div>
                    
                    <div className="space-y-1 overflow-y-auto max-h-20">
                      {dayExams.slice(0, 2).map((exam, i) => (
                        <div 
                          key={i} 
                          onClick={() => {
                            setSelectedExam(exam);
                            setShowExamDetails(true);
                          }}
                          className={`text-xs rounded p-1 truncate cursor-pointer hover:opacity-90 ${getTypeColor(exam.type)} text-white flex items-center justify-between`}
                        >
                          <span className="truncate">{exam.title}</span>
                          <span className={`w-2 h-2 rounded-full ${getStatusColor(exam.status)}`}></span>
                        </div>
                      ))}
                      {dayExams.length > 2 && (
                        <div className="text-xs text-center text-blue-600 hover:underline cursor-pointer">
                          + {dayExams.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Placeholder for week view
  const renderWeekView = () => {
    // Get the start of the week (Sunday)
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay());
    
    // Time slots from 8 AM to 8 PM
    const timeSlots = Array.from({ length: 13 }, (_, i) => 8 + i);
    
    // Week days
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(day.getDate() + i);
      weekDays.push(day);
    }
    
    // Filter exams for the current week
    const filteredExams = filterExams(exams).filter(exam => {
      if (!exam.date) return false;
      
      const examDate = new Date(exam.date);
      const examWeekStart = new Date(examDate);
      examWeekStart.setDate(examDate.getDate() - examDate.getDay());
      
      return weekStart.toDateString() === examWeekStart.toDateString();
    });
    
    if (loading) {
      return <div className="p-8 text-center text-gray-500">Loading exams...</div>;
    }
    
    if (error) {
      return <div className="p-8 text-center text-red-500">{error}</div>;
    }
    
    return (
      <div className="min-w-max">
        {/* Header with days */}
        <div className="grid grid-cols-8 border-b">
          <div className="py-2 px-4 font-medium text-sm text-gray-600 border-r"></div>
          {weekDays.map((day, i) => {
            const isToday = day.toDateString() === new Date().toDateString();
            return (
              <div 
                key={i} 
                className={`py-2 font-medium text-center text-sm border-r last:border-r-0 min-w-32 ${
                  isToday ? "bg-blue-50" : ""
                }`}
              >
                <div className={`font-bold ${isToday ? "text-blue-600" : "text-gray-800"}`}>
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className={`${isToday ? "bg-blue-500 text-white" : "text-gray-600"} rounded-full w-6 h-6 flex items-center justify-center mx-auto mt-1`}>
                  {day.getDate()}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Time grid */}
        <div>
          {timeSlots.map((hour) => (
            <div key={hour} className="grid grid-cols-8 border-b last:border-b-0">
              <div className="py-3 px-2 font-medium text-xs text-gray-600 border-r text-right">
                {hour % 12 === 0 ? 12 : hour % 12}:00 {hour >= 12 ? 'PM' : 'AM'}
              </div>
              
              {weekDays.map((day, dayIndex) => {
                const currentHourExams = filteredExams.filter(exam => {
                  if (!exam.date || !exam.startTime) return false;
                  
                  const examDate = new Date(exam.date);
                  const startHour = parseInt(exam.startTime.split(':')[0], 10);
                  return (
                    examDate.toDateString() === day.toDateString() &&
                    startHour === hour
                  );
                });
                
                return (
                  <div key={dayIndex} className="min-h-16 border-r last:border-r-0 p-1 relative">
                    {currentHourExams.map((exam, i) => (
                      <div 
                        key={i} 
                        onClick={() => {
                          setSelectedExam(exam);
                          setShowExamDetails(true);
                        }}
                        className={`absolute top-0 left-0 right-0 mx-1 my-0.5 p-1 rounded text-xs text-white cursor-pointer ${getTypeColor(exam.type)}`}
                        style={{
                          height: `calc(100% - 2px)`,
                          zIndex: i + 1
                        }}
                      >
                        <div className="font-medium truncate">{exam.title}</div>
                        <div className="text-xs opacity-90">{exam.room}</div>
                        <div className="text-xs opacity-90">
                          {exam.startTime} - {exam.endTime}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Placeholder for day view
  const renderDayView = () => {
    // Time slots from 8 AM to 8 PM
    const timeSlots = Array.from({ length: 13 }, (_, i) => 8 + i);
    
    // Filter exams for the current day
    const filteredExams = filterExams(exams).filter(exam => {
      if (!exam.date) return false;
      const examDate = new Date(exam.date);
      return examDate.toDateString() === currentDate.toDateString();
    });
    
    if (loading) {
      return <div className="p-8 text-center text-gray-500">Loading exams...</div>;
    }
    
    if (error) {
      return <div className="p-8 text-center text-red-500">{error}</div>;
    }
    
    return (
      <div className="min-w-full">
        {/* Day header */}
        <div className="bg-blue-50 py-3 px-4 border-b">
          <div className="font-bold text-blue-800">
            {formatDate(currentDate)}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {filteredExams.length} exam{filteredExams.length !== 1 ? 's' : ''} scheduled
          </div>
        </div>
        
        {/* Time grid */}
        <div>
          {timeSlots.map((hour) => {
            const currentHourExams = filteredExams.filter(exam => {
              if (!exam.startTime) return false;
              const startHour = parseInt(exam.startTime.split(':')[0], 10);
              return startHour === hour;
            });
            
            return (
              <div key={hour} className="grid grid-cols-4 border-b last:border-b-0">
                <div className="py-3 px-4 font-medium text-sm text-gray-600 border-r text-right">
                  {hour % 12 === 0 ? 12 : hour % 12}:00 {hour >= 12 ? 'PM' : 'AM'}
                </div>
                
                <div className="col-span-3 min-h-24 p-2">
                  {currentHourExams.length === 0 ? (
                    <div className="h-full w-full border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-sm text-gray-400">
                      No exams scheduled
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {currentHourExams.map((exam, i) => (
                        <div 
                          key={i} 
                          onClick={() => {
                            setSelectedExam(exam);
                            setShowExamDetails(true);
                          }}
                          className={`p-3 rounded-lg text-white cursor-pointer hover:opacity-95 ${getTypeColor(exam.type)}`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-bold text-lg">{exam.title}</div>
                              <div className="flex items-center mt-2">
                                <Clock className="w-4 h-4 mr-1" />
                                <span>{exam.startTime} - {exam.endTime}</span>
                              </div>
                              <div className="flex items-center mt-1">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span>{exam.room}</span>
                              </div>
                            </div>
                            <div className={`px-2 py-1 rounded-full text-xs flex items-center ${
                              exam.status === 'validated' ? 'bg-green-600' : 'bg-yellow-600'
                            }`}>
                              {exam.status === 'validated' ? (
                                <CheckCircle className="w-3 h-3 mr-1" />
                              ) : (
                                <AlertCircle className="w-3 h-3 mr-1" />
                              )}
                              <span className="capitalize">{exam.status}</span>
                            </div>
                          </div>
                          <div className="mt-2 bg-amber-50 opacity-50 px-4 py-1 rounded text-xs text-gray-800"> 
                            {exam.students} students enrolled
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  // Render exam details modal
  const renderExamDetailsModal = () => {
    if (!selectedExam) return null;
    
    return (
      <div className="backdrop fixed inset-0 bg-gray-800/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl relative overflow-hidden animate-fadeIn">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-xl font-bold">Exam Details</h3>
            <button
              onClick={() => setShowExamDetails(false)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6">
            <div className={`w-full p-4 rounded-lg mb-4 ${getTypeColor(selectedExam.type) } text-white `}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${getTypeColor(selectedExam.type)}`}></div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs flex items-center ${
                  selectedExam.status === 'validated' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedExam.status === 'validated' ? (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  ) : (
                    <AlertCircle className="w-3 h-3 mr-1" />
                  )}
                  <span className="capitalize">{selectedExam.status || "Draft"}</span>
                </div>
              </div>
              
              <h2 className="text-2xl font-bold mt-2">{selectedExam.title}</h2>
              <p className="text-gray-600 capitalize">{selectedExam.subject}</p>
              {selectedExam.courseCode && (
                <p className="text-gray-600 text-sm mt-1">Course Code: {selectedExam.courseCode}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Schedule</h4>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-gray-600" />
                    <span>{selectedExam.date ? formatDate(selectedExam.date) : "Date not set"}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-gray-600" />
                    <span>{selectedExam.startTime || "??:??"} - {selectedExam.endTime || "??:??"}</span>
                  </div>
                  {selectedExam.duration && (
                    <div className="text-sm text-gray-500 ml-7">
                      Duration: {Math.floor(selectedExam.duration / 60)} hours {selectedExam.duration % 60} minutes
                    </div>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Location</h4>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-gray-600" />
                  <span>{selectedExam.room || "Room not assigned"}</span>
                </div>
                {selectedExam.department && (
                  <div className="flex items-center mt-2">
                    <FileText className="w-5 h-5 mr-2 text-gray-600" />
                    <span>Department: {selectedExam.department}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Enrollment</h4>
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2 text-gray-600" />
                <span>{selectedExam.students} students enrolled</span>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${Math.min(selectedExam.students / 60 * 100, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">Room capacity: 60 students</div>
            </div>
          </div>
          
          <div className="border-t p-4 flex justify-end space-x-3">
            <button 
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              onClick={() => setShowExamDetails(false)}
            >
              Close
            </button>
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition" onClick={() => setShowSelectedRoom(true)}
            >
              Edit Exam
            </button>
          </div>
        </div>
      </div>
    );
  };
  // Render filter panel
const renderFilterPanel = () => {
  if (!showFilters) return null;

  const examTypes = Object.keys(filters.types);
  const subjects = Object.keys(filters.subjects);

  return (
    <div className="backdrop fixed inset-0 bg-gray-800/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl relative overflow-hidden animate-fadeIn">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-medium">Filter Exams</h3>
          <button
            onClick={() => setShowFilters(false)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <h4 className="font-medium mb-3 text-gray-800 flex items-center">
              <span className="bg-gray-100 p-1 rounded-md mr-2">
                <Filter className="w-4 h-4 text-gray-600" />
              </span>
              Exam Types
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {examTypes.map(type => (
                <div key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`type-${type}`}
                    checked={filters.types[type]}
                    onChange={() => toggleTypeFilter(type)}
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={`type-${type}`} className="capitalize flex items-center text-gray-700">
                    <span className={`inline-block w-3 h-3 rounded-full mr-2 ${typeColors[type]}`}></span>
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-medium mb-3 text-gray-800 flex items-center">
              <span className="bg-gray-100 p-1 rounded-md mr-2">
                <FileText className="w-4 h-4 text-gray-600" />
              </span>
              Subjects
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {subjects.map(subject => (
                <div key={subject} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`subject-${subject}`}
                    checked={filters.subjects[subject]}
                    onChange={() => toggleSubjectFilter(subject)}
                    className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={`subject-${subject}`} className="capitalize text-gray-700">
                    {subject}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t">
            <button
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
              onClick={() => {
                // Reset all filters to true
                const resetTypes = {};
                const resetSubjects = {};

                Object.keys(filters.types).forEach(type => {
                  resetTypes[type] = true;
                });

                Object.keys(filters.subjects).forEach(subject => {
                  resetSubjects[subject] = true;
                });

                setFilters({
                  types: resetTypes,
                  subjects: resetSubjects
                });
              }}
            >
              Reset Filters
            </button>
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              onClick={() => {
                setShowFilters(false);
                fetchFilteredExams(); // Fetch the exams based on the filters
              }}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SelectRoomPanel = ({ selectedExam, rooms, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState("");

  const handleRoomChange = async (e) => {
    const roomId = e.target.value;
    setSelectedRoom(roomId);
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:8000/api/exam-rooms",
        {
          exam: { examId: parseInt(selectedExam.id) },
          room: { roomId: parseInt(roomId) },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // Optional: Add feedback or refresh exams
      onClose(); // Close panel after submission
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedExam) return null;

  return (
    <div className="backdrop fixed inset-0 bg-gray-800/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl relative overflow-hidden animate-fadeIn p-4">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-lg font-semibold">Assign Room to {selectedExam.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
        </div>

        <select
          value={selectedRoom}
          onChange={handleRoomChange}
          className="block w-full p-2 border border-gray-300 rounded"
          disabled={isSubmitting}
        >
          <option value="">Select a Room</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.Name} ({room.location})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
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
          <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-md flex items-center justify-center mr-3 shadow">
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
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-md lg:hidden hover:bg-gray-200 transition"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mr-4 shadow-md">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-800">
                  Exam Schedule
                </h1>
                <p className="text-gray-500">
                  View and manage all exam schedules with ease
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
                <button
                  onClick={() => setShowNotification(!showNotification)}
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <Bell className="h-5 w-5 text-gray-600" />
                </button>
              </div>
              <button className="flex items-center space-x-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-sm">
                <span>New Exam</span>
                <span className="text-lg leading-none">+</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-y-auto bg-gray-100 px-6 py-6">
        <div className="bg-white rounded-xl shadow-md p-6 max-w-6xl mx-auto">
          {/* Header with title and actions */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <Calendar className="text-blue-600" size={20} />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Exam Calendar</h2>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search exams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm pl-9 w-40 sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              </div>
              
              <button 
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm flex items-center shadow-sm"
                onClick={() => setShowFilters(true)}
              >
                <Filter className="mr-1.5" size={16} />
                Filters
              </button>
            </div>
          </div>
          
          {/* Calendar navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex space-x-2 items-center">
              <button 
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm" 
                onClick={goToPreviousPeriod}
              >
                <ChevronLeft size={18} />
              </button>
              <button 
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm" 
                onClick={goToNextPeriod}
              >
                <ChevronRight size={18} />
              </button>
              <button 
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium shadow-sm ml-2"
                onClick={goToToday}
              >
                Today
              </button>
            </div>
            
            <div className="text-lg font-medium text-gray-800 bg-gray-50 px-4 py-2 rounded-lg">
              {currentView === 'month' && currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              {currentView === 'week' && `Week of ${new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay()).toLocaleDateString()}`}
              {currentView === 'day' && formatDate(currentDate)}
            </div>
            
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg shadow-sm">
              <button 
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'month' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setCurrentView('month')}
              >
                Month
              </button>
              <button 
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'week' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setCurrentView('week')}
              >
                Week
              </button>
              <button 
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'day' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setCurrentView('day')}
              >
                Day
              </button>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-6 bg-gray-50 p-3 rounded-lg">
            <div className="text-sm font-medium text-gray-600 mr-2">Legend:</div>

            <div className="flex items-center text-sm">
              <span className="inline-block w-3 h-3 rounded-full mr-1.5 bg-green-500"></span>
              <span>Validated</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="inline-block w-3 h-3 rounded-full mr-1.5 bg-yellow-500"></span>
              <span>Pending</span>
            </div>
          </div>
          
          {/* Calendar content */}
          <div className="border border-gray-200 rounded-lg overflow-auto shadow-sm">
            {currentView === 'month' && renderMonthView()}
            {currentView === 'week' && renderWeekView()}
            {currentView === 'day' && renderDayView()}
          </div>
        </div>
      </main>
      
      {/* Status bar */}
      <footer className="bg-white border-t border-gray-200 py-2 px-6">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <div>© 2025 Exam Admin System</div>
          <div className="flex items-center">
            <div className="flex items-center mr-4">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
              <span>System online</span>
            </div>
            {new Date().toLocaleDateString()}
          </div>
        </div>
      </footer>
    </div>

    
    {/* Render modals */}
    {showExamDetails && renderExamDetailsModal()}
    {showFilters && renderFilterPanel()}
    {showSelectedRoom && (
  <SelectRoomPanel
    selectedExam={selectedExam}
    rooms={rooms}
    onClose={() => setShowSelectedRoom(false)}
  />
)}
  </div>
);
};

export default ExamAdminInterface;
