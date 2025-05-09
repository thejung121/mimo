
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// In development or when environment variables are not set,
// use demo values to prevent the app from crashing
export const useDemo = !supabaseUrl || !supabaseAnonKey;

if (useDemo) {
  console.warn(
    'Supabase environment variables are missing. Using demo mode with limited functionality. ' +
    'Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env.local file.'
  );
}

// Create Supabase client - use demo settings if needed
// Make sure to use a valid URL format for the demo
export const supabase = createClient<Database>(
  useDemo ? 'https://example.supabase.co' : supabaseUrl,
  useDemo ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRlbW8iLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxMzA5ODU0MCwiZXhwIjoxOTI4Njc0NTQwfQ.magsCuCyBc1-NOQ6F_Vz2A' : supabaseAnonKey
);
