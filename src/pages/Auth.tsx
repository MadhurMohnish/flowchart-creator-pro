
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '@/components/Auth/AuthForm';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

const Auth: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        navigate('/');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (session) {
    return <div className="flex justify-center items-center h-screen">Redirecting...</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight mb-1">Flow AI</h1>
          <p className="text-sm text-muted-foreground mb-6">Visual Workflow Automation</p>
          
          <h2 className="text-2xl font-bold mb-6">
            {mode === 'login' ? 'Welcome Back' : 'Create Your Account'}
          </h2>
        </div>

        <div className="bg-card p-6 rounded-xl border shadow-sm">
          <AuthForm mode={mode} />
          
          <div className="mt-6 text-center text-sm">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button 
                  onClick={() => setMode('signup')} 
                  className="text-primary hover:underline font-medium"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button 
                  onClick={() => setMode('login')} 
                  className="text-primary hover:underline font-medium"
                >
                  Log in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
