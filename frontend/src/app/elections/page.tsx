'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Vote, Timer, Users, ChevronRight, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ElectionsPage() {
  const router = useRouter();
  const [elections, setElections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const data = await api.get('/elections');
        setElections(data);
      } catch (err: any) {
        if (err.message.includes('401') || err.message.includes('403')) {
          router.push('/login');
        } else {
          setError('Failed to load active elections. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchElections();
  }, [router]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col items-center">
      <Navbar />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.1] dark:opacity-20 pointer-events-none" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-32 pb-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Badge variant="primary" className="mb-4">Live Network</Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-[var(--text-primary)]">
            Active <span className="gradient-text">Elections.</span>
          </h1>
          <p className="text-lg text-[var(--text-secondary)] mt-4 max-w-2xl font-medium">
            Participate in decentralized governance. Every vote is cryptographically signed and stored on the immutable ledger.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-40 rounded-3xl bg-[var(--bg-secondary)] animate-pulse border border-[var(--border)]" />
            ))}
          </div>
        ) : error ? (
          <Card glass className="p-12 text-center border-red-500/20">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Protocol Access Error</h3>
            <p className="text-[var(--text-secondary)] mb-6">{error}</p>
            <Button onClick={() => window.location.reload()} variant="primary">Retry Connection</Button>
          </Card>
        ) : elections.length === 0 ? (
          <Card glass className="p-20 text-center">
             <div className="w-20 h-20 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mx-auto mb-6 border border-[var(--border)]">
               <Vote className="w-10 h-10 text-[var(--text-muted)]" />
             </div>
             <h3 className="text-2xl font-black text-[var(--text-primary)] tracking-tight">No Active Polls</h3>
             <p className="text-[var(--text-secondary)] mt-2 font-medium">There are no governance decisions currently awaiting mediation.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {elections.map((election, i) => (
              <motion.div
                key={election.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card glass className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-[var(--primary)] transition-colors duration-500">
                  <div className="flex items-center gap-6 w-full">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0 border border-[var(--primary)]/20">
                      <Vote className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl md:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
                          {election.title}
                        </h3>
                        <Badge variant={election.status === 'ACTIVE' ? 'success' : 'neutral'}>
                          {election.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] font-medium max-w-xl">
                        {election.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-[var(--border)] pt-4 md:pt-0">
                    <div className="flex flex-col items-center md:items-end">
                      <span className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)]">Verified Voters</span>
                      <div className="flex items-center gap-1.5 font-bold text-[var(--text-primary)]">
                        <Users className="w-4 h-4" />
                        {election.voterCount || 0}
                      </div>
                    </div>
                    <div className="flex flex-col items-center md:items-end">
                      <span className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)]">Time Remaining</span>
                      <div className="flex items-center gap-1.5 font-bold text-[var(--text-primary)]">
                        <Timer className="w-4 h-4" />
                        {election.status === 'ACTIVE' ? 'Live' : 'Closed'}
                      </div>
                    </div>
                    <Link href={`/elections/${election.id}`}>
                      <Button variant="primary" className="h-12 w-12 !p-0">
                        <ChevronRight className="w-6 h-6" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
