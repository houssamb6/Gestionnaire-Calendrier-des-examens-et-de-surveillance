package com.example.demo.dto;

public class LoginResponse {
    private String token;
    private String role;
    private String name;
    private String department;



    public LoginResponse(String token, String role, String name, String department) {
        this.token = token;
        this.role = role;
        this.name = name;
        this.department = department;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
