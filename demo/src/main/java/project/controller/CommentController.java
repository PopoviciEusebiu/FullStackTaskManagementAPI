package project.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.dto.CommentDTO;
import project.exceptions.ApiExceptionResponse;
import project.service.CommentService;

import java.util.List;
@RestController
@RequestMapping("/comment")
@RequiredArgsConstructor
@CrossOrigin
public class CommentController {

    private final CommentService commentService;

    @Operation(summary = "Get all comments", description = "Retrieves a list of all comments")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved all comments")
    })
    @GetMapping
    public ResponseEntity<List<CommentDTO>> getAllComments(){
        return ResponseEntity.status(HttpStatus.OK).body(commentService.getAllComments());
    }

    @Operation(summary = "Get comment by ID", description = "Retrieves a comment by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved the comment"),
            @ApiResponse(responseCode = "404", description = "Comment not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<CommentDTO> getCommentById(@PathVariable Integer id){
        CommentDTO commentDTO = commentService.getCommentById(id);
        if(commentDTO == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.status(HttpStatus.OK).body(commentDTO);
    }

    @Operation(summary = "Get comments for a task", description = "Retrieves all comments associated with a specific task ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved comments for the task"),
            @ApiResponse(responseCode = "404", description = "No comments found for this task")
    })
    @GetMapping("/fromTask/{taskId}")
    public ResponseEntity<?> getCommentsForTask(@PathVariable Integer taskId) throws ApiExceptionResponse {
        List<CommentDTO> comments = commentService.getCommentsByTaskId(taskId);
        return ResponseEntity.ok(comments);
    }

    @Operation(summary = "Create a new comment", description = "Creates a new comment and returns the created comment")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Comment successfully created"),
            @ApiResponse(responseCode = "400", description = "Invalid input, object invalid")
    })
    @PostMapping
    public ResponseEntity<CommentDTO> createComment(@RequestBody CommentDTO commentDTO){

        try {
            CommentDTO newComment = commentService.createComment(commentDTO);
            return ResponseEntity.status(HttpStatus.OK).body(newComment);
        }catch(ApiExceptionResponse e){
            return ResponseEntity.status(e.getStatus()).build();
        }
    }

    @Operation(summary = "Delete a comment", description = "Deletes a comment based on the ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully deleted the comment"),
            @ApiResponse(responseCode = "404", description = "Comment not found")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Integer id){
        try{
            commentService.deleteComment(id);
            return ResponseEntity.status(HttpStatus.OK).build();
        }catch (ApiExceptionResponse e){
            return ResponseEntity.status(e.getStatus()).build();
        }
    }

    @Operation(summary = "Update a comment", description = "Updates a comment and returns the updated comment")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Comment successfully updated"),
            @ApiResponse(responseCode = "404", description = "Comment not found")
    })
    @PutMapping("/{id}")
    public ResponseEntity<CommentDTO> updateComment(@PathVariable Integer id, @RequestBody CommentDTO commentDTO){
        try{
            CommentDTO updatedComment = commentService.updateComment(commentDTO, id);
            return ResponseEntity.status(HttpStatus.OK).body(updatedComment);
        }catch (ApiExceptionResponse e){
            return ResponseEntity.status(e.getStatus()).build();
        }
    }
}
