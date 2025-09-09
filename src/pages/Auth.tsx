import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Auth() {
  console.log('Auth component is rendering');
  
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();

  console.log('Auth component render - loading:', loading, 'user:', user);

  // Force show content after 3 seconds if still loading
  const [forceShow, setForceShow] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setForceShow(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading && !forceShow) {
    console.log('Auth component showing loading state');
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  console.log('Auth component showing main content');

  if (user) {
    console.log('User exists, redirecting to home');
    return <Navigate to="/" replace />;
  }

  const handleTabChange = (value: string) => {
    if (value === 'signup') {
      navigate('/access-code-qualification');
    } else {
      setActiveTab(value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/39a056f2-95b6-4132-bc49-38d69b878021.png" 
            alt="React InSight Logo" 
            className="h-[150px] w-auto mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-foreground mb-2">
            React InSight Portal
          </h1>
        </div>

        <Card className="shadow-dialog">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign-Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="mt-6">
                <LoginForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}