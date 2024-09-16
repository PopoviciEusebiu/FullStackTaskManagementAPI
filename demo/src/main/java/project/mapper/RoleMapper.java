package project.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import project.dto.RoleDTO;
import project.model.Role;

import java.util.List;

@Component
@RequiredArgsConstructor
public class RoleMapper {

    public RoleDTO roleEntityToDto(Role role){
        return RoleDTO.builder()
                .role(role.getRole())
                .build();
    }

    public List<RoleDTO> roleListEntityToDto(List<Role> roles){
        return roles.stream()
                .map(this::roleEntityToDto)
                .toList();
    }

    public Role roleDtoToEntity(RoleDTO roleDto){
        return Role.builder()
                .role(roleDto.role())
                .build();
    }

    public List<Role> roleListDtoToEntity(List<RoleDTO> roleDtos){
        return roleDtos.stream()
                .map(roleDto -> roleDtoToEntity(roleDto))
                .toList();
    }
}
