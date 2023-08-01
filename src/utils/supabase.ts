// Initialize the JS client
import { createClient } from '@supabase/supabase-js';
import { Database } from '../interface/supabase.types';



const supabase = createClient<Database>(
  process.env.SUPABASE_PROJECT_URL as string,
  process.env.SUPABASE_ANON_KEY as string
);

export default supabase;
