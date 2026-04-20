package com.votingsystem.service;

import com.votingsystem.dto.AuditDTO;
import com.votingsystem.entity.AuditLog;
import com.votingsystem.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    public List<AuditDTO> getAuditTrail(Long electionId) {
        List<AuditLog> logs = auditLogRepository.findByElectionIdOrderBySequenceNumberAsc(electionId);
        List<AuditDTO> auditDTOs = new ArrayList<>();

        String expectedPreviousHash = "GENESIS";

        for (AuditLog log : logs) {
            boolean isValid = log.getPreviousHash().equals(expectedPreviousHash);

            auditDTOs.add(AuditDTO.builder()
                    .id(log.getId())
                    .voteHash(log.getVoteHash())
                    .previousHash(log.getPreviousHash())
                    .electionId(log.getElectionId())
                    .sequenceNumber(log.getSequenceNumber())
                    .timestamp(log.getTimestamp())
                    .isValid(isValid)
                    .build());

            expectedPreviousHash = log.getVoteHash();
        }

        return auditDTOs;
    }

    public boolean verifyChainIntegrity(Long electionId) {
        List<AuditLog> logs = auditLogRepository.findByElectionIdOrderBySequenceNumberAsc(electionId);

        if (logs.isEmpty()) return true;

        String expectedPreviousHash = "GENESIS";

        for (AuditLog log : logs) {
            if (!log.getPreviousHash().equals(expectedPreviousHash)) {
                return false;
            }

            expectedPreviousHash = log.getVoteHash();
        }

        return true;
    }

    public long getAuditCount(Long electionId) {
        return auditLogRepository.countByElectionId(electionId);
    }
}
