package com.grading.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class AIService {

    public Map<String, Object> gradeAnswer(String modelAnswer, String studentAnswer, int maxMarks) {

        RestTemplate restTemplate = new RestTemplate();

        String url = "http://localhost:5000/grade";

        Map<String, Object> request = new HashMap<>();
        request.put("modelAnswer", modelAnswer);
        request.put("studentAnswer", studentAnswer);
        request.put("maxMarks", maxMarks);

        @SuppressWarnings("unchecked")
        Map<String, Object> response =
                restTemplate.postForObject(url, request, Map.class);

        return response;
    }
}