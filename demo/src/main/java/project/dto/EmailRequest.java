package project.dto;

import lombok.Data;
import project.validators.ValidEmail;

@Data
public class EmailRequest {
    @ValidEmail
    private String from;
    private String subject;
    private String content;

}