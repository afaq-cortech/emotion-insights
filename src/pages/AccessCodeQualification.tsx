import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, User, Mail, Phone, MapPin, Lock, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export default function AccessCodeQualification() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    zipCode: '',
    subscription: '',
    password: '',
    confirmPassword: ''
  });
  const [subscriptionChoices, setSubscriptionChoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscriptionChoices = async () => {
      const { data, error } = await supabase
        .from('subscription_choices')
        .select('*')
        .order('subscription');
      
      if (error) {
        console.error('Error fetching subscription choices:', error);
      } else {
        setSubscriptionChoices(data || []);
      }
    };

    fetchSubscriptionChoices();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let value = e.target.value;
    
    // Handle phone number formatting
    if (e.target.name === 'phone') {
      // Remove all non-numeric characters except +
      value = value.replace(/[^\d+]/g, '');
      
      // Ensure it starts with +1
      if (!value.startsWith('+1')) {
        value = '+1' + value.replace(/^\+?1?/, '');
      }
      
      // Format as +1 (XXX) XXX-XXXX
      const digits = value.replace('+1', '');
      if (digits.length <= 10) {
        if (digits.length >= 6) {
          value = `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
        } else if (digits.length >= 3) {
          value = `+1 (${digits.slice(0, 3)}) ${digits.slice(3)}`;
        } else if (digits.length > 0) {
          value = `+1 (${digits}`;
        } else {
          value = '+1 ';
        }
      } else {
        // Don't allow more than 10 digits after +1
        return;
      }
    }
    
    // Handle zip code formatting - only allow 5 digits, allow leading zeros
    if (e.target.name === 'zipCode') {
      // Remove all non-numeric characters
      value = value.replace(/\D/g, '');
      
      // Limit to 5 digits
      if (value.length > 5) {
        return; // Don't update if more than 5 digits
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      subscription: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Error",
        description: "Passwords do not match. Please try again.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      toast({
        title: "Password Error",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      console.log('Starting registration process for:', formData.email);

      // Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (authError) {
        console.error('Auth error:', authError);
        toast({
          title: "Registration Error",
          description: `Authentication failed: ${authError.message}`,
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      if (!authData.user) {
        console.error('No user returned from signup');
        toast({
          title: "Registration Error",
          description: "Failed to create user account.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      console.log('User created successfully:', authData.user.id);

      // Create user profile using the secure function
      const { data: profileId, error: profileError } = await supabase.rpc('create_user_profile', {
        p_user_id: authData.user.id,
        p_first_name: formData.firstName,
        p_last_name: formData.lastName,
        p_email: formData.email,
        p_cell_number: formData.phone,
        p_access_code: null,
        p_subscription: formData.subscription,
        p_reactor_level: ''
      });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        toast({
          title: "Registration Incomplete",
          description: `Profile creation failed: ${profileError.message}. Please contact support.`,
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      console.log('User profile created successfully:', profileId);

      toast({
        title: "Registration Successful",
        description: "Your account has been created! Please check your email to verify your account.",
      });
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        zipCode: '',
        subscription: '',
        password: '',
        confirmPassword: ''
      });
      
      // Navigate to demographics page
      navigate('/demographics');

    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/39a056f2-95b6-4132-bc49-38d69b878021.png" 
            alt="React InSight Logo" 
            className="h-[150px] w-auto mx-auto mb-4"
          />
        </div>
        <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
            Register to Be A Reactor
          </CardTitle>
          <CardDescription>
            To become a Reactor (and get free streaming!), we have to know some things about you so we can place you in the right Reaction Panel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Cell Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your cell phone number"
                  value={formData.phone || '+1 '}
                  onChange={handleChange}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="zipCode"
                  name="zipCode"
                  type="text"
                  placeholder="Enter your zip code"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subscription">Select Streaming Service You Prefer (don't worry, you can change this later if you want something different!)</Label>
              <Select value={formData.subscription} onValueChange={handleSelectChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a streaming service" />
                </SelectTrigger>
                <SelectContent>
                  {subscriptionChoices.map((choice) => (
                    <SelectItem key={choice.id} value={choice.id.toString()}>
                      {choice.subscription}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Create Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password (min 6 characters)"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 h-4 w-4 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 h-4 w-4 text-muted-foreground"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-primary hover:opacity-90 transition-smooth"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save and Next'}
            </Button>

            <div className="text-center">
              <Link 
                to="/auth" 
                className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-smooth"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}