package com.votingsystem.dto;

import com.votingsystem.enums.ElectionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class ElectionResponse {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private ElectionStatus status;
    private List<CandidateResponse> candidates;
    private long totalVotes;
    private boolean hasVoted;
    private LocalDateTime createdAt;

    @Data
    @Builder
    @AllArgsConstructor
    public static class CandidateResponse {
        private Long id;
        private String name;
        private String party;
        private String description;
        private long voteCount;
    }
}
