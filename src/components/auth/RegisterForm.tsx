import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, User, Mail, Lock, Phone, KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    accessCode: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    cellNumber: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    if (formData.accessCode.length !== 12) {
      toast({
        title: "Invalid access code",
        description: "Access code must be 12 characters long.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password.length < 7) {
      toast({
        title: "Invalid password",
        description: "Password must be at least 7 characters long.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const generateUniqueReactorId = async (): Promise<string> => {
    const generateId = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = 'R';
      for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    let reactorId = generateId();
    let isUnique = false;

    while (!isUnique) {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('reactor_id')
        .eq('reactor_id', reactorId)
        .maybeSingle();

      if (error) {
        console.error('Error checking reactor ID uniqueness:', error);
        reactorId = generateId(); // Try a new ID if there's an error
        continue;
      }

      if (!data) {
        isUnique = true;
      } else {
        reactorId = generateId();
      }
    }

    return reactorId;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      // First validate the access code
      const { data: isValid } = await supabase.rpc('validate_access_code', {
        access_code: formData.accessCode
      });

      if (!isValid) {
        toast({
          title: "Invalid access code",
          description: "The access code you entered is invalid or has already been used.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Create the user account
      const redirectUrl = `${window.location.origin}/`;
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (authError) {
        toast({
          title: "Registration failed",
          description: authError.message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (authData.user) {
        // Mark access code as used
        await supabase.rpc('use_access_code', {
          access_code: formData.accessCode,
          user_id: authData.user.id
        });

        // Generate unique reactor ID
        const reactorId = await generateUniqueReactorId();

        // Create user profile using the database function
        const { error: profileError } = await supabase.rpc('create_user_profile', {
          p_user_id: authData.user.id,
          p_first_name: formData.firstName,
          p_last_name: formData.lastName,
          p_email: formData.email,
          p_cell_number: formData.cellNumber,
          p_access_code: formData.accessCode,
          p_subscription: '',
          p_reactor_level: 'Green'
        });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          toast({
            title: "Profile creation failed",
            description: "Account created but profile setup failed. Please contact support.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        toast({
          title: "Registration successful",
          description: "Your account has been created successfully.",
        });

        // Navigate to thank you page
        navigate('/thank-you');
      }
    } catch (err) {
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="accessCode">Access Code (12 characters)</Label>
        <div className="relative">
          <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="accessCode"
            name="accessCode"
            type="text"
            placeholder="Enter your access code"
            value={formData.accessCode}
            onChange={handleChange}
            required
            maxLength={12}
            className="pl-10 uppercase"
            style={{ textTransform: 'uppercase' }}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          No Access Code? <a href="/access-code-qualification" className="text-primary hover:underline">Click here.</a>
        </p>
      </div>

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
        <Label htmlFor="cellNumber">Cell Number</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="cellNumber"
            name="cellNumber"
            type="tel"
            placeholder="Enter your cell number"
            value={formData.cellNumber}
            onChange={handleChange}
            required
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password (minimum 7 characters)</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={7}
            className="pl-10 pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="pl-10 pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-primary hover:opacity-90 transition-smooth"
        disabled={loading}
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
};