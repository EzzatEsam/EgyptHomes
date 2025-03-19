package com.egypthomes.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Embeddable
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class PropertyLocation {
    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String governorate;

    @Column(nullable = true)
    private String street;

    @Column(nullable = true)
    private Float longitude;

    @Column(nullable = true)
    private Float latitude;
}
