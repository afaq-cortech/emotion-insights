import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminLoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Verify admin using secure RPC that checks bcrypt hash
      const { data: isAdmin, error } = await supabase.rpc('verify_admin_password', {
        login_input: username,
        password,
      });

      if (error) throw error;

      if (isAdmin === true) {
        // Store admin session in localStorage
        localStorage.setItem('adminSession', 'true');
        toast({
          title: "Admin login successful",
          description: "Welcome to the admin panel.",
        });
        navigate('/admin');
      } else {
        toast({
          title: "Login failed",
          description: "Invalid admin credentials.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Login failed",
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
        <Label htmlFor="username">Admin Username</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="username"
            type="text"
            placeholder="Enter admin username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="adminPassword">Admin Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="adminPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
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

      <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
        <p className="font-medium">Default Admin Credentials (dev only):</p>
        <p>Username/Email: admin</p>
        <p>Password: password</p>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-primary hover:opacity-90 transition-smooth"
        disabled={loading || !username || !password}
      >
        {loading ? 'Signing in...' : 'Admin Sign In'}
      </Button>
    </form>
  );
};