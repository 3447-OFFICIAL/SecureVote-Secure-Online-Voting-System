package com.votingsystem.repository;

import com.votingsystem.entity.Vote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    boolean existsByUserIdAndElectionId(Long userId, Long electionId);
    Optional<Vote> findByVoteHash(String voteHash);

    @Query("SELECT COUNT(v) FROM Vote v WHERE v.election.id = :electionId")
    long countByElectionId(@Param("electionId") Long electionId);

    @Query("SELECT COUNT(v) FROM Vote v WHERE v.election.id = :electionId AND v.candidate.id = :candidateId")
    long countByElectionIdAndCandidateId(@Param("electionId") Long electionId, @Param("candidateId") Long candidateId);
    @Modifying
    @Query("DELETE FROM Vote v WHERE v.election.id = :electionId")
    void deleteByElectionId(@Param("electionId") Long electionId);
}
