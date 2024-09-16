package project.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import project.model.AuthenticationResponse;
import project.model.ConfirmationToken;
import project.model.Token;
import project.model.User;
import project.repository.RoleRepository;
import project.repository.TokenRepository;
import project.repository.UserRepository;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JWTService jwtService;

    private final TokenRepository tokenRepository;

    private final AuthenticationManager authenticationManager;
    private final RoleRepository roleRepository;
    private final ConfirmationTokenService confirmationTokenService;


    public AuthenticationResponse register(User request) {

        // check if user already exist. if exist than authenticate the user
        if (repository.findByUsername(request.getUsername()) != null) {
            return new AuthenticationResponse(null, "User already exist");
        }

        User user = User.builder()
                .username(request.getUsername())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .password(passwordEncoder.encode(request.getPassword()))
                .emailAddress(request.getEmailAddress())
                .logged(Boolean.FALSE)
                .roles(List.of(roleRepository.findByRole("USER")))
                .isActivated(Boolean.FALSE)
                .confirmationToken(null)
                .build();

        user = repository.save(user);

        String jwt = jwtService.generateToken(user);

        saveUserToken(jwt, user);

        ConfirmationToken confirmationToken = confirmationTokenService.createToken(user.getUsername());
        user.setConfirmationToken(confirmationToken);


        return new AuthenticationResponse(jwt, "Registration successful. Please verify your email.");

    }


    public AuthenticationResponse authenticate(User request) {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );

            User user = repository.findByUsername(request.getUsername());
            if (user == null) {
                return new AuthenticationResponse(null, "User not found");
            }

            if (!user.isActivated()) {
                return new AuthenticationResponse(null, "Cannot login, please verify your email");
            }

            user.setLogged(Boolean.TRUE);
            String jwt = jwtService.generateToken(user);

            revokeAllTokenByUser(user);
            saveUserToken(jwt, user);

            return new AuthenticationResponse(jwt, "User login was successful");
    }

    private void revokeAllTokenByUser(User user) {
        List<Token> validTokens = tokenRepository.findAllTokensByUser(user.getId());
        if (validTokens.isEmpty()) {
            return;
        }

        validTokens.forEach(t -> {
            t.setLoggedOut(true);
        });

        tokenRepository.saveAll(validTokens);
    }

    private void saveUserToken(String jwt, User user) {
        Token token = new Token();
        token.setToken(jwt);
        token.setLoggedOut(false);
        token.setUser(user);
        tokenRepository.save(token);
    }

}