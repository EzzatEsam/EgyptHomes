package com.egypthomes.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterDTO {
        @NotBlank
        @Email
        String email;
        @NotBlank
        @Size(min = 8)
        String password;
        @NotBlank
        @Size(min = 3, max = 50)
        String firstName;
        @NotBlank
        @Size(min = 3, max = 50)
        String lastName;
        @Size(min = 11, max = 14)
        String phoneNumber;
}
