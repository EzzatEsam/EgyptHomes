package com.egypthomes.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.egypthomes.exception.DuplicateEmailException;
import com.egypthomes.model.User;
import com.egypthomes.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;

    UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findFirstByEmail(email);
    }

    public Optional<User> getUserById(long id) {
        return userRepository.findFirstById(id);
    }

    @Transactional
    public User updateUser(User user) {
        return userRepository.save(user);
    }

    @Transactional
    public void updateUserRefreshToken(User user, String refreshToken, int refreshTokenExpiresDays) {
        user.setRefreshToken(refreshToken);
        user.setRefreshTokenExpiry(LocalDateTime.now().plusDays(refreshTokenExpiresDays));
        userRepository.save(user);
    }

    @Transactional
    public User addUser(User user) {
        var found = userRepository.findFirstByEmail(user.getEmail());
        if (found.isPresent()) {
            throw new DuplicateEmailException("Email: " + user.getEmail() + " already exists");
        }

        return userRepository.save(user);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return getUserByEmail(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
