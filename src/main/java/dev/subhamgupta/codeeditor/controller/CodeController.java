package dev.subhamgupta.codeeditor.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.nio.file.*;
import java.util.*;
import java.io.IOException;

@RestController
@RequestMapping("/api/code")
@CrossOrigin(origins = "*") // Allow React frontend
public class CodeController {

    private final Path workspaceDir = Paths.get("workspace"); // relative to project root

    @PostMapping("/save")
    public ResponseEntity<?> saveCode(@RequestBody Map<String, String> body) throws IOException {
        String code = body.get("code");
        String filePath = body.get("file");
        Files.createDirectories(workspaceDir.resolve(filePath).getParent());
        Files.writeString(workspaceDir.resolve(filePath), code);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/build")
    public ResponseEntity<?> build() throws IOException, InterruptedException {
        ProcessBuilder builder = new ProcessBuilder("platformio", "run");
        builder.directory(workspaceDir.toFile());
        Process process = builder.start();
        int exitCode = process.waitFor();
        return ResponseEntity.ok(Map.of("exitCode", exitCode));
    }

    @PostMapping("/upload")
    public ResponseEntity<?> upload() throws IOException, InterruptedException {
        ProcessBuilder builder = new ProcessBuilder("platformio", "run", "--target", "upload");
        builder.directory(workspaceDir.toFile());
        Process process = builder.start();
        int exitCode = process.waitFor();
        return ResponseEntity.ok(Map.of("exitCode", exitCode));
    }

    @GetMapping("/list")
    public ResponseEntity<?> listFiles() throws IOException {
        List<Map<String, Object>> files = new ArrayList<>();
        Files.walk(workspaceDir)
                .filter(Files::isRegularFile)
                .forEach(path -> {
                    Map<String, Object> file = new HashMap<>();
                    file.put("name", workspaceDir.relativize(path).toString());
                    file.put("isDirectory", Files.isDirectory(path));
                    files.add(file);
                });
        return ResponseEntity.ok(files);
    }

    @GetMapping("/open")
    public ResponseEntity<?> openFile(@RequestParam String file) throws IOException {
        Path filePath = workspaceDir.resolve(file);
        String content = Files.readString(filePath);
        return ResponseEntity.ok(Map.of("content", content));
    }
}
