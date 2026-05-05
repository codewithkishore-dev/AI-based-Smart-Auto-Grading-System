package com.grading.repository;

import com.grading.model.CodingSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CodingSubmissionRepository extends JpaRepository<CodingSubmission, Long> {
    List<CodingSubmission> findByStudentId(String studentId);
}