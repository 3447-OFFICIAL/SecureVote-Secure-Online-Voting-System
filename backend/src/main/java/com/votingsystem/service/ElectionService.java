package com.votingsystem.service;

import com.votingsystem.dto.ElectionRequest;
import com.votingsystem.dto.ElectionResponse;
import com.votingsystem.entity.Candidate;
import com.votingsystem.entity.Election;
import com.votingsystem.entity.User;
import com.votingsystem.enums.ElectionStatus;
import com.votingsystem.repository.AuditLogRepository;
import com.votingsystem.repository.CandidateRepository;
import com.votingsystem.repository.ElectionRepository;
import com.votingsystem.repository.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ElectionService {

    private final ElectionRepository electionRepository;
    private final CandidateRepository candidateRepository;
    private final VoteRepository voteRepository;
    private final AuditLogRepository auditLogRepository;

    @Transactional
    @SuppressWarnings("null")
    public ElectionResponse createElection(ElectionRequest request, User admin) {
        Election election = Election.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .status(ElectionStatus.UPCOMING)
                .createdBy(admin)
                .build();

        Election saved = electionRepository.save(election);

        if (request.getCandidates() != null) {
            request.getCandidates().forEach(c -> {
                Candidate candidate = Candidate.builder()
                        .name(c.getName())
                        .party(c.getParty())
                        .description(c.getDescription())
                        .election(saved)
                        .build();
                candidateRepository.save(candidate);
            });
        }

        return toResponse(saved, null);
    }

    public List<ElectionResponse> getAllElections(User currentUser) {
        return electionRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(e -> toResponse(e, currentUser))
                .collect(Collectors.toList());
    }

    @SuppressWarnings("null")
    public ElectionResponse getElectionById(Long id, User currentUser) {
        Election election = electionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Election not found"));
        return toResponse(election, currentUser);
    }

    @Transactional
    @SuppressWarnings("null")
    public ElectionResponse updateElectionStatus(Long id, ElectionStatus status) {
        Election election = electionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Election not found"));
        election.setStatus(status);
        electionRepository.save(election);
        return toResponse(election, null);
    }

    @Transactional
    @SuppressWarnings("null")
    public void deleteElection(Long id) {
        if (!electionRepository.existsById(id)) {
            throw new RuntimeException("Election not found");
        }
        // First delete dependent records
        voteRepository.deleteByElectionId(id);
        auditLogRepository.deleteByElectionId(id);

        // Then delete the election (this will cascade to Candidates)
        electionRepository.deleteById(id);
    }

    private ElectionResponse toResponse(Election election, User currentUser) {
        List<Candidate> candidates = candidateRepository.findByElectionId(election.getId());
        boolean showResults = election.getStatus() == ElectionStatus.COMPLETED;

        List<ElectionResponse.CandidateResponse> candidateResponses = candidates.stream()
                .map(c -> ElectionResponse.CandidateResponse.builder()
                        .id(c.getId())
                        .name(c.getName())
                        .party(c.getParty())
                        .description(c.getDescription())
                        .voteCount(showResults ? voteRepository.countByElectionIdAndCandidateId(election.getId(), c.getId()) : 0)
                        .build())
                .collect(Collectors.toList());

        boolean hasVoted = currentUser != null &&
                voteRepository.existsByUserIdAndElectionId(currentUser.getId(), election.getId());

        return ElectionResponse.builder()
                .id(election.getId())
                .title(election.getTitle())
                .description(election.getDescription())
                .startDate(election.getStartDate())
                .endDate(election.getEndDate())
                .status(election.getStatus())
                .candidates(candidateResponses)
                .totalVotes(voteRepository.countByElectionId(election.getId()))
                .hasVoted(hasVoted)
                .createdAt(election.getCreatedAt())
                .build();
    }
}
