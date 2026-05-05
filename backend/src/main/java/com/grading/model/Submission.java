package com.grading.model;

import jakarta.persistence.*;

@Entity
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long questionId;

    private String studentId;      // 2023PECCB001
    private String studentName;    // entered by student

    private String studentAnswer;
    private double aiMarks;
    private String feedback;

    public Long getId() { return id; }

    public Long getQuestionId() { return questionId; }
    public void setQuestionId(Long questionId) { this.questionId = questionId; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentAnswer() { return studentAnswer; }
    public void setStudentAnswer(String studentAnswer) { this.studentAnswer = studentAnswer; }

    public double getAiMarks() { return aiMarks; }
    public void setAiMarks(double aiMarks) { this.aiMarks = aiMarks; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    private double plagiarismScore;
private String plagiarismStatus;

public double getPlagiarismScore() {
    return plagiarismScore;
}

public void setPlagiarismScore(double plagiarismScore) {
    this.plagiarismScore = plagiarismScore;
}

public String getPlagiarismStatus() {
    return plagiarismStatus;
}

public void setPlagiarismStatus(String plagiarismStatus) {
    this.plagiarismStatus = plagiarismStatus;
}
}