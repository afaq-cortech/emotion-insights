import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface SubscriptionChoice {
  id: number;
  subscription: string | null;
  sub_details: string | null;
  sub_level: string | null;
  sub_value: string | null;
}

interface UserProfile {
  subscription: string;
  first_name: string;
  last_name: string;
  reactor_id: string;
}

export default function ChangeReward() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [subscriptionChoices, setSubscriptionChoices] = useState<SubscriptionChoice[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch subscription choices
        const { data: choices, error: choicesError } = await supabase
          .from('subscription_choices' as any)
          .select('*')
          .order('id');

        if (choicesError) throw choicesError;

        // Fetch user profile
        if (user) {
          const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('subscription, first_name, last_name, reactor_id')
            .eq('user_id', user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            throw profileError;
          }

          setUserProfile(profile as any);
        }

        setSubscriptionChoices((choices as any) || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load subscription options');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getReactorRequirements = (subLevel: string) => {
    if (subLevel === '1') {
      return 'Up to 6 minutes per day, 5 times each week';
    } else if (subLevel === '2') {
      return 'Up to 8 minutes per day, 5 times each week';
    }
    return '';
  };

  const getCurrentSubscriptionName = () => {
    if (!userProfile?.subscription) return 'None';
    const choice = subscriptionChoices.find(choice => choice.id.toString() === userProfile.subscription);
    return choice?.subscription || 'Unknown';
  };

  const getSelectedSubscriptionName = (subscriptionId: number) => {
    const choice = subscriptionChoices.find(choice => choice.id === subscriptionId);
    return choice?.subscription || 'Unknown';
  };

  const handleSelectSubscription = async (subscriptionId: number) => {
    if (!user) return;

    console.log('Updating subscription for user:', user.id, 'to subscription:', subscriptionId);

    try {
      // Calculate date 90 days from today
      const today = new Date();
      const futureDate = new Date(today.getTime() + (90 * 24 * 60 * 60 * 1000));
      const subChangeDate = futureDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD

      console.log('Setting sub_change date to:', subChangeDate);

      const { data, error } = await supabase
        .from('user_profiles')
        .update({ 
          subscription: subscriptionId.toString(),
          sub_change: subChangeDate
        } as any)
        .eq('user_id', user.id)
        .select(); // Add select to see the result

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Update successful:', data);
      toast.success('Subscription updated successfully');
      navigate('/');
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast.error('Failed to update subscription');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

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
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Change Subscription Reward
                </h1>
                <p className="text-muted-foreground">
                  Select your new subscription reward
                </p>
              </div>
            </div>
            {userProfile && (
              <div className="text-right text-sm text-muted-foreground">
                <div className="font-medium">
                  {userProfile.first_name} {userProfile.last_name}
                </div>
                {userProfile.reactor_id && (
                  <div>
                    Reactor ID: {userProfile.reactor_id}
                  </div>
                )}
                {userProfile.subscription && (
                  <div>
                    Subscription Reward: {subscriptionChoices.find(choice => choice.id.toString() === userProfile.subscription)?.subscription || userProfile.subscription}
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
            <CardTitle>Subscription Reward Options</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subscription Option</TableHead>
                  <TableHead>Subscription Details</TableHead>
                  <TableHead>Reactor Requirements</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptionChoices.map((choice) => (
                  <TableRow key={choice.id}>
                    <TableCell className="font-medium">
                      {choice.subscription || '-'}
                    </TableCell>
                    <TableCell>
                      {choice.sub_details || '-'}
                    </TableCell>
                    <TableCell>
                      {choice.sub_level ? getReactorRequirements(choice.sub_level) : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {userProfile?.subscription === choice.id.toString() ? (
                        <span className="text-muted-foreground font-medium">Selected</span>
                      ) : (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm">
                              Select
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirm Subscription Change</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to change your subscription reward from{' '}
                                <strong>{getCurrentSubscriptionName()}</strong> to{' '}
                                <strong>{getSelectedSubscriptionName(choice.id)}</strong>?
                                <br />
                                <br />
                                <span className="text-destructive font-medium">
                                  Once confirmed, this choice cannot be changed for 90 days.
                                </span>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleSelectSubscription(choice.id)}>
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {subscriptionChoices.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No subscription options available.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}