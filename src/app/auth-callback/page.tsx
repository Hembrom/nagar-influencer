'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const supabase = createClient();

        // Get the next destination from URL or sessionStorage
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const urlNext = params.get('next');
        const storedNext = sessionStorage.getItem('auth_next');
        const next = urlNext || storedNext || '/dashboard/campaigns';
        // Clear the stored next after using it
        if (storedNext) {
          sessionStorage.removeItem('auth_next');
        }

        if (!code) {
          console.error('[AUTH_CALLBACK_ERROR] No auth code found');
          router.push(`/login?error=auth`);
          return;
        }

        // exchangeCodeForSession handles PKCE verification
        // since we're on the same domain, cookies with PKCE verifier are available
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          console.error('[AUTH_CALLBACK_ERROR]', error);
          router.push(`/login?error=auth`);
          return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          console.log('[AUTH_CALLBACK_SUCCESS]', user.email);
          // Redirect to backend dashboard
          // The session is stored in Supabase cookies which the backend will read
          window.location.href = `${window.location.origin}${next}`;
        }
      } catch (err) {
        console.error('[AUTH_CALLBACK_EXCEPTION]', err);
        router.push(`/login?error=auth`);
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="mb-4 text-lg font-semibold">Completing sign in...</div>
        <div className="text-gray-600">Please wait while we redirect you.</div>
      </div>
    </div>
  );
}
