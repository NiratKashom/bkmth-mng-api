import { Response, Request } from 'express';
import { supabase, tokenJa,setToken } from "../utils/supabase";

interface signUpData {
  email: string;
  password: string;
}

export const signUp = async (req: Request, res: Response) => {
  console.log("signUp JA");
  console.log("body", req);
  const { email, password }: signUpData = req.body;
  const resData = await supabase.auth.signUp({
    email,
    password,
  });
  res.json({ message: resData });
};

export const signIn = async (req: Request, res: Response) => {
  console.log("============signIn JA");
  const { email, password }: signUpData = req.body;
  const { data, error: userErr } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  console.log(" === = = = == =result", data);

  // setToken(data.session?.access_token ||  ' ')

  res.json({ message: data });
};

export const signOut = async (req: Request, res: Response) => {
  console.log("signOut JA");
  const { error } = await supabase.auth.signOut();
  if (error) {
    res.json({ error: error });
  }
  res.json({ message: "signOut successful" });
};
