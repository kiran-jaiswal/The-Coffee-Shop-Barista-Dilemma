package com.example.HackathonHCL.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TestCaseSummaryDTO {

    private Integer testCaseNumber;

    private Double averageWaitTime;

    private List<BaristaStatsDTO> baristaStats;

    private Integer complaintsToManager; // wait > 8 min
}
