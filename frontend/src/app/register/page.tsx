'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    registerNumber: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await api.post('/auth/register', formData);
      // As requested: move to login page first on success
      router.push('/login?registered=true');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.1] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
                <div className="w-12 h-12 rounded-xl bg-[var(--primary)] flex items-center justify-center shadow-xl shadow-[var(--primary)]/20">
                <span className="text-white font-black text-2xl italic tracking-tighter">S</span>
                </div>
            </Link>
            <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)]">Initialize Identity.</h1>
            <p className="text-[var(--text-secondary)] font-medium mt-2">Create a secure, anonymous voting identity on the protocol.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card glass className="p-8 space-y-8">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold text-center">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)]">Full Legal Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]"
                  placeholder="Student Name as per records"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)]">Register Number</label>
                      <input 
                          type="text" 
                          required
                          value={formData.registerNumber}
                          onChange={(e) => setFormData({ ...formData, registerNumber: e.target.value })}
                          className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]"
                          placeholder="e.g. 2024CS102"
                      />
                  </div>
                  <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)]">College Email ID</label>
                      <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]"
                          placeholder="name@university.edu"
                      />
                  </div>
              </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)]">Secure Access Passcode</label>
                <input 
                  type="password" 
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]"
                  placeholder="High entropy required"
                />
            </div>

            <div className="p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] text-[10px] text-[var(--text-muted)] font-medium leading-relaxed italic">
              Note: Your identity data is hashed using Polymath-ZK-Snarks before being committed to the ledger. SecureVote never stores raw personally identifiable information.
            </div>

            <Button 
              type="submit"
              variant="primary" 
              className="w-full py-4 text-xs font-black uppercase tracking-widest"
              disabled={isLoading}
            >
              {isLoading ? 'Processing Protocol ID...' : 'Generate Protocol ID'}
            </Button>
            
            <div className="text-center pt-4 border-t border-[var(--border)]">
              <p className="text-xs text-[var(--text-muted)] font-bold">
                Already have an ID? <Link href="/login" className="text-[var(--primary)] hover:underline ml-1">Access Portal</Link>
              </p>
            </div>
          </Card>
        </form>
      </motion.div>
    </div>
  );
}
