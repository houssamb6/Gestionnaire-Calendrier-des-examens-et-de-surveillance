// Mock profile data
const studentProfile = {
  name: 'Alice Johnson',
  studentId: 'S123456',
  email: 'alice.johnson@university.edu',
  program: 'Computer Science',
  year: '3rd Year',
  group: 'CS-3A',
  avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200'
};

const teacherProfile = {
  name: 'Dr. Robert Smith',
  teacherId: 'T987654',
  email: 'robert.smith@university.edu',
  department: 'Computer Science',
  position: 'Associate Professor',
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200'
};

export function getProfileData(userType) {
  if (userType === 'student') {
    return studentProfile;
  } else {
    return teacherProfile;
  }
}