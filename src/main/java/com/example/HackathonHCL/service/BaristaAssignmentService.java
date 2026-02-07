package com.example.HackathonHCL.service;

import com.example.HackathonHCL.entity.Barista;
import com.example.HackathonHCL.entity.Order;
import com.example.HackathonHCL.repository.BaristaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BaristaAssignmentService {

    private final BaristaRepository baristaRepository;

    public Barista assignBarista(Order order) {

        List<Barista> baristas = baristaRepository.findAll();

        double avgLoad = baristas.stream()
                .mapToInt(Barista::getTotalAssignedMinutes)
                .average()
                .orElse(1);

        Barista selected = baristas.stream()
                .min((b1, b2) -> {
                    double r1 = b1.getTotalAssignedMinutes() / avgLoad;
                    double r2 = b2.getTotalAssignedMinutes() / avgLoad;

                    // overloaded prefers quick orders
                    if (r1 > 1.2 && order.getDrinkType().getPrepTimeMinutes() <= 2)
                        return -1;
                    if (r2 > 1.2 && order.getDrinkType().getPrepTimeMinutes() <= 2)
                        return 1;

                    return Double.compare(r1, r2);
                })
                .orElseThrow();

        selected.setTotalAssignedMinutes(
                selected.getTotalAssignedMinutes() + order.getDrinkType().getPrepTimeMinutes()
        );

        baristaRepository.save(selected);
        return selected;
    }
}