package com.example.demo.repository;

import com.example.demo.entity.Room;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<Room, Integer> {

    List<Room> findByIsAvailable(boolean b);
}
