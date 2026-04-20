package com.votingsystem.service;

import com.votingsystem.dto.VoteRequest;
import com.votingsystem.dto.VoteResponse;
import com.votingsystem.entity.*;
import com.votingsystem.enums.ElectionStatus;
import com.votingsystem.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VoteService {

    private final VoteRepository voteRepository;
    private final ElectionRepository electionRepository;
    private final CandidateRepository candidateRepository;
    private final AuditLogRepository auditLogRepository;

    @Transactional
    @SuppressWarnings("null")
    public VoteResponse castVote(VoteRequest request, User voter) {
        Election election = electionRepository.findById(request.getElectionId())
                .orElseThrow(() -> new RuntimeException("Election not found"));

        if (election.getStatus() != ElectionStatus.ACTIVE) {
            throw new RuntimeException("Election is not currently active");
        }

        if (voteRepository.existsByUserIdAndElectionId(voter.getId(), election.getId())) {
            throw new RuntimeException("You have already voted in this election");
        }

        Candidate candidate = candidateRepository.findById(request.getCandidateId())
                .orElseThrow(() -> new RuntimeException("Candidate not found"));

        if (!candidate.getElection().getId().equals(election.getId())) {
            throw new RuntimeException("Candidate does not belong to this election");
        }

        // Generate vote hash for anonymity and verification
        String voteData = UUID.randomUUID() + "|" + election.getId() + "|" + candidate.getId() + "|" + LocalDateTime.now();
        String voteHash = generateSHA256Hash(voteData);

        Vote vote = Vote.builder()
                .election(election)
                .candidate(candidate)
                .user(voter)
                .voteHash(voteHash)
                .build();

        voteRepository.save(vote);

        // Create audit log entry with chain reference
        createAuditEntry(voteHash, election.getId(), voteData);

        return VoteResponse.builder()
                .voteHash(voteHash)
                .message("Vote cast successfully. Save your vote hash for verification.")
                .timestamp(vote.getTimestamp())
                .build();
    }

    public boolean verifyVote(String voteHash) {
        return voteRepository.findByVoteHash(voteHash).isPresent();
    }

    @SuppressWarnings("null")
    private void createAuditEntry(String voteHash, Long electionId, String data) {
        String previousHash = "GENESIS";
        long sequenceNumber = 1;

        Optional<AuditLog> lastEntry = auditLogRepository.findTopByElectionIdOrderBySequenceNumberDesc(electionId);
        if (lastEntry.isPresent()) {
            previousHash = lastEntry.get().getVoteHash();
            sequenceNumber = lastEntry.get().getSequenceNumber() + 1;
        }

        // Chain hash = SHA256(voteHash + previousHash + sequenceNumber)
        String chainData = voteHash + "|" + previousHash + "|" + sequenceNumber;
        String chainHash = generateSHA256Hash(chainData);

        AuditLog auditLog = AuditLog.builder()
                .voteHash(chainHash)
                .previousHash(previousHash)
                .data(data)
                .electionId(electionId)
                .sequenceNumber(sequenceNumber)
                .build();

        auditLogRepository.save(auditLog);
    }

    public static String generateSHA256Hash(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }
}
