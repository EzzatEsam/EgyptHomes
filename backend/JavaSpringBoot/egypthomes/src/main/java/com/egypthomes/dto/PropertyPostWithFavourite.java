package com.egypthomes.dto;

import com.egypthomes.model.PropertyPost;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PropertyPostWithFavourite {
    private PropertyPost propertyPost;
    private boolean isFavorited;

}
