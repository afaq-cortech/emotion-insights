import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useStatusAlerts } from '@/hooks/useStatusAlerts';
import { LogOut, User, Mail, Phone, Calendar, Edit, Save, X, Copy, ExternalLink, ChevronUp, ChevronDown } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
  cell_number: string;
  reactor_id?: string;
  subscription?: string;
  sub_change?: string;
  reactor_level?: string;
  status?: string;
  access_code?: string;
  created_at: string;
}

interface SubscriptionChoice {
  id: number;
  subscription: string | null;
  sub_details: string | null;
  sub_level: string | null;
  sub_value: string | null;
}

interface ReactorStatus {
  id: number;
  status: string;
  message: string;
  button: string;
  button_url: string;
}

export default function Index() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subscriptionChoices, setSubscriptionChoices] = useState<SubscriptionChoice[]>([]);
  const [reactorStatus, setReactorStatus] = useState<ReactorStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    cell_number: ''
  });
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { alerts: statusAlerts } = useStatusAlerts(profile);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      // Fetch user profile, subscription choices, and reactor status
      const [profileResult, subscriptionResult] = await Promise.all([
        supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user?.id)
          .single(),
        supabase
          .from('subscription_choices' as any)
          .select('*')
          .order('id')
      ]);

      if (profileResult.error) {
        console.error('Error loading profile:', profileResult.error);
      } else {
        setProfile(profileResult.data);
        
        // Load reactor status based on user's status
        if ((profileResult.data as any)?.status) {
          const statusResult = await supabase
            .from('reactor_status' as any)
            .select('*')
            .eq('status', (profileResult.data as any).status)
            .single();
          
          if (statusResult.error) {
            console.error('Error loading reactor status:', statusResult.error);
          } else {
            setReactorStatus(statusResult.data as any);
          }
        }
      }

      if (subscriptionResult.error) {
        console.error('Error loading subscription choices:', subscriptionResult.error);
      } else {
        setSubscriptionChoices((subscriptionResult.data as any) || []);
      }
    } catch (err) {
      console.error('Profile loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSubscriptionName = (subscriptionId: string) => {
    const choice = subscriptionChoices.find(choice => choice.id.toString() === subscriptionId);
    return choice?.subscription || subscriptionId;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "There was a problem signing you out.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isEligibleToChange = () => {
    if (!profile?.sub_change) return true; // No date set means eligible
    const changeDate = new Date(profile.sub_change);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for comparison
    changeDate.setHours(0, 0, 0, 0);
    return changeDate <= today;
  };

  const handleKeepReward = async () => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          sub_change: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 1 year from now
        } as any)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Reward kept successfully",
        description: "Your subscription reward has been confirmed for another year.",
      });

      // Reload profile to get updated data
      loadProfile();
    } catch (error) {
      toast({
        title: "Error keeping reward",
        description: "There was a problem confirming your reward.",
        variant: "destructive",
      });
    }
  };

  const handleEditProfile = () => {
    if (profile) {
      setEditForm({
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        cell_number: profile.cell_number
      });
      setIsEditing(true);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(editForm as any)
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Profile updated successfully",
        description: "Your profile information has been saved.",
      });

      // Reload profile to get updated data
      loadProfile();
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error updating profile",
        description: "There was a problem saving your changes.",
        variant: "destructive",
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({
      first_name: '',
      last_name: '',
      email: '',
      cell_number: ''
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCopyAccessCode = async () => {
    if (profile?.access_code) {
      try {
        await navigator.clipboard.writeText(profile.access_code);
        toast({
          title: "Access code copied",
          description: "Your access code has been copied to clipboard.",
        });
      } catch (error) {
        toast({
          title: "Failed to copy",
          description: "Could not copy access code to clipboard.",
          variant: "destructive",
        });
      }
    }
  };

  const handleScrollUp = () => {
    if (scrollContainerRef.current) {
      const newPosition = Math.max(0, scrollPosition - 100);
      setScrollPosition(newPosition);
      scrollContainerRef.current.scrollTo({ top: newPosition, behavior: 'smooth' });
    }
  };

  const handleScrollDown = () => {
    if (scrollContainerRef.current) {
      const maxScroll = scrollContainerRef.current.scrollHeight - scrollContainerRef.current.clientHeight;
      const newPosition = Math.min(maxScroll, scrollPosition + 100);
      setScrollPosition(newPosition);
      scrollContainerRef.current.scrollTo({ top: newPosition, behavior: 'smooth' });
    }
  };

  const canScrollUp = scrollPosition > 0;
  const canScrollDown = scrollContainerRef.current 
    ? scrollPosition < scrollContainerRef.current.scrollHeight - scrollContainerRef.current.clientHeight 
    : false;

  const appStoreUrl = "https://apps.apple.com/app/reactor-insight/id123456789"; // Replace with actual App Store URL

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="animate-pulse">Loading your profile...</div>
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
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Reactor InSight Portal
                </h1>
                <p className="text-muted-foreground">
                  Welcome back{profile ? `, ${profile.first_name}` : ''}!
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
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
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Your Reactor Access Code */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Your Reactor Access Code:</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-medium">Access Code:</span>
                  <br />
                  <span className="text-muted-foreground font-mono text-lg">
                    {profile?.access_code || 'Awaiting Approval'}
                  </span>
                </div>
                {profile?.access_code && profile.access_code !== 'Awaiting Approval' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyAccessCode}
                    className="ml-2"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              {profile?.access_code && profile.access_code !== 'Awaiting Approval' && (
                <>
                  <div className="text-sm font-medium">
                    Download the Reactor App from the Apple App Store
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={() => window.open(appStoreUrl, '_blank')}
                      className="flex items-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      App Store
                    </Button>
                    
                    <div className="flex flex-col items-center">
                      <QRCodeSVG
                        value={appStoreUrl}
                        size={64}
                        className="border border-border rounded"
                      />
                      <span className="text-xs text-muted-foreground mt-1">Scan to download</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Welcome Card */}
          <Card className="lg:col-span-2 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2 text-primary" />
                Welcome {profile?.first_name || 'Reactor'} {profile?.reactor_id ? `(${profile.reactor_id})` : ''}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                You have successfully logged into your secure account. Your information is protected and encrypted.
              </p>
              <div className="bg-gradient-primary text-primary-foreground p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Your Reactor Status</h3>
                <p className="text-sm opacity-90 mb-2">
                  <span className="opacity-90">Your Status: </span>
                  <span className="opacity-90">{profile?.status || 'N/A'}</span>
                </p>
                <p className="text-sm opacity-90 mb-2">
                  <span className="opacity-90">Reactor Level: </span>
                  <span className="opacity-90">{profile?.reactor_level || 'N/A'}</span>
                </p>
                <p className="text-sm opacity-90 mb-2">
                  Subscription Reward: {profile?.subscription ? getSubscriptionName(profile.subscription) : <span className="italic font-bold">NOT SELECTED</span>} (Eligible to Change: {profile?.sub_change || 'N/A'})
                </p>
                
                {/* Conditional buttons */}
                <div className="mb-2 space-x-2">
                  {(!profile?.subscription || isEligibleToChange()) && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      onClick={() => navigate('/change-reward')}
                    >
                      Change
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Summary */}
          {profile && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-2 text-primary" />
                    Profile Summary
                  </div>
                  {!isEditing && (
                    <Button variant="outline" size="sm" onClick={handleEditProfile}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isEditing ? (
                  <>
                    <div className="flex items-center text-sm">
                      <User className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>{profile.first_name} {profile.last_name}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>{profile.email}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>{profile.cell_number}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>Joined {formatDate(profile.created_at)}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">First Name</label>
                      <Input
                        value={editForm.first_name}
                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                        placeholder="First Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Last Name</label>
                      <Input
                        value={editForm.last_name}
                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                        placeholder="Last Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Email"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Cell Number</label>
                      <Input
                        value={editForm.cell_number}
                        onChange={(e) => handleInputChange('cell_number', e.target.value)}
                        placeholder="Cell Number"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="default" size="sm" onClick={handleSaveProfile}>
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Status Updates */}
          <Card className="shadow-card border-warning">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-warning">Status Updates</CardTitle>
              <div className="flex flex-col gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleScrollUp}
                  disabled={!canScrollUp}
                  className="h-6 w-6 p-0"
                >
                  <ChevronUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleScrollDown}
                  disabled={!canScrollDown}
                  className="h-6 w-6 p-0"
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div 
                ref={scrollContainerRef}
                className="max-h-48 overflow-y-auto space-y-2"
                onScroll={(e) => setScrollPosition(e.currentTarget.scrollTop)}
              >
                {statusAlerts.length > 0 ? (
                  statusAlerts.map((alert, index) => (
                    <div key={alert.id}>
                      <div className="text-sm text-muted-foreground p-2 rounded">
                        {alert.message}
                      </div>
                      {index < statusAlerts.length - 1 && (
                        <div className="flex justify-center my-2">
                          <div className="h-px w-full bg-border"></div>
                        </div>
                      )}
                    </div>
                  ))
                ) : reactorStatus ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      {reactorStatus.message}
                    </p>
                    {reactorStatus.button && reactorStatus.button_url && (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => window.open(reactorStatus.button_url, '_blank')}
                      >
                        {reactorStatus.button}
                      </Button>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No status updates available.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/reactor-support')}>
                Reactor Support
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/scoring-history')}>
                Scoring History
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate('/fun-stats')}>
                Fun Stats
              </Button>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}