package com.example.HackathonHCL.repository;

import com.example.HackathonHCL.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // jo orders abhi complete nahi hue
    List<Order> findByCompletedFalse();

    // completed orders (optional, reporting ke liye)
    List<Order> findByCompletedTrue();
}
