package com.egypthomes.controller;

import com.egypthomes.dto.*;
import com.egypthomes.model.User;
import com.egypthomes.service.PropertyService;
import jakarta.persistence.EntityExistsException;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.util.NoSuchElementException;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @PostMapping
    public ResponseEntity<PropertyPostDTO> createProperty(
            @Validated @RequestBody PropertyCreationDTO creationDTO,
            @AuthenticationPrincipal User user) {

        var result = propertyService.addProperty(creationDTO, user);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<PaginatedResult<PropertyPostDTO>> getMethodName(@PathVariable long userId,
            @Validated PaginationRequestDTO paginationRequestDTO, @AuthenticationPrincipal User user) {
        try {
            PaginatedResult<PropertyPostDTO> results;
            if (user == null) {
                results = propertyService.getPropertiesByUser(userId, paginationRequestDTO.getPageNumber(),
                        paginationRequestDTO.getPageSize());
            } else {
                results = propertyService.getPropertiesByUserWithFavouriteStatus(userId, user.getId(),
                        paginationRequestDTO.getPageNumber(),
                        paginationRequestDTO.getPageSize());
            }

            return ResponseEntity.ok(results);

        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }

    }

    @GetMapping("/favourites")
    public ResponseEntity<PaginatedResult<PropertyPostDTO>> getFavourites(
            @Validated PaginationRequestDTO paginationRequestDTO, @AuthenticationPrincipal User user) {
        // check if user is authenticated
        if (user == null) {
            return ResponseEntity.status(401).build();
        }

        var results = propertyService.getUserFavourites(user.getId(), paginationRequestDTO.getPageNumber(),
                paginationRequestDTO.getPageSize());
        return ResponseEntity.ok(results);
    }

    @PostMapping("/favourites/{propertyId}")
    public ResponseEntity<?> addFavourite(@PathVariable long propertyId, @AuthenticationPrincipal User user) {
        try {
            propertyService.addFavourite(propertyId, user);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (EntityExistsException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @DeleteMapping("/favourites/{propertyId}")
    public ResponseEntity<?> removeFavourite(@PathVariable long propertyId, @AuthenticationPrincipal User user) {
        try {

            propertyService.deleteFavourite(propertyId, user);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (EntityExistsException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyPostDTO> getProperty(@PathVariable long id, @AuthenticationPrincipal User user) {

        if (user == null)
            return ResponseEntity.ok(propertyService.getProperty(id));
        else
            return ResponseEntity.ok(propertyService.getPropertyWithFavouriteStatus(id, user));

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProperty(@PathVariable long id, @AuthenticationPrincipal User user) {

        propertyService.deleteProperty(id, user);
        return ResponseEntity.noContent().build();

    }

    @PutMapping("/{id}")
    public ResponseEntity<PropertyPostDTO> updateProperty(@PathVariable long id,
            @Validated @RequestBody PropertyCreationDTO creationDTO, @AuthenticationPrincipal User user) {

        var result = propertyService.updateProperty(id, creationDTO, user);
        return ResponseEntity.ok(result);

    }

    @GetMapping("/recent")
    public ResponseEntity<PaginatedResult<PropertyPostDTO>> getRecentProperties(
            @Validated PaginationRequestDTO paginationRequest, @AuthenticationPrincipal User user) {
        if (user == null) {
            return ResponseEntity.ok(propertyService.getRecentProperties(paginationRequest.getPageNumber(),
                    paginationRequest.getPageSize()));
        } else {
            return ResponseEntity.ok(propertyService.getRecentPropertiesWithWithFavouriteStatus(user.getId(),
                    paginationRequest.getPageNumber(), paginationRequest.getPageSize()));
        }
    }

    @GetMapping("/search")
    public ResponseEntity<PaginatedResult<PropertyPostDTO>> searchProperties(
            @ModelAttribute @Validated PropertySearchDTO searchDTO,
            @ModelAttribute @Validated PaginationRequestDTO paginationRequest,
            @AuthenticationPrincipal User user) {

        PaginatedResult<PropertyPostDTO> results;
        if (user == null) {
            results = propertyService.searchProperties(searchDTO, paginationRequest.getPageNumber(),
                    paginationRequest.getPageSize());
        } else {
            results = propertyService.searchPropertiesWithFavouriteStatus(searchDTO, paginationRequest.getPageNumber(),
                    paginationRequest.getPageSize(), user);
        }
        return ResponseEntity.ok(results);
    }

}
