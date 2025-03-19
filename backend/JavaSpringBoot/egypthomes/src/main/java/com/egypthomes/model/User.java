package com.egypthomes.model;

import java.beans.Transient;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import io.micrometer.common.lang.Nullable;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
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
@Table(name = "users", indexes = {
        @jakarta.persistence.Index(name = "idx_user_email", columnList = "email")
})
public class User extends BaseModel implements UserDetails {

    @NotNull
    @Column(nullable = false)
    String firstName;

    String lastName;
    @NotNull
    @Column(nullable = false, unique = true)
    @Email
    String email;
    @NotNull
    @Column(nullable = false, unique = true)
    String password;

    @Nullable
    String phoneNumber;
    @Nullable
    String pictureUrl;
    @Nullable
    String provider;

    @Nullable
    String refreshToken;

    @Nullable
    LocalDateTime refreshTokenExpiry;

    @OneToMany(mappedBy = "user", orphanRemoval = true)
    private List<PropertyPost> postedProperties;

    @ManyToMany
    @JoinTable(name = "user_favorites", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "property_post_id"))
    private List<PropertyPost> favorites;

    @Transient
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getUsername() {
        return email;
    }

}
