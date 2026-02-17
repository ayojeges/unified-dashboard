'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/');
  }, [router]);
  
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <p>Redirecting to dashboard...</p>
      <p>
        <a href="/">Click here if not redirected</a>
      </p>
    </div>
  );
}