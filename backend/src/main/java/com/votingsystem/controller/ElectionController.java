package com.votingsystem.controller;

import com.votingsystem.dto.ElectionResponse;
import com.votingsystem.entity.User;
import com.votingsystem.service.ElectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/elections")
@RequiredArgsConstructor
public class ElectionController {

    private final ElectionService electionService;

    @GetMapping
    public ResponseEntity<List<ElectionResponse>> getAllElections(
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(electionService.getAllElections(currentUser));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ElectionResponse> getElection(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(electionService.getElectionById(id, currentUser));
    }
}
