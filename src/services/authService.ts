import { supabase } from '../lib/supabase'
import { toast } from 'sonner@2.0.3'

export interface User {
  id: string
  email: string
  name: string
  monthly_budget: number
}

export const authService = {
  // Sign up with email and password
  async signUp(email: string, password: string, name: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            full_name: name
          }
        }
      })

      if (error) throw error

      // Don't manually create profile - let the database trigger handle it
      return { user: data.user, error: null }
    } catch (error: any) {
      toast.error(error.message)
      return { user: null, error }
    }
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      return { user: data.user, error: null }
    } catch (error: any) {
      toast.error(error.message)
      return { user: null, error }
    }
  },

  // Sign in with Google
  async signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            prompt: 'select_account'
          }
        }
      })

      if (error) throw error

      return { data, error: null }
    } catch (error: any) {
      toast.error(error.message)
      return { data: null, error }
    }
  },

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      // Clear local storage
      localStorage.clear()
      
      return { error: null }
    } catch (error: any) {
      toast.error(error.message)
      return { error }
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return { user: null, profile: null }

      // Get user profile
      let { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (!profile) {
        // Auto-create profile row if it doesn't exist yet
        const defaultName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User'
        const { data: newProfile } = await supabase
          .from('users')
          .upsert({
            id: user.id,
            email: user.email || '',
            name: defaultName,
            monthly_budget: 0
          })
          .select()
          .maybeSingle()
        profile = newProfile || { id: user.id, email: user.email, name: defaultName, monthly_budget: 0 }
      }

      return { user, profile }
    } catch (error: any) {
      console.warn('Error fetching profile:', error)
      return { user: null, profile: null }
    }
  },

  // Update user profile
  async updateProfile(updates: Partial<User>) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) throw error

      return { error: null }
    } catch (error: any) {
      toast.error(error.message)
      return { error }
    }
  },

  // Listen to auth changes
  onAuthStateChange(callback: (user: any) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null)
    })
  }
}