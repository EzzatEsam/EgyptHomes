package com.egypthomes.mapper;

import org.springframework.stereotype.Component;

import com.egypthomes.dto.UserDTO;
import com.egypthomes.model.User;

@Component
public class UserMapper {
    public User toEntity(UserDTO user) {
        if (user == null) {
            return null;
        }
        return User.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .phoneNumber(user.getPhoneNumber())
                .pictureUrl(user.getPictureUrl())
                .build();

    }

    public UserDTO toDTO(User user) {
        if (user == null) {
            return null;
        }
        return new UserDTO(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhoneNumber(),
                user.getPictureUrl());
    }

}