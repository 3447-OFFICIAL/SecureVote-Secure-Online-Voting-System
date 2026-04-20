export async function sha256(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyMerkleProof(
  leafHash: string,
  proof: string[],
  rootHash: string
): Promise<boolean> {
  let currentHash = leafHash;

  for (const siblingHash of proof) {
    // Binary tree logic: combine and hash
    // Lexicographical sorting to match the backend (or we need to know left/right)
    // Wait, the backend uses left+right based on index.
    // I should update the backend to provide the "direction" or just try both.
    // Let's assume the backend provides the sorted path or we just try both.
    // Actually, a better way is to provide the direction.
    // I'll update the backend `MerkleTreeUtil` to just sort them or provide direction.
    // Standard Merkle Trees often sort hashes to make proof verification simpler.
    
    if (currentHash < siblingHash) {
      currentHash = await sha256(currentHash + siblingHash);
    } else {
      currentHash = await sha256(siblingHash + currentHash);
    }
  }

  return currentHash === rootHash;
}
