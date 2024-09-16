package project.dto;

import lombok.Builder;

import java.util.List;
@Builder
public record GroupDTO (
        Integer id,
        String name,
        String description,
        List<UserDTO> members,
        List<TaskDTO> tasks){}
