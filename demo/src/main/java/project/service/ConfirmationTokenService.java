package project.service;

import org.springframework.stereotype.Component;
import project.model.ConfirmationToken;

import java.time.LocalDate;

@Component
public interface ConfirmationTokenService {

    ConfirmationToken createToken(String username);

    int updateToken (String newToken, LocalDate newConfirmationTime, LocalDate newExpireTime, Integer tokenId);

    boolean validateToken(String token);
    boolean confirmToken(String token);
    void deleteToken(String token);
}
