package com.example.demo.controller;

import com.example.demo.entity.ExamStatus;
import com.example.demo.entity.ExamStudent;
import com.example.demo.service.ExamStudentService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/exam-students")
public class ExamStudentController {

    private final ExamStudentService examStudentService;

    public ExamStudentController(ExamStudentService examStudentService) {
        this.examStudentService = examStudentService;
    }

    @GetMapping
    public List<ExamStudent> getAllExamStudents() {
        return examStudentService.getAllExamStudents();
    }

    @PostMapping
    public ResponseEntity<?> createExamStudent(@RequestBody ExamStudent examStudent) {
        try {
            ExamStudent savedExamStudent = examStudentService.createExamStudent(examStudent);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedExamStudent);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/{examId}/{program}")  
    public ResponseEntity<?> createExamStudentsByProgram(
            @PathVariable Integer examId, 
                @PathVariable String program){
        try {
            examStudentService.createExamStudentsByProgram(examId, program, ExamStatus.INSCRIT);
            return ResponseEntity.status(HttpStatus.CREATED).body("ExamStudents created successfully for program: ");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
    }
    

    @PutMapping("/{id}")
    public ResponseEntity<?> updateExamStudent(@PathVariable Integer id, @RequestBody ExamStudent updatedExamStudent) {
        try{
            ExamStudent updated = examStudentService.updateExamStudent(id, updatedExamStudent);
            return ResponseEntity.ok(updated);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error"+e.getMessage());
        }    
    }


    

    @GetMapping("/{id}")
    public Optional<ExamStudent> getExamStudentById(@PathVariable Integer id) {
        return Optional.ofNullable(examStudentService.getExamStudentById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExamStudent(@PathVariable Integer id) {
        try{
            examStudentService.deleteExamStudent(id);
        return ResponseEntity.noContent().build();
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: "+e.getMessage());
            }
    }
    
}
