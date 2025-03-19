package com.egypthomes.mapper;

import org.springframework.stereotype.Component;

import com.egypthomes.dto.PropertyLocationDTO;
import com.egypthomes.model.PropertyLocation;

@Component
public class LocationMapper {
    public PropertyLocation toEntity(PropertyLocationDTO location) {
        return PropertyLocation.builder()
                .street(location.getStreet())
                .city(location.getCity())
                .governorate(location.getGovernorate())
                .latitude(location.getLatitude())
                .longitude(location.getLongitude())
                .build();
    }

    public PropertyLocationDTO toDTO(PropertyLocation location) {
        return PropertyLocationDTO.builder()
                .street(location.getStreet())
                .city(location.getCity())
                .governorate(location.getGovernorate())
                .latitude(location.getLatitude())
                .longitude(location.getLongitude())
                .build();
    }

}
