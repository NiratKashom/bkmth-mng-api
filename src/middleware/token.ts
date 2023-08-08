import { Request, Response, NextFunction } from 'express';
import { getSupabaseWithToken } from '../utils/supabase';


export const getTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token: string | undefined = req.headers.authorization?.split(" ")[1];
    req.supabase = await getSupabaseWithToken(token || null);
    next();
  } catch (error) {
    res.status(500).json({
      message: "Failed to get Supabase client",
      error: error
    });
  }
};
