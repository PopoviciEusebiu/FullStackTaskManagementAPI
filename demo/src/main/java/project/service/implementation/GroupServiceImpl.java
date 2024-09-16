package project.service.implementation;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import project.dto.GroupDTO;
import project.dto.TaskDTO;
import project.dto.UserDTO;
import project.exceptions.ApiExceptionResponse;
import project.mapper.GroupMapper;
import project.mapper.TaskMapper;
import project.mapper.UserMapper;
import project.model.Group;
import project.model.Task;
import project.model.User;
import project.repository.GroupRepository;
import project.repository.TaskRepository;
import project.repository.UserRepository;
import project.service.GroupService;
import project.service.TaskService;
import project.service.UserService;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class GroupServiceImpl implements GroupService {
    private final GroupRepository groupRepository;
    private final GroupMapper groupMapper;
    private final TaskRepository taskRepository;
    private final TaskService taskService;
    private final UserService userService;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final TaskMapper taskMapper;

    /**
     * Returnează un obiect GroupDTO asociat unui ID de grup sau null dacă grupul nu poate fi găsit.
     *
     * @param id ID-ul grupului căutat.
     * @return Obiectul GroupDTO corespunzător grupului sau null.
     */
    @Override
    public GroupDTO getGroupById(Integer id) {
        return groupRepository.findById(id)
                .map(groupMapper::groupEntityToDto)
                .orElse(null);
    }

    /**
     * Returnează o listă de obiecte GroupDTO care reprezintă toate grupurile din sistem.
     *
     * @return O listă de obiecte GroupDTO care reprezintă grupurile din sistem.
     */
    @Override
    public List<GroupDTO> getAllGroups() {
        List<Group> groups = groupRepository.findAll();
        return groups.stream()
                .map(groupMapper::groupEntityToDto)
                .collect(Collectors.toList());
    }

    /**
     * Returnează o listă de obiecte GroupDTO care reprezintă toate grupurile ale unui user.
     *
     * @return O listă de obiecte GroupDTO care reprezintă grupurile ale unui user.
     */

    @Override
    public List<GroupDTO> getMyGroups(String username) {
        List<Group> groups = groupRepository.findAll();
        return groups.stream()
                .map(groupMapper::groupEntityToDto)
                .filter(groupDTO -> groupDTO.members().stream()
                        .anyMatch(member -> member.username().equals(username)))
                .collect(Collectors.toList());
    }




    /**
     * Creează un nou grup pe baza datelor primite și returnează obiectul GroupDTO corespunzător.
     *
     * @param groupDTO Obiectul GroupDTO care conține datele grupului de creat.
     * @return Obiectul GroupDTO reprezentând grupul creat.
     */
    public GroupDTO createGroup(GroupDTO groupDTO, String creatorUsername) {
        Group group = groupMapper.groupDtoToEntity(groupDTO);
        User creator = userRepository.findByUsername(creatorUsername);

        if (group.getMembers() == null) {
            group.setMembers(new ArrayList<>());
        }
        if (group.getTasks() == null) {
            group.setTasks(new ArrayList<>());
        }

        group.getMembers().add(creator);

        Group savedGroup = groupRepository.save(group);

        return groupMapper.groupEntityToDto(savedGroup);
    }

    /**
     * Actualizează detaliile unui grup existent și returnează obiectul GroupDTO actualizat.
     *
     * @param groupDTO Obiectul GroupDTO care conține detaliile actualizate ale grupului.
     * @param id       ID-ul grupului de actualizat.
     * @return Obiectul GroupDTO actualizat.
     */
    @Override
    public GroupDTO updateGroup(GroupDTO groupDTO, Integer id) {
        Group existingGroup = groupRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Group not found with ID: " + id));

        existingGroup.setName(groupDTO.name());
        existingGroup.setDescription(groupDTO.description());
        Group updatedGroup = groupRepository.save(existingGroup);
        return groupMapper.groupEntityToDto(updatedGroup);
    }

    /**
     * Permite unui utilizator să șteargă un grup dacă este membru al acestuia.
     *
     * @param userId  ID-ul utilizatorului care dorește să șteargă grupul.
     * @param groupId ID-ul grupului care urmează să fie șters.
     * @throws IllegalArgumentException dacă grupul sau utilizatorul nu pot fi găsiți sau utilizatorul nu este membru al grupului.
     */
    @Override
    public void deleteGroupIfMember(Integer userId, Integer groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found with ID: " + groupId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        boolean isMember = group.getMembers().stream().anyMatch(u -> u.getId().equals(userId));
        if (!isMember) {
            throw new IllegalStateException("User is not a member of the group");
        }

        for (Task task : group.getTasks()) {
            for (User taskUser : task.getUsers()) {
                taskUser.getTasks().remove(task);
            }
            task.getUsers().clear();
            taskRepository.save(task);
        }

        taskRepository.deleteAll(group.getTasks());

        group.getMembers().clear();

        groupRepository.save(group);

        groupRepository.delete(group);
    }

    /**
     * Adaugă un nou task într-un grup.
     *
     * @param taskDTO Obiectul TaskDTO care conține datele taskului de creat.
     * @param groupId ID-ul grupului în care va fi adăugat taskul.
     * @return TaskDTO obiectul TaskDTO reprezentând taskul creat.
     */
    @Override
    public TaskDTO addTaskToGroup(TaskDTO taskDTO, Integer groupId) throws ApiExceptionResponse {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found with ID: " + groupId));

        Task task = taskMapper.taskDtoToEntity(taskDTO);

        if (task.getUsers() == null) {
            task.setUsers(new ArrayList<>());
        }

        List<User> users = group.getMembers();
        for (User user : users) {
            task.getUsers().add(user);
            user.getTasks().add(task);
        }

        task.setGroup(group);

        Task savedTask = taskRepository.save(task);

        userRepository.saveAll(users);

        return taskMapper.taskEntityToDto(savedTask);
    }




    /**
     * Elimină un task specific dintr-un grup.
     *
     * @param taskId ID-ul taskului care trebuie șters.
     * @param groupId ID-ul grupului din care taskul trebuie eliminat.
     * @return Boolean indicând dacă ștergerea a fost efectuată cu succes.
     * @throws IllegalArgumentException dacă grupul sau taskul nu pot fi găsiți, sau dacă taskul nu aparține grupului.
     */
    @Override
    public boolean deleteTaskFromGroup(Integer taskId, Integer groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found with ID: " + groupId));
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with ID: " + taskId));

        if (!task.getGroup().getId().equals(group.getId())) {
            throw new IllegalArgumentException("Task does not belong to the specified group");
        }

        for (User user : task.getUsers()) {
            user.getTasks().remove(task);
        }
        task.getUsers().clear();

        taskRepository.delete(task);
        return true;
    }

    /**
     * Permite unui utilizator să actualizeze un task dintr-un grup dacă este membru al grupului.
     *
     * @param userId  ID-ul utilizatorului care dorește să actualizeze taskul.
     * @param taskDTO Obiectul TaskDTO care conține datele taskului de actualizat.
     * @param groupId ID-ul grupului în care se află taskul.
     * @throws IllegalArgumentException dacă grupul, utilizatorul sau taskul nu pot fi găsiți sau utilizatorul nu este membru al grupului.
     */
    @Override
    public TaskDTO updateTaskFromGroup(Integer userId, TaskDTO taskDTO, Integer groupId, Integer taskId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found with ID: " + groupId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found with ID: " + taskDTO.id()));

        if (!group.getMembers().contains(user)) {
            throw new IllegalArgumentException("User is not a member of the group");
        }

        task.setTitle(taskDTO.title());
        task.setDescription(taskDTO.description());
        task.setDueDate(taskDTO.dueDate());
        task.setStatus(taskDTO.status());

        Task updatedTask = taskRepository.save(task);
        return taskMapper.taskEntityToDto(updatedTask);
    }

    /**
     * Înscrie un utilizator într-un grup dat.
     *
     * @param userId ID-ul utilizatorului care va fi însris în grup.
     * @param groupId ID-ul grupului în care utilizatorul va fi însris.
     * @return GroupDTO grupul actualizat.
     */
    @Override
    public GroupDTO enrollUserToGroup(Integer userId, Integer groupId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found with ID: " + groupId));

        if (group.getMembers().contains(user)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User is already a member of the group.");
        }

        group.getMembers().add(user);

        for (Task task : group.getTasks()) {
            task.getUsers().add(user);
            user.getTasks().add(task);
            taskRepository.save(task);
        }

        Group updatedGroup = groupRepository.save(group);



        return groupMapper.groupEntityToDto(updatedGroup);
    }

    /**
     * Permite unui utilizator să părăsească un grup specificat.
     *
     * @param userId ID-ul utilizatorului care dorește să părăsească grupul.
     * @param groupId ID-ul grupului din care utilizatorul dorește să iasă.
     * @return GroupDTO reprezentând starea actualizată a grupului sau null dacă grupul nu mai există.
     * @throws IllegalArgumentException dacă grupul sau utilizatorul nu pot fi găsiți.
     */
    @Override
    public GroupDTO leaveGroup(Integer userId, Integer groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found with ID: " + groupId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        boolean removed = group.getMembers().removeIf(u -> u.getId().equals(userId));
        if (!removed) {
            throw new IllegalStateException("User not found in the group or could not be removed");
        }

        for (Task task : group.getTasks()) {
            task.getUsers().removeIf(u -> u.getId().equals(userId));
            user.getTasks().removeIf(u -> u.getId().equals(task.getId()));
        }

        taskRepository.saveAll(group.getTasks());

        groupRepository.save(group);

        return groupMapper.groupEntityToDto(group);
    }

    @Override
    public List<UserDTO> getGroupMembers(Integer groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found with ID: " + groupId));
        return group.getMembers().stream()
                .map(userMapper::userEntityToDto)
                .collect(Collectors.toList());
    }
    @Override
    public List<TaskDTO> getGroupTasks(Integer groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found with ID: " + groupId));
        return group.getTasks().stream()
                .map(taskMapper::taskEntityToDto)
                .collect(Collectors.toList());
    }
    @Override
    public List<UserDTO> getOnlineGroupMembers(Integer groupId) {
        Group group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found with ID: " + groupId));


        List<UserDTO> onlineMembers = group.getMembers().stream()
                .filter(User::getLogged)
                .map(userMapper::userEntityToDto)
                .collect(Collectors.toList());

        return onlineMembers;
    }

}