# Supabase Backend Integration Setup

This guide will help you set up Supabase backend for the AI-Powered Budget Tracker.

## Prerequisites

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new Supabase project

## Step 1: Database Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the entire content from `supabase-schema.sql`
4. Run the SQL script to create all tables, policies, and triggers

## Step 2: Authentication Setup

1. Go to Authentication > Settings in your Supabase dashboard
2. Enable Email authentication
3. For Google OAuth (optional):
   - Go to Authentication > Providers
   - Enable Google provider
   - Add your Google OAuth credentials

## Step 3: Storage Setup

1. Go to Storage in your Supabase dashboard
2. The `transaction-photos` bucket should be created automatically by the SQL script
3. If not created, create a new bucket named `transaction-photos` with public access

## Step 4: Environment Variables

1. Copy `.env.example` to `.env`
2. Fill in your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in:
- Project Settings > API
- URL: Project URL
- Anon Key: Project API keys > anon public

## Step 5: Install Dependencies

```bash
npm install @supabase/supabase-js
```

## Step 6: Update App.tsx (Optional)

To use the Supabase-integrated context instead of localStorage:

```tsx
// Replace this import
import { BudgetProvider } from './components/BudgetContext';

// With this import
import { SupabaseBudgetProvider as BudgetProvider } from './components/SupabaseBudgetContext';
```

## Features Integrated

### Authentication
- ✅ Email/Password signup and login
- ✅ Google OAuth login
- ✅ User profile management
- ✅ Secure logout

### Data Management
- ✅ Expenses CRUD operations
- ✅ Subscriptions management
- ✅ Wishlist items
- ✅ Category caps and custom categories
- ✅ Split payments
- ✅ User feedback collection

### File Storage
- ✅ Transaction photo uploads
- ✅ Secure file storage with RLS
- ✅ Photo management (view/delete)

### Data Export
- ✅ CSV export functionality
- ✅ PDF report generation

### Security
- ✅ Row Level Security (RLS) on all tables
- ✅ User data isolation
- ✅ Secure file uploads
- ✅ JWT-based authentication

## Database Schema

The following tables are created:

1. **users** - User profiles and settings
2. **expenses** - All expense records
3. **subscriptions** - Recurring subscriptions
4. **wishlist_items** - User wishlist
5. **category_caps** - Spending limits per category
6. **split_payments** - Shared expense records
7. **custom_categories** - User-defined categories
8. **feedback** - User feedback
9. **transaction_photos** - Photo metadata

## API Integration Points

### Frontend Components Connected:
- **AuthPage** → `authService`
- **Dashboard** → `expenseService`, `authService`
- **AddExpense** → `expenseService`
- **Subscriptions** → `subscriptionService`
- **Wishlist** → `wishlistService`
- **CategoryCaps** → `categoryService`
- **SplitPayments** → `splitPaymentService`
- **Feedback** → `feedbackService`
- **DataBackup** → `storageService`

## Testing the Integration

1. Start the development server: `npm run dev`
2. Try creating an account
3. Add some expenses and test all features
4. Check the Supabase dashboard to see data being created

## Troubleshooting

### Common Issues:

1. **Environment variables not loading**
   - Make sure `.env` file is in the root directory
   - Restart the development server after adding env vars

2. **RLS policies blocking access**
   - Check that user is properly authenticated
   - Verify RLS policies in Supabase dashboard

3. **Storage upload issues**
   - Ensure `transaction-photos` bucket exists
   - Check storage policies are correctly set

4. **Google OAuth not working**
   - Verify Google OAuth credentials in Supabase
   - Check redirect URLs are correctly configured

## Migration from localStorage

The app will automatically work with both localStorage (existing) and Supabase (new) contexts. To migrate:

1. Users can export their localStorage data using the existing export feature
2. Create a new account with Supabase
3. Manually re-enter data or use import functionality (if implemented)

## Production Deployment

1. Set up environment variables in your hosting platform
2. Configure custom domain for Supabase (optional)
3. Set up proper CORS settings
4. Enable email templates for authentication
5. Set up monitoring and backups

The backend is now fully integrated and ready for production use!