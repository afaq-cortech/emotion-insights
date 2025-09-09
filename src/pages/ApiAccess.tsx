import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Plus, Copy, Trash2, Check, Eye, EyeOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ApiKey {
  id: string;
  key_name: string;
  api_key: string;
  is_active: boolean;
  created_at: string;
  expires_at?: string;
  last_used_at?: string;
  usage_count: number;
  rate_limit_per_hour: number;
}

export default function ApiAccess() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyRateLimit, setNewKeyRateLimit] = useState('1000');
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});
  const [visibleKeys, setVisibleKeys] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load API keys.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a key name.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Generate new API key
      const { data: generatedKey, error: genError } = await supabase.rpc('generate_api_key');
      if (genError) throw genError;

      // Insert the new API key
      const { data, error } = await supabase
        .from('api_keys')
        .insert({
          key_name: newKeyName.trim(),
          api_key: generatedKey,
          rate_limit_per_hour: parseInt(newKeyRateLimit),
          allowed_tables: ['dashboard_access'],
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      setCreatedKey(generatedKey);
      setNewKeyName('');
      setNewKeyRateLimit('1000');
      await loadApiKeys();
      
      toast({
        title: "Success",
        description: "API key created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create API key.",
        variant: "destructive",
      });
    }
  };

  const deleteApiKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', keyId);

      if (error) throw error;

      await loadApiKeys();
      toast({
        title: "Success",
        description: "API key deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete API key.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async (text: string, keyId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [keyId]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [keyId]: false }));
      }, 2000);
      toast({
        title: "Copied",
        description: "API key copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const maskApiKey = (key: string) => {
    return key.substring(0, 8) + '...' + key.substring(key.length - 8);
  };

  const handleBack = () => {
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={handleBack} size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Button>
          <h1 className="text-3xl font-bold text-foreground">API Access Management</h1>
        </div>

        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Dashboard API</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  The Dashboard API allows external systems to access user dashboard data using reactor IDs.
                </p>
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Endpoint</h3>
                  <code className="text-sm bg-background p-2 rounded block">
                    https://ognnfanapdotgrmsmwav.supabase.co/functions/v1/dashboard-api
                  </code>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Usage</h3>
                  <p className="text-sm text-muted-foreground mb-2">GET Request:</p>
                  <code className="text-sm bg-background p-2 rounded block mb-2">
                    ?reactor_id=YOUR_REACTOR_ID
                  </code>
                  <p className="text-sm text-muted-foreground mb-2">POST Request:</p>
                  <code className="text-sm bg-background p-2 rounded block">
                    {"{"}"reactor_id": "YOUR_REACTOR_ID"{"}"}
                  </code>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Response Format</h3>
                  <pre className="text-sm bg-background p-2 rounded overflow-x-auto">
{`{
  "status_updates": [
    {
      "id": 1,
      "message": "Alert message",
      "type": "filtered|current"
    }
  ],
  "subscription_reward": {
    "subscription": "Netflix",
    "sub_details": "Streaming service details"
  },
  "eligible_to_change_date": "2025-01-15"
}`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>API Key Management</CardTitle>
                <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create API Key
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New API Key</DialogTitle>
                      <DialogDescription>
                        Generate a new API key for external access to the dashboard API.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="keyName">Key Name</Label>
                        <Input
                          id="keyName"
                          placeholder="e.g., External Dashboard Access"
                          value={newKeyName}
                          onChange={(e) => setNewKeyName(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="rateLimit">Rate Limit (requests per hour)</Label>
                        <Input
                          id="rateLimit"
                          type="number"
                          value={newKeyRateLimit}
                          onChange={(e) => setNewKeyRateLimit(e.target.value)}
                        />
                      </div>
                      {createdKey && (
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <Label className="text-sm font-medium">Generated API Key</Label>
                          <div className="flex items-center gap-2 mt-2">
                            <code className="flex-1 p-2 bg-background rounded text-sm break-all">
                              {createdKey}
                            </code>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(createdKey, 'new')}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Make sure to copy this key now. You won't be able to see it again.
                          </p>
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setCreateDialogOpen(false);
                          setCreatedKey(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button onClick={createApiKey}>
                        Generate Key
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-pulse">Loading API keys...</div>
                </div>
              ) : apiKeys.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No API keys created yet. Create your first API key to get started.
                </div>
              ) : (
                <div className="space-y-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>API Key</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Usage</TableHead>
                        <TableHead>Rate Limit</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {apiKeys.map((key) => (
                        <TableRow key={key.id}>
                          <TableCell className="font-medium">{key.key_name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <code className="text-sm bg-muted px-2 py-1 rounded">
                                {visibleKeys[key.id] ? key.api_key : maskApiKey(key.api_key)}
                              </code>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleKeyVisibility(key.id)}
                              >
                                {visibleKeys[key.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(key.api_key, key.id)}
                              >
                                {copiedStates[key.id] ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={key.is_active ? "default" : "destructive"}>
                              {key.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>{key.usage_count} requests</TableCell>
                          <TableCell>{key.rate_limit_per_hour}/hour</TableCell>
                          <TableCell>
                            {new Date(key.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => deleteApiKey(key.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}