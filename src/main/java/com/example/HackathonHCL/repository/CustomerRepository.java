package com.example.HackathonHCL.repository;

import com.example.HackathonHCL.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    // future me loyalty / stats ke kaam aa sakta hai
}
