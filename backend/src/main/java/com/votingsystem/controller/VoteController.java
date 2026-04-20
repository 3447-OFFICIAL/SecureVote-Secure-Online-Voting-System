package com.votingsystem.controller;

import com.votingsystem.dto.VoteRequest;
import com.votingsystem.dto.VoteResponse;
import com.votingsystem.entity.User;
import com.votingsystem.service.VoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/votes")
@RequiredArgsConstructor
public class VoteController {

    private final VoteService voteService;

    @PostMapping
    public ResponseEntity<VoteResponse> castVote(
            @Valid @RequestBody VoteRequest request,
            @AuthenticationPrincipal User voter) {
        return ResponseEntity.ok(voteService.castVote(request, voter));
    }

    @GetMapping("/verify/{hash}")
    public ResponseEntity<Map<String, Object>> verifyVote(@PathVariable String hash) {
        boolean valid = voteService.verifyVote(hash);
        return ResponseEntity.ok(Map.of(
                "hash", hash,
                "verified", valid,
                "message", valid ? "Vote verified successfully" : "Vote hash not found"
        ));
    }
}
