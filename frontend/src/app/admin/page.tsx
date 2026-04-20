'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Navbar from '@/components/Navbar';
import AdminGuard from '@/components/auth/AdminGuard';
import { api } from '@/lib/api';
import { 
  Plus, 
  Settings, 
  Play, 
  CheckSquare, 
  Trash2, 
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [elections, setElections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [auditResult, setAuditResult] = useState<any>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  useEffect(() => {
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const data = await api.get('/elections');
      setElections(data);
    } catch (err) {
      console.error('Failed to fetch elections:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await api.patch(`/admin/elections/${id}/status`, { status });
      fetchElections();
    } catch (err) {
      alert('Failed to update status: ' + err);
    }
  };

  const deleteElection = async (id: number) => {
    if (!confirm('Are you absolutely sure? This will delete all associated votes.')) return;
    try {
      await api.delete(`/admin/elections/${id}`);
      fetchElections();
    } catch (err) {
      alert('Failed to delete: ' + err);
    }
  };

  const runSystemAudit = async (id: number) => {
    setIsAuditing(true);
    try {
      const result = await api.get(`/admin/audit/${id}/verify`);
      setAuditResult(result);
    } catch (err) {
      alert('Audit failed: ' + err);
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <AdminGuard>
      <div className="relative min-h-screen w-full bg-[var(--bg-primary)] overflow-x-hidden">
        <Navbar />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none" />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <Badge variant="primary" className="mb-4">Admin Command Center</Badge>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-[var(--text-primary)]">
                Election <span className="gradient-text">Orchestrator.</span>
              </h1>
              <p className="text-[var(--text-secondary)] mt-2 font-medium max-w-xl">
                Manage institutional consensus, monitor ledger integrity, and publish multi-sig verified results.
              </p>
            </div>
            
            <Link href="/admin/create">
                <Button variant="primary" className="h-14 px-8 flex items-center gap-2 group">
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    Initialize New Election
                </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {isLoading ? (
              [1, 2, 3].map(i => <div key={i} className="h-48 rounded-3xl bg-[var(--bg-secondary)] animate-pulse" />)
            ) : elections.length === 0 ? (
              <Card glass className="p-20 text-center flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center mb-6 text-[var(--text-muted)]">
                  <Play className="w-8 h-8 opacity-20" />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)]">No active protocols found.</h3>
                <p className="text-[var(--text-muted)] mt-2">Initialize your first election to begin the consensus process.</p>
              </Card>
            ) : (
              elections.map((election) => (
                <Card glass key={election.id} className="p-8 group overflow-hidden relative">
                  <div className="flex flex-col md:flex-row justify-between gap-8 h-full">
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-4">
                        <Badge variant={election.status === 'ACTIVE' ? 'primary' : 'neutral'} className="uppercase">
                          {election.status}
                        </Badge>
                        <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-widest italic">
                          ID: {String(election.id).padStart(4, '0')}
                        </span>
                      </div>
                      
                      <h2 className="text-2xl font-black text-[var(--text-primary)] mb-2 group-hover:gradient-text transition-all duration-300">
                        {election.title}
                      </h2>
                      <p className="text-[var(--text-secondary)] text-sm line-clamp-2 mb-6 max-w-2xl font-medium">
                        {election.description}
                      </p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-tighter">Total Participation</p>
                          <p className="text-xl font-black text-[var(--text-primary)]">{election.totalVotes}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase font-bold text-[var(--text-muted)] tracking-tighter">Candidates</p>
                          <p className="text-xl font-black text-[var(--text-primary)]">{election.candidates?.length || 0}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 min-w-[240px]">
                      {election.status === 'UPCOMING' && (
                        <Button 
                          onClick={() => updateStatus(election.id, 'ACTIVE')}
                          variant="primary" 
                          className="w-full flex items-center justify-center gap-2"
                        >
                          <Play className="w-4 h-4" /> Start Election
                        </Button>
                      )}
                      
                      {election.status === 'ACTIVE' && (
                        <Button 
                          onClick={() => updateStatus(election.id, 'COMPLETED')}
                          variant="primary" 
                          className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 border-amber-500"
                        >
                          <CheckSquare className="w-4 h-4" /> Publish Results
                        </Button>
                      )}

                      <Button 
                        onClick={() => runSystemAudit(election.id)}
                        variant="secondary" 
                        disabled={isAuditing}
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <ShieldCheck className="w-4 h-4" /> 
                        {isAuditing ? 'Auditing...' : 'Verify Integrity'}
                      </Button>

                      <Button 
                        onClick={() => deleteElection(election.id)}
                        variant="ghost" 
                        className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4" /> Drop Protocol
                      </Button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {auditResult && auditResult.electionId === election.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 pt-6 border-t border-[var(--border)]"
                      >
                        <div className={`p-4 rounded-2xl flex items-center gap-4 ${
                          auditResult.chainIntegrity 
                            ? 'bg-green-500/10 border border-green-500/20 text-green-500' 
                            : 'bg-red-500/10 border border-red-500/20 text-red-500'
                        }`}>
                          {auditResult.chainIntegrity ? <ShieldCheck className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                          <div>
                            <p className="font-black text-xs uppercase tracking-widest">{auditResult.message}</p>
                            <p className="text-[10px] opacity-70">Audited {auditResult.totalRecords} cryptographic entries on the ledger.</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="ml-auto"
                            onClick={() => setAuditResult(null)}
                          >
                            Dismiss
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
