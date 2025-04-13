
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '@/components/Auth/AuthForm';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Flow AI</h1>
          <p className="text-muted-foreground mt-2">Visual Workflow Automation</p>
        </div>
        <AuthForm />
      </div>
    </div>
  );
};

export default Auth;
