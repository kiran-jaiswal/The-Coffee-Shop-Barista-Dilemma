package com.example.HackathonHCL.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor   // 👈 IMPORTANT
@NoArgsConstructor
public class OrderStatsDTO {

    private Long orderId;
    private String drinkType;
    private String assignedBarista;
    private Double waitTimeMinutes;
    private Double priorityScore;
    private boolean abandoned;
}
