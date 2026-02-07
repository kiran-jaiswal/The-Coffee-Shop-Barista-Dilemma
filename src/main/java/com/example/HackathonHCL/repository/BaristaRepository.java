package com.example.HackathonHCL.repository;

import com.example.HackathonHCL.entity.Barista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BaristaRepository extends JpaRepository<Barista, Long> {
    // basic CRUD kaafi hai hackathon ke liye
}

