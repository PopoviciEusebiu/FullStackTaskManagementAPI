package project.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.dto.TaskDTO;
import project.dto.UserDTO;
import project.exceptions.ApiExceptionResponse;
import project.service.AuthenticationService;
import project.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@CrossOrigin
public class UserController {
    private final UserService userService;
    private final AuthenticationService authenticationService;

    @Operation(
            summary = "Get all users",
            description = "Retrieve a list of all users."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successful operation")
    })
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers(){
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.status(HttpStatus.OK).body(users);
    }

    @Operation(
            summary = "Find user by ID",
            description = "Retrieve a user by its ID."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successful operation"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity findUserById(@PathVariable Integer id){
        UserDTO userDTO = userService.getUserById(id);
        if(userDTO == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.status(HttpStatus.OK).body(userDTO);
    }


    @Operation(
            summary = "Update user",
            description = "Update an user with specified id."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successful operation")
    })
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Integer id, @RequestBody UserDTO user){
        try {
            UserDTO updatedUserDTO = userService.updateUser(user, id);
            return ResponseEntity.status(HttpStatus.OK).body(updatedUserDTO);
        } catch (ApiExceptionResponse e) {
            return ResponseEntity.status(e.getStatus()).body(null);
        }
    }

    @Operation(
            summary = "Delete user",
            description = "Delete all users selected by the id."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successful operation")
    })
    @PostMapping("/delete")
    public ResponseEntity<Void> deleteUser(@RequestBody List<Integer> ids) {
        try {

            for(Integer i : ids){
                System.out.println(userService.getUserById(i));
                userService.deleteUser(i);
            }
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (ApiExceptionResponse e) {
            return ResponseEntity.status(e.getStatus()).build();
        }
    }

    @Operation(
            summary = "Get tasks for user",
            description = "Retrieve tasks associated with a specific user."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successful operation"),
            @ApiResponse(responseCode = "404", description = "User or tasks not found")
    })
    @GetMapping("/{adminId}/tasks/{userId}")
    public ResponseEntity<?> getTasksForUser(@PathVariable Integer adminId, @PathVariable Integer userId) {
        try {
            List<TaskDTO> tasks = userService.getTasksByUserId(adminId, userId);
            return ResponseEntity.ok(tasks);
        } catch (ApiExceptionResponse e) {
            return ResponseEntity.status(e.getStatus()).body(e.getErrors());
        }
    }


    @GetMapping("/export/{userId}")
    public ResponseEntity exportTaskDetails(@PathVariable Integer userId, @RequestParam String fileType) {
        return ResponseEntity.ok(userService.exportUserDetails(userId, fileType));
    }
}
