package com.votingsystem.service;

import com.votingsystem.dto.MerkleProofDTO;
import com.votingsystem.entity.MerkleAudit;
import com.votingsystem.repository.MerkleAuditRepository;
import com.votingsystem.repository.VoteAuditRepository;
import com.votingsystem.util.MerkleTreeUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MerkleAuditService {

    private final MerkleAuditRepository merkleAuditRepository;
    private final VoteAuditRepository voteAuditRepository;

    @Transactional
    public MerkleAudit calculateAndSaveRoot(Long electionId) {
        List<String> hashes = voteAuditRepository.findVoteHashesByElectionId(electionId);
        if (hashes.isEmpty()) {
            throw new RuntimeException("No votes found for election ID: " + electionId);
        }

        String root = MerkleTreeUtil.calculateRoot(hashes);

        MerkleAudit audit = merkleAuditRepository.findByElectionId(electionId)
                .map(existing -> {
                    existing.setMerkleRoot(root);
                    existing.setNodeCount(hashes.size());
                    return existing;
                })
                .orElse(MerkleAudit.builder()
                        .electionId(electionId)
                        .merkleRoot(root)
                        .nodeCount(hashes.size())
                        .build());

        return merkleAuditRepository.save(audit);
    }

    public MerkleProofDTO getProofForVote(String voteHash) {
        // Find which election this vote belongs to
        return voteAuditRepository.findAll().stream()
                .filter(v -> v.getVoteHash().equals(voteHash))
                .findFirst()
                .map(vote -> {
                    Long electionId = vote.getElection().getId();
                    List<String> hashes = voteAuditRepository.findVoteHashesByElectionId(electionId);
                    String root = merkleAuditRepository.findByElectionId(electionId)
                            .map(MerkleAudit::getMerkleRoot)
                            .orElse(MerkleTreeUtil.calculateRoot(hashes));

                    return MerkleProofDTO.builder()
                            .voteHash(voteHash)
                            .merkleRoot(root)
                            .proof(MerkleTreeUtil.getProof(hashes, voteHash))
                            .verified(true)
                            .build();
                })
                .orElseThrow(() -> new RuntimeException("Vote hash not found: " + voteHash));
    }
}
