package project.mapper;


import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;
import project.dto.GroupDTO;
import project.model.Group;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class GroupMapper {
    private final UserMapper userMapper;
    private final TaskMapper taskMapper;

    public GroupMapper(@Lazy UserMapper userMapper,@Lazy TaskMapper taskMapper) {
        this.userMapper = userMapper;
        this.taskMapper = taskMapper;
    }

    public GroupDTO groupEntityToDto(Group group){
        return GroupDTO.builder()
                .id(group.getId())
                .name(group.getName())
                .description(group.getDescription())
                .members(group.getMembers().stream().map(userMapper::userEntityToDto).toList())
                .tasks(group.getTasks().stream().map(taskMapper::taskEntityToDto).toList())
                .build();
    }

    public List<GroupDTO> groupListEntityToDto(List<Group> groups){
        return groups.stream()
                .map(this::groupEntityToDto)
                .collect(Collectors.toList());
    }

    public Group groupDtoToEntity(GroupDTO groupDTO){
        Group group = new Group();
        group.setId(groupDTO.id());
        group.setName(groupDTO.name());
        group.setDescription(groupDTO.description());
        return group;
    }

    public List<Group> groupDTOListToGroupList(List<GroupDTO> groupDTOs){
        return groupDTOs.stream()
                .map(this::groupDtoToEntity)
                .collect(Collectors.toList());
    }
}
