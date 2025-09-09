import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
import { useReactorWarnings } from '@/hooks/useReactorWarnings';
import { AddWarningDialog } from '@/components/admin/AddWarningDialog';
import { DeleteWarningDialog } from '@/components/admin/DeleteWarningDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function ReactorWarnings() {
  const navigate = useNavigate();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingWarning, setEditingWarning] = useState<any>(null);
  const [deletingWarning, setDeletingWarning] = useState<any>(null);
  const { warnings, loading, refetch } = useReactorWarnings();

  const handleWarningAdded = () => {
    refetch();
  };

  const handleEditWarning = (warning: any) => {
    setEditingWarning(warning);
    setShowAddDialog(true);
  };

  const handleDeleteWarning = async () => {
    if (!deletingWarning) return;

    try {
      const { error } = await supabase
        .from('reactor_warnings')
        .delete()
        .eq('id', deletingWarning.id);

      if (error) {
        toast.error("Failed to delete warning");
        return;
      }

      toast.success("Warning deleted successfully");
      setDeletingWarning(null);
      refetch();
    } catch (error) {
      console.error('Error deleting warning:', error);
      toast.error("Failed to delete warning");
    }
  };

  const handleCloseDialog = () => {
    setShowAddDialog(false);
    setEditingWarning(null);
  };

  const getLevelBadgeVariant = (level: string | null) => {
    switch (level) {
      case '5':
        return 'destructive';
      case '4':
        return 'destructive';
      case '3':
        return 'default';
      case '2':
        return 'secondary';
      case '1':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-6" id="top">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/status-notes')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Status Notes
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Reactor Warnings</h1>
        </div>

        {/* Navigation Menu */}
        <div className="mb-6 p-4 bg-card rounded-lg border shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Quick Navigation</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate('/status-notes')}>
              Back to Status Notes
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/admin')}>
              Admin Dashboard
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="shadow-card" id="warnings">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Reactor Warnings</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowAddDialog(true)}>
                  <Plus className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' })}>
                  Top
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Level</TableHead>
                    <TableHead>Level Description</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        Loading warnings...
                      </TableCell>
                    </TableRow>
                  ) : warnings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No reactor warnings found
                      </TableCell>
                    </TableRow>
                  ) : (
                    warnings.map((warning) => (
                      <TableRow key={warning.id}>
                        <TableCell>
                          <Badge variant={getLevelBadgeVariant(warning.level)}>
                            {warning.level || 'UNKNOWN'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="truncate" title={warning.level_desc || ''}>
                            {warning.level_desc || '-'}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-md">
                          <div className="truncate" title={warning.message || ''}>
                            {warning.message || 'No message'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditWarning(warning)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeletingWarning(warning)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      <AddWarningDialog 
        open={showAddDialog} 
        onOpenChange={handleCloseDialog}
        onWarningAdded={handleWarningAdded}
        editWarning={editingWarning}
      />

      <DeleteWarningDialog
        open={!!deletingWarning}
        onOpenChange={(open) => !open && setDeletingWarning(null)}
        onConfirm={handleDeleteWarning}
        warningMessage={deletingWarning?.message}
      />
    </div>
  );
}