package com.example.HackathonHCL.config;

import com.example.HackathonHCL.entity.Barista;
import com.example.HackathonHCL.repository.BaristaRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataLoader {

    private final BaristaRepository baristaRepository;

    @PostConstruct
    public void loadInitialData() {

        if (baristaRepository.count() == 0) {

            baristaRepository.save(new Barista(null, "Barista-1", 0));
            baristaRepository.save(new Barista(null, "Barista-2", 0));
            baristaRepository.save(new Barista(null, "Barista-3", 0));

            System.out.println("✅ 3 Baristas initialized");
        }
    }
}
