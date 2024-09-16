package project.service.implementation;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import project.constants.TaskStatus;
import project.dto.TaskDTO;
import project.dto.UserDTO;
import project.exceptions.ApiExceptionResponse;
import project.mapper.TaskMapper;
import project.model.Task;
import project.model.User;
import project.repository.TaskRepository;
import project.repository.UserRepository;
import project.service.TaskService;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {
    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;
    private final UserRepository userRepository;

    /**
     * Returnează un obiect TaskDTO asociat unui ID de sarcină sau null dacă sarcina nu poate fi găsită.
     *
     * @param id ID-ul sarcinii căutate.
     * @return Obiectul TaskDTO corespunzător sarcinii sau null.
     */
    @Override
    public TaskDTO getTaskById(Integer id) {
        Task task = taskRepository.findById(id).orElse(null);
        if (task == null) {
            return null;
        }
        return taskMapper.taskEntityToDto(task);
    }

    /**
     * Returnează o listă de obiecte TaskDTO care reprezintă toate sarcinile din sistem.
     *
     * @return O listă de obiecte TaskDTO care reprezintă sarcinile din sistem.
     */
    @Override
    public List<TaskDTO> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(taskMapper::taskEntityToDto)
                .collect(Collectors.toList());
    }

    /**
     * Creează o nouă sarcină pe baza datelor primite și returnează obiectul TaskDTO corespunzător.
     *
     * @param taskDTO Obiectul TaskDTO care conține datele sarcinii de creat.
     * @return Obiectul TaskDTO reprezentând sarcina creată.
     * @throws ApiExceptionResponse Excepție aruncată în cazul în care utilizatorul asociat sarcinii nu poate fi găsit.
     */
    @Override
    public TaskDTO createTask(TaskDTO taskDTO) throws ApiExceptionResponse {
        Task task = taskMapper.taskDtoToEntity(taskDTO);
        List<UserDTO> userDTOs = taskDTO.users();

        if (userDTOs == null || userDTOs.isEmpty()) {
            ArrayList<String> errors = new ArrayList<>();
            errors.add("No users provided");

            throw ApiExceptionResponse.builder()
                    .errors(errors)
                    .message("Task must have at least one user")
                    .status(HttpStatus.BAD_REQUEST)
                    .build();
        }

        List<User> users = userDTOs.stream()
                .map(userDTO -> userRepository.findByUsername(userDTO.username()))
                .collect(Collectors.toList());

        if (users.contains(null)) {
            ArrayList<String> errors = new ArrayList<>();
            errors.add("One or more users might not exist");

            throw ApiExceptionResponse.builder()
                    .errors(errors)
                    .message("Users not found")
                    .status(HttpStatus.NOT_FOUND)
                    .build();
        }

        if (task.getUsers() == null) {
            task.setUsers(new ArrayList<>());
        }

        for (User user : users) {
            task.getUsers().add(user);
            user.getTasks().add(task);
        }

        Task savedTask = taskRepository.save(task);

        userRepository.saveAll(users);

        return taskMapper.taskEntityToDto(savedTask);
    }





    /**
     * Actualizează detaliile unei sarcini existente și returnează obiectul TaskDTO actualizat.
     *
     * @param taskDTO Obiectul TaskDTO care conține detaliile actualizate ale sarcinii.
     * @param id      ID-ul sarcinii de actualizat.
     * @return Obiectul TaskDTO actualizat.
     * @throws ApiExceptionResponse Excepție aruncată dacă sarcina nu poate fi găsită.
     */
    @Override
    public TaskDTO updateTask(TaskDTO taskDTO, Integer id) throws ApiExceptionResponse {
        Task existingTask = taskRepository.findById(id).orElse(null);
        if (existingTask != null) {
            existingTask.setTitle(taskDTO.title());
            existingTask.setDescription(taskDTO.description());
            existingTask.setDueDate(taskDTO.dueDate());
            existingTask.setStatus(taskDTO.status());

            Task updatedTask = taskRepository.save(existingTask);
            System.out.println("Task updated successfully: " + updatedTask.getTitle());
            return taskMapper.taskEntityToDto(updatedTask);
        } else {
            ArrayList<String> errors = new ArrayList<>();
            errors.add("The task '" + taskDTO.title() + "' with ID " + id + " might not exist");

            throw ApiExceptionResponse.builder()
                    .errors(errors)
                    .message("Task not found")
                    .status(HttpStatus.NOT_FOUND)
                    .build();
        }
    }

    /**
     * Șterge o sarcină din sistem pe baza ID-ului specificat.
     *
     * @param id ID-ul sarcinii de șters.
     * @throws ApiExceptionResponse Excepție aruncată dacă sarcina nu poate fi găsită.
     */
    @Override
    public void deleteTask(Integer id) throws ApiExceptionResponse {
        Task task = taskRepository.findById(id).orElse(null);
        if (task != null) {
            for (User user : task.getUsers()) {
                user.getTasks().remove(task);
            }
            task.getUsers().clear();
            taskRepository.delete(task);
            System.out.println("Task deleted successfully: " + task.getTitle());
        } else {
            ArrayList<String> errors = new ArrayList<>();
            errors.add("Task with ID " + id + " does not exist");

            throw ApiExceptionResponse.builder()
                    .message("Task not found")
                    .status(HttpStatus.NOT_FOUND)
                    .errors(errors)
                    .build();
        }
    }

    /**
     * Returnează o listă de sarcini finalizate din istoricul sistemului.
     *
     * @return O listă de sarcini finalizate din istoricul sistemului.
     */
    @Override
    public List<TaskDTO> getCompletedTasksHistory(String username) {
        List<Task> tasks = taskRepository.findAllByStatus(TaskStatus.DONE);
        List<Task> completedTasks = new ArrayList<>();
        for (Task task : tasks) {
            if (task.getUsers().stream().anyMatch(user -> user.getUsername().equals(username))) {
                completedTasks.add(task);
            }
        }
        return completedTasks.stream()
                .map(taskMapper::taskEntityToDto)
                .collect(Collectors.toList());
    }


    /**
     * Returnează o listă de sarcini de făcut din istoricul sistemului.
     *
     * @return O listă de sarcini de făcut din istoricul sistemului.
     */
    @Override
    public List<TaskDTO> getToDoTasksHistory(String username) {
        List<Task> tasks = taskRepository.findAllByStatus(TaskStatus.TODO);
        List<Task> todoTasks = new ArrayList<>();
        for (Task task : tasks) {
            if (task.getUsers().stream().anyMatch(user -> user.getUsername().equals(username))) {
                todoTasks.add(task);
            }
        }
        return todoTasks.stream()
                .map(taskMapper::taskEntityToDto)
                .collect(Collectors.toList());
    }



    /**
     * Returnează o listă de sarcini ale unui utilizator sortate după data limită în ordine crescătoare.
     *
     * @param id ID-ul utilizatorului pentru care se caută sarcinile.
     * @return O listă de sarcini ale utilizatorului sortate după data limită în ordine crescătoare.
     */
    @Override
    public List<TaskDTO> getAllTasksSortedByDueDateAsc(Integer id) {
        return taskRepository.findByUserIdOrderByDueDateAsc(id).stream()
                .map(taskMapper::taskEntityToDto)
                .collect(Collectors.toList());
    }

    /**
     * Returnează o listă de sarcini ale unui utilizator sortate după data limită în ordine descrescătoare.
     *
     * @param id ID-ul utilizatorului pentru care se caută sarcinile.
     * @return O listă de sarcini ale utilizatorului sortate după data limită în ordine descrescătoare.
     */
    @Override
    public List<TaskDTO> getAllTasksSortedByDueDateDesc(Integer id) {
        return taskRepository.findByUserIdOrderByDueDateDesc(id).stream()
                .map(taskMapper::taskEntityToDto)
                .collect(Collectors.toList());
    }


    /**
     * Returnează o listă de obiecte TaskDTO care reprezintă toate sarcinile din sistem.
     *
     * @return O listă de obiecte TaskDTO care reprezintă sarcinile din sistem.
     */
    @Override
    public List<TaskDTO> findTasksByUsername(String username) {
        List<Task> tasks = taskRepository.findAll().stream()
                .filter(task -> task.getUsers().stream().anyMatch(user -> user.getUsername().equals(username)))
                .collect(Collectors.toList());

        return tasks.stream()
                .map(taskMapper::taskEntityToDto)
                .collect(Collectors.toList());
    }


}
