package com.example.HackathonHCL.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BaristaStatsDTO {

    private String baristaName;   // Barista-1, Barista-2, Barista-3
    private Integer ordersHandled;
}
