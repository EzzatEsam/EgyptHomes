package com.egypthomes.service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.lang.NonNull;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.egypthomes.controller.AuthController;
import com.egypthomes.dto.PaginatedResult;
import com.egypthomes.dto.PropertyCreationDTO;
import com.egypthomes.dto.PropertyPostDTO;
import com.egypthomes.dto.PropertySearchDTO;
import com.egypthomes.mapper.PropertyMapper;
import com.egypthomes.model.PropertyPost;
import com.egypthomes.model.User;
import com.egypthomes.repository.PropertyPostRepository;
import com.egypthomes.specifications.PropertySpecifications;

import io.micrometer.common.lang.Nullable;
import jakarta.persistence.EntityExistsException;

@Service
public class PropertyService {

    private final PropertyPostRepository propertyPostRepository;
    private final PropertyMapper propertyMapper;
    private final ImageUploadService imageUploadService;

    public PropertyService(PropertyPostRepository propertyPostRepository, PropertyMapper propertyMapper,
            AuthController authController, ImageUploadService imageUploadService) {
        this.propertyPostRepository = propertyPostRepository;
        this.propertyMapper = propertyMapper;
        this.imageUploadService = imageUploadService;
    }

    @Transactional
    public PropertyPostDTO addProperty(@NonNull PropertyCreationDTO creationDTO, @NonNull User user) {
        var property = propertyMapper.toEntity(creationDTO);
        property.setUser(user);
        if (property.getContactEmail() == null) {
            property.setContactEmail(user.getEmail());
        }
        savePropertyImages(property);
        property = propertyPostRepository.save(property);
        return propertyMapper.toDTO(property);
    }

    @Transactional
    public PropertyPostDTO updateProperty(long propertyId, @NonNull PropertyCreationDTO propertyDto,
            @NonNull User user) {
        var property = propertyPostRepository.findById(propertyId).orElseThrow();
        if (!isOwnedByUser(property, user)) {
            throw new AccessDeniedException("User is not the owner of the property");
        }
        var propertyEntity = propertyMapper.toEntity(propertyDto);
        savePropertyImages(propertyEntity);
        var updatedProperty = propertyPostRepository.save(propertyEntity);
        return propertyMapper.toDTO(updatedProperty);
    }

    @Transactional
    public boolean deleteProperty(long id) {
        if (!propertyPostRepository.existsById(id)) {
            return false;
        }
        propertyPostRepository.deleteById(id);
        return true;
    }

    @Transactional(readOnly = true)
    public PropertyPostDTO getPropertyWithFavouriteStatus(long id, @Nullable User user) {
        var property = propertyPostRepository.findByUserIdWithFavouriteStatus(id, user.getId()).orElseThrow();
        var dto = propertyMapper.toDTO(property.getPropertyPost(), property.isFavorited());
        return dto;
    }

    @Transactional(readOnly = true)
    public PropertyPostDTO getProperty(long id) {
        var property = propertyPostRepository.findById(id).orElseThrow();
        return propertyMapper.toDTO(property);
    }

    @Transactional(readOnly = true)
    public PaginatedResult<PropertyPostDTO> getPropertiesByUser(long userId, int page, int size) {

        var pageable = createPageRequestWithSort(page, size, "createdAt");
        var propertiesPage = propertyPostRepository.findByUser_Id(userId, pageable);

        return PaginatedResult.fromPage(propertiesPage, propertyMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public PaginatedResult<PropertyPostDTO> getRecentProperties(int page, int size) {
        var pageable = createPageRequestWithSort(page, size, "createdAt");

        var propertiesPage = propertyPostRepository.findAll(pageable);
        return PaginatedResult.fromPage(propertiesPage, propertyMapper::toDTO);
    }

    @Transactional(readOnly = true)
    public PaginatedResult<PropertyPostDTO> getRecentPropertiesWithWithFavouriteStatus(long viewId, int page,
            int size) {
        var pageable = createPageRequestWithSort(page, size, "createdAt");
        var propertiesPage = propertyPostRepository.findAllWithFavouriteStatus(viewId, pageable);
        return PaginatedResult.fromPage(propertiesPage,
                p -> propertyMapper.toDTO(p.getPropertyPost(), p.isFavorited()));
    }

    @Transactional(readOnly = true)
    public PaginatedResult<PropertyPostDTO> getPropertiesByUserWithFavouriteStatus(long ownerId, long viewerId,
            int page, int size) {
        var pageable = createPageRequestWithSort(page, size, "createdAt");
        var propertiesPage = propertyPostRepository.findAllByUserWithFavoriteStatus(ownerId, viewerId, pageable);

        return PaginatedResult.fromPage(propertiesPage,
                p -> propertyMapper.toDTO(p.getPropertyPost(), p.isFavorited()));
    }

    @Transactional(readOnly = true)
    public PaginatedResult<PropertyPostDTO> getUserFavourites(long userId, int page, int size) {
        var pageable = createPageRequestWithSort(page, size, "createdAt");
        var propertiesPage = propertyPostRepository.findAllByUserFavourites(userId, pageable);

        return PaginatedResult.fromPage(propertiesPage, p -> propertyMapper.toDTO(p, true));
    }

    @Transactional
    public void addFavourite(long propertyId, User user) {
        var property = propertyPostRepository.findById(propertyId).orElseThrow();
        if (isPropertyFavoritedByUser(property, user)) {
            throw new EntityExistsException("Property is already favorited by user");
        }
        property.getFavoritedBy().add(user);
        // user.getFavorites().add(property);
        propertyPostRepository.save(property);
    }

    @Transactional
    public void deleteFavourite(long propertyId, User user) {
        var property = propertyPostRepository.findById(propertyId).orElseThrow();

        if (!isPropertyFavoritedByUser(property, user)) {
            throw new NoSuchElementException("Property is not favorited by user");
        }
        property.getFavoritedBy().removeIf(u -> u.getId().equals(user.getId()));
        propertyPostRepository.save(property);
    }

    @Transactional
    public void deleteProperty(long propertyId, User user) {
        var property = propertyPostRepository.findById(propertyId).orElseThrow();
        if (!isOwnedByUser(property, user)) {
            throw new AccessDeniedException("User is not the owner of the property");
        }
        propertyPostRepository.delete(property);
    }

    @Transactional(readOnly = true)
    public PaginatedResult<PropertyPostDTO> searchPropertiesWithFavouriteStatus(PropertySearchDTO searchDTO, int page,
            int size, User viewer) {
        var pageable = createPageRequestWithSort(page, size, "createdAt");
        var specs = PropertySpecifications.withSearch(searchDTO);
        var propertiesPage = propertyPostRepository.findAll(specs, pageable);
        var properties = propertiesPage.getContent();
        var dtos = properties.stream().map(p -> {
            var isFavorited = viewer != null && propertyPostRepository.isFavoritedByUser(viewer.getId(), p);
            return propertyMapper.toDTO(p, isFavorited);
        }).toList();

        return PaginatedResult.<PropertyPostDTO>builder()
                .results(dtos)
                .totalResults((int) propertiesPage.getTotalElements())
                .pageSize(propertiesPage.getSize())
                .page(propertiesPage.getNumber() + 1)
                .totalPages(propertiesPage.getTotalPages())
                .build();
    }

    @Transactional(readOnly = true)
    public PaginatedResult<PropertyPostDTO> searchProperties(PropertySearchDTO searchDTO, int page, int size) {
        var pageable = createPageRequestWithSort(page, size, "createdAt");
        var specs = PropertySpecifications.withSearch(searchDTO);
        var propertiesPage = propertyPostRepository.findAll(specs, pageable);
        return PaginatedResult.fromPage(propertiesPage, propertyMapper::toDTO);
    }

    private PageRequest createPageRequestWithSort(int page, int size, String sortField) {
        return PageRequest.of(page - 1, size, Sort.by(Sort.Order.desc(sortField)));
    }

    private boolean isOwnedByUser(PropertyPost property, User user) {
        return property.getUser().getId().equals(user.getId());
    }

    private boolean isPropertyFavoritedByUser(PropertyPost property, User user) {
        return property.getFavoritedBy().stream().anyMatch(u -> u.getId().equals(user.getId()));
    }

    private void savePropertyImages(PropertyPost property) {
        var imageUrls = property.getImageUrls();
        if (imageUrls != null && imageUrls.size() > 0) {
            var savedImages = savePropertyImages(imageUrls.toArray(new String[0]));
            property.setImageUrls(savedImages);
        }
    }

    private List<String> savePropertyImages(String[] images) {
        List<String> imageUrls = new ArrayList<>();

        for (String image : images) {
            try {
                String imageUrl = imageUploadService.saveImage(image);
                imageUrls.add(imageUrl);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return imageUrls;
    }

}
