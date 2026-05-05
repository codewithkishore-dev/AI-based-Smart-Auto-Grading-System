package com.grading.model;

import jakarta.persistence.*;

@Entity
public class CodingTestCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long problemId;

    @Column(length = 3000)
    private String inputData;

    @Column(length = 3000)
    private String expectedOutput;

    private boolean hiddenTest;

    public Long getId() { return id; }

    public Long getProblemId() { return problemId; }
    public void setProblemId(Long problemId) { this.problemId = problemId; }

    public String getInputData() { return inputData; }
    public void setInputData(String inputData) { this.inputData = inputData; }

    public String getExpectedOutput() { return expectedOutput; }
    public void setExpectedOutput(String expectedOutput) { this.expectedOutput = expectedOutput; }

    public boolean isHiddenTest() { return hiddenTest; }
    public void setHiddenTest(boolean hiddenTest) { this.hiddenTest = hiddenTest; }
}