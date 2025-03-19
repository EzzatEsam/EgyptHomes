package com.egypthomes.dto;

import java.util.Date;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
@AllArgsConstructor
public class AccessTokenDTO {
        @NotBlank
        String accessToken;
        Date expiresAt;
        @NotBlank
        String refreshToken;
        @NotBlank
        UserDTO user;
}
