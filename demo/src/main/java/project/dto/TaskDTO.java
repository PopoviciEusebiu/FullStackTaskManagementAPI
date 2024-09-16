package project.dto;

import lombok.Builder;
import project.constants.TaskStatus;

import java.time.LocalDate;
import java.util.List;

@Builder
public record TaskDTO(
        Integer id,
        String title,
        String description,
        LocalDate dueDate,
        TaskStatus status,
        List<UserDTO> users,
        List<CommentDTO> comments){}
