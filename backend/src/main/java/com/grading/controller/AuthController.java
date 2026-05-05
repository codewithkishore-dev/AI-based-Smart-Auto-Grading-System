package com.grading.controller;

import com.grading.model.User;
import com.grading.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        if (user.getName() == null || user.getName().trim().isEmpty()
                || user.getEmail() == null || user.getEmail().trim().isEmpty()
                || user.getPassword() == null || user.getPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Name, email and password are required");
        }

        String email = user.getEmail().trim().toLowerCase();

        User existingUser = userRepository.findByEmail(email);
        if (existingUser != null) {
            return ResponseEntity.status(409).body("Account already exists. Please login.");
        }

        if (email.endsWith("@college.edu")) {
            user.setRole("TEACHER");
        } else if (email.endsWith("@gmail.com")) {
            user.setRole("STUDENT");
        } else {
            return ResponseEntity.status(400).body("Invalid email domain");
        }

        user.setEmail(email);
        user.setName(user.getName().trim());
        user.setPassword(user.getPassword().trim());

        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginUser) {

        if (loginUser.getEmail() == null || loginUser.getEmail().trim().isEmpty()
                || loginUser.getPassword() == null || loginUser.getPassword().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Email and password are required");
        }

        String email = loginUser.getEmail().trim().toLowerCase();
        String password = loginUser.getPassword().trim();

        User existingUser = userRepository.findByEmail(email);

        if (existingUser == null) {
            return ResponseEntity.status(401).body("Account not found. Please sign up first.");
        }

        if (!existingUser.getPassword().equals(password)) {
            return ResponseEntity.status(401).body("Invalid password");
        }

        return ResponseEntity.ok(existingUser);
    }
}