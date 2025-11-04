import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          is_premium: boolean
          subscription_status: 'trial' | 'active' | 'expired' | 'none'
          trial_ends_at: string | null
          weight: number | null
          objective: 'emagrecimento' | 'massa' | 'definicao' | null
          language: 'pt' | 'en' | 'es'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          is_premium?: boolean
          subscription_status?: 'trial' | 'active' | 'expired' | 'none'
          trial_ends_at?: string | null
          weight?: number | null
          objective?: 'emagrecimento' | 'massa' | 'definicao' | null
          language?: 'pt' | 'en' | 'es'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          is_premium?: boolean
          subscription_status?: 'trial' | 'active' | 'expired' | 'none'
          trial_ends_at?: string | null
          weight?: number | null
          objective?: 'emagrecimento' | 'massa' | 'definicao' | null
          language?: 'pt' | 'en' | 'es'
          created_at?: string
          updated_at?: string
        }
      }
      workout_sessions: {
        Row: {
          id: string
          user_id: string
          date: string
          exercises: string[]
          total_calories: number
          duration: number
          completed: boolean
          xp_gained: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          exercises: string[]
          total_calories: number
          duration: number
          completed?: boolean
          xp_gained: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          exercises?: string[]
          total_calories?: number
          duration?: number
          completed?: boolean
          xp_gained?: number
          created_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          unlocked_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          unlocked_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          unlocked_at?: string
          created_at?: string
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type WorkoutSession = Database['public']['Tables']['workout_sessions']['Row']
export type Achievement = Database['public']['Tables']['achievements']['Row']