import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';
import { DemographicSelector } from './DemographicSelector';

type UserProfile = Database['public']['Tables']['user_profiles']['Row'];

export const AssignAccessCodes: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigningCodes, setAssigningCodes] = useState<Set<string>>(new Set());
  const [selectedFilters, setSelectedFilters] = useState<Array<{category: string, value: string, demo: string}>>([]);
  const { toast } = useToast();

  const fetchUsersWithoutCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, first_name, last_name, email, access_code, reactor_id, user_id, status, race, gender, age_group, education, income, marital_status, registered_voter, vote_2024')
        .or('access_code.is.null,access_code.eq.')
        .order('created_at', { ascending: false });

      console.log('Query result:', { data, error, count: data?.length });
      console.log('Users without access codes:', data);

      if (error) throw error;
      setUsers(data as UserProfile[] || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users without access codes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const assignAccessCode = async (userId: string) => {
    setAssigningCodes(prev => new Set([...prev, userId]));
    
    try {
      // Create a new access code
      const { data: codeData, error: codeError } = await supabase
        .rpc('create_access_code');

      if (codeError) throw codeError;

      const newAccessCode = codeData;

      // Update the user profile with the new access code and status
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ 
          access_code: newAccessCode,
          status: "Code Assigned"
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Update local state - remove the user from the list since they now have an access code
      setUsers(prevUsers => 
        prevUsers.filter(user => user.id !== userId)
      );

      toast({
        title: "Success",
        description: `Access code ${newAccessCode} assigned successfully.`,
      });
    } catch (error) {
      console.error('Error assigning access code:', error);
      toast({
        title: "Error",
        description: "Failed to assign access code.",
        variant: "destructive",
      });
    } finally {
      setAssigningCodes(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const assignAllAccessCodes = async () => {
    setLoading(true);
    
    try {
      const promises = filteredUsers.map(user => assignAccessCode(user.id));
      await Promise.all(promises);
      
      toast({
        title: "Success",
        description: "Access codes assigned to all users.",
      });
    } catch (error) {
      console.error('Error assigning all access codes:', error);
      toast({
        title: "Error",
        description: "Failed to assign access codes to all users.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on selected demographic filters
  const getFilteredUsers = () => {
    if (selectedFilters.length === 0) {
      return users;
    }

    console.log('Applying filters:', selectedFilters);
    console.log('Total users to filter:', users.length);

    const filtered = users.filter(user => {
      // Group filters by demo for AND logic between demos
      const filtersByDemo: Record<string, Array<{category: string, value: string}>> = {};
      selectedFilters.forEach(filter => {
        if (!filtersByDemo[filter.demo]) {
          filtersByDemo[filter.demo] = [];
        }
        filtersByDemo[filter.demo].push({category: filter.category, value: filter.value});
      });

      console.log('Filters by demo:', filtersByDemo);

      // Check if user matches ALL demo groups (AND logic between demos)
      const matches = Object.entries(filtersByDemo).every(([demo, demoFilters]) => {
        // Group filters within demo by category for OR logic within categories
        const filtersByCategory: Record<string, string[]> = {};
        demoFilters.forEach(filter => {
          if (!filtersByCategory[filter.category]) {
            filtersByCategory[filter.category] = [];
          }
          filtersByCategory[filter.category].push(filter.value);
        });

        console.log(`User ${user.first_name} ${user.last_name} - checking demo ${demo}:`, filtersByCategory);

        // Check if user matches ALL categories within this demo (AND logic between categories)
        return Object.entries(filtersByCategory).every(([category, values]) => {
          // Map filter categories to actual user profile field names
          let userFieldName = category;
          if (demo === 'age_group' && category === 'options') {
            userFieldName = 'age_group';
          }
          // Map other demographics as needed
          if (demo === 'gender' && category === 'options') {
            userFieldName = 'gender';
          }
          if (demo === 'race' && category === 'options') {
            userFieldName = 'race';
          }
          if (demo === 'education' && category === 'options') {
            userFieldName = 'education';
          }
          if (demo === 'income' && category === 'options') {
            userFieldName = 'income';
          }
          
          const userValue = user[userFieldName as keyof UserProfile] as string;
          console.log(`  Checking ${category} (mapped to ${userFieldName}): user has "${userValue}", looking for ${values}`);
          
          if (!userValue) {
            console.log(`  User has no value for ${category}, skipping`);
            return false;
          }
          
          // Check if user value matches ANY of the filter values (OR logic within category)
          const categoryMatch = values.some(filterValue => {
            // Handle different matching strategies
            if (category === 'age_group') {
              // For age groups, check if user's age group matches any of the selected ranges
              const match = userValue === filterValue;
              console.log(`    Age group exact match: "${userValue}" === "${filterValue}" = ${match}`);
              return match;
            }
            // Default string matching (case insensitive)
            const match = userValue.toLowerCase().includes(filterValue.toLowerCase()) || 
                   filterValue.toLowerCase().includes(userValue.toLowerCase());
            console.log(`    String match: "${userValue}" includes "${filterValue}" = ${match}`);
            return match;
          });
          
          console.log(`  Category ${category} match result: ${categoryMatch}`);
          return categoryMatch;
        });
      });

      console.log(`User ${user.first_name} ${user.last_name} overall match: ${matches}`);
      return matches;
    });

    console.log('Filtered users count:', filtered.length);
    return filtered;
  };

  const filteredUsers = getFilteredUsers();

  useEffect(() => {
    fetchUsersWithoutCodes();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Assign Access Codes</CardTitle>
        <div className="flex gap-2">
          {selectedFilters.length > 0 && (
            <Button 
              onClick={() => setSelectedFilters([])}
              variant="outline"
              size="sm"
            >
              Reset Filters
            </Button>
          )}
          {filteredUsers.length > 0 && (
            <Button 
              onClick={() => assignAllAccessCodes()}
              disabled={loading}
              variant="outline"
            >
              Assign All Access Codes
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {selectedFilters.length > 0 ? "No users match the selected filters." : "No users without access codes found."}
          </div>
        ) : (
          <>
            <div className="mb-4">
              <DemographicSelector onSelectionChange={setSelectedFilters} />
              <div className="mt-2 text-sm text-muted-foreground">
                Showing {filteredUsers.length} records
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reactor ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Demographics</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {user.reactor_id ? (
                        <Badge variant="secondary">{user.reactor_id}</Badge>
                      ) : (
                        <span className="text-muted-foreground">No reactor ID</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.status ? (
                        <Badge variant="outline">{user.status}</Badge>
                      ) : (
                        <Badge variant="destructive">No Status</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-xs">
                        {user.age_group && <div><strong>Age:</strong> {user.age_group}</div>}
                        {user.gender && <div><strong>Gender:</strong> {user.gender}</div>}
                        {user.race && <div><strong>Race:</strong> {user.race}</div>}
                        {user.education && <div><strong>Education:</strong> {user.education}</div>}
                        {user.income && <div><strong>Income:</strong> {user.income}</div>}
                        {user.vote_2024 && <div><strong>Vote 2024:</strong> {user.vote_2024}</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => assignAccessCode(user.id)}
                        disabled={assigningCodes.has(user.id)}
                        size="sm"
                      >
                        {assigningCodes.has(user.id) ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Assigning...
                          </>
                        ) : (
                          'Assign Code'
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </CardContent>
    </Card>
  );
};