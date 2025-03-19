package com.egypthomes.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Table(name = "property_posts")
public class PropertyPost extends BaseModel {
    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_favorites", joinColumns = @JoinColumn(name = "property_post_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
    private List<User> favoritedBy;

    @Embedded
    private PropertyLocation location;

    @Column(nullable = false)
    @Enumerated(jakarta.persistence.EnumType.STRING)
    private PropertyCategory category;

    @Column(nullable = false)
    @Enumerated(jakarta.persistence.EnumType.STRING)
    private PropertyType propertyType;

    @Column(nullable = true)
    private String contactPhone;

    @Column(nullable = true)
    private String contactEmail;

    @Column(nullable = true)
    private Integer numberOfBedrooms;

    @Column(nullable = true)
    private Integer numberOfBathrooms;

    @Column(nullable = false)
    private Integer area;

    @Column(nullable = true)
    private Boolean hasGarden;

    @Column(nullable = true)
    private Boolean hasGarage;

    @Column(nullable = true)
    private Boolean hasSwimmingPool;

    @Column(nullable = true)
    private Boolean hasAirConditioning;

    @Builder.Default
    @ElementCollection
    @CollectionTable(name = "property_images")
    private List<String> imageUrls = new ArrayList<>();

}
