import { supabase } from '../lib/supabase'
import { toast } from 'sonner@2.0.3'
import { SplitPayment } from '../components/BudgetContext'

export const splitPaymentService = {
  // Get all split payments for current user
  async getSplitPayments() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { data, error } = await supabase
        .from('split_payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data.map(payment => ({
        id: payment.id,
        name: payment.name,
        totalAmount: payment.total_amount,
        friends: payment.friends,
        date: payment.date
      }))
    } catch (error: any) {
      toast.error('Failed to load split payments')
      return []
    }
  },

  // Add new split payment
  async addSplitPayment(payment: Omit<SplitPayment, 'id'>) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { data, error } = await supabase
        .from('split_payments')
        .insert({
          user_id: user.id,
          name: payment.name,
          total_amount: payment.totalAmount,
          friends: payment.friends,
          date: payment.date
        })
        .select()
        .single()

      if (error) throw error

      toast.success('Split payment added successfully')
      return {
        id: data.id,
        name: data.name,
        totalAmount: data.total_amount,
        friends: data.friends,
        date: data.date
      }
    } catch (error: any) {
      toast.error('Failed to add split payment')
      return null
    }
  },

  // Delete split payment
  async deleteSplitPayment(id: string) {
    try {
      const { error } = await supabase
        .from('split_payments')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Split payment deleted')
      return true
    } catch (error: any) {
      toast.error('Failed to delete split payment')
      return false
    }
  }
}