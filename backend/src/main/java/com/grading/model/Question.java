package com.grading.model;

import jakarta.persistence.*;

@Entity
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String questionText;

    @Column(length = 3000)
    private String modelAnswer;

    private int maxMarks;

    public Long getId() { return id; }
    public String getQuestionText() { return questionText; }
    public String getModelAnswer() { return modelAnswer; }
    public int getMaxMarks() { return maxMarks; }

    public void setId(Long id) { this.id = id; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }
    public void setModelAnswer(String modelAnswer) { this.modelAnswer = modelAnswer; }
    public void setMaxMarks(int maxMarks) { this.maxMarks = maxMarks; }
}