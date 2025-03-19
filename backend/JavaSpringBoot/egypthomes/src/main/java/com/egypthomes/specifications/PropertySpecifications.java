package com.egypthomes.specifications;

import com.egypthomes.dto.PropertySearchDTO;
import com.egypthomes.model.PropertyCategory;
import com.egypthomes.model.PropertyPost;
import com.egypthomes.model.PropertyType;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.lang.NonNull;

public class PropertySpecifications {

    public static Specification<PropertyPost> withSearch(PropertySearchDTO searchDTO) {

        List<Specification<PropertyPost>> specs = new ArrayList<>();

        if (searchDTO.getGovernorate() != null && !searchDTO.getGovernorate().isEmpty())
            specs.add(withGovernorate(searchDTO.getGovernorate()));
        if (searchDTO.getCity() != null && !searchDTO.getCity().isEmpty())
            specs.add(withCity(searchDTO.getCity()));
        if (searchDTO.getStreet() != null && !searchDTO.getStreet().isEmpty())
            specs.add(withStreet(searchDTO.getStreet()));
        if (searchDTO.getMinPrice() != null)
            specs.add(withMinPrice(searchDTO.getMinPrice()));
        if (searchDTO.getMaxPrice() != null)
            specs.add(withMaxPrice(searchDTO.getMaxPrice()));
        if (searchDTO.getPropertyCategory() != null)
            specs.add(withCategory(searchDTO.getPropertyCategory()));
        if (searchDTO.getPropertyType() != null)
            specs.add(withType(searchDTO.getPropertyType()));
        if (searchDTO.getMinBathrooms() != null)
            specs.add(withNumberOfBathrooms(searchDTO.getMinBathrooms()));
        if (searchDTO.getMinBedrooms() != null)
            specs.add(withNumberOfBedrooms(searchDTO.getMinBedrooms()));
        if (searchDTO.getMinArea() != null)
            specs.add(withArea(searchDTO.getMinArea()));
        if (Boolean.TRUE.equals(searchDTO.getHasAirConditioning()))
            specs.add(withAirConditioning());
        if (Boolean.TRUE.equals(searchDTO.getHasGarden()))
            specs.add(withGarden());
        if (Boolean.TRUE.equals(searchDTO.getHasGarage()))
            specs.add(withGarage());
        if (Boolean.TRUE.equals(searchDTO.getHasSwimmingPool()))
            specs.add(withSwimmingPool());

        Specification<PropertyPost> spec = Specification.where(null);
        for (Specification<PropertyPost> s : specs) {
            spec = spec.and(s);
        }

        return spec;
    }

    public static Specification<PropertyPost> withGovernorate(@NonNull String gov) {
        return (root, _, criteriaBuilder) -> {
            return criteriaBuilder.equal(root.get("location").get("governorate"), gov);
        };
    }

    public static Specification<PropertyPost> withCity(@NonNull String city) {
        return (root, _, criteriaBuilder) -> {
            return criteriaBuilder.equal(root.get("location").get("city"), city);
        };
    }

    public static Specification<PropertyPost> withStreet(@NonNull String street) {
        return (root, _, criteriaBuilder) -> {
            return criteriaBuilder.equal(root.get("location").get("street"), street);
        };
    }

    public static Specification<PropertyPost> withMinPrice(double minPrice) {
        return (root, _, criteriaBuilder) -> {
            return criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice);
        };
    }

    public static Specification<PropertyPost> withMaxPrice(double maxPrice) {
        return (root, _, criteriaBuilder) -> {
            return criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice);
        };
    }

    public static Specification<PropertyPost> withCategory(@NonNull PropertyCategory category) {
        return (root, _, criteriaBuilder) -> {
            return criteriaBuilder.equal(root.get("category"), category);
        };
    }

    public static Specification<PropertyPost> withType(@NonNull PropertyType type) {
        return (root, _, criteriaBuilder) -> {
            return criteriaBuilder.equal(root.get("propertyType"), type);
        };
    }

    public static Specification<PropertyPost> withNumberOfBathrooms(int numberOfBathrooms) {
        return (root, _, criteriaBuilder) -> {
            return criteriaBuilder.greaterThanOrEqualTo(root.get("numberOfBathrooms"), numberOfBathrooms);
        };
    }

    public static Specification<PropertyPost> withNumberOfBedrooms(int numberOfBedrooms) {
        return (root, _, criteriaBuilder) -> {
            return criteriaBuilder.greaterThanOrEqualTo(root.get("numberOfBedrooms"), numberOfBedrooms);
        };
    }

    public static Specification<PropertyPost> withAirConditioning() {
        return (root, _, criteriaBuilder) -> {
            return criteriaBuilder.equal(root.get("hasAirConditioning"), true);
        };
    }

    public static Specification<PropertyPost> withGarden() {
        return (root, _, criteriaBuilder) -> {
            return criteriaBuilder.equal(root.get("hasGarden"), true);
        };
    }

    public static Specification<PropertyPost> withGarage() {
        return (root, _, criteriaBuilder) -> {
            return criteriaBuilder.equal(root.get("hasGarage"), true);
        };
    }

    public static Specification<PropertyPost> withSwimmingPool() {
        return (root, _, criteriaBuilder) -> {
            return criteriaBuilder.equal(root.get("hasSwimmingPool"), true);
        };
    }

    public static Specification<PropertyPost> withArea(int area) {
        return (root, _, criteriaBuilder) -> {
            return criteriaBuilder.greaterThanOrEqualTo(root.get("area"), area);
        };
    }

}