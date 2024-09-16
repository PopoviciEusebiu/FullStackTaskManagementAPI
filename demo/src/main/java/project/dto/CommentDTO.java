package project.dto;

import lombok.Builder;

@Builder
public record CommentDTO(
        Integer id,
        UserDTO user,
        TaskDTO task,
        String content) {}
