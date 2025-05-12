package com.example.demo.service;

import com.example.demo.entity.Exam;
import com.example.demo.entity.ExamStatus;
import com.example.demo.entity.ExamStudent;
import com.example.demo.entity.Student;
import com.example.demo.repository.ExamRepository;
import com.example.demo.repository.ExamStudentRepository;
import com.example.demo.repository.StudentRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ExamStudentService {

    private final ExamStudentRepository examStudentRepository;
    private final ExamRepository examRepository;
    private final StudentRepository studentRepository;

    public List<ExamStudent> getAllExamStudents() {
        return examStudentRepository.findAll();
    }

    @Transactional
    public ExamStudent createExamStudent(ExamStudent examStudent) {
        if (examStudent.getExam() == null || examStudent.getExam().getExamId() == null) {
            throw new IllegalArgumentException("Exam must be provided with a valid ID.");
        }
        
        if (examStudent.getStudent() == null || examStudent.getStudent().getStudentId() == null) {
            throw new IllegalArgumentException("Student must be provided with a valid ID.");
        }

        if (examStudent.getStatus() == null) {
            throw new IllegalArgumentException("Exam status must be provided.");
        }

        // Fetch and validate exam
        Exam exam = examRepository.findById(examStudent.getExam().getExamId())
                .orElseThrow(() -> new IllegalArgumentException("Exam not found with ID: " + examStudent.getExam().getExamId()));

        // Fetch and validate student
        Student student = studentRepository.findById(examStudent.getStudent().getStudentId())
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + examStudent.getStudent().getStudentId()));

        // Check if student is already assigned to the exam
        if (examStudentRepository.existsByExamAndStudent(exam, student)) {
            throw new IllegalArgumentException("Student with ID " + student.getStudentId() + " is already registered for this exam.");
        }




        // Assign the validated entities
        examStudent.setExam(exam);
        examStudent.setStudent(student);

        return examStudentRepository.save(examStudent);
    }

    @Transactional
public void createExamStudentsByProgram(Integer examId, String program, ExamStatus status) {
    // Validate exam
    Exam exam = examRepository.findById(examId)
        .orElseThrow(() -> new IllegalArgumentException("Exam not found with ID: " + examId));

    // Fetch all students by program
    List<Student> students = studentRepository.findByProgram(program);

    for (Student student : students) {
        // Avoid duplicates
        if (examStudentRepository.existsByExamAndStudent(exam, student)) {
            continue;
        }

        // Create new ExamStudent
        ExamStudent examStudent = new ExamStudent();
        examStudent.setExam(exam);
        examStudent.setStudent(student);
        examStudent.setStatus(status);
        examStudentRepository.save(examStudent);
    }
}

    @Transactional
public ExamStudent updateExamStudent(Integer id, ExamStudent updatedExamStudent) {
    // Validate ID
    if (id == null) {
        throw new IllegalArgumentException("ExamStudent ID must be provided.");
    }

    // Fetch existing record
    ExamStudent existingExamStudent = examStudentRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("ExamStudent not found with ID: " + id));

    // Validate exam ID
    if (updatedExamStudent.getExam() == null || updatedExamStudent.getExam().getExamId() == null) {
        throw new IllegalArgumentException("Exam must be provided with a valid ID.");
    }

    // Validate student ID
    if (updatedExamStudent.getStudent() == null || updatedExamStudent.getStudent().getStudentId() == null) {
        throw new IllegalArgumentException("Student must be provided with a valid ID.");
    }

    // Validate status
    if (updatedExamStudent.getStatus() == null) {
        throw new IllegalArgumentException("Exam status must be provided.");
    }

    // Fetch and validate exam
    Exam exam = examRepository.findById(updatedExamStudent.getExam().getExamId())
            .orElseThrow(() -> new IllegalArgumentException("Exam not found with ID: " + updatedExamStudent.getExam().getExamId()));

    // Fetch and validate student
    Student student = studentRepository.findById(updatedExamStudent.getStudent().getStudentId())
            .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + updatedExamStudent.getStudent().getStudentId()));

    // Check if student is already assigned to this exam (but allow if it's the same record)
    examStudentRepository.findByExamAndStudent(exam, student)
            .ifPresent(existing -> {
                if (!existing.getExamStudentId().equals(id)) {
                    throw new IllegalArgumentException("Student with ID " + student.getStudentId() + " is already registered for this exam.");
                }
            });

    // Update values
    existingExamStudent.setExam(exam);
    existingExamStudent.setStudent(student);
    existingExamStudent.setStatus(updatedExamStudent.getStatus());

    return examStudentRepository.save(existingExamStudent);
}



    public ExamStudent getExamStudentById(Integer id) {
        return examStudentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("ExamStudent not found with ID: " + id));
    }

    @Transactional
    public void deleteExamStudent(Integer id) {
        // Validate ID
        if (id == null) {
            throw new IllegalArgumentException("ExamStudent ID must be provided.");
        }
    
        // Check if the record exists before deleting
        ExamStudent existingExamStudent = examStudentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("ExamStudent not found with ID: " + id));
    
        // Delete the record
        examStudentRepository.delete(existingExamStudent);
    }
    
}
