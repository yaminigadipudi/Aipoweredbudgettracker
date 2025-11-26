import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          monthly_budget: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          monthly_budget?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          monthly_budget?: number
          updated_at?: string
        }
      }
      expenses: {
        Row: {
          id: string
          user_id: string
          amount: number
          date: string
          description: string
          category: string
          payment_method: string
          is_recurring: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          date: string
          description: string
          category: string
          payment_method: string
          is_recurring?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          date?: string
          description?: string
          category?: string
          payment_method?: string
          is_recurring?: boolean
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          name: string
          amount: number
          billing_cycle: string
          next_payment_date: string
          payment_method: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          amount: number
          billing_cycle: string
          next_payment_date: string
          payment_method: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          amount?: number
          billing_cycle?: string
          next_payment_date?: string
          payment_method?: string
          updated_at?: string
        }
      }
      wishlist_items: {
        Row: {
          id: string
          user_id: string
          name: string
          price: number
          priority: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          price: number
          priority: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          price?: number
          priority?: string
          updated_at?: string
        }
      }
      category_caps: {
        Row: {
          id: string
          user_id: string
          category: string
          limit_amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category: string
          limit_amount: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category?: string
          limit_amount?: number
          updated_at?: string
        }
      }
      split_payments: {
        Row: {
          id: string
          user_id: string
          name: string
          total_amount: number
          friends: { name: string; amount: number }[]
          date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          total_amount: number
          friends: { name: string; amount: number }[]
          date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          total_amount?: number
          friends?: { name: string; amount: number }[]
          date?: string
          updated_at?: string
        }
      }
      custom_categories: {
        Row: {
          id: string
          user_id: string
          category_name: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category_name: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category_name?: string
        }
      }
      feedback: {
        Row: {
          id: string
          user_id: string
          feedback_type: string
          message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          feedback_type: string
          message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          feedback_type?: string
          message?: string | null
        }
      }
      transaction_photos: {
        Row: {
          id: string
          user_id: string
          file_name: string
          file_url: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          file_name: string
          file_url: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          file_name?: string
          file_url?: string
        }
      }
    }
  }
}