import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export default function GoogleAuthHandler() {
  const hasHandledAuth = useRef(false);

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (hasHandledAuth.current) return;
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user && !localStorage.getItem('isAuthenticated')) {
          hasHandledAuth.current = true;
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userName', session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User');
          window.location.reload();
        }
      } catch (error) {
        console.error('Google auth error:', error);
      }
    };

    handleAuthCallback();
  }, []);

  return null;
}