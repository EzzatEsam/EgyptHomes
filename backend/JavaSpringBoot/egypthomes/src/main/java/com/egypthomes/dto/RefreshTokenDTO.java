package com.egypthomes.dto;

public record RefreshTokenDTO(
    String refreshToken,
    String accessToken
) {
    
}
