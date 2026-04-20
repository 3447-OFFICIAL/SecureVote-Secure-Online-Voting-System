'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/lib/ThemeContext';
import { Search, Menu, X, Sun, Moon, LogOut, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('auth_token');
    const userDataStr = localStorage.getItem('user_data');
    
    setIsLoggedIn(!!token);
    
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        setIsAdmin(userData.role === 'ROLE_ADMIN' || userData.role === 'ADMIN');
      } catch (e) {
        setIsAdmin(false);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setIsLoggedIn(false);
    router.push('/');
    router.refresh();
  };

  if (!mounted) return null;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-2 w-full z-[100] px-4"
    >
      <div className="max-w-7xl mx-auto glass rounded-2xl px-6 py-3 relative z-[200]">
        <div className="flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)] flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-xl shadow-[var(--primary)]/20">
              <span className="text-white font-black text-xl italic tracking-tighter">S</span>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xl leading-none tracking-tight gradient-text">SecureVote</span>
              <span className="text-[9px] text-[var(--accent)] font-bold uppercase tracking-[0.2em]">DeFi Protocol</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/elections" className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Elections</Link>
            <Link href="/verify" className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Verify</Link>
            {isAdmin && (
              <Link href="/admin" className="text-xs font-black uppercase tracking-[0.15em] text-[var(--primary)] hover:brightness-125 transition-all flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
                Admin
              </Link>
            )}
            
            <div className="h-5 w-[1px] bg-[var(--border)] mx-2" />

            <button
              onClick={toggleTheme}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors focus:outline-none"
              aria-label="Toggle Theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-500" />}
                </motion.div>
              </AnimatePresence>
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <div className="p-2 text-[var(--text-primary)] cursor-pointer hover:bg-[var(--bg-secondary)] rounded-full transition-colors">
                  <UserIcon className="w-5 h-5" />
                </div>
                <Button onClick={handleLogout} variant="ghost" className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Button href="/login" variant="ghost">Sign In</Button>
                <Button href="/register" variant="primary">Access Portal</Button>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="md:hidden mt-2 mx-auto max-w-7xl glass rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex flex-col space-y-4">
              <nav className="flex flex-col space-y-2">
                <Link href="/elections" className="font-bold text-lg text-[var(--text-primary)]">Elections</Link>
                <Link href="/verify" className="font-bold text-lg text-[var(--text-primary)]">Verification Matrix</Link>
                {isAdmin && <Link href="/admin" className="font-bold text-lg text-[var(--primary)] animate-pulse">Admin Panel</Link>}
              </nav>
              <div className="h-[1px] bg-[var(--border)] w-full" />
              
              {isLoggedIn ? (
                <>
                  <Button onClick={handleLogout} variant="primary" className="w-full text-center justify-center">Log Out</Button>
                </>
              ) : (
                <>
                  <Button href="/login" variant="secondary" className="w-full text-center justify-center">Sign In</Button>
                  <Button href="/register" variant="primary" className="w-full text-center justify-center">Access Portal</Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.nav>
  );
}
