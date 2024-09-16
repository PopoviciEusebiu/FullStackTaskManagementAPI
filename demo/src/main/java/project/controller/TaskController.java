package project.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.constants.TaskStatus;
import project.dto.TaskDTO;
import project.exceptions.ApiExceptionResponse;
import project.mapper.TaskStatusWrapper;
import project.service.TaskService;
import project.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/task")
@RequiredArgsConstructor
@CrossOrigin
public class TaskController {
    private final TaskService taskService;
    private final UserService userService;

    @Operation(summary = "Get all tasks", description = "Retrieves a list of all tasks")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved list")
    })
    @GetMapping
    public ResponseEntity<List<TaskDTO>> getAllTasks(){
        return ResponseEntity.status(HttpStatus.OK).body(taskService.getAllTasks());
    }

    @Operation(
            summary = "Find task by ID",
            description = "Retrieve a task by its ID."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successful operation"),
            @ApiResponse(responseCode = "404", description = "Task not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO> getTaskById(@PathVariable Integer id){
        TaskDTO taskDTO = taskService.getTaskById(id);
        if(taskDTO == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.status(HttpStatus.OK).body(taskDTO);
    }

    @Operation(summary = "Create a new task", description = "Creates a new task and returns the created task")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Task successfully created"),
            @ApiResponse(responseCode = "400", description = "Bad request due to input errors")
    })
    @PostMapping
    public ResponseEntity<TaskDTO> createTask(@RequestBody TaskDTO taskDTO){
        try{
            TaskDTO newTask = taskService.createTask(taskDTO);
        return ResponseEntity.status(HttpStatus.OK).body(newTask);
        }catch (ApiExceptionResponse e){
            return ResponseEntity.status(e.getStatus()).build();
        }
    }


    @Operation(summary = "Delete a task", description = "Deletes a task based on the ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully deleted the task"),
            @ApiResponse(responseCode = "404", description = "Task not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Integer id){
        try{
            taskService.deleteTask(id);
            return ResponseEntity.status(HttpStatus.OK).build();
        }catch (ApiExceptionResponse e){
            return ResponseEntity.status(e.getStatus()).build();
        }
    }

    @Operation(summary = "Update a task", description = "Updates a task based on the ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully updated the task"),
            @ApiResponse(responseCode = "404", description = "Task not found")
    })
    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO> updateTask(@PathVariable Integer id, @RequestBody TaskDTO taskDTO){
        try{
            TaskDTO updatedTask = taskService.updateTask(taskDTO, id);
            return ResponseEntity.status(HttpStatus.OK).body(updatedTask);
        }catch (ApiExceptionResponse e){
            return ResponseEntity.status(e.getStatus()).build();
        }
    }

    @Operation(summary = "Get all tasks sorted by due date in ascending order",
            description = "Retrieves a list of all tasks sorted by their due date in ascending order based on a specified project ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved and sorted the tasks list"),
            @ApiResponse(responseCode = "404", description = "No tasks found for the provided ID")
    })
    @GetMapping("/sort/asc/{id}")
    public ResponseEntity<List<TaskDTO>> getAllTasksSortedAsc(@PathVariable Integer id) {
        return ResponseEntity.status(HttpStatus.OK).body(taskService.getAllTasksSortedByDueDateAsc(id));
    }

    @Operation(summary = "Get all tasks sorted by due date in descending order",
            description = "Retrieves a list of all tasks sorted by their due date in descending order based on a specified project ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved and sorted the tasks list"),
            @ApiResponse(responseCode = "404", description = "No tasks found for the provided ID")
    })
    @GetMapping("/sort/desc/{id}")
    public ResponseEntity<List<TaskDTO>> getAllTasksSortedByDesc(@PathVariable Integer id) {
        return ResponseEntity.status(HttpStatus.OK).body(taskService.getAllTasksSortedByDueDateDesc(id));
    }

    @Operation(summary = "Get tasks by status", description = "Retrieves a list of tasks filtered by their status (TODO or DONE)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved the tasks list")
    })
    @PostMapping("/history")
    public ResponseEntity<List<TaskDTO>> getCompletedTasksHistory(@RequestBody TaskStatusWrapper statusWrapper) {
        List<TaskDTO> completedTasksHistory;
        if(statusWrapper.getTaskStatus() == TaskStatus.TODO) {
            completedTasksHistory = taskService.getToDoTasksHistory(statusWrapper.getUsername());
        } else {
            completedTasksHistory = taskService.getCompletedTasksHistory(statusWrapper.getUsername());
        }
        return ResponseEntity.status(HttpStatus.OK).body(completedTasksHistory);
    }

    @Operation(summary = "Get all tasks from a user", description = "Retrieves a list of all tasks")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved list")
    })
    @GetMapping("/userTasks")
    public ResponseEntity<List<TaskDTO>> getAllUserTasks(@RequestParam String username){
        return ResponseEntity.status(HttpStatus.OK).body(taskService.findTasksByUsername(username));
    }

}
