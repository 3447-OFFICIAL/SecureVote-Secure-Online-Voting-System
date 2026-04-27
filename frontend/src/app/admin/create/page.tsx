'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Navbar from '@/components/Navbar';
import AdminGuard from '@/components/auth/AdminGuard';
import { api } from '@/lib/api';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  UserPlus,
  Calendar,
  Layers,
  FileText,
  Save,
  Loader2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateElectionPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    candidates: [
      { name: '', party: '', description: '' }
    ]
  });

  const addCandidate = () => {
    setFormData({
      ...formData,
      candidates: [...formData.candidates, { name: '', party: '', description: '' }]
    });
  };

  const removeCandidate = (index: number) => {
    if (formData.candidates.length === 1) return;
    const newCandidates = [...formData.candidates];
    newCandidates.splice(index, 1);
    setFormData({ ...formData, candidates: newCandidates });
  };

  const updateCandidate = (index: number, field: string, value: string) => {
    const newCandidates = [...formData.candidates];
    (newCandidates[index] as any)[field] = value;
    setFormData({ ...formData, candidates: newCandidates });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Format dates correctly for Spring's LocalDateTime (removing 'Z' and milliseconds)
      const formatToLocalISO = (dateStr: string) => {
        if (!dateStr) return null;
        const d = new Date(dateStr);
        return d.toISOString().split('.')[0]; // Result: 2026-04-21T11:26:39
      };

      const payload = {
        ...formData,
        startDate: formatToLocalISO(formData.startDate),
        endDate: formatToLocalISO(formData.endDate)
      };
      
      await api.post('/admin/elections', payload);
      router.push('/admin');
    } catch (err: any) {
      alert('Failed to initialize protocol: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminGuard>
      <div className="relative min-h-screen w-full bg-[var(--bg-primary)] overflow-x-hidden">
        <Navbar />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.05] pointer-events-none" />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 relative z-10">
          <Link href="/admin" className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">Back to Orchestrator</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge variant="primary" className="mb-4">Protocol Deployment</Badge>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-[var(--text-primary)]">
              Initialize New <span className="gradient-text">Consensus.</span>
            </h1>
            <p className="text-[var(--text-secondary)] mt-4 font-medium mb-12">
              Configure the parameters for the upcoming institutional election.
            </p>

            <form onSubmit={handleSubmit} className="space-y-8">
              <Card glass className="p-8 space-y-8">
                <div className="grid grid-cols-1 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                       <FileText className="w-4 h-4 text-[var(--primary)]" />
                       <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--text-primary)]">Basic Configuration</h3>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)]">Election Title</label>
                      <input 
                        type="text" 
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl px-6 py-4 text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-all font-bold"
                        placeholder="e.g. Student Council 2026"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)]">Description</label>
                      <textarea 
                        rows={4}
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl px-6 py-4 text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)] transition-all font-medium"
                        placeholder="Detail the scope and purpose of this election..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-2">
                         <Calendar className="w-4 h-4 text-[var(--primary)]" />
                         <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--text-primary)]">Scheduling</h3>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)]">Start Date & Time</label>
                        <input 
                          type="datetime-local" 
                          required
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                          className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-2 invisible">
                         <Calendar className="w-4 h-4 text-[var(--primary)]" />
                         <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--text-primary)]">Scheduling</h3>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)]">End Date & Time</label>
                        <input 
                          type="datetime-local" 
                          required
                          value={formData.endDate}
                          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                          className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center">
                        <UserPlus className="w-5 h-5" />
                      </div>
                      <h2 className="text-xl font-bold text-[var(--text-primary)]">Candidate Matrix</h2>
                   </div>
                   <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={addCandidate}
                    className="flex items-center gap-2 text-[var(--primary)]"
                  >
                     <Plus className="w-4 h-4" /> Add Delegate
                   </Button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {formData.candidates.map((candidate, idx) => (
                    <Card glass key={idx} className="p-6 relative">
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--primary)] py-1 px-3 bg-[var(--primary)]/10 rounded-lg">
                          Delegate ID: {String(idx + 1).padStart(2, '0')}
                        </span>
                        {formData.candidates.length > 1 && (
                          <Button 
                            type="button"
                            variant="ghost" 
                            onClick={() => removeCandidate(idx)}
                            className="text-red-500 hover:bg-red-500/10 p-2 rounded-xl transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)]">Full Name</label>
                          <input 
                            type="text" 
                            required
                            value={candidate.name}
                            onChange={(e) => updateCandidate(idx, 'name', e.target.value)}
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)]"
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)]">Party / Group</label>
                          <input 
                            type="text" 
                            required
                            value={candidate.party}
                            onChange={(e) => updateCandidate(idx, 'party', e.target.value)}
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)]"
                            placeholder="Science & Tech Alliance"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)]">Bio / Statement</label>
                          <textarea 
                            rows={2}
                            value={candidate.description}
                            onChange={(e) => updateCandidate(idx, 'description', e.target.value)}
                            className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)]"
                            placeholder="A brief statement for voters..."
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-8">
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={isLoading}
                  className="h-16 px-12 text-xs font-black tracking-widest uppercase flex items-center justify-center gap-2 flex-grow"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> 
                      Deploying Protocol...
                    </>
                  ) : (
                    <>
                      <Layers className="w-5 h-5" /> 
                      Initialize Election
                    </>
                  )}
                </Button>
                <Link href="/admin">
                  <Button variant="secondary" className="h-16 px-8 text-xs font-black tracking-widest uppercase">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </motion.div>
        </main>
      </div>
    </AdminGuard>
  );
}
