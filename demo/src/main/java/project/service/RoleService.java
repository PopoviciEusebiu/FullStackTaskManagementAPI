package project.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import project.dto.RoleDTO;
import project.mapper.RoleMapper;
import project.model.Role;
import project.repository.RoleRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;

    private final RoleMapper roleMapper;

    public RoleDTO getRoleById(Integer id){
        return roleMapper.roleEntityToDto(roleRepository.findById(Integer.valueOf(id)).orElse(null));
    }

    public RoleDTO findByRole(String role){
        return roleMapper.roleEntityToDto(roleRepository.findByRole(role));
    }

    public List<RoleDTO> getAllRoles(){
        return roleMapper.roleListEntityToDto(roleRepository.findAll());
    }

    public RoleDTO createRole(Role role){
        return roleMapper.roleEntityToDto(roleRepository.save(role));
    }

    public RoleDTO updateRole(Role role){
        return roleMapper.roleEntityToDto(roleRepository.save(role));
    }

    public void deleteRole(Role role){
        roleRepository.delete(role);
    }


}
