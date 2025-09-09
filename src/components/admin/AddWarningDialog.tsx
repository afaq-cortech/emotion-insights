import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AddWarningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWarningAdded: () => void;
  editWarning?: {
    id: number;
    level: string | null;
    level_desc?: string | null;
    message: string | null;
  } | null;
}

export const AddWarningDialog: React.FC<AddWarningDialogProps> = ({
  open,
  onOpenChange,
  onWarningAdded,
  editWarning,
}) => {
  const [level, setLevel] = useState('');
  const [levelDesc, setLevelDesc] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editWarning) {
      setLevel(editWarning.level || '');
      setLevelDesc(editWarning.level_desc || '');
      setMessage(editWarning.message || '');
    } else {
      setLevel('');
      setLevelDesc('');
      setMessage('');
    }
  }, [editWarning, open]);

  const handleSubmit = async () => {
    if (!level || !message) {
      toast.error('Please fill in level and message fields');
      return;
    }

    try {
      setLoading(true);

      if (editWarning) {
        // Update existing warning
        const { error } = await supabase
          .from('reactor_warnings')
          .update({
            level,
            level_desc: levelDesc,
            message,
          })
          .eq('id', editWarning.id);

        if (error) throw error;

        toast.success('Warning updated successfully');
      } else {
        // Create new warning
        const { error } = await supabase
          .from('reactor_warnings')
          .insert([{
            level,
            level_desc: levelDesc,
            message,
          }]);

        if (error) throw error;

        toast.success('Warning added successfully');
      }

      onWarningAdded();
      onOpenChange(false);
      setLevel('');
      setLevelDesc('');
      setMessage('');
    } catch (error) {
      console.error('Error saving warning:', error);
      toast.error('Failed to save warning');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editWarning ? 'Edit Warning' : 'Add New Warning'}
          </DialogTitle>
          <DialogDescription>
            {editWarning 
              ? 'Update the warning details below.' 
              : 'Create a new reactor warning message.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="level">Warning Level</Label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select warning level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="level_desc">Level Description</Label>
            <Textarea
              id="level_desc"
              placeholder="Enter level description (optional)..."
              value={levelDesc}
              onChange={(e) => setLevelDesc(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Enter warning message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : editWarning ? 'Update' : 'Add Warning'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};