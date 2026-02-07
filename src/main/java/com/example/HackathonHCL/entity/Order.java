package com.example.HackathonHCL.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Customer who placed the order
    @ManyToOne
    private Customer customer;

    // Drink ordered
    @Enumerated(EnumType.STRING)
    private DrinkType drinkType;

    // Time when order arrived
    private LocalDateTime arrivalTime;

    // Calculated dynamically (0–100)
    private double priorityScore;

    // Order completed or not
    private boolean completed;

    // Fairness: how many times this order was skipped
    private int skippedCount;

    // Customer abandonment
    private boolean abandoned;

    // ✅ VERY IMPORTANT: Assigned Barista
    @ManyToOne
    @JoinColumn(name = "barista_id")
    private Barista assignedBarista;

    // Constructor for new order
    public Order(Customer customer, DrinkType drinkType) {
        this.customer = customer;
        this.drinkType = drinkType;
        this.arrivalTime = LocalDateTime.now();
        this.completed = false;
        this.skippedCount = 0;
        this.abandoned = false;
    }
}
