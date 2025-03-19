package com.egypthomes.service;

import java.util.Date;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    @Value("${jwt.issuer}")
    private String jwtIssuer;

    public String GenerateToken(UserDetails userDetails, Map<String, Object> claims) {
        return Jwts.builder()
                .claims(claims)
                .issuer(jwtIssuer)
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Date getJwtExpiration() {
        return new Date(System.currentTimeMillis() + jwtExpiration);
    }

    public Claims getClaimsFromToken(String token) {
        var claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims;
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            var claims = getClaimsFromToken(token);
            var username = claims.getSubject();

            return (validateClaims(claims) && username.equals(userDetails.getUsername()));
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return false;
        }
    }

    public boolean validateClaims(Claims claims) {
        try {
            var issuer = claims.getIssuer();
            var expired = claims.getExpiration().before(new Date());
            return issuer.equals(jwtIssuer) && !expired;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return false;
        }
    }

    public String getUsernameFromToken(String token) {
        return getClaimsFromToken(token).getSubject();
    }

    public Date getExpirationDateFromToken(String token) {
        return getClaimsFromToken(token).getExpiration();
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
