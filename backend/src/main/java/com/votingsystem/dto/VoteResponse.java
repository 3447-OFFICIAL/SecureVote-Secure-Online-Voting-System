package com.votingsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class VoteResponse {
    private String voteHash;
    private String message;
    private LocalDateTime timestamp;
}
