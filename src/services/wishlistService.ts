import { supabase } from '../lib/supabase'
import { toast } from 'sonner@2.0.3'
import { WishlistItem } from '../components/BudgetContext'

export const wishlistService = {
  // Get all wishlist items for current user
  async getWishlistItems() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { data, error } = await supabase
        .from('wishlist_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        priority: item.priority
      }))
    } catch (error: any) {
      toast.error('Failed to load wishlist')
      return []
    }
  },

  // Add new wishlist item
  async addWishlistItem(item: Omit<WishlistItem, 'id'>) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { data, error } = await supabase
        .from('wishlist_items')
        .insert({
          user_id: user.id,
          name: item.name,
          price: item.price,
          priority: item.priority
        })
        .select()
        .single()

      if (error) throw error

      toast.success('Item added to wishlist')
      return {
        id: data.id,
        name: data.name,
        price: data.price,
        priority: data.priority
      }
    } catch (error: any) {
      toast.error('Failed to add item to wishlist')
      return null
    }
  },

  // Delete wishlist item
  async deleteWishlistItem(id: string) {
    try {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Item removed from wishlist')
      return true
    } catch (error: any) {
      toast.error('Failed to remove item')
      return false
    }
  }
}