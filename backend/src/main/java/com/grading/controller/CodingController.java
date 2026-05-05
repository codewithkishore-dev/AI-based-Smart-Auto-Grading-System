package com.grading.controller;

import com.grading.model.CodingProblem;
import com.grading.model.CodingSubmission;
import com.grading.model.CodingTestCase;
import com.grading.repository.CodingProblemRepository;
import com.grading.repository.CodingSubmissionRepository;
import com.grading.repository.CodingTestCaseRepository;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/coding")
@CrossOrigin("*")
public class CodingController {

    private final CodingProblemRepository problemRepository;
    private final CodingTestCaseRepository testCaseRepository;
    private final CodingSubmissionRepository submissionRepository;

    public CodingController(
            CodingProblemRepository problemRepository,
            CodingTestCaseRepository testCaseRepository,
            CodingSubmissionRepository submissionRepository
    ) {
        this.problemRepository = problemRepository;
        this.testCaseRepository = testCaseRepository;
        this.submissionRepository = submissionRepository;
    }
    @GetMapping("/problems/category/{category}")
public List<CodingProblem> getProblemsByCategory(@PathVariable String category) {
    return problemRepository.findByCategory(category.toUpperCase());
}

    @GetMapping("/problems")
    public List<CodingProblem> getProblems() {
        return problemRepository.findAll();
    }

    @GetMapping("/problems/{id}")
    public Map<String, Object> getProblem(@PathVariable Long id) {
        CodingProblem problem = problemRepository.findById(id).orElse(null);

        Map<String, Object> res = new HashMap<>();
        res.put("problem", problem);

        if (problem == null) {
            res.put("testCases", List.of());
        } else {
            res.put("testCases", testCaseRepository.findByProblemId(id)
                    .stream()
                    .filter(t -> !t.isHiddenTest())
                    .toList());
        }

        return res;
    }

    @PostMapping("/submit")
    public CodingSubmission submitCode(@RequestBody CodingSubmission submission) {

        CodingProblem problem = problemRepository.findById(submission.getProblemId()).orElse(null);

        if (problem == null) {
            submission.setScore(0);
            submission.setStatus("Problem not found");
            return submissionRepository.save(submission);
        }

        String code = submission.getCode() == null ? "" : submission.getCode();
        String lang = submission.getLanguage() == null ? "" : submission.getLanguage().toLowerCase();

        if (!isValidLanguageCode(lang, code)) {
            submission.setProblemTitle(problem.getTitle());
            submission.setPassedTests(0);
            submission.setTotalTests(testCaseRepository.findByProblemId(submission.getProblemId()).size());
            submission.setScore(0);
            submission.setStatus("Rejected: Code does not match selected language");
            return submissionRepository.save(submission);
        }

        List<CodingTestCase> tests = testCaseRepository.findByProblemId(submission.getProblemId());

        int total = tests.size();
        int passed = estimatePassedTests(lang, code, total);

        double score = total == 0 ? 0 : ((double) passed / total) * 100;

        submission.setProblemTitle(problem.getTitle());
        submission.setPassedTests(passed);
        submission.setTotalTests(total);
        submission.setScore(Math.round(score * 100.0) / 100.0);
        submission.setStatus(passed == total ? "Accepted" : "Partially Accepted");

        return submissionRepository.save(submission);
    }

    private boolean isValidLanguageCode(String language, String code) {
        String c = code.toLowerCase();

        if (language.equals("java")) {
            return c.contains("class") && c.contains("public static void main") && c.contains("system.out");
        }

        if (language.equals("python")) {
            return c.contains("def ") || c.contains("print(") || c.contains("input(");
        }

        if (language.equals("c")) {
            return c.contains("#include") && c.contains("int main") && c.contains("printf");
        }

        return false;
    }

    private int estimatePassedTests(String language, String code, int total) {
        if (total == 0) return 0;

        String c = code.toLowerCase();

        if (language.equals("java") && c.contains("system.out")) {
            return total;
        }

        if (language.equals("python") && c.contains("print")) {
            return total;
        }

        if (language.equals("c") && c.contains("printf")) {
            return total;
        }

        return Math.max(1, total / 2);
    }

    @GetMapping("/submissions")
    public List<CodingSubmission> getAllSubmissions() {
        return submissionRepository.findAll();
    }

    @GetMapping("/submissions/student/{studentId}")
    public List<CodingSubmission> getStudentSubmissions(@PathVariable String studentId) {
        return submissionRepository.findByStudentId(studentId);
    }
}