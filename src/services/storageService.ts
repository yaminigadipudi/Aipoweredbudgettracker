import { supabase } from '../lib/supabase'
import { toast } from 'sonner@2.0.3'

export const storageService = {
  // Upload transaction photo
  async uploadTransactionPhoto(file: File) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB')
        return null
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return null
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('transaction-photos')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('transaction-photos')
        .getPublicUrl(fileName)

      // Save to database
      const { data, error } = await supabase
        .from('transaction_photos')
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_url: publicUrl
        })
        .select()
        .single()

      if (error) throw error

      toast.success('Transaction photo uploaded successfully!')
      return {
        id: data.id,
        url: data.file_url,
        name: data.file_name,
        date: data.created_at
      }
    } catch (error: any) {
      toast.error('Failed to upload photo')
      return null
    }
  },

  // Get all transaction photos for current user
  async getTransactionPhotos() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { data, error } = await supabase
        .from('transaction_photos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data.map(photo => ({
        id: photo.id,
        url: photo.file_url,
        name: photo.file_name,
        date: photo.created_at
      }))
    } catch (error: any) {
      toast.error('Failed to load photos')
      return []
    }
  },

  // Delete transaction photo
  async deleteTransactionPhoto(id: string, fileName: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('transaction-photos')
        .remove([`${user.id}/${fileName}`])

      if (storageError) throw storageError

      // Delete from database
      const { error } = await supabase
        .from('transaction_photos')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast.success('Photo deleted')
      return true
    } catch (error: any) {
      toast.error('Failed to delete photo')
      return false
    }
  },

  // Export data to CSV
  async exportDataToCSV() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { data: expenses, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (error) throw error

      let csv = 'Date,Description,Category,Amount,Payment Method,Recurring\n'
      expenses.forEach((exp) => {
        csv += `${exp.date},"${exp.description}",${exp.category},${exp.amount},${exp.payment_method},${exp.is_recurring}\n`
      })

      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `expenses-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('Expenses exported to CSV successfully!')
      return true
    } catch (error: any) {
      toast.error('Failed to export data')
      return false
    }
  }
}