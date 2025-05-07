package com.example.demo.service;

import com.example.demo.entity.Department;
import com.example.demo.entity.Room;
import com.example.demo.repository.RoomRepository;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public List<Room> getAvailableRooms() {
        return roomRepository.findByIsAvailable(true);
    }
    
    public Room createRoom(Room room) {
        return roomRepository.save(room);
    }

    public Room updateRoom(Integer roomId, Room updatedRoom) {
    return roomRepository.findById(roomId).map(existingRoom -> {
        existingRoom.setRoomName(updatedRoom.getRoomName());
        existingRoom.setCapacity(updatedRoom.getCapacity());
        existingRoom.setLocation(updatedRoom.getLocation());
        existingRoom.setIsAvailable(updatedRoom.getIsAvailable());

        return roomRepository.save(existingRoom);
    }).orElseThrow(() -> new IllegalArgumentException("Room not found with id " + roomId));
}


    @Transactional
    public void deleteRoom(Integer id) {
    // Find the room
    Room room = roomRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Room not found with ID: " + id));

    // Only allow deletion if the room is available
    if (room.getIsAvailable()== false) {
        throw new IllegalStateException("Cannot delete room that is currently in use.");  
    }
    // Now delete the room
    roomRepository.delete(room);
}
}

