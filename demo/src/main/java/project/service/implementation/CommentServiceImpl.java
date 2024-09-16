package project.service.implementation;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import project.dto.CommentDTO;
import project.dto.TaskDTO;
import project.dto.UserDTO;
import project.exceptions.ApiExceptionResponse;
import project.mapper.CommentMapper;
import project.model.Comment;
import project.model.Task;
import project.model.User;
import project.repository.CommentRepository;
import project.repository.TaskRepository;
import project.repository.UserRepository;
import project.service.CommentService;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
    private final CommentRepository commentRepository;
    private final CommentMapper commentMapper;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;


    /**
     * Returnează un obiect CommentDTO asociat unui ID de comentariu sau null dacă comentariul nu poate fi găsit.
     *
     * @param id ID-ul comentariului căutat.
     * @return Obiectul CommentDTO corespunzător comentariului sau null.
     */
    @Override
    public CommentDTO getCommentById(Integer id) {
        return commentMapper.commentEntityToDto(commentRepository.findById(id).orElse(null));
    }

    /**
     * Returnează o listă de obiecte CommentDTO care reprezintă toate comentariile din sistem.
     *
     * @return O listă de obiecte CommentDTO care reprezintă comentariile din sistem.
     */
    @Override
    public List<CommentDTO> getAllComments() {
        return commentRepository.findAll().stream()
                .map(commentMapper::commentEntityToDto)
                .collect(Collectors.toList());
    }

    /**
     * Creează un nou comentariu pe baza datelor primite și returnează obiectul CommentDTO corespunzător.
     *
     * @param commentDTO Obiectul CommentDTO care conține datele comentariului de creat.
     * @return Obiectul CommentDTO reprezentând comentariul creat.
     * @throws ApiExceptionResponse Excepție aruncată în cazul în care utilizatorul asociat comentariului sau sarcina asociată comentariului nu poate fi găsită.
     */
    @Override
    public CommentDTO createComment(CommentDTO commentDTO) throws ApiExceptionResponse {
        Comment comment = commentMapper.commentDtoToEntity(commentDTO);

        UserDTO userDTO = commentDTO.user();
        User user = userRepository.findByUsername(userDTO.username());

        TaskDTO taskDTO = commentDTO.task();
        System.out.println(taskDTO);
        Task task = taskRepository.findTaskById(taskDTO.id());


        if(user != null && task != null){
            comment.setUser(user);
            comment.setTask(task);
        }else {
            ArrayList<String> errors = new ArrayList<>();
            errors.add("The user " + user.getUsername() + " or task " + task.getTitle() + "  might not exist");

            throw ApiExceptionResponse.builder()
                    .errors(errors)
                    .message("Task not found")
                    .status(HttpStatus.NOT_FOUND)
                    .build();
        }
        return commentMapper.commentEntityToDto(commentRepository.save(comment));
    }

    /**
     * Actualizează detaliile unui comentariu existent și returnează obiectul CommentDTO actualizat.
     *
     * @param commentDTO Obiectul CommentDTO care conține detaliile actualizate ale comentariului.
     * @param id         ID-ul comentariului de actualizat.
     * @return Obiectul CommentDTO actualizat.
     * @throws ApiExceptionResponse Excepție aruncată dacă comentariul nu poate fi găsit.
     */
    @Override
    public CommentDTO updateComment(CommentDTO commentDTO, Integer id) throws ApiExceptionResponse {
        Comment existingComment = commentRepository.findById(id).orElse(null);

        if (existingComment != null) {
            existingComment.setContent(commentDTO.content());
            Comment updatedComment = commentRepository.save(existingComment);
            System.out.println("Comment updated successfully!");
            return commentMapper.commentEntityToDto(updatedComment);
        } else {
            ArrayList<String> errors = new ArrayList<>();
            errors.add("The comment with ID " + id + " might not exist");
            throw ApiExceptionResponse.builder()
                    .errors(errors)
                    .message("Comment not found")
                    .status(HttpStatus.NOT_FOUND)
                    .build();
        }
    }

    /**
     * Șterge un comentariu din sistem pe baza ID-ului specificat.
     *
     * @param id ID-ul comentariului de șters.
     * @throws ApiExceptionResponse Excepție aruncată dacă comentariul nu poate fi găsit.
     */
    @Override
    public void deleteComment(Integer id) throws ApiExceptionResponse {
        Comment comment = commentRepository.findById(id).orElse(null);
        if (comment != null) {
            commentRepository.delete(comment);
            System.out.println("Comment deleted successfully!");
        } else {
            ArrayList<String> errors = new ArrayList<>();
            errors.add("Comment with ID " + id + " does not exist");
            throw ApiExceptionResponse.builder()
                    .errors(errors)
                    .message("Comment not found")
                    .status(HttpStatus.NOT_FOUND)
                    .build();
        }
    }

    /**
     * Returnează o listă de comentarii asociate unei sarcini cu ID-ul specificat.
     *
     * @param taskId ID-ul sarcinii pentru care se caută comentariile asociate.
     * @return O listă de obiecte CommentDTO care reprezintă comentariile asociate sarcinii.
     * @throws ApiExceptionResponse Excepție aruncată dacă nu sunt găsite comentarii pentru sarcina specificată.
     */
    @Override
    public List<CommentDTO> getCommentsByTaskId(Integer taskId) throws  ApiExceptionResponse{
        List<Comment> comments = commentRepository.getCommentsByTaskId(taskId);

        if (comments == null || comments.isEmpty()) {
            throw ApiExceptionResponse.builder()
                    .message("No comments found for task with ID: " + taskId)
                    .status(HttpStatus.NOT_FOUND)
                    .build();
        }

        return commentMapper.commentListEntityToDto(comments);
    }
}
