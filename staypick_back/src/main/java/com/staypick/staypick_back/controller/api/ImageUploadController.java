package com.staypick.staypick_back.controller.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;
import java.util.*;

@RestController
@RequestMapping("/api")
public class ImageUploadController {

    private static final String UPLOAD_DIR = "uploads/";

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            // 디렉토리 없으면 생성
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // 파일명 중복 방지
            String originalFilename = file.getOriginalFilename();
            String extension = Objects.requireNonNull(originalFilename).substring(originalFilename.lastIndexOf("."));
            String filename = "review_" + UUID.randomUUID() + extension;

            // 저장
            Path filePath = uploadPath.resolve(filename);
            Files.write(filePath, file.getBytes());

            // 프론트에 전달할 이미지 URL
            String imageUrl = "/uploads/" + filename;

            return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "이미지 업로드 실패"));
        }
    }
}
