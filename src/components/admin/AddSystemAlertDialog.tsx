import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AddSystemAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAlertAdded?: () => void;
  editAlert?: {
    id: number;
    start_date: string;
    end_date: string;
    message: string;
  } | null;
}

export function AddSystemAlertDialog({ open, onOpenChange, onAlertAdded, editAlert }: AddSystemAlertDialogProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(
    editAlert ? new Date(editAlert.start_date) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    editAlert ? new Date(editAlert.end_date) : undefined
  );
  const [message, setMessage] = useState(editAlert?.message || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Reset form when editAlert changes
  React.useEffect(() => {
    if (editAlert) {
      setStartDate(new Date(editAlert.start_date));
      setEndDate(new Date(editAlert.end_date));
      setMessage(editAlert.message);
    } else {
      setStartDate(undefined);
      setEndDate(undefined);
      setMessage('');
    }
  }, [editAlert]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate || !message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
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
            alert_status: 'Current'
          });

        if (error) {
          throw error;
        }
      }

      toast({
        title: "Success",
        description: editAlert ? "System alert updated successfully" : "System alert created successfully",
      });

      // Reset form
      setStartDate(undefined);
      setEndDate(undefined);
      setMessage('');
      onOpenChange(false);
      
      // Refresh the alerts list
      if (onAlertAdded) {
        onAlertAdded();
      }
    } catch (error) {
      console.error('Error creating alert:', error);
      toast({
        title: "Error",
        description: "Failed to create system alert. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setMessage('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editAlert ? 'Edit System Alert' : 'Add System Alert'}</DialogTitle>
          <DialogDescription>
            {editAlert ? 'Update the system alert details below.' : 'Create a new system alert with start date, end date, and message.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
                  {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
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
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
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

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Enter alert message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!startDate || !endDate || !message.trim() || isSubmitting}
            >
              {isSubmitting ? 'Saving...' : (editAlert ? 'Update Alert' : 'Create Alert')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}