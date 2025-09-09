import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface UserProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  cell_number?: string;
  created_at: string;
  access_code?: string | null;
  reactor_id?: string;
  subscription?: string;
  sub_change?: string | null;
  reactor_level?: string;
  status?: string | null;
  age_group?: string | null;
  gender?: string | null;
  race?: string | null;
  education?: string | null;
  income?: string | null;
  marital_status?: string | null;
  registered_voter?: string | null;
  vote_2024?: string | null;
  agree_iphone?: string | null;
  agree_live_id?: string | null;
  agree_crosscheck?: string | null;
  agree_data_share?: string | null;
}

interface EditUserDialogProps {
  user: UserProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdated: () => void;
}

export const EditUserDialog: React.FC<EditUserDialogProps> = ({
  user,
  open,
  onOpenChange,
  onUserUpdated,
}) => {
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (user) {
      setFormData({ ...user });
    }
  }, [user]);

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          cell_number: formData.cell_number,
          age_group: formData.age_group,
          gender: formData.gender,
          race: formData.race,
          education: formData.education,
          income: formData.income,
          marital_status: formData.marital_status,
          registered_voter: formData.registered_voter,
          vote_2024: formData.vote_2024,
          status: formData.status,
          access_code: formData.access_code,
          subscription: formData.subscription,
          reactor_level: formData.reactor_level,
          agree_iphone: formData.agree_iphone,
          agree_live_id: formData.agree_live_id,
          agree_crosscheck: formData.agree_crosscheck,
          agree_data_share: formData.agree_data_share,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "User profile updated successfully.",
      });

      onUserUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user profile.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User Profile</DialogTitle>
          <DialogDescription>
            Edit user details. Reactor ID and system fields cannot be modified.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Read-only fields */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Reactor ID</Label>
              <Badge variant="secondary" className="mt-1">
                {user.reactor_id || 'No reactor ID'}
              </Badge>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Created At</Label>
              <p className="text-sm mt-1">{new Date(user.created_at).toLocaleString()}</p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={formData.first_name || ''}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={formData.last_name || ''}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="cell_number">Cell Number</Label>
              <Input
                id="cell_number"
                value={formData.cell_number || ''}
                onChange={(e) => handleInputChange('cell_number', e.target.value)}
              />
            </div>
          </div>

          {/* Status and Access Code */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status || ''}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Panel Selection In Process">Panel Selection In Process</SelectItem>
                  <SelectItem value="Code Assigned">Code Assigned</SelectItem>
                  <SelectItem value="Demographics Complete">Demographics Complete</SelectItem>
                  <SelectItem value="Access Code Qualification Complete">Access Code Qualification Complete</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="access_code">Access Code</Label>
              <Input
                id="access_code"
                value={formData.access_code || ''}
                onChange={(e) => handleInputChange('access_code', e.target.value)}
              />
            </div>
          </div>

          {/* Subscription Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="subscription">Subscription</Label>
              <Select
                value={formData.subscription || ''}
                onValueChange={(value) => handleInputChange('subscription', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subscription" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Free">Free</SelectItem>
                  <SelectItem value="Basic">Basic</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="reactor_level">Reactor Level</Label>
              <Select
                value={formData.reactor_level || ''}
                onValueChange={(value) => handleInputChange('reactor_level', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Level 1">Level 1</SelectItem>
                  <SelectItem value="Level 2">Level 2</SelectItem>
                  <SelectItem value="Level 3">Level 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Demographics */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age_group">Age Group</Label>
              <Select
                value={formData.age_group || ''}
                onValueChange={(value) => handleInputChange('age_group', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select age group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="18-24">18-24</SelectItem>
                  <SelectItem value="25-34">25-34</SelectItem>
                  <SelectItem value="35-44">35-44</SelectItem>
                  <SelectItem value="45-54">45-54</SelectItem>
                  <SelectItem value="55-64">55-64</SelectItem>
                  <SelectItem value="65+">65+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender || ''}
                onValueChange={(value) => handleInputChange('gender', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Non-binary">Non-binary</SelectItem>
                  <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="race">Race</Label>
              <Select
                value={formData.race || ''}
                onValueChange={(value) => handleInputChange('race', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select race" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="White">White</SelectItem>
                  <SelectItem value="Black or African American">Black or African American</SelectItem>
                  <SelectItem value="Asian">Asian</SelectItem>
                  <SelectItem value="Hispanic or Latino">Hispanic or Latino</SelectItem>
                  <SelectItem value="Native American">Native American</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="education">Education</Label>
              <Select
                value={formData.education || ''}
                onValueChange={(value) => handleInputChange('education', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select education" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High School">High School</SelectItem>
                  <SelectItem value="Some College">Some College</SelectItem>
                  <SelectItem value="Associate Degree">Associate Degree</SelectItem>
                  <SelectItem value="Bachelor Degree">Bachelor Degree</SelectItem>
                  <SelectItem value="Master Degree">Master Degree</SelectItem>
                  <SelectItem value="Doctorate">Doctorate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="income">Income</Label>
              <Select
                value={formData.income || ''}
                onValueChange={(value) => handleInputChange('income', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select income" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Under $25,000">Under $25,000</SelectItem>
                  <SelectItem value="$25,000-$49,999">$25,000-$49,999</SelectItem>
                  <SelectItem value="$50,000-$74,999">$50,000-$74,999</SelectItem>
                  <SelectItem value="$75,000-$99,999">$75,000-$99,999</SelectItem>
                  <SelectItem value="$100,000-$149,999">$100,000-$149,999</SelectItem>
                  <SelectItem value="$150,000+">$150,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="marital_status">Marital Status</Label>
              <Select
                value={formData.marital_status || ''}
                onValueChange={(value) => handleInputChange('marital_status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select marital status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Single">Single</SelectItem>
                  <SelectItem value="Married">Married</SelectItem>
                  <SelectItem value="Divorced">Divorced</SelectItem>
                  <SelectItem value="Widowed">Widowed</SelectItem>
                  <SelectItem value="Separated">Separated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Voting Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="registered_voter">Registered Voter</Label>
              <Select
                value={formData.registered_voter || ''}
                onValueChange={(value) => handleInputChange('registered_voter', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="vote_2024">Vote 2024</Label>
              <Select
                value={formData.vote_2024 || ''}
                onValueChange={(value) => handleInputChange('vote_2024', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Democrat">Democrat</SelectItem>
                  <SelectItem value="Republican">Republican</SelectItem>
                  <SelectItem value="Independent">Independent</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                  <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Agreement Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="agree_iphone">Agree iPhone</Label>
              <Select
                value={formData.agree_iphone || ''}
                onValueChange={(value) => handleInputChange('agree_iphone', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="agree_live_id">Agree Live ID</Label>
              <Select
                value={formData.agree_live_id || ''}
                onValueChange={(value) => handleInputChange('agree_live_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="agree_crosscheck">Agree Crosscheck</Label>
              <Select
                value={formData.agree_crosscheck || ''}
                onValueChange={(value) => handleInputChange('agree_crosscheck', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="agree_data_share">Agree Data Share</Label>
              <Select
                value={formData.agree_data_share || ''}
                onValueChange={(value) => handleInputChange('agree_data_share', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};