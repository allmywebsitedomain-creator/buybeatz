import { createClient } from '@supabase/supabase-js';

// Specific project credentials for crowntunzmusic provided by user
const supabaseUrl = 'https://gtoiuhrnmggqgfvjnjyl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0b2l1aHJubWdncWdmdmpuanlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNzgwMjUsImV4cCI6MjA4Njk1NDAyNX0.nuiduAj11m5mvQOntJfU1YzxL3mmXzDlq4OJIBWU6d8';

// Initialize Supabase with global configurations for modern ESM environments
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});