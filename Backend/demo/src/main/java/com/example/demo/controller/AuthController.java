package com.example.demo.controller;
import java.util.Map;
import java.util.Optional;

import com.example.demo.entity.Role;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.entity.User;
import com.example.demo.security.JwtUtil;
import com.example.demo.service.UserService;


@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Map<String, Object> userMap) {
        // Extract fields from the map
        String name = (String) userMap.get("name");
        String email = (String) userMap.get("email");
        String password = (String) userMap.get("password");
        String roleStr = (String) userMap.get("role"); // Get role as a string
        String departmentName = (String) userMap.get("department");
        String section = (String) userMap.get("section");
    
        // Convert the role string to the Role enum
        Role role;
        try {
            role = Role.valueOf(roleStr); // Convert string to enum
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid role: " + roleStr);
        }
        if(section == null)
        {
            return userService.registerUser(name, email, password, role, departmentName, "---");

        }
        // Call the service method
        return userService.registerUser(name, email, password, role, departmentName, section);
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyPassword(@RequestBody LoginRequest request) {
        Optional<User> user = userService.getUserByEmail(request.getEmail());

        if (user.isPresent() && new BCryptPasswordEncoder().matches(request.getPassword(), user.get().getPassword())) {
            return ResponseEntity.ok("Password verified");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        Optional<User> user = userService.getUserByEmail(request.getEmail());
        
        if (user.isPresent() && new BCryptPasswordEncoder().matches(request.getPassword(), user.get().getPassword())) {
            String token = jwtUtil.generateToken((UserDetails) user.get());
            
            // Create a structured response
            LoginResponse loginResponse = new LoginResponse(token, user.get().getRole().toString(), user.get().getName());
            return ResponseEntity.ok(loginResponse);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new LoginResponse(null, null, "Invalid credentials!"));
        }
    }

}
