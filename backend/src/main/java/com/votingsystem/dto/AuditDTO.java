package com.votingsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
public class AuditDTO {
    private Long id;
    private String voteHash;
    private String previousHash;
    private Long electionId;
    private Long sequenceNumber;
    private LocalDateTime timestamp;
    private boolean isValid;
}
