package com.example.HackathonHCL.service;

import com.example.HackathonHCL.entity.Customer;
import com.example.HackathonHCL.entity.DrinkType;
import com.example.HackathonHCL.entity.Order;
import com.example.HackathonHCL.repository.CustomerRepository;
import com.example.HackathonHCL.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final PriorityCalculatorService priorityCalculatorService;

    /**
     * Create new order
     */
    public Order createOrder(Customer customer, DrinkType drinkType) {

        // Save customer first
        Customer savedCustomer = customerRepository.save(customer);

        // Create order
        Order order = new Order(savedCustomer, drinkType);

        // Initial priority calculation
        order.setPriorityScore(
                priorityCalculatorService.calculatePriority(order)
        );

        return orderRepository.save(order);
    }

    /**
     * Get all pending (not completed) orders
     */
    public List<Order> getPendingOrders() {
        return orderRepository.findByCompletedFalse();
    }

    /**
     * Recalculate priority for an order
     */
    public void updatePriority(Order order) {
        order.setPriorityScore(
                priorityCalculatorService.calculatePriority(order)
        );
        orderRepository.save(order);
    }

    /**
     * Mark order as completed
     */
    public void completeOrder(Order order) {
        order.setCompleted(true);
        orderRepository.save(order);
    }

    /**
     * Check abandonment logic
     * - Regular customers abandon after 10 min
     * - New customers abandon after 8 min
     */
    public void checkAndHandleAbandonment(Order order) {

        long waitMinutes =
                Duration.between(order.getArrivalTime(), LocalDateTime.now()).toMinutes();

        int maxWait = order.getCustomer().isRegularCustomer() ? 10 : 8;

        if (waitMinutes >= maxWait) {
            order.setAbandoned(true);
            order.setCompleted(true);
            orderRepository.save(order);
        }
    }

    /**
     * Increment skipped count (fairness logic)
     */
    public void incrementSkipped(Order order) {
        order.setSkippedCount(order.getSkippedCount() + 1);
        orderRepository.save(order);
    }

    /**
     * Get all orders (used for statistics)
     */
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}
