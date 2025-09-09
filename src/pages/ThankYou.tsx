import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function ThankYou() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-dialog">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-success-foreground" />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Thank You!
          </h1>
          
          <p className="text-muted-foreground mb-8">
            Your account has been successfully created. You can now access your secure portal.
          </p>
          
          <Button 
            onClick={() => navigate('/auth')}
            className="w-full bg-gradient-primary hover:opacity-90 transition-smooth"
          >
            Continue to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}