'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * This page handles OAuth callbacks for the auth route (/auth-callback/route.ts).
 * The actual OAuth exchange happens on the server via route.ts, which handles PKCE verification.
 * This page is only used if someone navigates directly to /auth-callback as a page.
 */
export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // If accessed as a page, redirect to the route handler
    // The route handler (route.ts) will handle the OAuth callback properly
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    
    if (code) {
      // The route handler should have already processed this
      // If we're here, redirect to dashboard
      router.push('/dashboard/campaigns');
    } else {
      // No code, redirect to login
      router.push('/login?error=auth');
    }
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
