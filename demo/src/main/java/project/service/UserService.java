package project.service;

import org.springframework.stereotype.Component;
import project.dto.TaskDTO;
import project.dto.UserDTO;
import project.exceptions.ApiExceptionResponse;
import project.model.User;

import java.util.List;

@Component
public interface UserService {
    UserDTO getUserById(Integer id);
    List<UserDTO> getAllUsers();

    UserDTO updateUser(UserDTO user, Integer id) throws ApiExceptionResponse;

    void deleteUser(Integer id) throws ApiExceptionResponse;

    boolean isAdmin(User user);
    List<TaskDTO> getTasksByUserId(Integer adminId, Integer userId) throws ApiExceptionResponse;
    String exportUserDetails(Integer userId, String fileType);
    void setAllUsersLoggedFalse();
}
