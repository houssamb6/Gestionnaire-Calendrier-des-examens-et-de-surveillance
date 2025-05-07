package com.example.demo.service;

import com.example.demo.dto.UserDTO;
import com.example.demo.entity.Department;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;
import com.example.demo.entity.Student;
import com.example.demo.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

import com.example.demo.repository.DepartmentRepository;
import com.example.demo.repository.StudentRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;//3lech hethom final
    private final StudentRepository studentRepository;//mochkla el final lezm exist 
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public ResponseEntity<String> registerUser(String name, String email, String password, Role role, String department, String section) {
        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.ok("Email already exists!");
        }

        // Vérifier si un admin existe déjà
        if (role == Role.ADMIN && userRepository.findAll().stream().anyMatch(user -> user.getRole() == Role.ADMIN)) {
            return ResponseEntity.ok("An admin already exists!");
        }
         

        // List of allowed departments
        List<String> allowedDepartments = List.of("Math", "Technique", "Info");
        if (!allowedDepartments.contains(department)) {
            return ResponseEntity.ok("Invalid department. Allowed departments are: Math, Technique, Info.");
        }

        // Check   if the department exists, if not create it
        Department department1 = departmentRepository.findByName(department).
        orElseThrow(() -> new IllegalArgumentException("department n 'existe pas"));
        

        // Check if a Chef de Département already exists for this department
        if (role == Role.CHEF && userRepository.existsByRoleAndDepartment(Role.CHEF, department1)) {
            return ResponseEntity.ok("A Chef de Département already exists for this department!");
        }
        // Création et sauvegarde de l'utilisateur
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password)); // Hashage du mot de passe
        user.setRole(role);
        user.setDepartment(department1);
        user = userRepository.save(user); // Sauvegarde et récupération de l'ID généré
        
        if(role == Role.CHEF)
        {
            User a=userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("id mal9achou "));
            Department department2 = departmentRepository.findByName(department)
            .orElseThrow(() -> new IllegalArgumentException("mal9Ach departement "));
            if (department2.getHead() != null) {
                // headId is present, perform the required action
                new IllegalArgumentException("department has a head");
            } else {
                // headId is not present
                department2.setHead(a);
            }    
        }
        // Création de l'étudiant si le rôle est ETUDIANT
        if (role == Role.ETUDIANT) {
            Student student = new Student();
            student.setUserId(user); // Utilisation directe de l'objet sauvegardé
            student.setProgram(section);
            studentRepository.save(student);
        }
        return ResponseEntity.ok("User registered successfully!");
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> getUserById(Integer id) {
        return userRepository.findById(id);
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public List<UserDTO> getAllSupervisor() {
        return userRepository.findAllByRole(Role.ENSEIGNANT)
            .stream()
            .map(user -> new UserDTO(user.getUserId(),user.getName(),user.getEmail(),user.getRole(),user.getDepartmentname()))
            .collect(Collectors.toList());
    }

    public User updateUser(Integer id, User userDetails) {
        return userRepository.findById(id).map(user -> {
            user.setName(userDetails.getName());
            user.setEmail(userDetails.getEmail());
            user.setPassword(passwordEncoder.encode(userDetails.getPassword())); // Hash password
            user.setRole(userDetails.getRole());
            user.setDepartment(userDetails.getDepartment());
            user.setIsActive(userDetails.getIsActive());
            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public boolean deleteUser(Integer id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        } else {
            throw new RuntimeException("User not found");
        }
    }
}
