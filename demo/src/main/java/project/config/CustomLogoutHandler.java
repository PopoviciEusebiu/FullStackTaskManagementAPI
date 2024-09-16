package project.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import project.model.Token;
import project.model.User;
import project.repository.TokenRepository;
import project.repository.UserRepository;

@Configuration
public class CustomLogoutHandler implements LogoutHandler {

    private final TokenRepository tokenRepository;
    private final UserRepository userRepository;

    public CustomLogoutHandler(TokenRepository tokenRepository, UserRepository userRepository) {
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void logout(HttpServletRequest request,
                       HttpServletResponse response,
                       Authentication authentication) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            Token storedToken = tokenRepository.findByToken(token).orElse(null);

            if (storedToken != null) {
                storedToken.setLoggedOut(true);
                tokenRepository.save(storedToken);

                User user = userRepository.findById(storedToken.getUser().getId()).orElse(null);
                if (user != null) {
                    user.setLogged(Boolean.FALSE);
                    userRepository.save(user);
                }
            }
        }
    }

}