import { NextRequest, NextResponse } from 'next/server';
import { createCalendarClient } from '@/lib/google-calendar';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // 1. Get tokens from settings
    const { data: settingsData, error: settingsError } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'google_calendar_tokens')
      .single();

    if (settingsError || !settingsData?.value) {
      return NextResponse.json({ error: 'Not authenticated with Google Calendar. Please sync first.' }, { status: 401 });
    }

    const tokens = settingsData.value;
    const calendar = createCalendarClient(tokens);

    // 2. Fetch all tasks with due dates
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .not('due_date', 'is', null);

    if (tasksError) throw tasksError;

    // 3. Sync to Google Calendar
    // Note: For a production app, you'd want to store the Google Event ID in the tasks table to update/delete them, 
    // rather than just creating new ones. This is a simplified push mechanism.
    let syncedCount = 0;
    
    for (const task of tasks) {
      if (!task.due_date) continue;
      
      const event = {
        summary: `[Task] ${task.title}`,
        description: task.description || 'Synced from Sanskar OS',
        start: {
          date: task.due_date.split('T')[0], // YYYY-MM-DD
        },
        end: {
          date: task.due_date.split('T')[0],
        }
      };

      try {
        await calendar.events.insert({
          calendarId: 'primary',
          requestBody: event,
        });
        syncedCount++;
      } catch (err) {
        console.error(`Failed to sync task ${task.id}:`, err);
      }
    }

    return NextResponse.json({ success: true, message: `Synced ${syncedCount} tasks to Google Calendar` });
  } catch (error: any) {
    console.error('Sync error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
