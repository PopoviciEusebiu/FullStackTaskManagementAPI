package project.service;

import org.springframework.stereotype.Component;
import project.dto.CommentDTO;
import project.exceptions.ApiExceptionResponse;

import java.util.List;
@Component
public interface CommentService {
    CommentDTO getCommentById(Integer id);
    List<CommentDTO> getAllComments();

    CommentDTO createComment(CommentDTO comment) throws ApiExceptionResponse;

    CommentDTO updateComment(CommentDTO comment , Integer id) throws ApiExceptionResponse;

    void deleteComment(Integer id) throws ApiExceptionResponse;

    List<CommentDTO> getCommentsByTaskId(Integer taskId) throws  ApiExceptionResponse;
}
