'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import netlifyIdentity from 'netlify-identity-widget';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    netlifyIdentity.on('login', () => {
      router.push('/');
    });

    return () => {
      netlifyIdentity.off('login');
    };
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <button
        onClick={() => netlifyIdentity.open('login')}
        className="px-6 py-3 bg-purple-600 text-white rounded shadow hover:bg-purple-700"
      >
        Log in
      </button>
    </div>
  );
}
