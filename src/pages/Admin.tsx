import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, LogOut, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AssignAccessCodes } from '@/components/admin/AssignAccessCodes';
import { EditUserDialog } from '@/components/admin/EditUserDialog';

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
  status?: string | null;
  race?: string | null;
  gender?: string | null;
  age_group?: string | null;
  education?: string | null;
  income?: string | null;
  marital_status?: string | null;
  registered_voter?: string | null;
  vote_2024?: string | null;
}


export default function Admin() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState<UserProfile | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Admin component mounting...');
    // Check if admin is logged in
    const adminSession = localStorage.getItem('adminSession');
    console.log('Admin session:', adminSession);
    if (!adminSession) {
      console.log('No admin session, redirecting to auth');
      navigate('/auth');
      return;
    }

    console.log('Admin session found, loading data...');
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      // Load users
      const { data: usersData, error: usersError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      setUsers(usersData || []);
    } catch (error) {
      toast({
        title: "Error loading data",
        description: "Failed to load admin data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      // Delete from Supabase auth (this will cascade to user_profiles due to foreign key)
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) throw error;

      toast({
        title: "User deleted",
        description: "User has been successfully deleted.",
      });

      loadData(); // Refresh the data
    } catch (error) {
      toast({
        title: "Error deleting user",
        description: "Failed to delete user.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    navigate('/auth');
  };

  const handleEditUser = (user: UserProfile) => {
    setEditUser(user);
    setEditDialogOpen(true);
  };

  const handleUserUpdated = () => {
    loadData(); // Refresh the user list
  };

  // Filter users based on search term
  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    const reactorId = user.reactor_id?.toLowerCase() || '';
    const email = user.email.toLowerCase();
    
    return fullName.includes(searchLower) || 
           email.includes(searchLower) || 
           reactorId.includes(searchLower);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-6">
            <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
            <nav className="flex gap-4">
              <a 
                href="#assign-codes" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Assign Access Codes
              </a>
              <a 
                href="#user-management" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                User Management
              </a>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/status-notes')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors p-0 h-auto font-normal"
              >
                Status Notes
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/api-access')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors p-0 h-auto font-normal"
              >
                API Access
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/admin/management')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors p-0 h-auto font-normal"
              >
                Admin Management
              </Button>
            </nav>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="space-y-6">
          {/* Assign Access Codes Section */}
          <div id="assign-codes">
            <AssignAccessCodes />
          </div>
          
            {/* Users Management */}
            <Card id="user-management" className="shadow-card">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">
                        Total Users: {users.length} | Filtered: {filteredUsers.length}
                      </p>
                      {searchTerm && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSearchTerm('')}
                        >
                          Clear Filter
                        </Button>
                      )}
                    </div>
                    <a 
                      href="#top" 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Top
                    </a>
                  </div>
                  
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search by reactor ID, email, or name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Reactor ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Access Code</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                       <TableBody>
                         {filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              {user.reactor_id ? (
                                <Badge 
                                  variant="secondary" 
                                  className="cursor-pointer hover:bg-secondary/80 transition-colors"
                                  onClick={() => handleEditUser(user)}
                                >
                                  {user.reactor_id}
                                </Badge>
                              ) : (
                                <span 
                                  className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                                  onClick={() => handleEditUser(user)}
                                >
                                  No reactor ID
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              {user.first_name} {user.last_name}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              {user.status ? (
                                <Badge variant="outline">{user.status}</Badge>
                              ) : (
                                <Badge variant="destructive">No Status</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {user.access_code ? (
                                <Badge variant="default">{user.access_code}</Badge>
                              ) : (
                                <span className="text-muted-foreground">No code</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteUser(user.user_id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
        </div>

        {/* Edit User Dialog */}
        <EditUserDialog
          user={editUser}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onUserUpdated={handleUserUpdated}
        />
      </div>
    </div>
  );
}