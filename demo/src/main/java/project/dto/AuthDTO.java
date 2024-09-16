package project.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import project.model.Role;

@Getter
@Setter
@Data
public class AuthDTO {
    private String username;
    private String password;
    private Role role;
}
