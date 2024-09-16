package project.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.dto.EmailRequest;
import project.exceptions.ApiExceptionResponse;
import project.service.EmailService;

@RestController
@RequestMapping("/email")
@RequiredArgsConstructor
@CrossOrigin
public class EmailController {
    private final EmailService emailService;


    @PostMapping("/send-email")
    public ResponseEntity<?> sendEmail(@RequestBody EmailRequest emailRequest) throws ApiExceptionResponse {
        emailService.sendEmail(emailRequest.getFrom(), emailRequest.getSubject(), emailRequest.getContent());
        return ResponseEntity.ok("Email sent successfully");
    }
}
