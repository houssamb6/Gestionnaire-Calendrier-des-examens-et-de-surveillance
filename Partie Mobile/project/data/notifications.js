// Mock data for notifications
const studentNotifications = [
  {
    id: 1,
    title: 'Room Change',
    message: 'Your Computer Science Fundamentals exam has been moved from room A101 to B105.',
    timestamp: '2025-06-10T14:30:00',
    read: false,
    examId: '1'
  },
  {
    id: 2,
    title: 'New Exam Added',
    message: 'A new exam has been scheduled: Web Development on June 25th at 10:00.',
    timestamp: '2025-06-09T09:15:00',
    read: true,
    examId: null
  },
  {
    id: 3,
    title: 'Time Change',
    message: 'Your Data Structures exam has been rescheduled to start at 11:00 instead of 10:00.',
    timestamp: '2025-06-08T16:45:00',
    read: false,
    examId: '3'
  }
];

const teacherNotifications = [
  {
    id: 1,
    title: 'New Surveillance Duty',
    message: 'You have been assigned to supervise the Web Development exam on June 25th at 10:00 in room D102.',
    timestamp: '2025-06-10T11:20:00',
    read: false,
    examId: null
  },
  {
    id: 2,
    title: 'Room Change',
    message: 'Your surveillance for Computer Science Fundamentals has been moved from room A101 to B105.',
    timestamp: '2025-06-10T14:30:00',
    read: true,
    examId: '1'
  },
  {
    id: 3,
    title: 'Student Count Update',
    message: 'The number of students for the Database Management exam has increased to 32.',
    timestamp: '2025-06-07T10:15:00',
    read: false,
    examId: '3'
  }
];

export function getNotifications(userType) {
  if (userType === 'student') {
    return studentNotifications;
  } else {
    return teacherNotifications;
  }
}

export function markNotificationAsRead(notificationId) {
  // In a real app, this would call an API to update the notification
  
  // For student notifications
  const studentNotification = studentNotifications.find(n => n.id === notificationId);
  if (studentNotification) {
    studentNotification.read = true;
  }
  
  // For teacher notifications
  const teacherNotification = teacherNotifications.find(n => n.id === notificationId);
  if (teacherNotification) {
    teacherNotification.read = true;
  }
}