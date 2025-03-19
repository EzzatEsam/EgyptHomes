package com.egypthomes.dto;

import java.util.List;
import java.util.function.Function;

import org.springframework.data.domain.Page;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaginatedResult<T> {
    private List<T> results;
    private int totalResults;
    private int pageSize;
    private int page;
    private int totalPages;

    public static <T> PaginatedResult<T> fromPage(Page<T> page) {
        return PaginatedResult.<T>builder()
                .results(page.getContent())
                .totalResults((int) page.getTotalElements())
                .pageSize(page.getSize())
                .page(page.getNumber() + 1)
                .totalPages(page.getTotalPages())
                .build();
    }

    public static <T, R> PaginatedResult<R> fromPage(Page<T> page, Function<T, R> mapper) {
        return PaginatedResult.<R>builder()
                .results(page.getContent().stream().map(mapper).toList()) // Transform items using the mapper
                .totalResults((int) page.getTotalElements())
                .pageSize(page.getSize())
                .page(page.getNumber() + 1)
                .totalPages(page.getTotalPages())
                .build();
    }
}
