// Initialize the JS client
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../interface/supabase.types';
import dotenv from 'dotenv';

declare global {
  namespace Express {
    interface Request {
      supabase?: SupabaseClient;
    }
  }
}

dotenv.config();
let supabase_url = process.env.SUPABASE_PROJECT_URL!;
let supabase_key = process.env.SUPABASE_PUBLIC_ANON!;


let supabase = createClient<Database>(
  supabase_url,
  supabase_key
);

const getSupabaseWithToken = async (token: string | null) => {
  let supabase: SupabaseClient;
  if (token) {
    supabase = createClient<Database>(
      supabase_url,
      supabase_key,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    );
  } else {
    supabase = createClient<Database>(
      supabase_url,
      supabase_key
    );
  }

  return supabase;
};


export { getSupabaseWithToken, supabase }


