package com.egypthomes.repository;

import org.springframework.data.domain.Pageable;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;

import com.egypthomes.dto.PropertyPostWithFavourite;
import com.egypthomes.model.PropertyPost;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PropertyPostRepository extends JpaRepository<PropertyPost, Long> {

    @Query("SELECT p from PropertyPost p JOIN p.favoritedBy f WHERE f.id = :userId")
    Page<PropertyPost> findAllByUserFavourites(@Param("userId") Long userId, Pageable pageable);

    @Query("""
            SELECT new com.egypthomes.dto.PropertyPostWithFavourite(p,
                CASE WHEN f.id IS NOT NULL THEN true ELSE false END)
            FROM PropertyPost p
            LEFT JOIN p.favoritedBy f WITH f.id = :viewerId
            WHERE p.user.id = :ownerId
            """)
    Page<PropertyPostWithFavourite> findAllByUserWithFavoriteStatus(@Param("ownerId") Long ownerId,
            @Param("viewerId") Long viewerId,
            Pageable pageable);

    Page<PropertyPost> findByUser_Id(Long userId, Pageable pageable);

    @Query("SELECT new com.egypthomes.dto.PropertyPostWithFavourite(p, CASE WHEN u.id IS NOT NULL THEN true ELSE false END) FROM PropertyPost p LEFT JOIN p.favoritedBy u WITH u.id = :userId WHERE p.id = :id")
    Optional<PropertyPostWithFavourite> findByUserIdWithFavouriteStatus(Long id, Long userId);

    @Query("""
            SELECT new com.egypthomes.dto.PropertyPostWithFavourite(p,
                CASE WHEN f.id IS NOT NULL THEN true ELSE false END)
            FROM PropertyPost p
            LEFT JOIN p.favoritedBy f WITH f.id = :viewerId
            """)
    Page<PropertyPostWithFavourite> findAllWithFavouriteStatus(@Param("viewerId") Long viewerId, Pageable pageable);

    @Query("SELECT COUNT(u) > 0 FROM User u WHERE u.id = :userId AND :propertyPost MEMBER OF u.favorites")
    boolean isFavoritedByUser(@Param("userId") Long userId, @Param("propertyPost") PropertyPost propertyPost);

    Page<PropertyPost> findAll(Specification<PropertyPost> spec, Pageable pageable);

}
