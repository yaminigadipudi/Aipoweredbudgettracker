# Google Authentication Setup Guide

## Issue Fixed
Google OAuth was logging users in without proper account verification. This has been fixed with proper user profile creation and redirect handling.

## Supabase Configuration

### 1. Enable Google Provider
1. Go to your Supabase project dashboard
2. Navigate to **Authentication > Providers**
3. Enable **Google** provider
4. Add your Google OAuth credentials:
   - **Client ID**: Your Google OAuth Client ID
   - **Client Secret**: Your Google OAuth Client Secret

### 2. Configure Redirect URLs
In your Google Cloud Console:
1. Go to **APIs & Credentials > OAuth 2.0 Client IDs**
2. Add these redirect URIs:
   ```
   https://afenqovmulirtdtzgkxb.supabase.co/auth/v1/callback
   http://localhost:3000/auth/callback (for development)
   ```

### 3. Site URL Configuration
In Supabase Authentication Settings:
1. Set **Site URL** to: `http://localhost:3000` (development) or your production URL
2. Add **Redirect URLs**:
   ```
   http://localhost:3000/auth/callback
   https://your-domain.com/auth/callback
   ```

## How It Works Now

### 1. Proper User Creation
- Google OAuth automatically creates user in `auth.users`
- Database trigger creates corresponding profile in `users` table
- Uses Google profile data (name, email) or falls back to email username

### 2. Redirect Flow
1. User clicks "Continue with Google"
2. Redirects to Google OAuth
3. Google redirects to `/auth/callback`
4. `AuthCallback` component handles the session
5. Redirects to dashboard on success

### 3. Profile Management
- User profile is automatically created with Google data
- Monthly budget defaults to 0
- All user data is properly isolated with RLS

## Testing

1. Clear browser data/cookies
2. Try Google login - should create new account properly
3. Check Supabase dashboard for user creation
4. Verify user can access dashboard and create expenses

## Security Features

- ✅ Row Level Security on all tables
- ✅ Proper user isolation
- ✅ Secure OAuth flow
- ✅ Automatic profile creation
- ✅ Session management

The Google authentication now works correctly with proper account creation and security!