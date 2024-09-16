package project.mapper;


import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;
import project.dto.TaskDTO;
import project.dto.UserDTO;
import project.model.Task;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class TaskMapper{
    private final UserMapper userMapper;


    public TaskMapper(@Lazy UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    public TaskDTO taskEntityToDto(Task task){
        List<UserDTO> userDTOs = task.getUsers().stream()
                .map(userMapper::userEntityToDto)
                .collect(Collectors.toList());

        return TaskDTO.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .dueDate(task.getDueDate())
                .status(task.getStatus())
                .users(userDTOs)
                //.comments(commentMapper.commentListEntityToDto(task.getComments()))
                .build();
    }

    public List<TaskDTO> taskListEntityToDto(List<Task> tasks){
        return tasks.stream()
                .map(task -> taskEntityToDto(task))
                .toList();
    }

    public Task taskDtoToEntity(TaskDTO taskDTO){
        return Task.builder()
                .id(taskDTO.id())
                .title(taskDTO.title())
                .status(taskDTO.status())
                .description(taskDTO.description())
                .dueDate(taskDTO.dueDate())
                //.user(userMapper.userDtoToEntity(taskDTO.user(), password))
                /*.comments(commentMapper.commentListDtoToEntity(taskDTO.comments()))*/
                .build();
    }

    public List<Task> taskListDtoToEntity(List<TaskDTO> taskDTOS){
        return taskDTOS.stream()
                .map(taskDTO -> taskDtoToEntity(taskDTO))
                .toList();
    }

}
