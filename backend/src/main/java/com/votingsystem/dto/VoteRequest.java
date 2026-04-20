package com.votingsystem.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class VoteRequest {

    @NotNull(message = "Election ID is required")
    private Long electionId;

    @NotNull(message = "Candidate ID is required")
    private Long candidateId;
}
