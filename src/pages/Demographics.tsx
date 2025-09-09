import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface DemoQuestion {
  demo: string;
  demo_options: string[];
}

// Create dynamic schema based on demo questions
const createFormSchema = (questions: DemoQuestion[]) => {
  const schemaObject: Record<string, z.ZodString> = {};
  questions.forEach(question => {
    schemaObject[question.demo] = z.string().min(1, `${question.demo.replace('_', ' ')} is required`);
  });
  return z.object(schemaObject);
};

export default function Demographics() {
  const [demoQuestions, setDemoQuestions] = useState<DemoQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const form = useForm<Record<string, string>>({
    resolver: demoQuestions.length > 0 ? zodResolver(createFormSchema(demoQuestions)) : undefined,
    defaultValues: {},
    mode: "onChange" // This enables real-time validation
  });

  useEffect(() => {
    const fetchDemoQuestions = async () => {
      try {
        const { data, error } = await supabase
          .rpc('count_rows', { table_name: 'demo_prelim' });

        // For now, let's use the hardcoded data from the query results
        const hardcodedData: DemoQuestion[] = [
          { demo: 'age_group', demo_options: ['18-24', '25-34', '35-44', '45-54', '55+'] },
          { demo: 'gender', demo_options: ['Female', 'Male', 'Non-Binary', 'Other'] },
          { demo: 'race', demo_options: ['American Indian or Alaska Native', 'Asian', 'Black or African American', 'Hispanic or Latino', 'Middle Eastern or North African (MENA)', 'Native Hawaiian or Other Pacific Islander', 'White', 'Two or More Races', 'Some Other Race'] },
          { demo: 'education', demo_options: ['High School', 'Associate\'s / Technical Degree', 'Some College', 'Bachelor\'s Degree', 'Master\'s Degree', 'PhD/Advanced Degree'] },
          { demo: 'income', demo_options: ['< $25,000', '$25,000 - $50,000', '$50,000 - $75,000', '$75,000 - $100,000', '$100,000 - $150,000', '$150,000+'] },
          { demo: 'marital_status', demo_options: ['Single', 'Married', 'Partnered', 'In a relationship', 'Divorced', 'Widowed'] },
          { demo: 'registered_voter', demo_options: ['Yes', 'No'] },
          { demo: 'vote_2024', demo_options: ['Kamala Harris', 'Donald Trump', 'Did not Vote', 'Other'] }
        ];

        setDemoQuestions(hardcodedData);
      } catch (error) {
        console.error('Error fetching demo questions:', error);
        toast({
          title: "Error",
          description: "Failed to load demographic questions.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDemoQuestions();
  }, [toast]);

  const onSubmit = async (values: Record<string, string>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save demographics.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Update the existing user profile with demographic data
      const profileData = {
        age_group: values.age_group,
        gender: values.gender,
        race: values.race,
        education: values.education,
        income: values.income,
        marital_status: values.marital_status,
        registered_voter: values.registered_voter,
        vote_2024: values.vote_2024,
      };

      const { error } = await supabase
        .from('user_profiles')
        .update({
          ...profileData,
          status: 'Demographics Completed'
        } as any)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Demographics saved successfully!",
      });

      // Navigate to final step
      navigate('/final-step');
    } catch (error: any) {
      console.error('Error saving demographics:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save demographics.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatLabel = (demo: string) => {
    return demo
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center text-muted-foreground">Loading...</div>
      </div>
    );
  }

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
            <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
              Let Us Know Some Things About You
            </CardTitle>
            <CardDescription>
              Next, please answer the following demographic questions so we can put you in similar panels. All fields are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {demoQuestions.map((question, index) => (
                  <FormField
                    key={question.demo}
                    control={form.control}
                    name={question.demo as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{formatLabel(question.demo)}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={`Select ${formatLabel(question.demo).toLowerCase()}`} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {question.demo_options.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting || !form.formState.isValid}
                >
                  {isSubmitting ? 'Saving...' : 'Save and Continue'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}