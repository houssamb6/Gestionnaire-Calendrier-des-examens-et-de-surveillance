package com.example.demo.service;

import com.example.demo.entity.Exam;
import com.example.demo.entity.ExamRoom;
import com.example.demo.entity.Invigilator;
import com.example.demo.entity.Role;
import com.example.demo.entity.Room;
import com.example.demo.entity.User;
import com.example.demo.repository.ExamRepository;
import com.example.demo.repository.InvigilatorRepository;
import com.example.demo.repository.RoomRepository;
import com.example.demo.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@AllArgsConstructor
public class InvigilatorService {

    private final InvigilatorRepository invigilatorRepository;
    private final UserRepository userRepository;
    private final ExamRepository examRepository;
    private final RoomRepository roomRepository;
    private final ExamRoomService examRoomService;


    public List<Invigilator> getAllInvigilators() {
        return invigilatorRepository.findAll();
    }


    @Transactional
    public Invigilator createInvigilator(Invigilator invigilator) {
        if (invigilator.getUser() == null || invigilator.getUser().getUserId() == null) {
            throw new IllegalArgumentException("User must be provided with a valid ID.");
        }

        if (invigilator.getExam() == null || invigilator.getExam().getExamId() == null) {
            throw new IllegalArgumentException("Exam must be provided with a valid ID.");
        }

        if (invigilator.getRoom() == null || invigilator.getRoom().getRoomId() == null) {
            throw new IllegalArgumentException("Room must be provided with a valid ID.");
        }

        // Validate User
        User user = userRepository.findByUserId(invigilator.getUser().getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + invigilator.getUser().getUserId()));
        if (!user.getRole().equals(Role.ENSEIGNANT)) {
            throw new IllegalArgumentException("Only users with the 'ENSEIGNANT' role can be invigilators.");
        }

        // Validate Exam
        Exam exam = examRepository.findById(invigilator.getExam().getExamId())
                .orElseThrow(() -> new IllegalArgumentException("Exam not found with ID: " + invigilator.getExam().getExamId()));

        // Validate Room
        Room room = roomRepository.findById(invigilator.getRoom().getRoomId())
                .orElseThrow(() -> new IllegalArgumentException("Room not found with ID: " + invigilator.getRoom().getRoomId()));

        // Set validated entities
        invigilator.setUser(user);
        invigilator.setExam(exam);
        invigilator.setRoom(room);

        room.setIsAvailable(false);
        roomRepository.save(room);

        try {
    return invigilatorRepository.save(invigilator);
} catch (DataIntegrityViolationException e) {
    throw new ResponseStatusException(HttpStatus.CONFLICT, 
        "This invigilator assignment already exists");
}
    }

    @Transactional
    public Invigilator updateInvigilator(Integer id, Invigilator invigilatorDetails) {
    // Find the existing invigilator
        Invigilator existingInvigilator = invigilatorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invigilator not found with ID: " + id));

        // Validate User
        if (invigilatorDetails.getUser() != null && invigilatorDetails.getUser().getUserId() != null) {
            User user = userRepository.findByUserId(invigilatorDetails.getUser().getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + invigilatorDetails.getUser().getUserId()));
            if (!user.getRole().equals(Role.ENSEIGNANT)) {
                throw new IllegalArgumentException("Only users with the 'ENSEIGNANT' role can be invigilators.");
            }
            // Check if the user is already assigned as an invigilator for the same exam
            if (invigilatorRepository.existsByUserAndExam(user, existingInvigilator.getExam()) && 
                !user.getUserId().equals(existingInvigilator.getUser().getUserId())) {
                throw new IllegalArgumentException("This user is already assigned as an invigilator for this exam.");
            }
            existingInvigilator.setUser(user);
        }

        // Validate Exam
        if (invigilatorDetails.getExam() != null && invigilatorDetails.getExam().getExamId() != null) {
            Exam exam = examRepository.findById(invigilatorDetails.getExam().getExamId())
                    .orElseThrow(() -> new IllegalArgumentException("Exam not found with ID: " + invigilatorDetails.getExam().getExamId()));
            existingInvigilator.setExam(exam);
        }

        // Validate Room
        if (invigilatorDetails.getRoom() != null && invigilatorDetails.getRoom().getRoomId() != null) {
            Room room = roomRepository.findById(invigilatorDetails.getRoom().getRoomId())
                    .orElseThrow(() -> new IllegalArgumentException("Room not found with ID: " + invigilatorDetails.getRoom().getRoomId()));
            existingInvigilator.setRoom(room);
        }
        return invigilatorRepository.save(existingInvigilator);
    }
    

}
