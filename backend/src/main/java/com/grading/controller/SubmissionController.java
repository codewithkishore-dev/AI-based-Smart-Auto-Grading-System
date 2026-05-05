package com.grading.controller;

import com.grading.model.Question;
import com.grading.model.Submission;
import com.grading.repository.QuestionRepository;
import com.grading.repository.SubmissionRepository;
import com.grading.service.AIService;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/submissions")
@CrossOrigin("*")
public class SubmissionController {

    private final SubmissionRepository submissionRepository;
    private final QuestionRepository questionRepository;
    private final AIService aiService;

    public SubmissionController(
            SubmissionRepository submissionRepository,
            QuestionRepository questionRepository,
            AIService aiService
    ) {
        this.submissionRepository = submissionRepository;
        this.questionRepository = questionRepository;
        this.aiService = aiService;
    }

    @PostMapping
    public Submission submitAnswer(@RequestBody Submission submission) {

        Question question = questionRepository
                .findById(submission.getQuestionId())
                .orElse(null);

        if (question == null) {
            submission.setAiMarks(0);
            submission.setFeedback("Question not found");
            return submissionRepository.save(submission);
        }

        double plagiarismScore = calculatePlagiarism(submission);
        submission.setPlagiarismScore(plagiarismScore);

        if (plagiarismScore >= 80) {
            submission.setPlagiarismStatus("High plagiarism detected");
        } else if (plagiarismScore >= 50) {
            submission.setPlagiarismStatus("Moderate similarity");
        } else {
            submission.setPlagiarismStatus("No major plagiarism");
        }

        Map<String, Object> result = aiService.gradeAnswer(
                question.getModelAnswer(),
                submission.getStudentAnswer(),
                question.getMaxMarks()
        );

        submission.setAiMarks(Double.parseDouble(result.get("marks").toString()));
        submission.setFeedback(result.get("feedback").toString());

        return submissionRepository.save(submission);
    }

    private double calculatePlagiarism(Submission newSubmission) {
        List<Submission> oldSubmissions = submissionRepository.findAll();

        double highestSimilarity = 0;

        for (Submission old : oldSubmissions) {
            if (old.getStudentAnswer() == null || newSubmission.getStudentAnswer() == null) {
                continue;
            }

            if (Objects.equals(old.getQuestionId(), newSubmission.getQuestionId())) {
                double score = similarity(old.getStudentAnswer(), newSubmission.getStudentAnswer());
                highestSimilarity = Math.max(highestSimilarity, score);
            }
        }

        return Math.round(highestSimilarity * 100.0) / 100.0;
    }

    private double similarity(String a, String b) {
        Set<String> wordsA = new HashSet<>(Arrays.asList(a.toLowerCase().split("\\s+")));
        Set<String> wordsB = new HashSet<>(Arrays.asList(b.toLowerCase().split("\\s+")));

        if (wordsA.isEmpty() || wordsB.isEmpty()) return 0;

        Set<String> intersection = new HashSet<>(wordsA);
        intersection.retainAll(wordsB);

        Set<String> union = new HashSet<>(wordsA);
        union.addAll(wordsB);

        return ((double) intersection.size() / union.size()) * 100;
    }

    @GetMapping
    public List<Submission> getSubmissions() {
        return submissionRepository.findAll();
    }

    @GetMapping("/results")
    public List<Map<String, Object>> getResults() {
        return submissionRepository.findAll().stream().map(s -> {
            Map<String, Object> res = new HashMap<>();

            res.put("submissionId", s.getId());
            res.put("studentId", s.getStudentId());
            res.put("studentName", s.getStudentName());
            res.put("questionId", s.getQuestionId());

            Question q = questionRepository.findById(s.getQuestionId()).orElse(null);
            res.put("questionText", q != null ? q.getQuestionText() : "Question not found");

            res.put("answer", s.getStudentAnswer());
            res.put("marks", s.getAiMarks());
            res.put("feedback", s.getFeedback());
            res.put("plagiarismScore", s.getPlagiarismScore());
            res.put("plagiarismStatus", s.getPlagiarismStatus());

            return res;
        }).toList();
    }

    @GetMapping("/student/{studentId}")
    public List<Map<String, Object>> getStudentResults(@PathVariable String studentId) {
        return getResults().stream()
                .filter(r -> studentId.equals(r.get("studentId")))
                .toList();
    }

    @GetMapping("/analytics")
    public Map<String, Object> getAnalytics() {
        List<Submission> submissions = submissionRepository.findAll();

        Map<String, Object> analytics = new HashMap<>();

        double averageMarks = submissions.stream()
                .mapToDouble(Submission::getAiMarks)
                .average()
                .orElse(0);

        Map<String, Double> studentTotals = new HashMap<>();
        Map<String, Integer> studentCounts = new HashMap<>();

        Map<Long, Double> questionTotals = new HashMap<>();
        Map<Long, Integer> questionCounts = new HashMap<>();

        for (Submission s : submissions) {
            String studentKey = s.getStudentId() + " - " + s.getStudentName();

            studentTotals.put(studentKey, studentTotals.getOrDefault(studentKey, 0.0) + s.getAiMarks());
            studentCounts.put(studentKey, studentCounts.getOrDefault(studentKey, 0) + 1);

            questionTotals.put(s.getQuestionId(), questionTotals.getOrDefault(s.getQuestionId(), 0.0) + s.getAiMarks());
            questionCounts.put(s.getQuestionId(), questionCounts.getOrDefault(s.getQuestionId(), 0) + 1);
        }

        List<Map<String, Object>> topStudents = studentTotals.keySet().stream().map(k -> {
            Map<String, Object> m = new HashMap<>();
            m.put("student", k);
            m.put("average", studentTotals.get(k) / studentCounts.get(k));
            return m;
        }).sorted((a, b) -> Double.compare((double) b.get("average"), (double) a.get("average"))).toList();

        List<Map<String, Object>> weakQuestions = questionTotals.keySet().stream().map(qid -> {
            Map<String, Object> m = new HashMap<>();

            Question q = questionRepository.findById(qid).orElse(null);

            m.put("questionId", qid);
            m.put("questionText", q != null ? q.getQuestionText() : "Question not found");
            m.put("average", questionTotals.get(qid) / questionCounts.get(qid));

            return m;
        }).sorted(Comparator.comparingDouble(a -> (double) a.get("average"))).toList();

        analytics.put("averageMarks", averageMarks);
        analytics.put("topStudents", topStudents);
        analytics.put("weakQuestions", weakQuestions);

        return analytics;
    }
}