package com.votingsystem.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String voteHash;

    @Column(nullable = false)
    private String previousHash;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String data;

    @Column(nullable = false)
    private Long electionId;

    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp;

    @Column(nullable = false)
    private Long sequenceNumber;

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }
}
