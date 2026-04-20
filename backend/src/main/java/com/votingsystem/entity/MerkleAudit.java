package com.votingsystem.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "merkle_audits")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MerkleAudit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long electionId;

    @Column(nullable = false)
    private String merkleRoot;

    @Column(nullable = false)
    private Integer nodeCount;

    @Column(nullable = false, updatable = false)
    private LocalDateTime calculatedAt;

    @PrePersist
    protected void onCreate() {
        calculatedAt = LocalDateTime.now();
    }
}
