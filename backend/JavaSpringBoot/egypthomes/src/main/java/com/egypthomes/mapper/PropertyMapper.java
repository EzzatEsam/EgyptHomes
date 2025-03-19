package com.egypthomes.mapper;

import org.springframework.stereotype.Component;

import com.egypthomes.dto.PropertyCreationDTO;
import com.egypthomes.dto.PropertyPostDTO;
import com.egypthomes.model.PropertyPost;

@Component
public class PropertyMapper {

    private final LocationMapper locationMapper;
    private final UserMapper userMapper;

    public PropertyMapper(LocationMapper locationMapper, UserMapper userMapper) {
        this.locationMapper = locationMapper;
        this.userMapper = userMapper;
    }

    public PropertyPostDTO toDTO(PropertyPost property) {
        if (property == null) {
            return null;
        }
        return PropertyPostDTO.builder()
                .id(property.getId())
                .title(property.getTitle())
                .description(property.getDescription())
                .price(property.getPrice())
                .location(locationMapper.toDTO(property.getLocation()))
                .category(property.getCategory())
                .propertyType(property.getPropertyType())
                .contactPhone(property.getContactPhone())
                .contactEmail(property.getContactEmail())
                .numberOfBedrooms(property.getNumberOfBedrooms())
                .numberOfBathrooms(property.getNumberOfBathrooms())
                .images(property.getImageUrls())
                .user(userMapper.toDTO(property.getUser()))
                .area(property.getArea())
                .hasGarage(property.getHasGarage())
                .hasSwimmingPool(property.getHasSwimmingPool())
                .hasGarden(property.getHasGarden())
                .hasAirConditioning(property.getHasAirConditioning())
                .build();
    }

    public PropertyPostDTO toDTO(PropertyPost property, boolean isFavorited) {
        if (property == null) {
            return null;
        }
        var dto = toDTO(property);
        dto.setIsFavorited(isFavorited);
        return dto;
    }

    public PropertyPost toEntity(PropertyPostDTO property) {
        if (property == null) {
            return null;
        }
        return PropertyPost.builder()
                .id(property.getId())
                .title(property.getTitle())
                .description(property.getDescription())
                .price(property.getPrice())
                .location(locationMapper.toEntity(property.getLocation()))
                .category(property.getCategory())
                .propertyType(property.getPropertyType())
                .contactPhone(property.getContactPhone())
                .contactEmail(property.getContactEmail())
                .numberOfBedrooms(property.getNumberOfBedrooms())
                .user(userMapper.toEntity(property.getUser()))
                .numberOfBathrooms(property.getNumberOfBathrooms())
                .build();
    }

    public PropertyPost toEntity(PropertyCreationDTO property) {
        if (property == null) {
            return null;
        }
        return PropertyPost.builder()
                .title(property.getTitle())
                .description(property.getDescription())
                .price(property.getPrice())
                .location(locationMapper.toEntity(property.getLocation()))
                .category(property.getCategory())
                .propertyType(property.getPropertyType())
                .contactPhone(property.getContactPhone())
                .contactEmail(property.getContactEmail())
                .numberOfBedrooms(property.getNumberOfBedrooms())
                .numberOfBathrooms(property.getNumberOfBathrooms())
                .area(property.getArea())
                .hasGarage(property.getHasGarage())
                .hasSwimmingPool(property.getHasSwimmingPool())
                .hasGarden(property.getHasGarden())
                .hasAirConditioning(property.getHasAirConditioning())
                .imageUrls(property.getImages())
                .build();
    }
}
