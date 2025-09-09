import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { createClient } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';
import { DemographicSelector } from '@/components/demographics/DemographicSelector';
import { DemographicOption } from '@/services/demographic-filter/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const SUPABASE_URL = "https://ognnfanapdotgrmsmwav.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nbm5mYW5hcGRvdGdybXNtd2F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3ODcxMzUsImV4cCI6MjA1NjM2MzEzNX0.aLP_uQJVBIYWD1zbeXwNeKLri-_CCtawKLyZ0NlZXdQ";

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

interface AddCustomAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAlertAdded?: () => void;
  editAlert?: {
    id: number;
    start_date: string;
    end_date: string;
    message: string;
    filter: any;
  } | null;
}

export function AddCustomAlertDialog({ open, onOpenChange, onAlertAdded, editAlert }: AddCustomAlertDialogProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(
    editAlert ? new Date(editAlert.start_date) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    editAlert ? new Date(editAlert.end_date) : undefined
  );
  const [message, setMessage] = useState(editAlert?.message || '');
  const [selectedFilters, setSelectedFilters] = useState<DemographicOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Reset form when editAlert changes
  useEffect(() => {
    if (editAlert) {
      setStartDate(new Date(editAlert.start_date));
      setEndDate(new Date(editAlert.end_date));
      setMessage(editAlert.message);
      setSelectedFilters(editAlert.filter || []);
    } else {
      setStartDate(undefined);
      setEndDate(undefined);
      setMessage('');
      setSelectedFilters([]);
    }
  }, [editAlert]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      toast({
        title: "Missing Dates",
        description: "Please select both start and end dates",
        variant: "destructive",
      });
      return;
    }

    if (!message.trim()) {
      toast({
        title: "Missing Message",
        description: "Please enter an alert message",
        variant: "destructive",
      });
      return;
    }

    // Get today's date at midnight for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Validate start date is today or in the future
    const startDateOnly = new Date(startDate);
    startDateOnly.setHours(0, 0, 0, 0);
    
    if (startDateOnly < today) {
      toast({
        title: "Invalid Start Date",
        description: "Start date must be today or in the future",
        variant: "destructive",
      });
      return;
    }

    // Validate end date is today or in the future
    const endDateOnly = new Date(endDate);
    endDateOnly.setHours(0, 0, 0, 0);
    
    if (endDateOnly < today) {
      toast({
        title: "Invalid End Date",
        description: "End date must be today or in the future",
        variant: "destructive",
      });
      return;
    }

    // Validate end date is greater than or equal to start date
    if (endDateOnly < startDateOnly) {
      toast({
        title: "Invalid Date Range",
        description: "End date must be greater than or equal to start date",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (editAlert) {
        // Update existing alert
        const { error } = await supabase
          .from('reactor_alerts')
          .update({
            start_date: startDate.toISOString().split('T')[0],
            end_date: endDate.toISOString().split('T')[0],
            message: message.trim(),
            filter: selectedFilters.length > 0 ? selectedFilters : null,
          })
          .eq('id', editAlert.id);

        if (error) {
          throw error;
        }
      } else {
        // Create new alert
        const { error } = await supabase
          .from('reactor_alerts')
          .insert({
            start_date: startDate.toISOString().split('T')[0],
            end_date: endDate.toISOString().split('T')[0],
            message: message.trim(),
            alert_status: 'Filtered',
            filter: selectedFilters.length > 0 ? selectedFilters : null,
          });

        if (error) {
          throw error;
        }
      }

      toast({
        title: "Success",
        description: editAlert ? "Custom alert updated successfully" : "Custom alert created successfully",
      });

      // Reset form
      setStartDate(undefined);
      setEndDate(undefined);
      setMessage('');
      setSelectedFilters([]);
      onOpenChange(false);
      
      // Refresh the alerts list
      if (onAlertAdded) {
        onAlertAdded();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save custom alert",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editAlert ? 'Edit Custom Alert' : 'Add Custom Alert'}</DialogTitle>
          <DialogDescription>
            {editAlert ? 'Update the custom alert details below.' : 'Create a new custom alert with date range, message, and demographic filters.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const startDateOnly = startDate ? new Date(startDate) : today;
                      startDateOnly.setHours(0, 0, 0, 0);
                      return date < today || date < startDateOnly;
                    }}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Alert Message</Label>
            <Textarea
              id="message"
              placeholder="Enter the alert message that will be displayed to users"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Demographic Filters (Optional)</CardTitle>
              <CardDescription>
                Select demographic criteria to target specific user groups. Leave empty to show to all users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DemographicSelector 
                onSelectionChange={setSelectedFilters}
                config={{ dataSource: 'demo_prelim' }}
              />
              {selectedFilters.length > 0 && (
                <div className="mt-4 text-sm text-muted-foreground">
                  Selected {selectedFilters.length} filter{selectedFilters.length !== 1 ? 's' : ''}
                </div>
              )}
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : (editAlert ? 'Update Alert' : 'Create Alert')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}