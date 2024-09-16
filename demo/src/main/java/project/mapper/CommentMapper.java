package project.mapper;

import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;
import project.dto.CommentDTO;
import project.model.Comment;

import java.util.List;

@Component
public class CommentMapper {
    private final UserMapper userMapper;
    private final TaskMapper taskMapper;

    public CommentMapper(@Lazy UserMapper userMapper, TaskMapper taskMapper) {
        this.userMapper = userMapper;
        this.taskMapper = taskMapper;
    }

    public CommentDTO commentEntityToDto(Comment comment){
        return CommentDTO.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .user(userMapper.userEntityToDto(comment.getUser()))
                .task(taskMapper.taskEntityToDto(comment.getTask()))
                .build();
    }

    public List<CommentDTO> commentListEntityToDto(List<Comment> comments){
        return comments.stream()
                .map(comment -> commentEntityToDto(comment))
                .toList();
    }

    public Comment commentDtoToEntity(CommentDTO commentDTO){
        return Comment.builder()
                .id(commentDTO.id())
                .content(commentDTO.content())
//                .user(userMapper.userDtoToEntity(commentDTO.user()))
//                .task(taskMapper.taskDtoToEntity(commentDTO.task()))
                .build();
    }

    public List<Comment> commentListDtoToEntity(List<CommentDTO> commentDTOS){
        return commentDTOS.stream()
                .map(commentDTO -> commentDtoToEntity(commentDTO))
                .toList();
    }
}
