
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Use the production Supabase URL and key
const supabaseUrl = "https://bqlxmbwkucukhmioxall.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxbHhtYndrdWN1a2htaW94YWxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0Mjk3NTUsImV4cCI6MjA2NjAwNTc1NX0.SIznvyEjP_0bjfuEvoYJIIgBxSUkUyk7RRXsSnIc9YI";

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// For backward compatibility
export const useDemo = false;
