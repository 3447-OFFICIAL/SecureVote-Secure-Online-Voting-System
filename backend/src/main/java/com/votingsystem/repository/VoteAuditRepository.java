package com.votingsystem.repository;

import com.votingsystem.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface VoteAuditRepository extends JpaRepository<Vote, Long> {
    
    @Query("SELECT v.voteHash FROM Vote v WHERE v.election.id = :electionId ORDER BY v.id ASC")
    List<String> findVoteHashesByElectionId(@Param("electionId") Long electionId);
    
    @Query("SELECT COUNT(v) FROM Vote v WHERE v.election.id = :electionId")
    int countByElectionId(@Param("electionId") Long electionId);
}
