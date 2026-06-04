import { NextRequest, NextResponse } from 'next/server';
import { getAuthUrl, getTokensFromCode } from '@/lib/google-calendar';
import { supabase } from '@/lib/supabase'; // Important: Admin client needed for secure server writes if using RLS, but for this demo we'll just save it to the settings table directly since it's a single-user app

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    // If no code, redirect to Google Auth URL
    const url = getAuthUrl();
    return NextResponse.redirect(url);
  }

  try {
    // If we have a code, exchange it for tokens
    const tokens = await getTokensFromCode(code);

    // Save tokens securely to Supabase settings table
    const { error } = await supabase
      .from('settings')
      .upsert(
        { key: 'google_calendar_tokens', value: tokens },
        { onConflict: 'key' }
      );

    if (error) throw error;

    // Redirect back to calendar with success message
    return NextResponse.redirect(new URL('/calendar?sync=success', request.url));
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.redirect(new URL('/calendar?sync=error', request.url));
  }
}
