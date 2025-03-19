package com.egypthomes.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaginationRequestDTO {
    private Integer pageNumber = 1;
    private Integer pageSize = 10;
}
