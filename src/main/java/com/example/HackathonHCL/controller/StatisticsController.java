package com.example.HackathonHCL.controller;

import com.example.HackathonHCL.dto.OrderStatsDTO;
import com.example.HackathonHCL.dto.TestCaseSummaryDTO;
import com.example.HackathonHCL.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
public class StatisticsController {

    private final StatisticsService statisticsSimulationService;

    /**
     * 📊 Table view
     * 10 test cases summary
     */
    @GetMapping("/testcases")
    public List<TestCaseSummaryDTO> getAllTestCaseSummaries() {
        return statisticsSimulationService.getAllTestCaseSummaries();
    }

    /**
     * 🔍 Expand view
     * 200–300 orders of one test case
     */
    @GetMapping("/testcases/{testCaseNumber}")
    public List<OrderStatsDTO> getTestCaseDetails(
            @PathVariable Integer testCaseNumber
    ) {
        return statisticsSimulationService.getOrdersForTestCase(testCaseNumber);
    }
}
