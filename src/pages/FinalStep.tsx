import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function FinalStep() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreements, setAgreements] = useState({
    agree_iphone: false,
    agree_live_id: false,
    agree_crosscheck: false,
    agree_data_share: false
  });

  const allAgreed = Object.values(agreements).every(value => value);

  const handleAgreementChange = (field: keyof typeof agreements, checked: boolean) => {
    setAgreements(prev => ({
      ...prev,
      [field]: checked
    }));
  };

  const handleContinue = async () => {
    if (!allAgreed) {
      toast({
        title: "Agreement Required",
        description: "Please check all requirements before continuing.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to continue.",
          variant: "destructive"
        });
        return;
      }

      // Save agreements to user_profile table
      const { error } = await supabase
        .from('user_profiles')
        .update({
          agree_iphone: agreements.agree_iphone ? 'Y' : 'N',
          agree_live_id: agreements.agree_live_id ? 'Y' : 'N',
          agree_crosscheck: agreements.agree_crosscheck ? 'Y' : 'N',
          agree_data_share: agreements.agree_data_share ? 'Y' : 'N',
          status: 'Panel Selection In Process'
        } as any)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Your agreements have been saved successfully.",
      });

      navigate('/');
    } catch (error) {
      console.error('Error saving agreements:', error);
      toast({
        title: "Error",
        description: "Failed to save your agreements. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <img 
            src="/lovable-uploads/39a056f2-95b6-4132-bc49-38d69b878021.png" 
            alt="React InSight Logo" 
            className="h-[150px] w-auto mx-auto mb-4"
          />
        </div>
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-3xl bg-gradient-primary bg-clip-text text-transparent">
              Final Step!
            </CardTitle>
            <CardDescription className="text-lg">
              To complete the process, please carefully read and affirm you understand and agree to the following requirements to become a Reactor:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agree_iphone"
                    checked={agreements.agree_iphone}
                    onCheckedChange={(checked) => handleAgreementChange('agree_iphone', checked as boolean)}
                  />
                  <label htmlFor="agree_iphone" className="text-sm leading-relaxed cursor-pointer">
                    I have an iPhone, version 10 or above (2017 or newer). Our app will not work on emulators.
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agree_live_id"
                    checked={agreements.agree_live_id}
                    onCheckedChange={(checked) => handleAgreementChange('agree_live_id', checked as boolean)}
                  />
                  <label htmlFor="agree_live_id" className="text-sm leading-relaxed cursor-pointer">
                    I agree to a live ID check where I will show an acceptable picture ID such as a driver license. You can cover any sensitive data, but it must show your photo, date of birth and address. This data will not be saved and is handled by a trusted 3rd party used by Venmo, banks and other financial and commercial entities.
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agree_crosscheck"
                    checked={agreements.agree_crosscheck}
                    onCheckedChange={(checked) => handleAgreementChange('agree_crosscheck', checked as boolean)}
                  />
                  <label htmlFor="agree_crosscheck" className="text-sm leading-relaxed cursor-pointer">
                    I agree to have my data cross-checked to confirm accuracy through US consumer data and/or voter registration files.
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agree_data_share"
                    checked={agreements.agree_data_share}
                    onCheckedChange={(checked) => handleAgreementChange('agree_data_share', checked as boolean)}
                  />
                  <label htmlFor="agree_data_share" className="text-sm leading-relaxed cursor-pointer">
                    I agree to allow my anonymized data – including demographics, scores and responses – to be shared to improve campaigns and data analytics and processing.
                  </label>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleContinue} 
              className="w-full" 
              size="lg"
              disabled={!allAgreed || isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Complete and Go to the Dashboard"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}