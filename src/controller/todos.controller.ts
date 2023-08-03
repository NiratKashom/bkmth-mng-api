import { Response, Request } from "express";
import {supabase,tokenJa,getSupabaseWithToken} from "../utils/supabase";

export const getAllTodos = async (req: Request, res: Response) => {
  // const supabase = await getSupabaseWithToken();
  // console.log('tokenJa', tokenJa)

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