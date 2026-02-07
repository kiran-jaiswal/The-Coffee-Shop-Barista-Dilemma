package com.example.HackathonHCL.entity;

import lombok.Getter;

@Getter
public enum DrinkType {

    COLD_BREW(1, 120),
    ESPRESSO(2, 150),
    AMERICANO(2, 140),
    CAPPUCCINO(4, 180),
    LATTE(4, 200),
    SPECIALTY_MOCHA(6, 250);

    private final int prepTimeMinutes;
    private final int price;

    DrinkType(int prepTimeMinutes, int price) {
        this.prepTimeMinutes = prepTimeMinutes;
        this.price = price;
    }
}
