'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/api';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace(getUser() ? '/dashboard' : '/login');
  }, [router]);
  return (
    <div className="grid min-h-screen place-items-center bg-uvg-deep">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-uvg-mint" />
    </div>
  );
}
