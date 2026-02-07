package com.example.HackathonHCL.repository;

import com.example.HackathonHCL.entity.TestCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TestCaseRepository extends JpaRepository<TestCase, Long> {

    // Find by test case number (1–10)
    Optional<TestCase> findByTestCaseNumber(Integer testCaseNumber);
}
