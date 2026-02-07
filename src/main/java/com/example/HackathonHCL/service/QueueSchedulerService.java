package com.example.HackathonHCL.service;

import com.example.HackathonHCL.entity.Order;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QueueSchedulerService {

    private final OrderService orderService;
    private final BaristaAssignmentService baristaAssignmentService;

    @Scheduled(fixedRate = 30000)
    public void processQueue() {

        List<Order> orders = orderService.getPendingOrders();

        // sort by priority DESC
        orders.sort((o1, o2) ->
                Double.compare(o2.getPriorityScore(), o1.getPriorityScore())
        );

        for (int i = 0; i < orders.size(); i++) {

            Order current = orders.get(i);

            // update priority
            orderService.updatePriority(current);

            long waitTime = Duration
                    .between(current.getArrivalTime(), LocalDateTime.now())
                    .toMinutes();

            // 🚨 ABANDONMENT CHECK
            if (!current.getCustomer().isRegularCustomer() && waitTime >= 8) {
                current.setAbandoned(true);
                current.setCompleted(true);
                continue;
            }

            // 🚑 EMERGENCY HANDLING
            if (waitTime >= 8) {
                current.setAssignedBarista(
                        baristaAssignmentService.assignBarista(current)
                );
                current.setCompleted(true);
                continue;
            }

            // 🧠 FAIRNESS: skipped orders increment
            for (int j = i + 1; j < orders.size(); j++) {
                Order skipped = orders.get(j);
                orderService.incrementSkipped(skipped);
            }
        }
    }
}