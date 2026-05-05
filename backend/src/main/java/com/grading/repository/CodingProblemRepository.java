package com.grading.repository;

import com.grading.model.CodingProblem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CodingProblemRepository extends JpaRepository<CodingProblem, Long> {
    List<CodingProblem> findByCategory(String category);
}