package com.votingsystem.repository;

import com.votingsystem.entity.Election;
import com.votingsystem.enums.ElectionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ElectionRepository extends JpaRepository<Election, Long> {
    List<Election> findByStatus(ElectionStatus status);
    List<Election> findAllByOrderByCreatedAtDesc();
}
