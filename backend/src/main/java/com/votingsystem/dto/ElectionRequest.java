package com.votingsystem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ElectionRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Start date is required")
    private LocalDateTime startDate;

    @NotNull(message = "End date is required")
    private LocalDateTime endDate;

    private List<CandidateRequest> candidates;

    @Data
    public static class CandidateRequest {
        @NotBlank(message = "Candidate name is required")
        private String name;
        private String party;
        private String description;
    }
}
