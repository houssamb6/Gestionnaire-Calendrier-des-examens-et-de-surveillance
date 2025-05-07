package com.example.demo.dto;

import com.example.demo.entity.Role;

public class UserDTO {
    private Long userId;
    private String name;
    private String email;
    private Role role;   
    private String department;

    public UserDTO(Long userId,String name,String email,Role role,String department)
    {
        this.userId=userId;
        this.name=name;
        this.email=email;
        this.role=role;
        this.department=department;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }
}