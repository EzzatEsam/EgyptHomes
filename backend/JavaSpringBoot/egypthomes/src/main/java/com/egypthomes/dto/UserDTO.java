package com.egypthomes.dto;

import io.micrometer.common.lang.Nullable;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class UserDTO {
        @NotBlank
        Long id;
        @NotBlank
        @Email
        String email;
        @NotBlank
        String firstName;
        @NotBlank
        String lastName;
        @Nullable
        String phoneNumber;
        @Nullable
        String pictureUrl;
}
