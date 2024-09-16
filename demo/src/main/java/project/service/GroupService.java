package project.service;

import org.springframework.stereotype.Component;
import project.dto.GroupDTO;
import project.dto.TaskDTO;
import project.dto.UserDTO;
import project.exceptions.ApiExceptionResponse;

import java.util.List;

@Component
public interface GroupService {

    GroupDTO getGroupById(Integer id);
    List<GroupDTO> getAllGroups();
    GroupDTO createGroup(GroupDTO groupDTO, String creatorUsername);
    GroupDTO updateGroup(GroupDTO groupDTO, Integer id);
    TaskDTO addTaskToGroup(TaskDTO taskDTO, Integer groupId) throws ApiExceptionResponse;
    GroupDTO enrollUserToGroup(Integer userId, Integer groupId);
    List<UserDTO> getGroupMembers(Integer groupId);
    List<UserDTO> getOnlineGroupMembers(Integer groupId);
    List<TaskDTO> getGroupTasks(Integer groupId);
    boolean deleteTaskFromGroup(Integer taskId, Integer groupId);
    GroupDTO leaveGroup(Integer userId, Integer groupId);
    void deleteGroupIfMember(Integer userId, Integer groupId);
    TaskDTO updateTaskFromGroup(Integer userId, TaskDTO taskDTO, Integer groupId, Integer taskId);
    List<GroupDTO> getMyGroups(String username);
}
