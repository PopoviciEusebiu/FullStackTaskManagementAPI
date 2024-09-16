package project.service.implementation;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import project.model.ConfirmationToken;
import project.model.User;
import project.repository.ConfirmationTokenRepository;
import project.repository.UserRepository;
import project.service.ConfirmationTokenService;
import project.service.EmailService;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class ConfirmationTokenServiceImpl implements ConfirmationTokenService {

    private final ConfirmationTokenRepository confirmationTokenRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Override
    public ConfirmationToken createToken(String username) {
        ConfirmationToken token = new ConfirmationToken();
        token.setConfirmationToken(UUID.randomUUID().toString());
        token.setCreatedTime(LocalDate.now());
        token.setExpireTime(LocalDate.now().plusDays(1));
        confirmationTokenRepository.save(token);

        token.setUser(userRepository.findByUsername(username));

        emailService.sendEmailForVerification(userRepository.findByUsername(username).getEmailAddress(), "http://localhost:3000/confirm/" + token.getConfirmationToken());

        return token;
    }

    @Override
    public int updateToken(String newToken, LocalDate newConfirmationTime, LocalDate newExpireTime, Integer tokenId) {
        return confirmationTokenRepository.updateToken(newToken, newConfirmationTime, newExpireTime, tokenId);
    }

    @Override
    public boolean validateToken(String token) {
        Optional<ConfirmationToken> confirmationToken = confirmationTokenRepository.findConfirmationTokenByConfirmationToken(token);
        return confirmationToken.map(t -> !t.getExpireTime().isBefore(LocalDate.now()) && t.getConfirmationTime() == null)
                .orElse(false);
    }

    @Override
    public boolean confirmToken(String token) {
        Optional<ConfirmationToken> confirmationToken = confirmationTokenRepository.findConfirmationTokenByConfirmationToken(token);
        if (confirmationToken.isPresent() && confirmationToken.get().getExpireTime().isAfter(LocalDate.now())) {
            confirmationToken.get().setConfirmationTime(LocalDate.now());
            confirmationTokenRepository.save(confirmationToken.get());

            User user = confirmationToken.get().getUser();
            user.setActivated(true);
            return true;
        }
        return false;
    }

    @Override
    public void deleteToken(String token) {
        confirmationTokenRepository.deleteConfirmationTokenByConfirmationToken(token);
    }
}
