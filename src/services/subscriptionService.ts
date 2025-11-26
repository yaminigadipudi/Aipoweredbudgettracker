import { supabase } from '../lib/supabase'
import { toast } from 'sonner@2.0.3'
import { Subscription } from '../components/BudgetContext'

export const subscriptionService = {
  // Get all subscriptions for current user
  async getSubscriptions() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Transform to match frontend interface
      return data.map(sub => ({
        id: sub.id,
        name: sub.name,
        amount: sub.amount,
        billingCycle: sub.billing_cycle,
        nextPaymentDate: sub.next_payment_date,
        paymentMethod: sub.payment_method
      }))
    } catch (error: any) {
      toast.error('Failed to load subscriptions')
      return []
    }
  },

  // Add new subscription
  async addSubscription(subscription: Omit<Subscription, 'id'>) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          name: subscription.name,
          amount: subscription.amount,
          billing_cycle: subscription.billingCycle,
          next_payment_date: subscription.nextPaymentDate,
          payment_method: subscription.paymentMethod
        })
        .select()
        .single()

      if (error) throw error

      toast.success('Subscription added successfully')
      return {
        id: data.id,
        name: data.name,
        amount: data.amount,
        billingCycle: data.billing_cycle,
        nextPaymentDate: data.next_payment_date,
        paymentMethod: data.payment_method
      }
    } catch (error: any) {
      toast.error('Failed to add subscription')
      return null
    }
  },

  // Delete subscription
  async deleteSubscription(id: string) {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Subscription deleted')
      return true
    } catch (error: any) {
      toast.error('Failed to delete subscription')
      return false
    }
  },

  // Get upcoming subscriptions (within 7 days)
  async getUpcomingSubscriptions() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const today = new Date()
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .gte('next_payment_date', today.toISOString().split('T')[0])
        .lte('next_payment_date', nextWeek.toISOString().split('T')[0])

      if (error) throw error

      return data.map(sub => ({
        id: sub.id,
        name: sub.name,
        amount: sub.amount,
        billingCycle: sub.billing_cycle,
        nextPaymentDate: sub.next_payment_date,
        paymentMethod: sub.payment_method
      }))
    } catch (error: any) {
      return []
    }
  }
}