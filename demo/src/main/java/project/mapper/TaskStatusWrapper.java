package project.mapper;

import org.springframework.stereotype.Component;
import project.constants.TaskStatus;

@Component
public class TaskStatusWrapper {
    private TaskStatus taskStatus;
    private String username;

    public TaskStatus getTaskStatus() {
        return taskStatus;
    }
    public String getUsername(){ return username; }



}
