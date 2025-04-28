package dev.subhamgupta.codeeditor.controller;

import dev.subhamgupta.codeeditor.services.CodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.nio.file.*;
import java.util.*;
import java.io.IOException;

@RestController
@RequestMapping("/api/code")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Allow React frontend
public class CodeController {

    private final CodeService codeService;
    // relative to project root

    @PostMapping("/save")
    public ResponseEntity<?> saveCode(@RequestBody Map<String, String> body) throws IOException {
        codeService.saveCode(body);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/build")
    public ResponseEntity<?> build() throws IOException, InterruptedException {
        return ResponseEntity.ok(codeService.build());
    }

    @PostMapping("/upload")
    public ResponseEntity<?> upload() throws IOException, InterruptedException {

        return ResponseEntity.ok(codeService.upload());
    }

    @GetMapping("/list")
    public ResponseEntity<?> listFiles() throws IOException {

        return ResponseEntity.ok(codeService.listFiles());
    }

    @GetMapping("/open")
    public ResponseEntity<?> openFile(@RequestParam String file) throws IOException {
        return ResponseEntity.ok(codeService.openFile(file));
    }
}
