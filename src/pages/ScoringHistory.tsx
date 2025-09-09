import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  first_name: string;
  last_name: string;
  reactor_id?: string;
}

export default function ScoringHistory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('first_name, last_name, reactor_id')
            .eq('user_id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') {
            console.error('Error loading profile:', error);
          } else {
            setProfile(data);
          }
        } catch (err) {
          console.error('Profile loading error:', err);
        }
      }
    };

    loadProfile();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card shadow-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/39a056f2-95b6-4132-bc49-38d69b878021.png" 
                alt="React InSight Logo" 
                className="h-16 w-auto mr-2.5"
              />
              <Button variant="ghost" onClick={() => navigate('/')} className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Scoring History
                </h1>
                <p className="text-muted-foreground">
                  View your scoring history and performance metrics
                </p>
              </div>
            </div>
            {profile && (
              <div className="text-right text-sm text-muted-foreground">
                <div className="font-medium">
                  {profile.first_name} {profile.last_name}
                </div>
                {profile.reactor_id && (
                  <div>
                    Reactor ID: {profile.reactor_id}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-primary" />
              Your Scoring History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This page will display your scoring history and performance analytics. Content coming soon...
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}