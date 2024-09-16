package project.service;

import org.springframework.stereotype.Component;
import project.exceptions.ApiExceptionResponse;

@Component
public interface EmailService {
    void sendEmail(String to, String subject, String content) throws ApiExceptionResponse;

    void sendEmailForVerification(String to, String email);
}
