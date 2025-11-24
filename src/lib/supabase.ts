import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
export interface User {
  id: string
  email: string
  name: string
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  user_id: string
  name: string
  avatar_url?: string
  created_at: string
  updated_at: string
}