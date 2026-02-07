package com.example.HackathonHCL.service;

import com.example.HackathonHCL.entity.Customer;
import com.example.HackathonHCL.entity.DrinkType;
import com.example.HackathonHCL.entity.Order;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class TestCaseSimulationService {

    private final OrderService orderService;
    private final PriorityCalculatorService priorityCalculatorService;

    private static final Random random = new Random();

    /**
     * Generates 200–300 orders for one test case
     */
    public List<Order> runSingleTestCase(Integer testCaseNumber) {

        int orderCount = 200 + random.nextInt(101); // 200–300
        List<Order> orders = new ArrayList<>();

        for (int i = 0; i < orderCount; i++) {

            boolean isRegular = random.nextDouble() < 0.3; // 30% regular customers
            Customer customer = new Customer(isRegular);

            DrinkType drinkType = randomDrinkType();

            Order order = orderService.createOrder(customer, drinkType);

            priorityCalculatorService.calculatePriority(order);

            orders.add(order);
        }

        return orders;
    }

    /**
     * Random drink based on frequency
     */
    private DrinkType randomDrinkType() {
        double p = random.nextDouble();

        if (p < 0.25) return DrinkType.COLD_BREW;
        if (p < 0.45) return DrinkType.ESPRESSO;
        if (p < 0.60) return DrinkType.AMERICANO;
        if (p < 0.80) return DrinkType.CAPPUCCINO;
        if (p < 0.92) return DrinkType.LATTE;
        return DrinkType.SPECIALTY_MOCHA;
    }
}
