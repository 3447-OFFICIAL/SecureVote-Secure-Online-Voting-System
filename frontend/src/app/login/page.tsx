'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { api } from '@/lib/api';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '', // Backend expects email currently in LoginRequest
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get('registered')) {
      setSuccess('Identity initialized! Please log in to access the portal.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/login', formData);
      localStorage.setItem('auth_token', response.token);
      localStorage.setItem('user_data', JSON.stringify(response));
      router.push('/elections');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
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
        className="w-full max-w-md relative z-10"
      >
        <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
                <div className="w-12 h-12 rounded-xl bg-[var(--primary)] flex items-center justify-center shadow-xl shadow-[var(--primary)]/20">
                <span className="text-white font-black text-2xl italic tracking-tighter">S</span>
                </div>
            </Link>
            <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)]">Welcome Back.</h1>
            <p className="text-[var(--text-secondary)] font-medium mt-2">Enter your cryptographic keys to access the portal.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card glass className="p-8 space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs font-bold text-center">
                {error}
              </div>
            )}
            {success && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 text-xs font-bold text-center">
                {success}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)]">Register Number / Email</label>
                <input 
                  type="text" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]"
                  placeholder="Institutional Identifier"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-[var(--text-muted)]">Secure Passcode</label>
                <input 
                  type="password" 
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary)]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button 
              type="submit"
              variant="primary" 
              className="w-full py-4 text-xs font-black uppercase tracking-widest"
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : 'Authenticate Session'}
            </Button>
            
            <div className="text-center pt-4 border-t border-[var(--border)]">
              <p className="text-xs text-[var(--text-muted)] font-bold">
                No account? <Link href="/register" className="text-[var(--primary)] hover:underline ml-1">Generate Identity</Link>
              </p>
            </div>
          </Card>
        </form>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[var(--bg-primary)]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--bg-secondary)]" />
          <div className="h-4 w-32 bg-[var(--bg-secondary)] rounded-md" />
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
