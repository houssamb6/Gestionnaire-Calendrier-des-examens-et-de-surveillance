import { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Clock, MapPin, Users } from "lucide-react";

function SchedulePage({ userData }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');
  
  // Sample data
  const events = [
    {
      id: 1,
      title: 'Database Systems Final Exam',
      type: 'exam',
      date: '2024-06-15',
      time: '10:00 - 12:00',
      location: 'Room 302',
      participants: ['Dr. Smith', '45 students'],
      status: 'scheduled',
      description: 'Final examination for Database Systems course.'
    },
    {
      id: 2,
      title: 'Algorithm Midterm',
      type: 'exam',
      date: '2024-06-12',
      time: '14:00 - 16:00',
      location: 'Main Hall',
      participants: ['Dr. Johnson', '60 students'],
      status: 'scheduled'
    },
    {
      id: 3,
      title: 'Department Meeting',
      type: 'meeting',
      date: '2024-06-10',
      time: '09:00 - 10:30',
      location: 'Conference Room A',
      participants: ['Department Staff', 'Program Coordinators'],
      status: 'scheduled',
      description: 'Monthly department meeting to discuss exam schedules and assignments.'
    },
    {
      id: 4,
      title: 'Grade Submission Deadline',
      type: 'deadline',
      date: '2024-06-25',
      time: '23:59',
      location: 'Online Portal',
      participants: ['All Faculty'],
      status: 'pending',
      description: 'Deadline for submitting all final grades for the semester.'
    },
    {
      id: 5,
      title: 'Programming Fundamentals Exam',
      type: 'exam',
      date: '2024-06-18',
      time: '13:00 - 15:00',
      location: 'Room 201',
      participants: ['Dr. Williams', '30 students'],
      status: 'scheduled'
    },
    {
      id: 6,
      title: 'Supervisor Coordination Meeting',
      type: 'meeting',
      date: '2024-06-08',
      time: '11:00 - 12:00',
      location: 'Conference Room B',
      participants: ['Exam Supervisors', 'Dept. Head'],
      status: 'cancelled',
      description: 'Briefing for all exam supervisors on procedures and protocols.'
    }
  ];

  const daysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getMonthDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysCount = daysInMonth(year, month);
    
    const days = [];
    const prevMonthDays = daysInMonth(year, month - 1);
    
    // Previous month's days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false
      });
    }
    
    // Current month's days
    for (let i = 1; i <= daysCount; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }
    
    // Next month's days
    const remainingDays = 42 - days.length; // 6 rows of 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }
    
    return days;
  };

  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { day: 'numeric' });
  };

  const formatFullDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const getEventsForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const hasEvents = (date) => {
    const events = getEventsForDate(date);
    return events.length > 0;
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'exam':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'meeting':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'deadline':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
        
        <div className="flex gap-2">
          <div className="flex bg-gray-100 rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-2 ${viewMode === 'month' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-2 ${viewMode === 'week' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-2 ${viewMode === 'day' ? 'bg-blue-600 text-white' : 'text-gray-700'}`}
            >
              Day
            </button>
          </div>
          
          <button className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-md">
        <button
          onClick={prevMonth}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
          {formatMonthYear(currentMonth)}
        </h2>
        
        <button
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Month View */}
      {viewMode === 'month' && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Calendar Header */}
          <div className="grid grid-cols-7 gap-px border-b">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500 bg-gray-50">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-px">
            {getMonthDays().map((day, index) => {
              const isToday = day.date.toDateString() === new Date().toDateString();
              const isSelected = day.date.toDateString() === selectedDate.toDateString();
              const dayEvents = getEventsForDate(day.date);
              
              return (
                <div
                  key={index}
                  onClick={() => setSelectedDate(day.date)}
                  className={`min-h-24 p-1 cursor-pointer transition-colors relative ${
                    day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'
                  } ${isSelected ? 'ring-2 ring-blue-500 ring-inset' : ''}`}
                >
                  <div className={`text-right ${isToday ? 'bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center ml-auto' : ''}`}>
                    {formatDate(day.date)}
                  </div>
                  
                  <div className="mt-1 space-y-1 max-h-20 overflow-y-auto">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className={`px-2 py-1 text-xs rounded border-l-4 ${getEventTypeColor(event.type)}`}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500 px-2">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Events for selected date */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Events for {formatFullDate(selectedDate)}
        </h3>
        
        <div className="space-y-4">
          {getEventsForDate(selectedDate).length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
              No events scheduled for this day.
            </div>
          ) : (
            getEventsForDate(selectedDate).map((event) => (
              <div
                key={event.id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getEventTypeColor(event.type)}`}>
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </span>
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(event.status)}`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                    <h4 className="text-lg font-medium text-gray-900 mt-2">{event.title}</h4>
                    {event.description && (
                      <p className="text-gray-600 mt-1">{event.description}</p>
                    )}
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{event.participants.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded transition-colors">
                      Edit
                    </button>
                    {event.status !== 'cancelled' && (
                      <button className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors">
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Events</h3>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="space-y-4">
            {events
              .filter(event => new Date(event.date) > new Date())
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 3)
              .map((event) => (
                <div key={event.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between">
                    <div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getEventTypeColor(event.type)}`}>
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </span>
                      <h4 className="text-md font-medium text-gray-900 mt-1">{event.title}</h4>
                      <div className="flex items-center text-sm mt-1">
                        <Clock className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-gray-600 mr-3">{event.date} {event.time}</span>
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-gray-600">{event.location}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 h-6 text-xs rounded-full ${getStatusBadgeClass(event.status)}`}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default SchedulePage;