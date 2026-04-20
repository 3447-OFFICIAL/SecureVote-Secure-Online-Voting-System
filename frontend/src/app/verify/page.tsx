'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, SearchCode, Database, CheckCircle2, LockKeyhole } from 'lucide-react';
import { useState } from 'react';
import { api } from '@/lib/api';

export default function VerifyPage() {
  const [receipt, setReceipt] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'verified' | 'failed'>('idle');
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!receipt.trim()) return;
    
    setIsVerifying(true);
    setStatus('loading');
    setError('');

    try {
      const result = await api.get(`/votes/verify/${receipt}`);
      if (result.verified) {
        setStatus('verified');
      } else {
        setStatus('failed');
        setError('Vote identifier not found on the ledger.');
      }
    } catch (err: any) {
      console.error('Verification failed:', err);
      setStatus('failed');
      setError(err.message || 'Verification service unreachable.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col items-center">
      <Navbar />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.1] dark:opacity-20 pointer-events-none" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-32 pb-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge variant="primary" className="mb-4">Verification Layer</Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-[var(--text-primary)]">
            Verify Your <span className="gradient-text">Consensus.</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] mt-4 font-medium">
            Enter your cryptographic receipt identifier to verify your vote has been correctly counted on the ledger.
          </p>
        </motion.div>

        <Card glass className="p-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)]">Receipt Identifier (SHA-256)</label>
              <div className="flex flex-col md:flex-row gap-4">
                <input 
                  type="text" 
                  value={receipt}
                  onChange={(e) => {
                    setReceipt(e.target.value);
                    if (status !== 'idle') setStatus('idle');
                  }}
                  placeholder="e.g. 0x93a1...f2e4"
                  className="flex-grow bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-6 py-4 text-[var(--text-primary)] font-mono text-sm focus:outline-none focus:border-[var(--primary)] transition-colors"
                />
                <Button 
                  variant="primary" 
                  className="h-auto px-8"
                  onClick={handleVerify}
                  disabled={isVerifying || !receipt.trim()}
                >
                  {isVerifying ? 'Verifying...' : 'Verify Proof'}
                </Button>
              </div>
              {status === 'verified' && (
                <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <p className="text-green-500 font-bold tracking-tight uppercase text-sm">
                    Verification Successful: Vote is cryptographically confirmed on the ledger.
                  </p>
                </div>
              )}
              {status === 'failed' && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-red-500" />
                  <p className="text-red-500 font-bold tracking-tight uppercase text-sm">
                    {error || 'Verification Failed: Vote identifier not found on the ledger.'}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 mt-6 border-t border-[var(--border)]">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${
                  status === 'verified' 
                    ? 'bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20' 
                    : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border-[var(--border)]'
                }`}>
                  <Database className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest italic transition-opacity ${
                  status === 'verified' ? 'opacity-100' : 'opacity-40'
                }`}>Node Consensus</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${
                  status === 'verified' 
                    ? 'bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20' 
                    : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border-[var(--border)]'
                }`}>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest italic transition-opacity ${
                  status === 'verified' ? 'opacity-100' : 'opacity-40'
                }`}>ZK-Proof Valid</span>
              </div>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-colors ${
                  status === 'verified' 
                    ? 'bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20' 
                    : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border-[var(--border)]'
                }`}>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest italic transition-opacity ${
                  status === 'verified' ? 'opacity-100' : 'opacity-40'
                }`}>Immutable Stamp</span>
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-[var(--bg-secondary)] border-dashed">
                <div className="flex items-center gap-4 mb-4">
                    <SearchCode className="w-6 h-6 text-[var(--primary)]" />
                    <h4 className="font-bold tracking-tight">Open Source Audit</h4>
                </div>
                <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed">
                    Download our protocol verification tool to run a local audit on the complete ledger tally.
                </p>
            </Card>
            <Card className="bg-[var(--bg-secondary)] border-dashed">
                <div className="flex items-center gap-4 mb-4">
                    <LockKeyhole className="w-6 h-6 text-[var(--accent)]" />
                    <h4 className="font-bold tracking-tight">Anonymity Matrix</h4>
                </div>
                <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed">
                    Learn how our zero-knowledge proofs decouple identity from ballot data while remaining verifiable.
                </p>
            </Card>
        </div>
      </main>
    </div>
  );
}

