import { supabase } from '../lib/supabase'
import { toast } from 'sonner@2.0.3'
import { CategoryCap } from '../components/BudgetContext'

export const categoryService = {
  // Get all category caps for current user
  async getCategoryCaps() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { data, error } = await supabase
        .from('category_caps')
        .select('*')
        .eq('user_id', user.id)

      if (error) throw error

      return data.map(cap => ({
        category: cap.category,
        limit: cap.limit_amount
      }))
    } catch (error: any) {
      toast.error('Failed to load category caps')
      return []
    }
  },

  // Set category cap
  async setCategoryCap(category: string, limit: number) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      // Check if cap already exists
      const { data: existing } = await supabase
        .from('category_caps')
        .select('id')
        .eq('user_id', user.id)
        .eq('category', category)
        .single()

      if (existing) {
        // Update existing cap
        const { error } = await supabase
          .from('category_caps')
          .update({
            limit_amount: limit,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)

        if (error) throw error
      } else {
        // Create new cap
        const { error } = await supabase
          .from('category_caps')
          .insert({
            user_id: user.id,
            category: category,
            limit_amount: limit
          })

        if (error) throw error
      }

      toast.success(`${category} limit set to ₹${limit}`)
      return true
    } catch (error: any) {
      toast.error('Failed to set category limit')
      return false
    }
  },

  // Get custom categories
  async getCustomCategories() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { data, error } = await supabase
        .from('custom_categories')
        .select('category_name')
        .eq('user_id', user.id)

      if (error) throw error

      return data.map(cat => cat.category_name)
    } catch (error: any) {
      toast.error('Failed to load custom categories')
      return []
    }
  },

  // Add custom category
  async addCustomCategory(category: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      // Check if category already exists
      const { data: existing } = await supabase
        .from('custom_categories')
        .select('id')
        .eq('user_id', user.id)
        .eq('category_name', category)
        .single()

      if (existing) {
        toast.error('Category already exists')
        return false
      }

      const { error } = await supabase
        .from('custom_categories')
        .insert({
          user_id: user.id,
          category_name: category
        })

      if (error) throw error

      toast.success(`${category} category added`)
      return true
    } catch (error: any) {
      toast.error('Failed to add category')
      return false
    }
  },

  // Delete custom category
  async deleteCustomCategory(category: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { error } = await supabase
        .from('custom_categories')
        .delete()
        .eq('user_id', user.id)
        .eq('category_name', category)

      if (error) throw error

      toast.success(`${category} category removed`)
      return true
    } catch (error: any) {
      toast.error('Failed to remove category')
      return false
    }
  }
}