// Initialize the JS client
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../interface/supabase.types';
import dotenv from 'dotenv';

dotenv.config();
let supabase_url = process.env.SUPABASE_PROJECT_URL!;
let supabase_key = process.env.SUPABASE_PUBLIC_ANON!;

let tokenJa: string = ' ';

let supabase = createClient<Database>(
  supabase_url,
  supabase_key,
  {
    global: {
      headers: {
        Authorization: `Bearer ${tokenJa}`
      }
    }
  }
);

const getSupabaseWithToken = async (token: string) => {
  let supabase;
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

const setToken = (newToken: string) => {
  tokenJa = newToken;
};

export { getSupabaseWithToken, supabase, setToken, tokenJa }


