'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Vote, ChevronLeft, CheckCircle2, ShieldCheck, Info, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function ElectionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [election, setElection] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);
  const [voteResult, setVoteResult] = useState<any>(null);

  useEffect(() => {
    const fetchElectionDetails = async () => {
      try {
        const data = await api.get(`/elections/${id}`);
        setElection(data);
      } catch (err: any) {
        if (err.message.includes('401') || err.message.includes('403')) {
          router.push('/login');
        } else {
          setError('Could not retrieve election specifications.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchElectionDetails();
  }, [id, router]);

  const handleVote = async () => {
    if (selectedCandidate === null) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await api.post('/votes', {
        electionId: parseInt(id as string),
        candidateId: selectedCandidate
      });
      setVoteResult(result);
    } catch (err: any) {
      setError(err.message || 'Transmission failed. Protocol rejected the vote.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <Loader2 className="w-12 h-12 text-[var(--primary)] animate-spin" />
      </div>
    );
  }

  if (voteResult) {
    return (
      <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.1] pointer-events-none" />
        <Card glass className="max-w-2xl w-full p-12 text-center border-emerald-500/30">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-8 border-2 border-emerald-500/20"
          >
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </motion.div>
          <h2 className="text-4xl font-black text-[var(--text-primary)] mb-4 tracking-tighter">Vote Recorded.</h2>
          <p className="text-[var(--text-secondary)] mb-8 font-medium">
            Your selection has been cryptographically signed and committed to the secure ledger. 
            The protocol has generated a unique audit hash for your verification.
          </p>
          
          <div className="bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--border)] mb-8 font-mono text-xs break-all text-emerald-500 font-bold select-all cursor-pointer hover:bg-[var(--bg-secondary)]/80 transition-colors">
            {voteResult.voteHash}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" href="/elections">Return to Terminal</Button>
            <Button variant="ghost" href="/verify">Verify on Network</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full py-20 px-4">
      <Navbar />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none" />

      <main className="max-w-5xl mx-auto pt-20">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-8 group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs uppercase font-black tracking-widest">Back to Elections</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Election Details */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              <Badge variant="primary">{election?.status}</Badge>
              <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tighter leading-tight">
                {election?.title}
              </h1>
              <p className="text-[var(--text-secondary)] font-medium">
                {election?.description}
              </p>
              
              <div className="h-[1px] bg-[var(--border)] w-full my-6" />
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-[var(--text-primary)]">Cryptographic Integrity</h4>
                    <p className="text-[10px] text-[var(--text-muted)] mt-1">End-to-end verifiable voting protocol active.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-[var(--text-primary)]">Submission Policy</h4>
                    <p className="text-[10px] text-[var(--text-muted)] mt-1">Votes are immutable and cannot be revoked once signed.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Candidate Selection */}
          <div className="lg:col-span-2">
            {election?.hasVoted ? (
              <Card glass className="p-12 text-center border-amber-500/20 mb-8">
                <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Access Portal Restricted</h3>
                <p className="text-[var(--text-secondary)] font-medium">
                  You have already participated in this decision. Duplicate transmission is prohibited by protocol rules.
                </p>
              </Card>
            ) : (
              <div className="space-y-6 pb-12">
                <h2 className="text-xl font-black text-[var(--text-primary)] tracking-tight mb-4 flex items-center gap-2">
                  <Vote className="w-5 h-5 text-[var(--primary)]" />
                  Select Candidate
                </h2>
                
                <div className="grid grid-cols-1 gap-4">
                  {election?.candidates.map((candidate: any) => (
                    <motion.div
                      key={candidate.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedCandidate(candidate.id)}
                    >
                      <Card 
                        glass 
                        className={`p-6 cursor-pointer transition-all duration-300 border-2 ${
                          selectedCandidate === candidate.id 
                            ? 'border-[var(--primary)] bg-[var(--primary)]/5' 
                            : 'border-transparent hover:border-[var(--border)]'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-lg font-bold text-[var(--text-primary)]">{candidate.name}</h3>
                            <p className="text-xs font-black uppercase tracking-widest text-[var(--accent)] mt-1">{candidate.party}</p>
                            <p className="text-sm text-[var(--text-secondary)] mt-2 italic">{candidate.description}</p>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                             selectedCandidate === candidate.id ? 'border-[var(--primary)] bg-[var(--primary)]' : 'border-[var(--border)]'
                          }`}>
                            {selectedCandidate === candidate.id && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </motion.div>
                )}

                <Button 
                  onClick={handleVote}
                  disabled={selectedCandidate === null || isSubmitting}
                  variant="primary" 
                  className="w-full h-16 text-lg font-black tracking-tight"
                >
                  {isSubmitting ? (
                     <div className="flex items-center gap-2">
                       <Loader2 className="w-5 h-5 animate-spin" />
                       Signing Transaction...
                     </div>
                  ) : 'Sign & Cast Vote'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
