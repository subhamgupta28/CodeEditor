package dev.subhamgupta.codeeditor.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CodeService {

    private final Path workspaceDir = Paths.get("/workspace");

    public void saveCode(Map<String, String> body) throws IOException {
        String code = body.get("code");
        String filePath = body.get("file");
        Files.createDirectories(workspaceDir.resolve(filePath).getParent());
        Files.writeString(workspaceDir.resolve(filePath), code);
    }

    public Map<String, Integer> build() throws IOException, InterruptedException{
        ProcessBuilder builder = new ProcessBuilder("platformio", "run");
        builder.directory(workspaceDir.toFile());
        Process process = builder.start();
        int exitCode = process.waitFor();
        return Map.of("exitCode", exitCode);
    }

    public Object upload() throws IOException, InterruptedException{
        ProcessBuilder builder = new ProcessBuilder("platformio", "run", "--target", "upload");
        builder.directory(workspaceDir.toFile());
        Process process = builder.start();
        int exitCode = process.waitFor();
        return Map.of("exitCode", exitCode);
    }

    public List<Map<String, Object>> listFiles() throws IOException {
        List<Map<String, Object>> files = new ArrayList<>();
        Files.walk(workspaceDir)
//                .filter(Files::isRegularFile)
                .forEach(path -> {
                    Map<String, Object> file = new HashMap<>();
                    file.put("name", workspaceDir.relativize(path).toString());
                    file.put("isDirectory", Files.isDirectory(path));
                    files.add(file);
                });
        return files;
    }

    public Map<String, String> openFile(String file) throws IOException {
        Path filePath = workspaceDir.resolve(file);
        String content = Files.readString(filePath);
        return Map.of("content", content);
    }
}
