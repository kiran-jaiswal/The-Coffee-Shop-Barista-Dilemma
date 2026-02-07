package com.example.HackathonHCL.service;

import com.example.HackathonHCL.entity.Order;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
public class PriorityCalculatorService {

    public double calculatePriority(Order order) {

        long waitMinutes =
                Duration.between(order.getArrivalTime(), LocalDateTime.now()).toMinutes();

        double score = 0;

        // 1️⃣ Wait Time (40%)
        score += Math.min(waitMinutes * 5, 40);

        // 2️⃣ Order Complexity (25%)
        switch (order.getDrinkType()) {
            case COLD_BREW -> score += 25;
            case ESPRESSO, AMERICANO -> score += 20;
            case CAPPUCCINO, LATTE -> score += 12;
            case SPECIALTY_MOCHA -> score += 5;
        }

        // 3️⃣ Loyalty (10%)
        if (order.getCustomer().isRegularCustomer()) {
            score += 10;
        }

        // 4️⃣ Urgency (25%)
        if (waitMinutes >= 8) {
            score += 25;
        }

        // 🔥 FAIRNESS PENALTY BOOST
        if (order.getSkippedCount() > 3) {
            score += 15;
        }

        return Math.min(score, 100);
    }
}