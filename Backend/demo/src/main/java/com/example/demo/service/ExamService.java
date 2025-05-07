package com.example.demo.service;

import com.example.demo.dto.DepartmentDTO;
import com.example.demo.dto.ExamDTO;
import com.example.demo.entity.Department;
import com.example.demo.entity.Exam;
import com.example.demo.entity.ExamRoom;
import com.example.demo.entity.ExamStudent;
import com.example.demo.entity.Invigilator;
import com.example.demo.entity.Role;
import com.example.demo.entity.Validation;
import com.example.demo.entity.ValidationStatus;
import com.example.demo.repository.DepartmentRepository;
import com.example.demo.repository.ExamRepository;
import com.example.demo.repository.ExamRoomRepository;
import com.example.demo.repository.ExamStudentRepository;
import com.example.demo.repository.InvigilatorRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.ValidationRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class ExamService {

    @Autowired
    private final DepartmentRepository departmentRepository;
    @Autowired
    private final ExamRoomRepository examRoomRepository;
    @Autowired
    private final ExamStudentRepository  examStudentRepository;
    @Autowired
    private final ExamRepository examRepository;
    @Autowired
    private final InvigilatorRepository invigilatorRepository;
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final ValidationRepository validationRepository;



    public List<ExamDTO> getAllExams() {
        return examRepository.findAll()
            .stream()
            .map(exam -> new ExamDTO(exam.getExamId(), exam.getSubject(), exam.getDepartment().getName(), exam.getExamDate(), exam.getStartTime(), exam.getEndTime(), exam.getDifficulty(), exam.getCoefficient()))
            .collect(Collectors.toList());
    }

    public Optional<Exam> getExamById(Integer id) {
        return examRepository.findById(id);
    }

    public Exam createExam(Exam exam) {
        Integer departmentId = (exam.getDepartment() != null && exam.getDepartment().getDepartmentId() != null) 
                ? exam.getDepartment().getDepartmentId() 
                : null;
    
        if (departmentId != null) {
            Department dep = departmentRepository.findById(departmentId)
                    .orElseThrow(() -> new IllegalArgumentException("Department not found with ID " + departmentId));
            exam.setDepartment(dep);
        } else {
            exam.setDepartment(null);
        }
    
        exam = examRepository.save(exam);
    
        // Directeur Validation
        Validation directeurValidation = new Validation();
        directeurValidation.setExamId(exam);
        directeurValidation.setValidatedBy(userRepository.findByRole(Role.DIRECTEUR));
        directeurValidation.setStatus(ValidationStatus.EN_ATTENTE);
        directeurValidation.setComments("aya");
        validationRepository.save(directeurValidation);
    
        // Fetch Department with head
        if (departmentId != null) {
            Department departmentWithHead = departmentRepository.findById(departmentId)
                    .orElseThrow(() -> new IllegalArgumentException("Department not found with ID " + departmentId));
    
            // Chef Validation
            Validation chefValidation = new Validation();
            chefValidation.setExamId(exam);
            chefValidation.setValidatedBy(departmentWithHead.getHead());
            chefValidation.setStatus(ValidationStatus.EN_ATTENTE);
            chefValidation.setComments("aya");
            validationRepository.save(chefValidation);
        }
        return exam;
    }
    
    

    public Exam updateExam(Integer examId, Exam updatedExam) {
        return examRepository.findById(examId).map(existingExam -> {
            existingExam.setSubject(updatedExam.getSubject());
            existingExam.setExamDate(updatedExam.getExamDate());
            existingExam.setStartTime(updatedExam.getStartTime());
            existingExam.setEndTime(updatedExam.getEndTime());
            existingExam.setDifficulty(updatedExam.getDifficulty());
            existingExam.setCoefficient(updatedExam.getCoefficient());
            existingExam.setIsDuplicate(updatedExam.getIsDuplicate());
    
            // Update Department only if provided
            if (updatedExam.getDepartment() != null && updatedExam.getDepartment().getDepartmentId() != null) {
                Department department = departmentRepository.findById(updatedExam.getDepartment().getDepartmentId())
                        .orElseThrow(() -> new IllegalArgumentException("Department not found"));
                existingExam.setDepartment(department);
            }
            return examRepository.save(existingExam);
        }).orElseThrow(() -> new IllegalArgumentException("Exam not found with id " + examId));
    }

    @Transactional
    public void deleteExam(Integer id) {
        // Find the exam
        Exam exam = examRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Exam not found with ID: " + id));

        // Delete all associated ExamStudent records
        if (examStudentRepository.existsByExam(exam)) {
            List<ExamStudent> examStudents = examStudentRepository.findByExam(exam);
            examStudentRepository.deleteAll(examStudents);
        }
        if (examRoomRepository.existsByExam(exam)) {
            List<ExamRoom> examStudents = examRoomRepository.findByExam(exam);
            examStudents.forEach(examRoom -> {
                // Delete the associated room if it exists
                if (examRoom.getRoom() != null) {
                    examRoom.getRoom().setIsAvailable(true); // Remove the association
                }
            });
            examRoomRepository.deleteAll(examStudents);
        }
        if(validationRepository.existsByExamId(exam)){
            List<Validation> validations = validationRepository.findByExamId(exam);
            validationRepository.deleteAll(validations);
        }
        
        

        // Delete all associated Invigilators if any
        List<Invigilator> invigilators = invigilatorRepository.findByExam(exam);
        if (!invigilators.isEmpty()) {
            invigilatorRepository.deleteAll(invigilators);
        }
        // Now delete the exam
        examRepository.delete(exam);
    }
}
