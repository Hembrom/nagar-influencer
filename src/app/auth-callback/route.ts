import { createClient } from '@/lib/supabase/server';
import { upsertProfileFromAuthServer } from '@/lib/profile-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/dashboard/campaigns';

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=auth', request.url));
  }

  try {
    const supabase = await createClient();

    // Exchange the code for a session - this handles PKCE verification server-side
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('[AUTH_CALLBACK_ERROR]', error);
      return NextResponse.redirect(new URL('/login?error=auth', request.url));
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      console.log('[AUTH_CALLBACK_SUCCESS]', user.email);
      
      // 🔥 CREATE/UPDATE PROFILE AND AUTO-CREATE INFLUENCER ENTRY
      try {
        await upsertProfileFromAuthServer(supabase, user);
        console.log('[PROFILE_CREATED]', user.email);
      } catch (profileErr) {
        console.error('[PROFILE_CREATION_ERROR]', profileErr);
        // Don't fail auth callback if profile creation fails - still redirect
      }
      
      // Redirect to the destination
      return NextResponse.redirect(new URL(next, request.url));
    }

    return NextResponse.redirect(new URL('/login?error=auth', request.url));
  } catch (err) {
    console.error('[AUTH_CALLBACK_EXCEPTION]', err);
    return NextResponse.redirect(new URL('/login?error=auth', request.url));
  }
}
