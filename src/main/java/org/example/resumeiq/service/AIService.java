package org.example.resumeiq.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
@Slf4j
public class AIService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.model}")
    private String model;

    private final WebClient webClient;

    public AIService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder
                .baseUrl("https://generativelanguage.googleapis.com")
                .build();
    }

    public boolean isEnabled() {
        return apiKey != null && !apiKey.isBlank();
    }

    public String analyzeResumeWithAI(String resumeText, String jobRoleName, String requiredSkills,
                                       List<String> matchedSkills, List<String> missingSkills, double matchScore) {
        if (!isEnabled()) {
            log.info("Gemini AI is disabled (no API key configured)");
            return null;
        }

        String prompt = String.format(
            "You are an expert HR professional and resume analyst.\n\n" +
            "A candidate applied for the role: **%s**\n" +
            "Required skills: %s\n\n" +
            "Their resume:\n---\n%s\n---\n\n" +
            "Skill match score: %.0f%%\n" +
            "Matched skills: %s\n" +
            "Missing skills: %s\n\n" +
            "Provide a concise analysis with:\n" +
            "1. Professional Summary (exactly 5 sentences covering: who the candidate is, their core strengths, their experience level, how well they fit this role, and one piece of forward-looking advice)\n" +
            "2. Key Strengths (bullet points related to the job)\n" +
            "3. Skill Gap Recommendations (specific actionable advice for each missing skill " +
            "- suggest courses, projects, or certifications)\n" +
            "4. Overall Verdict: Strong Match / Good Match / Needs Development\n\n" +
            "Keep it professional and actionable.",
            jobRoleName, requiredSkills, resumeText, matchScore,
            String.join(", ", matchedSkills),
            missingSkills.isEmpty() ? "None" : String.join(", ", missingSkills)
        );

        return callGemini(prompt);
    }

    private String callGemini(String prompt) {
        try {
            // Build JSON manually — no Jackson needed
            String escapedPrompt = prompt
                    .replace("\\", "\\\\")
                    .replace("\"", "\\\"")
                    .replace("\n", "\\n")
                    .replace("\r", "\\r")
                    .replace("\t", "\\t");

            String requestBody = "{\"contents\":[{\"parts\":[{\"text\":\"" + escapedPrompt + "\"}]}]," +
                    "\"generationConfig\":{\"temperature\":0.7,\"maxOutputTokens\":1024}}";

            String url = String.format("/v1beta/models/%s:generateContent?key=%s", model, apiKey);

            String responseJson = webClient.post()
                    .uri(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            if (responseJson == null) {
                log.warn("Empty response from Gemini");
                return null;
            }

            // Extract text from: "text": "..." in the response
            String marker = "\"text\"";
            int idx = responseJson.indexOf(marker);
            if (idx == -1) {
                log.warn("No text field in Gemini response");
                return null;
            }
            // Find the colon after "text", then the opening quote
            int colonIdx = responseJson.indexOf(':', idx + marker.length());
            int startQuote = responseJson.indexOf('"', colonIdx + 1);
            if (startQuote == -1) return null;

            // Find the closing quote (handle escaped quotes)
            StringBuilder sb = new StringBuilder();
            for (int i = startQuote + 1; i < responseJson.length(); i++) {
                char c = responseJson.charAt(i);
                if (c == '\\' && i + 1 < responseJson.length()) {
                    char next = responseJson.charAt(i + 1);
                    if (next == '"') { sb.append('"'); i++; }
                    else if (next == 'n') { sb.append('\n'); i++; }
                    else if (next == 't') { sb.append('\t'); i++; }
                    else if (next == '\\') { sb.append('\\'); i++; }
                    else { sb.append(c); }
                } else if (c == '"') {
                    break;
                } else {
                    sb.append(c);
                }
            }

            return sb.toString();

        } catch (Exception e) {
            log.error("Error calling Gemini API: {}", e.getMessage());
            return null;
        }
    }
}
