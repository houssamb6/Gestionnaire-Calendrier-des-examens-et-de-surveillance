// Mock data for exams and surveillances
const studentExams = [
  {
    id: '1',
    subject: 'Computer Science Fundamentals',
    date: '2025-06-15T09:00:00',
    startTime: '09:00',
    endTime: '11:00',
    room: 'A101',
    type: 'Final Exam',
    duration: 120
  },
  {
    id: '2',
    subject: 'Advanced Mathematics',
    date: '2025-06-17T14:00:00',
    startTime: '14:00',
    endTime: '16:30',
    room: 'B203',
    type: 'Final Exam',
    duration: 150
  },
  {
    id: '3',
    subject: 'Data Structures',
    date: '2025-06-20T10:00:00',
    startTime: '10:00',
    endTime: '12:00',
    room: 'C105',
    type: 'Final Exam',
    duration: 120
  }
];

const teacherSurveillances = [
  {
    id: '1',
    subject: 'Computer Science Fundamentals',
    date: '2025-06-15T09:00:00',
    startTime: '09:00',
    endTime: '11:00',
    room: 'A101',
    studentCount: 42,
    groups: ['CS-2A', 'CS-2B']
  },
  {
    id: '2',
    subject: 'Web Development',
    date: '2025-06-18T13:30:00',
    startTime: '13:30',
    endTime: '15:30',
    room: 'D102',
    studentCount: 35,
    groups: ['CS-3A']
  },
  {
    id: '3',
    subject: 'Database Management',
    date: '2025-06-22T10:00:00',
    startTime: '10:00',
    endTime: '12:30',
    room: 'B201',
    studentCount: 28,
    groups: ['CS-3B']
  }
];

export function getUpcomingExams(userType) {
  if (userType === 'student') {
    return studentExams;
  } else {
    return teacherSurveillances;
  }
}

export function getExamById(examId, userType) {
  if (userType === 'student') {
    return studentExams.find(exam => exam.id === examId);
  } else {
    return teacherSurveillances.find(surveillance => surveillance.id === examId);
  }
}