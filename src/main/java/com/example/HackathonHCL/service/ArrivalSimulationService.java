package com.example.HackathonHCL.service;

import com.example.HackathonHCL.entity.Customer;
import com.example.HackathonHCL.entity.DrinkType;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
@RequiredArgsConstructor
public class ArrivalSimulationService {

    private final OrderService orderService;
    private final Random random = new Random();

    // λ = 1.4 customers per minute (as per PDF)
    private static final double LAMBDA = 1.4;

    // Runs every 1 minute
    @Scheduled(fixedRate = 60000)
    public void simulateArrival() {

        int arrivals = poissonArrival(LAMBDA);

        for (int i = 0; i < arrivals; i++) {

            // 30% regular, 70% new (PDF psychology)
            boolean isRegular = random.nextDouble() < 0.3;
            Customer customer = new Customer(isRegular);

            // realistic drink distribution
            DrinkType drinkType = randomDrinkType();

            orderService.createOrder(customer, drinkType);
        }
    }

    /**
     * Poisson distribution generator
     */
    private int poissonArrival(double lambda) {
        double L = Math.exp(-lambda);
        int k = 0;
        double p = 1.0;

        do {
            k++;
            p *= random.nextDouble();
        } while (p > L);

        return k - 1;
    }

    /**
     * Drink probability based on PDF frequency
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
