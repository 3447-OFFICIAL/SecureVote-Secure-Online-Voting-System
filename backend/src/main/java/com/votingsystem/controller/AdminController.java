package com.votingsystem.controller;

import com.votingsystem.dto.AuditDTO;
import com.votingsystem.dto.ElectionRequest;
import com.votingsystem.dto.ElectionResponse;
import com.votingsystem.entity.User;
import com.votingsystem.enums.ElectionStatus;
import com.votingsystem.service.AuditService;
import com.votingsystem.service.ElectionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final ElectionService electionService;
    private final AuditService auditService;

    @PostMapping("/elections")
    public ResponseEntity<ElectionResponse> createElection(
            @Valid @RequestBody ElectionRequest request,
            @AuthenticationPrincipal User admin) {
        return ResponseEntity.ok(electionService.createElection(request, admin));
    }

    @PatchMapping("/elections/{id}/status")
    public ResponseEntity<ElectionResponse> updateElectionStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        ElectionStatus status = ElectionStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(electionService.updateElectionStatus(id, status));
    }

    @DeleteMapping("/elections/{id}")
    public ResponseEntity<Map<String, String>> deleteElection(@PathVariable Long id) {
        electionService.deleteElection(id);
        return ResponseEntity.ok(Map.of("message", "Election deleted successfully"));
    }

    @GetMapping("/audit/{electionId}")
    public ResponseEntity<List<AuditDTO>> getAuditTrail(@PathVariable Long electionId) {
        return ResponseEntity.ok(auditService.getAuditTrail(electionId));
    }

    @GetMapping("/audit/{electionId}/verify")
    public ResponseEntity<Map<String, Object>> verifyIntegrity(@PathVariable Long electionId) {
        boolean isValid = auditService.verifyChainIntegrity(electionId);
        long count = auditService.getAuditCount(electionId);
        return ResponseEntity.ok(Map.of(
                "electionId", electionId,
                "chainIntegrity", isValid,
                "totalRecords", count,
                "message", isValid ? "Audit chain is intact" : "WARNING: Chain integrity compromised"
        ));
    }
}
