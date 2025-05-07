package com.example.demo.repository;

import com.example.demo.entity.Department;
import com.example.demo.entity.Role;
import com.example.demo.entity.User;

import org.springframework.data.jdbc.repository.query.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User>  findByEmail(@Param("email") String email);

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role AND u.department = :department")
    int countByRoleAndDepartment(@Param("role") Role role, @Param("department") Department department);

    default boolean existsByRoleAndDepartment(Role role, Department department) {
    return countByRoleAndDepartment(role, department) > 0;
    }

    Optional<User> findByUserId(long id);
    Optional<User> findByDepartment(Department department);
    User findByRole(Role directeur);

    List<User> findAllByRole(Role role);
}
