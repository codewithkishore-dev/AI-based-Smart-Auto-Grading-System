package com.grading.repository;

import com.grading.model.CodingTestCase;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CodingTestCaseRepository extends JpaRepository<CodingTestCase, Long> {
    List<CodingTestCase> findByProblemId(Long problemId);
}