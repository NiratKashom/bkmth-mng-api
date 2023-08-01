// Initialize the JS client
import { createClient } from '@supabase/supabase-js';
import { Database } from '../interface/supabase.types';
import dotenv from 'dotenv';
import { Response, Request } from 'express';

dotenv.config();

const supabase = createClient<Database>(
  process.env.SUPABASE_PROJECT_URL as string,
  process.env.SUPABASE_PUBLIC_ANON as string
  // process.env.SUPABASE_SERVICE_KEY as string
);

export const getAllTodos = async (req: Request, res: Response) => {
  try {

    let { data, error } = await supabase
      .from('todos')
      .select('*');

    console.log("getAllTodos", data);
    return res.send(data);
  } catch (error) {
    res.send(500);
  }
};


// export default supabase;
