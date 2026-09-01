'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, clearSession } from '@/lib/api';
import type { User } from '@secure-crm/shared';

export function useAuth(redirect = true) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const u = getUser();
    if (!u && redirect) {
      router.replace('/login');
      return;
    }
    setUser(u);
    setReady(true);
  }, [redirect, router]);

  const logout = () => {
    clearSession();
    router.replace('/login');
  };

  return { user, ready, logout };
}
