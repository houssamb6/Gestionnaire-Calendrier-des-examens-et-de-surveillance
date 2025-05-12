package com.example.demo.service;

import com.example.demo.entity.Student;
import com.example.demo.entity.User;
import com.example.demo.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Optional<Student> getStudentById(Integer id) {
        return studentRepository.findById(id);
    }

    public List<String> getAllDistinctPrograms() {
        return studentRepository.findAll()
                                .stream()
                                .map(Student::getProgram)
                                .distinct()
                                .collect(Collectors.toList());
    }


    public Optional<Student> getStudentByUserId(User userId) {
        return studentRepository.findByUser(userId);
    }

    public Student createStudent(Student student) {
        return studentRepository.save(student);
        
    }

    public Student updateStudent(Integer id, Student studentDetails) {
        return studentRepository.findById(id).map(student -> {
            student.setUserId(studentDetails.getUser());
            student.setProgram(studentDetails.getProgram());
            return studentRepository.save(student);
        }).orElseThrow(() -> new RuntimeException("Student not found"));
    }

    public void deleteStudent(Integer id) {
        studentRepository.deleteById(id);
    }
}
