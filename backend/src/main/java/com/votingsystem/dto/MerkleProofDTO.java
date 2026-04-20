package com.votingsystem.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class MerkleProofDTO {
    private String voteHash;
    private String merkleRoot;
    private List<String> proof;
    private boolean verified;
}
