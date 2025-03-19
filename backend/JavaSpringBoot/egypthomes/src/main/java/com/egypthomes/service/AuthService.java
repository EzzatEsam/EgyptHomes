package com.egypthomes.service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.HashMap;
import java.util.Random;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.egypthomes.dto.AccessTokenDTO;
import com.egypthomes.dto.LoginDTO;
import com.egypthomes.dto.RegisterDTO;
import com.egypthomes.dto.UserDTO;
import com.egypthomes.exception.InvalidTokenException;
import com.egypthomes.mapper.UserMapper;
import com.egypthomes.model.User;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;

@Service
public class AuthService {

    @Value("${google.clientId}")
    private String googleClientId;

    @Value("${security.default.provider}")
    private String defaultProvider;

    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    private final UserMapper userMapper;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(PasswordEncoder passwordEncoder, UserService userService, UserMapper userMapper,
            AuthenticationManager authenticationManager, JwtService jwtService) {
        this.passwordEncoder = passwordEncoder;
        this.userService = userService;
        this.userMapper = userMapper;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Value("${auth.refreshtoken.expires.days}")
    private int refreshTokenExpiresDays;
    private final int refreshTokenLength = 20;
    private final String CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    public void register(RegisterDTO registerDTO) {
        var user = User.builder()
                .email(registerDTO.getEmail())
                .firstName(registerDTO.getFirstName())
                .lastName(registerDTO.getLastName())
                .phoneNumber(registerDTO.getPhoneNumber())
                .password(passwordEncoder.encode(registerDTO.getPassword()))
                .provider(
                        defaultProvider)
                .build();
        userService.addUser(user);
    }

    public AccessTokenDTO googleSignIn(String token) {
        HttpTransport transport = new NetHttpTransport();
        JsonFactory jsonFactory = GsonFactory.getDefaultInstance();
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
                // Specify the WEB_CLIENT_ID of the app that accesses the backend:
                .setAudience(Collections.singletonList(
                        googleClientId))
                // Or, if multiple clients access the backend:
                // .setAudience(Arrays.asList(WEB_CLIENT_ID_1, WEB_CLIENT_ID_2,
                // WEB_CLIENT_ID_3))
                .build();

        // (Receive idTokenString by HTTPS POST)

        GoogleIdToken idToken;
        try {
            idToken = verifier.verify(token);

            if (idToken != null) {
                Payload payload = idToken.getPayload();

                // Print user identifier
                String userId = payload.getSubject();
                System.out.println("User ID: " + userId);

                // Get profile information from payload
                String email = payload.getEmail();
                // boolean emailVerified = Boolean.valueOf(payload.getEmailVerified());
                // String name = (String) payload.get("name");
                String pictureUrl = (String) payload.get("picture");
                // String locale = (String) payload.get("locale");
                String familyName = (String) payload.get("family_name");
                String givenName = (String) payload.get("given_name");

                User user;
                user = userService.getUserByEmail(email).orElseGet(() -> {
                    var newUser = User.builder()
                            .email(email)
                            .firstName(givenName)
                            .lastName(familyName)
                            .pictureUrl(pictureUrl)
                            .password(passwordEncoder.encode(""))
                            .provider("google")
                            .build();
                    return userService.addUser(newUser);

                });

                var accessToken = jwtService.GenerateToken(user, new HashMap<>());
                var refreshToken = generateRefreshToken();
                userService.updateUserRefreshToken(user, refreshToken, refreshTokenExpiresDays);
                var accessTokenDTO = buildAccessTokenDTO(accessToken, refreshToken, user);
                return accessTokenDTO;
            } else {
                throw new InvalidTokenException("Invalid token");
            }
        } catch (Exception e) {
            throw new InvalidTokenException("Invalid token");
        }
    }

    public AccessTokenDTO login(LoginDTO loginDTO) {

        var user = userService.getUserByEmail(loginDTO.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Check if the user has a provider (Google, Facebook, etc.)
        if (user.getProvider() != null && user.getProvider().equals(defaultProvider)) {
            throw new InvalidTokenException("This account was registered using " + user.getProvider()
                    + ". Please sign in with " + user.getProvider());
        }
        var auth = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPassword()));
        if (auth.isAuthenticated()) {
            var accessToken = jwtService.GenerateToken(user, new HashMap<>());
            var refreshToken = generateRefreshToken();
            var accessTokenDTO = buildAccessTokenDTO(accessToken, refreshToken, user);

            userService.updateUserRefreshToken(user, refreshToken, refreshTokenExpiresDays);
            return accessTokenDTO;
        } else {
            throw new UsernameNotFoundException(String.format("User with email: %s not found", loginDTO.getEmail()));
        }
    }

    public AccessTokenDTO refresh(String refreshToken, String accessToken) {
        var email = jwtService.getUsernameFromToken(accessToken);

        var user = userService.getUserByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (user.getRefreshToken().equals(refreshToken) &&
                user.getRefreshTokenExpiry().isAfter(LocalDateTime.now())) {
            var newRefreshToken = generateRefreshToken();
            var newAccessToken = jwtService.GenerateToken(user, new HashMap<>());
            var accessTokenDTO = buildAccessTokenDTO(newAccessToken, newRefreshToken, user);

            userService.updateUserRefreshToken(user, refreshToken, refreshTokenExpiresDays);
            return accessTokenDTO;
        } else {
            throw new InvalidTokenException("Invalid refresh token");
        }
    }

    public void logout(String email) {
        var user = userService.getUserByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        userService.updateUserRefreshToken(user, null, 0);
    }

    private AccessTokenDTO buildAccessTokenDTO(String accessToken, String refreshToken, User user) {
        return AccessTokenDTO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(userMapper.toDTO(user))
                .expiresAt(jwtService.getJwtExpiration())
                .build();
    }

    public UserDTO getUserByEmail(String email) {
        var user = userService.getUserByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return userMapper.toDTO(user);
    }

    /**
     * @return
     */
    private String generateRefreshToken() {
        StringBuilder salt = new StringBuilder();
        Random rnd = new Random();
        while (salt.length() < refreshTokenLength) { // length of the random string.
            int index = (int) (rnd.nextFloat() * CHARS.length());
            salt.append(CHARS.charAt(index));
        }
        String saltStr = salt.toString();
        return saltStr;
    }

}
