
import { createClient } from '@supabase/supabase-js';

// These keys are public and safe to expose in the client
// The actual authentication is handled securely by Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Log a warning if environment variables are not set
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Missing Supabase environment variables. Please connect to Supabase using the Lovable integration. The app will function in demo mode until properly connected.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to check if we're using real Supabase credentials
export const isSupabaseConfigured = () => {
  return !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;
};
