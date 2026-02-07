package com.example.HackathonHCL.controller;

import com.example.HackathonHCL.entity.Customer;
import com.example.HackathonHCL.entity.DrinkType;
import com.example.HackathonHCL.entity.Order;
import com.example.HackathonHCL.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // 1️⃣ Place a new order
    // Example:
    // POST /api/orders/place?drinkType=COLD_BREW&regularCustomer=true
    @PostMapping("/place")
    public Order placeOrder(
            @RequestParam DrinkType drinkType,
            @RequestParam boolean regularCustomer
    ) {
        Customer customer = new Customer(regularCustomer);
        return orderService.createOrder(customer, drinkType);
    }

    // 2️⃣ Get all pending (waiting) orders
    // GET /api/orders/pending
    @GetMapping("/pending")
    public List<Order> getPendingOrders() {
        return orderService.getPendingOrders();
    }

    // 3️⃣ Complete an order (Simulated from Frontend)
    // POST /api/orders/{id}/complete
    @PostMapping("/{id}/complete")
    public void completeOrder(@PathVariable Long id) {
        Order order = orderService.getPendingOrders().stream()
                .filter(o -> o.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Order not found"));
        orderService.completeOrder(order);
    }
}
