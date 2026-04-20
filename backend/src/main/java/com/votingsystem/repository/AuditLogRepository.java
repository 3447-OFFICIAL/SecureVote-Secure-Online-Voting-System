package com.votingsystem.repository;

import com.votingsystem.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByElectionIdOrderBySequenceNumberAsc(Long electionId);
    Optional<AuditLog> findTopByElectionIdOrderBySequenceNumberDesc(Long electionId);
    long countByElectionId(Long electionId);

    @Modifying
    @Query("DELETE FROM AuditLog a WHERE a.electionId = :electionId")
    void deleteByElectionId(@Param("electionId") Long electionId);
}
