'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/auth/register');
  }, [router]);
  
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <p>Redirecting to signup page...</p>
      <p>
        <a href="/auth/register">Click here if not redirected</a>
      </p>
    </div>
  );
}