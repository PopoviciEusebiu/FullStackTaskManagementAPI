package project.service.implementation;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import project.exceptions.ApiExceptionResponse;
import project.service.EmailService;

import java.util.ArrayList;

import static org.hibernate.sql.ast.SqlTreeCreationLogger.LOGGER;

@Service
@Transactional
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendEmail(String from, String subject, String content) throws ApiExceptionResponse {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

            helper.setFrom(from);
            helper.setTo("sebipopovici2002@yahoo.com");
            helper.setSubject(subject);
            helper.setText("<html><body><h1>" + subject + "</h1><p>" + content + "</p></body></html>", true);

            mailSender.send(mimeMessage);
            System.out.println("Email sent successfully!");
        } catch (MessagingException e) {
            System.err.println("Failed to send email: " + e.getMessage());
            ArrayList<String> errors = new ArrayList<>();
            errors.add("Email cannot be sent due to an error: " + e.getMessage());
            throw ApiExceptionResponse.builder()
                    .errors(errors)
                    .message("Failed to send email")
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        }
    }

    @Override
    public void sendEmailForVerification(String to, String verificationLink) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "utf-8");

            StringBuilder htmlMsgBuilder = new StringBuilder();

            htmlMsgBuilder.append("<div style=\"font-family: Arial, sans-serif; font-size: 14px; color: #333;\">")
                    .append("<h2 style=\"color: #0056b3;\">Confirm Your Email Address</h2>")
                    .append("<p>Thank you for registering with us. Please click on the link below to activate your account:</p>")
                    .append("<p style=\"padding: 10px; background-color: #e6f7ff; border-left: 6px solid #0056b3;\">")
                    .append("<a href='")
                    .append(verificationLink)
                    .append("' style='text-decoration: none; color: #0056b3; font-weight: bold;'>Activate Account</a></p>")
                    .append("<p>If you did not register for an account, please ignore this email or reply to let us know.</p>")
                    .append("<p>Best regards,</p>")
                    .append("<p><strong>Task Manager</strong></p>")
                    .append("</div>");

            String htmlMsg = htmlMsgBuilder.toString();
            helper.setText(htmlMsg, true);
            helper.setTo(to);
            helper.setSubject("Confirm your email");
            helper.setFrom("task.manager.company@gmail.com");

            mailSender.send(mimeMessage);
            System.out.println("Verification email sent successfully!");
        } catch (MessagingException e) {
            LOGGER.error("Failed to send email", e);
            throw new IllegalStateException("Failed to send email");
        }
    }

}


