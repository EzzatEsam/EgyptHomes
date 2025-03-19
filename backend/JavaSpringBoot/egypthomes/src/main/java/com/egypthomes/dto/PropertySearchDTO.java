package com.egypthomes.dto;

import com.egypthomes.model.PropertyCategory;
import com.egypthomes.model.PropertyType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PropertySearchDTO {
    @Builder.Default
    private String city = null;
    @Builder.Default
    private String governorate = null;
    private Integer minBathrooms;
    private Integer minBedrooms;
    @Builder.Default
    private String street = null;
    private Double minPrice;
    private Double maxPrice;
    private PropertyType propertyType;
    private PropertyCategory propertyCategory;
    @Builder.Default
    private Boolean hasGarage = null;
    @Builder.Default
    private Boolean hasSwimmingPool = null;
    @Builder.Default
    private Boolean hasGarden = null;
    @Builder.Default
    private Boolean hasAirConditioning = null;
    @Builder.Default
    private Integer minArea = null;
}
