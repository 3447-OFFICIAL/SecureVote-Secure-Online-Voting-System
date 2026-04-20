'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import MerkleProofVisualizer from '@/components/MerkleProofVisualizer';
import { verifyMerkleProof } from '@/lib/merkle-utils';
import { Shield, Search, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function MerkleVerifyPage() {
  const [voteHash, setVoteHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    leaf: string;
    proof: string[];
    root: string;
    isVerified: boolean;
  } | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voteHash.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'}/audit/proof/${voteHash}`);
      if (!response.ok) {
        throw new Error('Vote hash not found or Merkle audit not yet calculated for this election.');
      }

      const data = await response.json();
      const isVerified = await verifyMerkleProof(data.voteHash, data.proof, data.merkleRoot);

      setResult({
        leaf: data.voteHash,
        proof: data.proof,
        root: data.merkleRoot,
        isVerified: isVerified
      });
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-6">
            <Shield className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Advanced Verification</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Use cryptographic Merkle Proofs to verify that your specific vote is included in the election's immutable consensus.
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 mb-12 shadow-2xl backdrop-blur-sm">
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label htmlFor="voteHash" className="block text-sm font-medium text-slate-400 mb-2 ml-1">
                Enter your Vote Hash
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="voteHash"
                  value={voteHash}
                  onChange={(e) => setVoteHash(e.target.value)}
                  placeholder="e.g. 8f2b3c... (copy from your voting confirmation)"
                  className="w-full px-6 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 transition-all font-mono text-sm pr-12"
                />
                <button
                  type="submit"
                  disabled={loading || !voteHash}
                  className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div className="mt-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <p className="text-sm text-red-400 font-medium">{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-12 pt-8 border-t border-slate-800">
              <MerkleProofVisualizer
                leaf={result.leaf}
                proof={result.proof}
                root={result.root}
              />
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8 text-sm">
          <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800/50">
            <h3 className="font-semibold text-slate-200 mb-3 flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>What is a Merkle Root?</span>
            </h3>
            <p className="text-slate-400 leading-relaxed">
              A Merkle Root is a single cryptographic hash that summarizes all votes in an election. If any vote is added, removed, or changed, this root becomes invalid, alerting auditors instantly.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-800/50">
            <h3 className="font-semibold text-slate-200 mb-3 flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>How Verification Works</span>
            </h3>
            <p className="text-slate-400 leading-relaxed">
              We take your vote hash and provide you with a "proof" (a set of sibling hashes). By hashing them together iteratively, you produce the Election Root, proving your vote is mathematically pinned in place.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
