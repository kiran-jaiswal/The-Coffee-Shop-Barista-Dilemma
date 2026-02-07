package com.example.HackathonHCL.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // true = regular, false = new customer
    private boolean regularCustomer;

    // 10 min for regular, 8 min for new
    private int maxWaitMinutes;

    public Customer(boolean regularCustomer) {
        this.regularCustomer = regularCustomer;
        this.maxWaitMinutes = regularCustomer ? 10 : 8;
    }
}
