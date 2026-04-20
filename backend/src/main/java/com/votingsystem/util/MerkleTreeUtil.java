package com.votingsystem.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.List;

public class MerkleTreeUtil {

    public static String calculateRoot(List<String> hashes) {
        if (hashes == null || hashes.isEmpty()) {
            return null;
        }

        List<String> currentLevel = new ArrayList<>(hashes);
        while (currentLevel.size() > 1) {
            List<String> nextLevel = new ArrayList<>();
            for (int i = 0; i < currentLevel.size(); i += 2) {
                if (i + 1 < currentLevel.size()) {
                    String left = currentLevel.get(i);
                    String right = currentLevel.get(i + 1);
                    // Lexicographical sorting for consistent verification
                    if (left.compareTo(right) <= 0) {
                        nextLevel.add(hash(left + right));
                    } else {
                        nextLevel.add(hash(right + left));
                    }
                } else {
                    // Duplicate last node if odd
                    nextLevel.add(hash(currentLevel.get(i) + currentLevel.get(i)));
                }
            }
            currentLevel = nextLevel;
        }
        return currentLevel.get(0);
    }

    public static List<String> getProof(List<String> hashes, String targetHash) {
        if (hashes == null || !hashes.contains(targetHash)) {
            return new ArrayList<>();
        }

        List<String> proof = new ArrayList<>();
        List<String> currentLevel = new ArrayList<>(hashes);
        int index = currentLevel.indexOf(targetHash);

        while (currentLevel.size() > 1) {
            List<String> nextLevel = new ArrayList<>();
            for (int i = 0; i < currentLevel.size(); i += 2) {
                String left = currentLevel.get(i);
                String right = (i + 1 < currentLevel.size()) ? currentLevel.get(i + 1) : left;
                
                nextLevel.add(hash(left + right));

                if (i == index || i + 1 == index) {
                    proof.add((i == index) ? right : left);
                    index /= 2;
                }
            }
            currentLevel = nextLevel;
        }
        return proof;
    }

    private static String hash(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashBytes = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }
}
