package project.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import project.dto.GroupDTO;
import project.dto.TaskDTO;
import project.dto.UserDTO;
import project.exceptions.ApiExceptionResponse;
import project.service.GroupService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/group")
@RequiredArgsConstructor
@CrossOrigin
public class GroupController {

    private final GroupService groupService;

    @Operation(summary = "Get all groups", description = "Retrieves a list of all groups")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved all groups")
    })
    @GetMapping
    public ResponseEntity<List<GroupDTO>> getAllGroups() {
        return ResponseEntity.ok(groupService.getAllGroups());
    }

    @Operation(summary = "Get groups from a user", description = "Retrieves a list of all groups")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved all groups")
    })
    @PostMapping("/my")
    public ResponseEntity<List<GroupDTO>> getMyGroups(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        return ResponseEntity.ok(groupService.getMyGroups(username));
    }

    @Operation(summary = "Get group by ID", description = "Retrieves a group by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved the group"),
            @ApiResponse(responseCode = "404", description = "Group not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<GroupDTO> getGroupById(@PathVariable Integer id) {
        GroupDTO groupDTO = groupService.getGroupById(id);
        if (groupDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(groupDTO);
    }

    @Operation(summary = "Create a new group", description = "Creates a new group and returns the created group")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Group successfully created"),
            @ApiResponse(responseCode = "400", description = "Invalid input, object invalid")
    })
    @PostMapping
    public ResponseEntity<GroupDTO> createGroup(@RequestBody GroupDTO groupDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String username = null;
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            username = ((UserDetails) authentication.getPrincipal()).getUsername();
        } else if (authentication != null) {
            username = authentication.getName();
        }
        GroupDTO newGroup = groupService.createGroup(groupDTO, username);

        return ResponseEntity.status(HttpStatus.CREATED).body(newGroup);
    }

    @Operation(summary = "Update a group", description = "Updates a group and returns the updated group")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Group successfully updated"),
            @ApiResponse(responseCode = "404", description = "Group not found")
    })
    @PutMapping("/{id}")
    public ResponseEntity<GroupDTO> updateGroup(@PathVariable Integer id, @RequestBody GroupDTO groupDTO) {
        GroupDTO updatedGroup = groupService.updateGroup(groupDTO, id);
        return ResponseEntity.ok(updatedGroup);
    }

    @Operation(summary = "Delete group if user is a member", description = "Deletes a group if the user is a member of it")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Group successfully deleted"),
            @ApiResponse(responseCode = "404", description = "Group or user not found"),
            @ApiResponse(responseCode = "403", description = "User is not a member of the group")
    })
    @DeleteMapping("/{groupId}/user/{userId}")
    public ResponseEntity<Void> deleteGroupIfMember(@PathVariable Integer groupId, @PathVariable Integer userId) {
        try {
            groupService.deleteGroupIfMember(userId, groupId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
    }

    @Operation(summary = "Enroll user to group", description = "Adds a user to the specified group")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User successfully enrolled in the group"),
            @ApiResponse(responseCode = "404", description = "Group or user not found")
    })
    @PostMapping("/{groupId}/users/{userId}/enroll")
    public ResponseEntity<GroupDTO> enrollUserToGroup(@PathVariable Integer userId, @PathVariable Integer groupId) {
        GroupDTO group = groupService.enrollUserToGroup(userId, groupId);
        return ResponseEntity.ok(group);
    }

    @Operation(summary = "Remove user from group", description = "Allows a user to leave a specified group")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User successfully left the group"),
            @ApiResponse(responseCode = "404", description = "Group or user not found")
    })
    @DeleteMapping("/{groupId}/users/{userId}/leave")
    public ResponseEntity<GroupDTO> leaveGroup(@PathVariable Integer userId, @PathVariable Integer groupId) {
        GroupDTO group = groupService.leaveGroup(userId, groupId);
        return ResponseEntity.ok(group);
    }

    @Operation(summary = "Update task from group", description = "Allows a user to update a specified task from group")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Task successfully updated"),
            @ApiResponse(responseCode = "404", description = "Task or user or group not found")
    })
    @PutMapping("/{groupId}/updateTask/{taskId}/fromUser/{userId}")
    public ResponseEntity<TaskDTO> updateTaskIfMember(@PathVariable Integer userId, @RequestBody TaskDTO taskDTO, @PathVariable Integer groupId, @PathVariable Integer taskId) throws ApiExceptionResponse {
        TaskDTO updatedTask = groupService.updateTaskFromGroup(userId, taskDTO, groupId, taskId);
        return ResponseEntity.ok(updatedTask);
    }

    @Operation(summary = "Add task to group", description = "Adds a new task to a group")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Task successfully added to the group"),
            @ApiResponse(responseCode = "404", description = "Group not found")
    })
    @PostMapping("/{groupId}/task")
    public ResponseEntity<TaskDTO> addTaskToGroup(@RequestBody TaskDTO taskDTO, @PathVariable Integer groupId) {
        try {
            TaskDTO addedTask = groupService.addTaskToGroup(taskDTO, groupId);
            return ResponseEntity.ok(addedTask);
        } catch (ApiExceptionResponse e) {
            return ResponseEntity.status(e.getStatus()).build();
        }
    }

    @Operation(summary = "Remove task from group", description = "Removes a task from a group")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Task successfully removed from the group"),
            @ApiResponse(responseCode = "404", description = "Group or task not found")
    })
    @DeleteMapping("/{groupId}/task/{taskId}")
    public ResponseEntity<Void> removeTaskFromGroup(@PathVariable Integer taskId, @PathVariable Integer groupId) {
        groupService.deleteTaskFromGroup(taskId, groupId);
        return ResponseEntity.ok().build();
    }


    @Operation(summary = "Get group members", description = "Retrieves a list of all members in a specified group")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved all group members"),
            @ApiResponse(responseCode = "404", description = "Group not found")
    })
    @GetMapping("/{groupId}/members")
    public ResponseEntity<List<UserDTO>> getGroupMembers(@PathVariable Integer groupId) {
        List<UserDTO> members = groupService.getGroupMembers(groupId);
        return ResponseEntity.ok(members);
    }

    @Operation(summary = "Get online group members", description = "Retrieves a list of all online members in a specified group")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved all online group members"),
            @ApiResponse(responseCode = "404", description = "Group not found")
    })
    @GetMapping("/{groupId}/onlineMembers")
    public ResponseEntity<List<UserDTO>> getOnlineGroupMembers(@PathVariable Integer groupId) {
        List<UserDTO> members = groupService.getOnlineGroupMembers(groupId);
        return ResponseEntity.ok(members);
    }

    @Operation(summary = "Get group tasks", description = "Retrieves a list of all tasks in a specified group")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved all tasks for the group"),
            @ApiResponse(responseCode = "404", description = "Group not found")
    })
    @GetMapping("/{groupId}/tasks")
    public ResponseEntity<List<TaskDTO>> getGroupTasks(@PathVariable Integer groupId) {
        List<TaskDTO> tasks = groupService.getGroupTasks(groupId);
        return ResponseEntity.ok(tasks);
    }
}