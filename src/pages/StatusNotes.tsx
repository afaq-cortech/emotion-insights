import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
import { AddSystemAlertDialog } from '@/components/admin/AddSystemAlertDialog';
import { AddCustomAlertDialog } from '@/components/admin/AddCustomAlertDialog';
import { DeleteAlertDialog } from '@/components/admin/DeleteAlertDialog';
import { useCurrentAlerts } from '@/hooks/useCurrentAlerts';
import { useCustomAlerts } from '@/hooks/useCustomAlerts';
import { useOldAlerts } from '@/hooks/useOldAlerts';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function StatusNotes() {
  const navigate = useNavigate();
  const [showAddSystemAlert, setShowAddSystemAlert] = useState(false);
  const [showAddCustomAlert, setShowAddCustomAlert] = useState(false);
  const [editingAlert, setEditingAlert] = useState<any>(null);
  const [editingCustomAlert, setEditingCustomAlert] = useState<any>(null);
  const [deletingAlert, setDeletingAlert] = useState<any>(null);
  const { currentAlerts, loading, refetch } = useCurrentAlerts();
  const { customAlerts, loading: customLoading, refetch: refetchCustom } = useCustomAlerts();
  const { oldAlerts, loading: oldLoading, refetch: refetchOld } = useOldAlerts();

  const handleAlertAdded = () => {
    refetch();
    refetchOld();
  };

  const handleCustomAlertAdded = () => {
    refetchCustom();
    refetchOld();
  };

  const handleEditAlert = (alert: any) => {
    setEditingAlert(alert);
    setShowAddSystemAlert(true);
  };

  const handleEditCustomAlert = (alert: any) => {
    setEditingCustomAlert(alert);
    setShowAddCustomAlert(true);
  };

  const handleEditOldAlert = (alert: any) => {
    // Determine which dialog to use based on alert type
    if (alert.alert_status === 'Current') {
      setEditingAlert(alert);
      setShowAddSystemAlert(true);
    } else {
      setEditingCustomAlert(alert);
      setShowAddCustomAlert(true);
    }
  };

  const handleDeleteAlert = async () => {
    if (!deletingAlert) return;

    try {
      const { error } = await supabase
        .from('reactor_alerts')
        .delete()
        .eq('id', deletingAlert.id);

      if (error) {
        toast.error("Failed to delete alert");
        return;
      }

      toast.success("Alert deleted successfully");
      setDeletingAlert(null);
      refetch();
      refetchCustom();
      refetchOld();
    } catch (error) {
      console.error('Error deleting alert:', error);
      toast.error("Failed to delete alert");
    }
  };

  const handleCloseDialog = () => {
    setShowAddSystemAlert(false);
    setEditingAlert(null);
  };

  const handleCloseCustomDialog = () => {
    setShowAddCustomAlert(false);
    setEditingCustomAlert(null);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-6" id="top">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/admin')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Status Notes</h1>
        </div>

        {/* Navigation Menu */}
        <div className="mb-6 p-4 bg-card rounded-lg border shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Quick Navigation</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm" onClick={() => document.getElementById('current-alerts')?.scrollIntoView({ behavior: 'smooth' })}>
              Current System Alerts
            </Button>
            <Button variant="outline" size="sm" onClick={() => document.getElementById('active-alerts')?.scrollIntoView({ behavior: 'smooth' })}>
              Active Custom Alerts
            </Button>
            <Button variant="outline" size="sm" onClick={() => document.getElementById('old-alerts')?.scrollIntoView({ behavior: 'smooth' })}>
              Old Alerts
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate('/reactor-warnings')}>
              Reactor Warnings
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="shadow-card" id="current-alerts">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Current System Alerts</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowAddSystemAlert(true)}>
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
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        Loading alerts...
                      </TableCell>
                    </TableRow>
                  ) : currentAlerts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No current system alerts
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentAlerts.map((alert: any) => (
                      <TableRow key={alert.id}>
                        <TableCell>{new Date(alert.start_date).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(alert.end_date).toLocaleDateString()}</TableCell>
                        <TableCell>{alert.message}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditAlert(alert)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeletingAlert(alert)}
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

          <Card className="shadow-card" id="active-alerts">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Active Custom Alerts</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowAddCustomAlert(true)}>
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
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Filter</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        Loading alerts...
                      </TableCell>
                    </TableRow>
                  ) : customAlerts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No active custom alerts
                      </TableCell>
                    </TableRow>
                  ) : (
                    customAlerts.map((alert: any) => (
                      <TableRow key={alert.id}>
                        <TableCell>{new Date(alert.start_date).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(alert.end_date).toLocaleDateString()}</TableCell>
                        <TableCell>{alert.message}</TableCell>
                        <TableCell>
                          {alert.filter && Array.isArray(alert.filter) && alert.filter.length > 0 ? (
                            <div className="text-sm">
                              {alert.filter.map((filter: any, index: number) => (
                                <div key={index} className="text-muted-foreground">
                                  {filter.category}: {filter.value}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">No filters</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditCustomAlert(alert)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeletingAlert(alert)}
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

          <Card className="shadow-card" id="old-alerts">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Old Alerts</CardTitle>
              <Button variant="outline" size="sm" onClick={() => document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' })}>
                Top
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Filter</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {oldLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        Loading old alerts...
                      </TableCell>
                    </TableRow>
                  ) : oldAlerts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground">
                        No old alerts
                      </TableCell>
                    </TableRow>
                  ) : (
                    oldAlerts.map((alert: any) => (
                      <TableRow key={alert.id}>
                        <TableCell>{new Date(alert.start_date).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(alert.end_date).toLocaleDateString()}</TableCell>
                        <TableCell>{alert.message}</TableCell>
                        <TableCell>
                          {alert.filter && Array.isArray(alert.filter) && alert.filter.length > 0 ? (
                            <div className="text-sm">
                              {alert.filter.map((filter: any, index: number) => (
                                <div key={index} className="text-muted-foreground">
                                  {filter.category}: {filter.value}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">No filters</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditOldAlert(alert)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDeletingAlert(alert)}
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

      <AddSystemAlertDialog 
        open={showAddSystemAlert} 
        onOpenChange={handleCloseDialog}
        onAlertAdded={handleAlertAdded}
        editAlert={editingAlert}
      />

      <AddCustomAlertDialog 
        open={showAddCustomAlert} 
        onOpenChange={handleCloseCustomDialog}
        onAlertAdded={handleCustomAlertAdded}
        editAlert={editingCustomAlert}
      />

      <DeleteAlertDialog
        open={!!deletingAlert}
        onOpenChange={(open) => !open && setDeletingAlert(null)}
        onConfirm={handleDeleteAlert}
        alertMessage={deletingAlert?.message}
      />
    </div>
  );
}