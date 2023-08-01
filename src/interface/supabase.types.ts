export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      todos: {
        Row: {
          complete: boolean | null
          created_at: string | null
          id: number
          title: string
        }
        Insert: {
          complete?: boolean | null
          created_at?: string | null
          id?: number
          title?: string
        }
        Update: {
          complete?: boolean | null
          created_at?: string | null
          id?: number
          title?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
