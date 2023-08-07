import { Response, Request } from 'express';
import { supabase } from "../utils/supabase";

interface signUpData {
  email: string;
  password: string;
}

interface UserResponse {
  user: string;
  token: string;
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
  try {
    const response: any = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (response.error) throw response
    const userInfo: UserResponse = {
      user: response.data.user.email,
      token: response.data.session.access_token
    };
    res.json({ userInfo });
  } catch (error : any) {
    res.json({ error: error.error });
  }
};

export const signOut = async (req: Request, res: Response) => {
  const supabase = req.supabase!;
  const { error } = await supabase.auth.signOut();
  if (error) {
    res.json({ error: error });
  }
  res.json({ message: "signOut successful" });
};
