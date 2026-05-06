package com.grading.controller;

import com.grading.model.Submission;
import com.grading.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/submissions")
@CrossOrigin("*")
public class SubmissionController {

    @Autowired
    private SubmissionRepository submissionRepository;

    @PostMapping
    public Submission submitAnswer(@RequestBody Submission submission) {

        String answer = submission.getAnswer();

        int marks = 0;

        if (answer != null && answer.length() > 20) {
            marks = 8;
        } else {
            marks = 4;
        }

        submission.setMarks(marks);

        return submissionRepository.save(submission);
    }
}