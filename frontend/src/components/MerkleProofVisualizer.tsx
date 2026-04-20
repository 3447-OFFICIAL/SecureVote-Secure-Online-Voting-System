'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, ChevronRight, Hash, CheckCircle2 } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MerkleProofVisualizerProps {
  leaf: string;
  proof: string[];
  root: string;
}

export default function MerkleProofVisualizer({ leaf, proof, root }: MerkleProofVisualizerProps) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="flex flex-col space-y-4">
        {/* Leaf Node */}
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
            <Hash className="w-6 h-6 text-blue-500" />
          </div>
          <div className="flex-grow p-4 rounded-xl bg-slate-900 border border-slate-800">
            <p className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-1">Your Vote Hash (Leaf)</p>
            <p className="text-sm font-mono text-blue-400 break-all">{leaf}</p>
          </div>
        </div>

        {/* Proof Steps */}
        {proof.map((hash, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-4 ml-6"
          >
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
              <div className="w-0.5 h-12 bg-slate-800" />
              <ChevronRight className="w-4 h-4 text-slate-600 absolute" />
            </div>
            <div className="flex-grow p-4 rounded-xl bg-slate-900/50 border border-slate-800/50">
              <p className="text-xs text-slate-500 font-mono uppercase tracking-wider mb-1">Sibling Hash (Step {index + 1})</p>
              <p className="text-sm font-mono text-slate-400 break-all">{hash}</p>
            </div>
          </motion.div>
        ))}

        {/* Root Node */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: (proof.length + 1) * 0.1 }}
          className="flex items-center space-x-4"
        >
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <Shield className="w-6 h-6 text-emerald-500" />
          </div>
          <div className="flex-grow p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-emerald-500/70 font-mono uppercase tracking-wider">Election Merkle Root</p>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-sm font-mono text-emerald-400 break-all">{root}</p>
          </div>
        </motion.div>
      </div>

      <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-start space-x-3">
        <div className="mt-0.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-emerald-500">Cryptographically Verified</h4>
          <p className="text-xs text-emerald-500/70 leading-relaxed">
            This vote has been verified against the election's Merkle Root. Any tampering would break the cryptographic chain, ensuring the integrity of your specific vote within the total count.
          </p>
        </div>
      </div>
    </div>
  );
}
