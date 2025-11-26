import { supabase } from '../lib/supabase'
import { toast } from 'sonner@2.0.3'

export const feedbackService = {
  // Submit feedback
  async submitFeedback(feedbackType: string, message?: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { error } = await supabase
        .from('feedback')
        .insert({
          user_id: user.id,
          feedback_type: feedbackType,
          message: message || null
        })

      if (error) throw error

      toast.success(`Thank you for your ${feedbackType} feedback!`)
      return true
    } catch (error: any) {
      toast.error('Failed to submit feedback')
      return false
    }
  },

  // Get user's feedback history
  async getFeedbackHistory() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data
    } catch (error: any) {
      return []
    }
  }
}