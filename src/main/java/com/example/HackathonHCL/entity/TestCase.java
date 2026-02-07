package com.example.HackathonHCL.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "test_cases")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TestCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Test case number (1–10)
    @Column(nullable = false, unique = true)
    private Integer testCaseNumber;

    // Simulation start time (7 AM)
    private LocalDateTime startTime;

    // Simulation end time (10 AM)
    private LocalDateTime endTime;

    // Total orders in this test case (200–300)
    private Integer totalOrders;

    // Orders mapped to this test case
    @OneToMany
    @JoinColumn(name = "test_case_id")
    private List<Order> orders;

    // ---- STATISTICS ----

    // Average wait time in minutes
    private Double averageWaitTime;

    // Complaints escalated to manager (>8 min wait)
    private Integer complaintsCount;

    // Orders handled by each barista
    private Integer barista1Orders;
    private Integer barista2Orders;
    private Integer barista3Orders;
}
