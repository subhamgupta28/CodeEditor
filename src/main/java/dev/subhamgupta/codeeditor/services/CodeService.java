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
//    private final Path workspaceDir = Paths.get("D:\\AutomataCapsule\\lib");

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
        Map<String, Map<String, Object>> pathMap = new HashMap<>();

        Files.walk(workspaceDir)
                .sorted() // Make sure parent folders come before children
                .forEach(path -> {
                    String relativePath = workspaceDir.relativize(path).toString();
                    if (relativePath.isEmpty()) return; // skip the root itself

                    Map<String, Object> node = new HashMap<>();
                    node.put("id", relativePath.replace("\\", "/")); // Normalize to /
                    node.put("label", path.getFileName().toString());

                    if (Files.isDirectory(path)) {
                        node.put("children", new ArrayList<Map<String, Object>>());
                    } else {
                        // If it's a file, add extension
                        String filename = path.getFileName().toString();
                        int dotIndex = filename.lastIndexOf('.');
                        if (dotIndex != -1 && dotIndex < filename.length() - 1) {
                            String extension = filename.substring(dotIndex + 1);
                            node.put("extension", extension);
                        } else {
                            node.put("extension", ""); // No extension
                        }
                    }

                    pathMap.put(relativePath, node);

                    // Add to parent if exists
                    Path parentPath = path.getParent();
                    if (parentPath != null && workspaceDir.relativize(parentPath).toString().length() > 0) {
                        String parentRelative = workspaceDir.relativize(parentPath).toString();
                        Map<String, Object> parentNode = pathMap.get(parentRelative);
                        if (parentNode != null) {
                            List<Map<String, Object>> children = (List<Map<String, Object>>) parentNode.get("children");
                            if (children != null) {
                                children.add(node);
                            }
                        }
                    }
                });

        // Collect only top-level nodes (those without parents)
        List<Map<String, Object>> roots = new ArrayList<>();
        pathMap.forEach((path, node) -> {
            Path fullPath = workspaceDir.resolve(path);
            Path parent = fullPath.getParent();
            if (parent == null || workspaceDir.equals(parent)) {
                roots.add(node);
            }
        });

        return roots;
    }



    public Map<String, String> openFile(String file) throws IOException {
        Path filePath = workspaceDir.resolve(file);
        String content = Files.readString(filePath);
        return Map.of("content", content);
    }
}
