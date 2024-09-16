package project.service.implementation;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import project.constants.FileType;
import project.dto.TaskDTO;
import project.dto.UserDTO;
import project.exceptions.ApiExceptionResponse;
import project.exporter.FileExporter;
import project.exporter.TXTFileExporter;
import project.exporter.XMLFileExporter;
import project.mapper.TaskMapper;
import project.mapper.UserMapper;
import project.model.User;
import project.repository.GroupRepository;
import project.repository.RoleRepository;
import project.repository.TaskRepository;
import project.repository.UserRepository;
import project.service.UserService;
import project.model.Group;
import project.model.Task;


import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final TaskMapper taskMapper;
    private final RoleRepository roleRepository;
    private final TaskRepository taskRepository;
    private final GroupRepository groupRepository;

    /**
     * Această metodă primește un ID de utilizator și returnează un obiect UserDTO asociat acestui ID sau null dacă utilizatorul nu poate fi găsit.
     *
     * @param id ID-ul utilizatorului căutat.
     * @return Un obiect UserDTO corespunzător utilizatorului sau null.
     */
    @Override
    public UserDTO getUserById(Integer id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return null;
        }
        return userMapper.userEntityToDto(user);
    }

    /**
     * Această metodă returnează o listă de obiecte UserDTO care reprezintă toți utilizatorii din sistem.
     *
     * @return O listă de obiecte UserDTO care reprezintă utilizatorii din sistem.
     */
    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::userEntityToDto)
                .collect(Collectors.toList());
    }



    /**
     * Această metodă actualizează detaliile utilizatorului cu ID-ul specificat și returnează obiectul UserDTO actualizat sau aruncă o excepție ApiExceptionResponse dacă utilizatorul nu poate fi găsit.
     *
     * @param userDTO Obiectul UserDTO care conține detaliile actualizate ale utilizatorului.
     * @param id      ID-ul utilizatorului de actualizat.
     * @return Un obiect UserDTO care reprezintă utilizatorul actualizat.
     * @throws ApiExceptionResponse Excepție aruncată dacă utilizatorul nu poate fi găsit.
     */
    @Override
    public UserDTO updateUser(UserDTO userDTO, Integer id) throws ApiExceptionResponse {
        User existingUser = userRepository.findById(id).orElse(null);
        if (existingUser != null) {
            existingUser.setUsername(userDTO.username());
            existingUser.setEmailAddress(userDTO.emailAddress());
            existingUser.setFirstName(userDTO.firstName());
            existingUser.setLastName(userDTO.lastName());

            User updatedUser = userRepository.save(existingUser);
            System.out.println("User updated successfully: " + updatedUser.getUsername());
            return userMapper.userEntityToDto(updatedUser);
        } else {
            ArrayList<String> errors = new ArrayList<>();
            errors.add("User with ID " + id + " might not exist");

            throw ApiExceptionResponse.builder()
                    .errors(errors)
                    .message("User not found")
                    .status(HttpStatus.NOT_FOUND)
                    .build();
        }
    }

    /**
     * Această metodă șterge utilizatorul cu ID-ul specificat sau aruncă o excepție ApiExceptionResponse dacă utilizatorul nu poate fi găsit.
     *
     * @param id ID-ul utilizatorului de șters.
     * @throws ApiExceptionResponse Excepție aruncată dacă utilizatorul nu poate fi găsit.
     */
    @Override
    public void deleteUser(Integer id) throws ApiExceptionResponse {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();

            for (Group group : groupRepository.findAll()) {
                if (group.getMembers().contains(user)) {
                    group.getMembers().remove(user);
                    groupRepository.save(group);
                }
            }

            for (Task task : user.getTasks()) {
                task.getUsers().remove(user);
                taskRepository.save(task);
            }

            userRepository.delete(user);
            System.out.println("User deleted successfully: " + user.getUsername());
        } else {
            ArrayList<String> errors = new ArrayList<>();
            errors.add("User with id " + id + " does not exist");

            throw ApiExceptionResponse.builder()
                    .message("User not found")
                    .status(HttpStatus.NOT_FOUND)
                    .errors(errors)
                    .build();
        }
    }

    public void setAllUsersLoggedFalse() {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            user.setLogged(false);
        }
        userRepository.saveAll(users);
    }


    /**
     * Această metodă verifică dacă utilizatorul specificat are rolul de administrator.
     *
     * @param user Utilizatorul pentru care se verifică rolul de administrator.
     * @return true dacă utilizatorul are rolul de administrator, false în caz contrar.
     */
    @Override
    public boolean isAdmin(User user) {
        return user.getRoles().stream().anyMatch(role -> role.getRole().equals("ADMIN"));
    }

    /**
     * Această metodă returnează o listă de obiecte TaskDTO pentru toate sarcinile asociate utilizatorului cu ID-ul specificat sau aruncă o excepție ApiExceptionResponse dacă administratorul nu poate fi găsit sau nu este autentificat.
     *
     * @param adminId ID-ul administratorului care face cererea.
     * @param userId  ID-ul utilizatorului pentru care se caută sarcinile asociate.
     * @return O listă de obiecte TaskDTO care reprezintă sarcinile asociate utilizatorului.
     * @throws ApiExceptionResponse Excepție aruncată dacă administratorul nu poate fi găsit sau nu este autentificat.
     */
    @Override
    public List<TaskDTO> getTasksByUserId(Integer adminId, Integer userId) throws ApiExceptionResponse {
        User admin = userRepository.findById(adminId).orElse(null);
        if (admin == null || !isAdmin(admin)) {
            ArrayList<String> errors = new ArrayList<>();
            errors.add("Invalid login details for ");

            throw ApiExceptionResponse.builder()
                    .errors(errors)
                    .message("Login failed")
                    .status(HttpStatus.NOT_FOUND)
                    .build();
        }

        return taskRepository.findByUserId(userId).stream()
                .map(taskMapper::taskEntityToDto)
                .collect(Collectors.toList());
    }

    @Override
    public String exportUserDetails(Integer userId, String fileType) {
        User user = userRepository.findUserById(userId);
        FileExporter fileExporter;
        if (fileType.equals(FileType.XML)) {
            fileExporter = new XMLFileExporter();
            return fileExporter.exportData(user);
        } else if (fileType.equals(FileType.TXT)) {
            fileExporter = new TXTFileExporter();
            return fileExporter.exportData(user);
        }
        return null;
    }



}
