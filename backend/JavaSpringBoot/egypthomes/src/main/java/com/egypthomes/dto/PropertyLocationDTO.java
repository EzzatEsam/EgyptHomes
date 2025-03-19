package com.egypthomes.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PropertyLocationDTO {

    private String street;

    @NotBlank
    private String city;

    @NotBlank
    private String governorate;

    private Float latitude;
    private Float longitude;
}
