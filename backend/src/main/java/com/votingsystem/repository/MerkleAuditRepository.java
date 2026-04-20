package com.votingsystem.repository;

import com.votingsystem.entity.MerkleAudit;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MerkleAuditRepository extends JpaRepository<MerkleAudit, Long> {
    Optional<MerkleAudit> findByElectionId(Long electionId);
}
