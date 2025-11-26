import { supabase } from '../lib/supabase'
import { toast } from 'sonner@2.0.3'
import { Expense } from '../components/BudgetContext'

export const expenseService = {
  // Get all expenses for current user
  async getExpenses() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Transform to match frontend interface
      return data.map(expense => ({
        id: expense.id,
        amount: expense.amount,
        date: expense.date,
        description: expense.description,
        category: expense.category,
        paymentMethod: expense.payment_method,
        isRecurring: expense.is_recurring
      }))
    } catch (error: any) {
      toast.error('Failed to load expenses')
      return []
    }
  },

  // Add new expense
  async addExpense(expense: Omit<Expense, 'id'>) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { data, error } = await supabase
        .from('expenses')
        .insert({
          user_id: user.id,
          amount: expense.amount,
          date: expense.date,
          description: expense.description,
          category: expense.category,
          payment_method: expense.paymentMethod,
          is_recurring: expense.isRecurring || false
        })
        .select()
        .single()

      if (error) throw error

      toast.success('Expense added successfully')
      return {
        id: data.id,
        amount: data.amount,
        date: data.date,
        description: data.description,
        category: data.category,
        paymentMethod: data.payment_method,
        isRecurring: data.is_recurring
      }
    } catch (error: any) {
      toast.error('Failed to add expense')
      return null
    }
  },

  // Delete expense
  async deleteExpense(id: string) {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Expense deleted')
      return true
    } catch (error: any) {
      toast.error('Failed to delete expense')
      return false
    }
  },

  // Get category spending for current month
  async getCategorySpending(category: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return 0

      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString()

      const { data, error } = await supabase
        .from('expenses')
        .select('amount')
        .eq('user_id', user.id)
        .eq('category', category)
        .gte('date', startOfMonth)
        .lte('date', endOfMonth)

      if (error) throw error

      return data.reduce((sum, expense) => sum + expense.amount, 0)
    } catch (error: any) {
      return 0
    }
  },

  // Get total spending for current month
  async getTotalSpent() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return 0

      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString()

      const { data, error } = await supabase
        .from('expenses')
        .select('amount')
        .eq('user_id', user.id)
        .gte('date', startOfMonth)
        .lte('date', endOfMonth)

      if (error) throw error

      return data.reduce((sum, expense) => sum + expense.amount, 0)
    } catch (error: any) {
      return 0
    }
  }
}