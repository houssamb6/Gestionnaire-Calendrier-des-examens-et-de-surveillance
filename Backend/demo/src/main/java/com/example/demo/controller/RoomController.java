package com.example.demo.controller;

import com.example.demo.entity.Exam;
import com.example.demo.entity.Room;
import com.example.demo.service.RoomService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping
    public List<Room> getAllRooms() {
        return roomService.getAllRooms();
    }

    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody Room room) {
        try {
            Room createdRoom = roomService.createRoom(room);
            return ResponseEntity.ok("Room " +createdRoom.getRoomName()+ " created successfully.");
        }catch (IllegalArgumentException e) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to create room.");
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> updateRoom(@PathVariable int id, @RequestBody Room room) {
    try {
        Room updatedRoom = roomService.updateRoom(id, room);
        if (updatedRoom == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not found with id: " + id);
        }
        return ResponseEntity.ok(updatedRoom);
    } catch (IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to update room.");
    }
}


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExam(@PathVariable Integer id) {
        try {
            roomService.deleteRoom(id);
            return ResponseEntity.noContent().build(); // 204 No Content
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting room " + e.getMessage());
        }
    }

    
    @GetMapping("/available")
    public List<Room> getAvailableRooms() {
        return roomService.getAvailableRooms();
    }

}
