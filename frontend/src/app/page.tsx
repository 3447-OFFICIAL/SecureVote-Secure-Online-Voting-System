'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import Navbar from '@/components/Navbar';
import { ShieldCheck, LockKeyhole, SearchCode } from 'lucide-react';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.15 } },
};

export default function HomePage() {
  const features = [
    {
      title: 'Cryptographic Identity',
      description: 'Zero-knowledge proofs guarantee total voter anonymity while mathematically preventing double-voting.',
      icon: <LockKeyhole className="w-6 h-6" />
    },
    {
      title: 'Immutable Ledger',
      description: 'Distributed nodes reach consensus on every ballot, making historical alterations computationally impossible.',
      icon: <ShieldCheck className="w-6 h-6" />
    },
    {
      title: 'Algorithmic Audits',
      description: 'Every stakeholder holds a validation receipt. Open-source verification confirms exact tally accuracy.',
      icon: <SearchCode className="w-6 h-6" />
    },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col items-center">
      <Navbar />

      <div className="absolute inset-0 bg-grid-pattern opacity-[0.15] dark:opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-[var(--primary)]/10 via-[var(--accent)]/10 to-transparent blur-[120px] rounded-full pointer-events-none -z-10" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow pt-32 pb-20 relative z-10">
        
        {/* Core Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center min-h-[60vh]">
          
          {/* Left Hero */}
          <motion.div 
            className="lg:col-span-7 flex flex-col space-y-8"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeUp} className="inline-flex w-fit items-center gap-3 px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--bg-secondary)] shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--success)]"></span>
              </span>
              <span className="text-[10px] sm:text-xs uppercase font-black tracking-[0.2em] text-[var(--text-primary)]">
                Network Secured • Block 8940
              </span>
            </motion.div>

            <div className="space-y-6">
              <motion.h1 
                variants={fadeUp}
                className="text-5xl sm:text-6xl lg:text-[5rem] font-black tracking-tighter leading-[1.05] text-[var(--text-primary)]"
              >
                Zero-Trust <br className="hidden sm:block" />
                <span className="gradient-text pb-2 inline-block shadow-black drop-shadow-sm">Digital Voting.</span>
              </motion.h1>

              <motion.p 
                variants={fadeUp}
                className="text-lg sm:text-xl md:text-2xl text-[var(--text-secondary)] max-w-2xl leading-relaxed font-medium tracking-tight"
              >
                The cryptographic voting infrastructure for modern democracies. Eliminate fraud, mathematically verify intent, and conduct irrefutable elections.
              </motion.p>
            </div>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4 pt-4">
              <Button href="/register" variant="primary" size="lg" className="w-full sm:w-auto">
                Launch Protocol
              </Button>
              <Button href="/verify" variant="secondary" size="lg" className="w-full sm:w-auto">
                Read Whitepaper
              </Button>
            </motion.div>

            <motion.div variants={fadeUp} className="pt-10 mt-6 border-t border-[var(--border)] w-full">
              <p className="text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-4">
                Enterprise Standards Verified
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="success">ISO 27001 Certified</Badge>
                <Badge variant="primary">Polymath ZK-Snarks</Badge>
                <Badge variant="neutral">Open Source Ledger</Badge>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Interface Glass Mock */}
          <motion.div 
            className="lg:col-span-5 relative w-full h-[550px] flex items-center justify-center mt-12 lg:mt-0"
            initial={{ opacity: 0, x: 40, filter: 'blur(20px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--primary)] to-[var(--accent)] rounded-[3rem] blur-3xl opacity-20 transform scale-90 -z-10 animate-pulse" style={{ animationDuration: '4s' }} />
            
            <div className="relative w-full max-w-md bg-[var(--bg-glass)] backdrop-blur-3xl border border-[var(--border)] rounded-[2.5rem] p-8 shadow-2xl flex flex-col space-y-8">
              
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">Proposal Consensus</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--success)] animate-pulse" />
                    <span className="text-xs text-[var(--text-secondary)] font-bold tracking-[0.2em] uppercase">Processing</span>
                  </div>
                </div>
                <div className="text-[10px] font-mono font-bold text-[var(--accent)] bg-[var(--accent)]/10 px-3 py-1.5 rounded-lg border border-[var(--accent)]/20 shadow-sm">
                  TX: 0x93..A1
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-6 pt-2">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-bold text-[var(--text-primary)]">
                    <span>Approve Restructuring</span>
                    <span>74.1%</span>
                  </div>
                  <div className="h-3 w-full bg-[var(--bg-secondary)] rounded-full overflow-hidden border border-[var(--border)] shadow-inner">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]"
                      initial={{ width: 0 }}
                      animate={{ width: "74.1%" }}
                      transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-semibold text-[var(--text-secondary)]">
                    <span>Reject Restructuring</span>
                    <span>25.9%</span>
                  </div>
                  <div className="h-3 w-full bg-[var(--bg-secondary)] rounded-full overflow-hidden border border-[var(--border)] shadow-inner">
                    <motion.div 
                      className="h-full bg-[var(--text-muted)]"
                      initial={{ width: 0 }}
                      animate={{ width: "25.9%" }}
                      transition={{ duration: 1.5, delay: 1.0, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>

              <hr className="border-[var(--border)] border-dashed border-b-0" />

              <motion.div 
                className="bg-[var(--bg-primary)] border border-[var(--border)] p-4 rounded-2xl shadow-lg flex items-center gap-4 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 1.8, type: "spring", stiffness: 100 }}
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--success)]/10 text-[var(--success)] flex items-center justify-center shrink-0 border border-[var(--success)]/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-[var(--text-primary)]">Blind Signature Verified</p>
                  <p className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-widest">Added to Block Array</p>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </div>

        {/* Feature Cards Grid */}
        <section id="platform" className="mt-32 border-t border-[var(--border)] pt-24 text-center">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[var(--text-primary)] mb-6">
            Flawless Architecture
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto font-medium mb-16">
            The platform relies purely on cryptographic proofs. No centralized authority can alter the tally, ensuring mathematical certainty at all times.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {features.map((feature, i) => (
              <Card key={feature.title} glass>
                <div className="w-14 h-14 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center text-[var(--primary)] mb-6 shadow-sm group-hover:scale-110 group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[var(--text-primary)] tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-base text-[var(--text-secondary)] font-medium">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
