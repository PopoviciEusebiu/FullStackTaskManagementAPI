package project.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.config.CustomLogoutHandler;
import project.model.AuthenticationResponse;
import project.model.User;
import project.service.AuthenticationService;
import project.service.ConfirmationTokenService;

@RestController
@CrossOrigin
public class AuthenticationController {

    private final AuthenticationService authService;
    private final CustomLogoutHandler logoutHandler;
    private final ConfirmationTokenService confirmationTokenService;

    public AuthenticationController(AuthenticationService authService, CustomLogoutHandler logoutHandler, ConfirmationTokenService confirmationTokenService) {
        this.authService = authService;
        this.logoutHandler = logoutHandler;
        this.confirmationTokenService = confirmationTokenService;
    }


    @Operation(
            summary = "Register user",
            description = "Register as a new user."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successful operation")
    })
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody User request
    ) {
        return ResponseEntity.ok(authService.register(request));
    }


    @Operation(
            summary = "Login user",
            description = "Login an user based on the username and password."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successful operation"),
            @ApiResponse(responseCode = "400", description = "Invalid username or password"),
            @ApiResponse(responseCode = "403", description = "Cannot login, please verify your email"),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody User request) {
        AuthenticationResponse response = authService.authenticate(request);
        if (response.getToken() == null) {
            if (response.getMessage().equals("Cannot login, please verify your email")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            } else if (response.getMessage().equals("User not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        }
        return ResponseEntity.ok(response);
    }


    @Operation(
            summary = "Logout user",
            description = "Logout an user."
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successful operation")
    })
    @GetMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        logoutHandler.logout(request, null, null);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/confirm/{confirmationToken}")
    public ResponseEntity<Boolean> confirmToken(@PathVariable String confirmationToken){
        boolean confirmationResult = confirmationTokenService.confirmToken(confirmationToken);
        if (confirmationResult) {
            return ResponseEntity.ok(true);
        } else {
            return ResponseEntity.badRequest().body(false);
        }

    }
}
