package project.service;

import org.springframework.stereotype.Component;
import project.dto.TaskDTO;
import project.exceptions.ApiExceptionResponse;

import java.util.List;
@Component
public interface TaskService {

    TaskDTO getTaskById(Integer id);
    List<TaskDTO> getAllTasks();

    TaskDTO createTask(TaskDTO task) throws ApiExceptionResponse;

    TaskDTO updateTask(TaskDTO task , Integer id) throws ApiExceptionResponse;

    void deleteTask(Integer id) throws ApiExceptionResponse;

    List<TaskDTO> getAllTasksSortedByDueDateAsc(Integer userId);
    List<TaskDTO> getAllTasksSortedByDueDateDesc(Integer userId);
    List<TaskDTO> getCompletedTasksHistory(String username);

    List<TaskDTO> getToDoTasksHistory(String username);

    List<TaskDTO> findTasksByUsername(String username);
}
