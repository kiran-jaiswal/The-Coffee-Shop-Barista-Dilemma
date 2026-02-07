package com.example.HackathonHCL.service;

import com.example.HackathonHCL.dto.BaristaStatsDTO;
import com.example.HackathonHCL.dto.OrderStatsDTO;
import com.example.HackathonHCL.dto.TestCaseSummaryDTO;
import com.example.HackathonHCL.entity.Barista;
import com.example.HackathonHCL.entity.Order;
import com.example.HackathonHCL.repository.BaristaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final TestCaseSimulationService testCaseSimulationService;
    private final BaristaRepository baristaRepository;

    private final Map<Integer, List<Order>> testCaseStore = new HashMap<>();

    /**
     * Runs 10 test cases (cached)
     */
    private void runAllTestCasesIfNeeded() {
        if (!testCaseStore.isEmpty()) return;

        for (int i = 1; i <= 100; i++) {
            testCaseStore.put(i, testCaseSimulationService.runSingleTestCase(i));
        }
    }

    /**
     * Table view (10 rows)
     */
    public List<TestCaseSummaryDTO> getAllTestCaseSummaries() {

        runAllTestCasesIfNeeded();

        List<TestCaseSummaryDTO> summaries = new ArrayList<>();

        for (Integer testCaseNo : testCaseStore.keySet()) {

            List<Order> orders = testCaseStore.get(testCaseNo);

            double avgWait = orders.stream()
                    .mapToLong(o ->
                            Duration.between(o.getArrivalTime(), LocalDateTime.now()).toMinutes()
                    )
                    .average()
                    .orElse(0);

            int complaints = (int) orders.stream()
                    .filter(o -> !o.getCustomer().isRegularCustomer())
                    .filter(o ->
                            Duration.between(o.getArrivalTime(), LocalDateTime.now()).toMinutes() > 8
                    )
                    .count();

            Map<String, Long> baristaCount = orders.stream()
                    .filter(o -> o.getAssignedBarista() != null)
                    .collect(Collectors.groupingBy(
                            o -> o.getAssignedBarista().getName(),
                            Collectors.counting()
                    ));

            List<BaristaStatsDTO> baristaStats = new ArrayList<>();
            baristaStats.add(new BaristaStatsDTO("Barista-1",
                    baristaCount.getOrDefault("Barista-1", 0L).intValue()));
            baristaStats.add(new BaristaStatsDTO("Barista-2",
                    baristaCount.getOrDefault("Barista-2", 0L).intValue()));
            baristaStats.add(new BaristaStatsDTO("Barista-3",
                    baristaCount.getOrDefault("Barista-3", 0L).intValue()));

            summaries.add(
                    new TestCaseSummaryDTO(
                            testCaseNo,
                            Math.round(avgWait * 100.0) / 100.0,
                            baristaStats,
                            complaints
                    )
            );
        }

        return summaries;
    }

    /**
     * Expand view (200–300 rows)
     */
    public List<OrderStatsDTO> getOrdersForTestCase(Integer testCaseNumber) {

        runAllTestCasesIfNeeded();

        List<Order> orders = testCaseStore.get(testCaseNumber);

        if (orders == null) return Collections.emptyList();

        return orders.stream().map(o -> new OrderStatsDTO(
                o.getId(),
                o.getDrinkType().name(),
                o.getAssignedBarista() != null ? o.getAssignedBarista().getName() : "Unassigned",
                (double) Duration.between(o.getArrivalTime(), LocalDateTime.now()).toMinutes(),
                o.getPriorityScore(),
                o.isAbandoned()
        )).collect(Collectors.toList());
    }
}
