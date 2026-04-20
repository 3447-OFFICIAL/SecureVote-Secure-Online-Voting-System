package com.votingsystem.controller;

import com.votingsystem.dto.MerkleProofDTO;
import com.votingsystem.entity.MerkleAudit;
import com.votingsystem.service.MerkleAuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
public class MerkleAuditApiController {

    private final MerkleAuditService merkleAuditService;

    @PostMapping("/calculate/{electionId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MerkleAudit> calculateRoot(@PathVariable Long electionId) {
        return ResponseEntity.ok(merkleAuditService.calculateAndSaveRoot(electionId));
    }

    @GetMapping("/proof/{voteHash}")
    public ResponseEntity<MerkleProofDTO> getProof(@PathVariable String voteHash) {
        try {
            return ResponseEntity.ok(merkleAuditService.getProofForVote(voteHash));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
