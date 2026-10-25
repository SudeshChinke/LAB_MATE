package com.labmate.api;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "${labmate.cors.allowed-origin:http://localhost:5173}")
public class ApiController {
    @GetMapping("/health")
    public Health health() {
        return new Health("ok", "LabMate API is running");
    }

    public record Health(String status, String message) {}
}
