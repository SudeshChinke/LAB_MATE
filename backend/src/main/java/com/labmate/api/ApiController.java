package com.labmate.api;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "${labmate.cors.allowed-origin:http://localhost:5173}")
public class ApiController {
    @GetMapping("/overview")
    public SignupSummary overview() {
        return new SignupSummary(142, 8);
    }

    @GetMapping("/health")
    public Health health() {
        return new Health("ok", "LabMate API is running");
    }

    @GetMapping("/equipment")
    public List<Equipment> equipment() {
        return List.of(
            new Equipment("oscilloscope", "Oscilloscope", "Tektronix TBS1052B", 12, 16),
            new Equipment("multimeter", "Digital multimeter", "Fluke 17B+", 18, 20),
            new Equipment("function-generator", "Function generator", "Keysight 33500B", 3, 8)
        );
    }

    public record Health(String status, String message) {}
    public record SignupSummary(int students, int faculty) {}
    public record Equipment(String id, String name, String model, int available, int total) {}
}
