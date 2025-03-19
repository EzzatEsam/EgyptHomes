package com.egypthomes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

import com.egypthomes.model.PropertyCategory;
import com.egypthomes.model.PropertyType;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PropertyCreationDTO {

    @NotBlank
    @Size(max = 300)
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

    @NotNull
    private PropertyCategory category;

    private Integer numberOfBedrooms;
    private Integer numberOfBathrooms;

    @NotNull
    private Integer area;

    private Boolean hasGarage;
    private Boolean hasSwimmingPool;
    private Boolean hasGarden;
    private Boolean hasAirConditioning;

    private List<String> images;
}
