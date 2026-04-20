'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const userDataStr = localStorage.getItem('user_data');
        if (!userDataStr) {
            router.push('/login');
            return;
        }

        try {
            const userData = JSON.parse(userDataStr);
            if (userData.role === 'ROLE_ADMIN' || userData.role === 'ADMIN') {
                setAuthorized(true);
            } else {
                router.push('/elections');
            }
        } catch (e) {
            router.push('/login');
        }
    }, [router]);

    if (!authorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 rounded-xl bg-[var(--primary)] mb-4" />
                    <p className="text-[var(--text-muted)] font-black uppercase tracking-widest text-[10px]">Verifying Authority...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
