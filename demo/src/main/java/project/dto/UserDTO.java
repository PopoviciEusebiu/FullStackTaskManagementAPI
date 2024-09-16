package project.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;

import java.util.List;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record UserDTO (
    Integer id,
    String username,
    List<RoleDTO> roles,
    List<CommentDTO> comments,
    List<TaskDTO> tasks,
    String firstName,
    String lastName,
    String emailAddress) {}
