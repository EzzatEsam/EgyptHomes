package com.egypthomes.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.egypthomes.model.PropertyCategory;
import com.egypthomes.model.PropertyType;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PropertyPostDTO {

    @NotNull
    private Long id;

    @NotBlank
    @Max(300)
    private String title;

    @NotBlank
    private String description;

    @NotNull
    private BigDecimal price;

    @NotNull
    private PropertyLocationDTO location;

    @Builder.Default
    private PropertyType propertyType = PropertyType.Buy;

    private String contactPhone;
    private String contactEmail;

    private PropertyCategory category;

    @NotNull
    private List<String> images;

    private Integer numberOfBedrooms;
    private Integer numberOfBathrooms;
    private Integer area;

    private Boolean hasGarage;
    private Boolean hasSwimmingPool;
    private Boolean hasGarden;
    private Boolean hasAirConditioning;

    @NotNull
    private UserDTO user;

    @NotNull
    private LocalDateTime createdAt;

    private Boolean isFavorited;
}
