
package com.egypthomes.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.egypthomes.dto.AccessTokenDTO;
import com.egypthomes.dto.ErrorResponseDTO;
import com.egypthomes.dto.GoogleSignInRequest;
import com.egypthomes.dto.LoginDTO;
import com.egypthomes.dto.RefreshTokenDTO;
import com.egypthomes.dto.RegisterDTO;
import com.egypthomes.dto.UserDTO;
import com.egypthomes.exception.DuplicateEmailException;
import com.egypthomes.service.AuthService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Validated @RequestBody RegisterDTO registerDTO) {
        try {
            authService.register(registerDTO);
            return ResponseEntity.ok(registerDTO);

        } catch (DuplicateEmailException e) {
            return ResponseEntity.badRequest().body(new ErrorResponseDTO(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ErrorResponseDTO(e.getMessage()));
        }
    }

    @PostMapping("/google-signin")
    public ResponseEntity<AccessTokenDTO> postMethodName(@RequestBody @Validated GoogleSignInRequest request) {
        return ResponseEntity.ok(authService.googleSignIn(request.getIdToken()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Validated @RequestBody LoginDTO entity) {
        try {
            var token = authService.login(entity);
            return ResponseEntity.ok(token);
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<AccessTokenDTO> postMethodName(@RequestBody RefreshTokenDTO refreshTokenDTO) {
        var token = authService.refresh(refreshTokenDTO.refreshToken(), refreshTokenDTO.accessToken());
        return ResponseEntity.ok(token);
    }

    @DeleteMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody RefreshTokenDTO refreshTokenDTO) {
        authService.logout(refreshTokenDTO.refreshToken());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user")
    public ResponseEntity<UserDTO> getMethodName(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(authService.getUserByEmail(userDetails.getUsername()));
    }

}