import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useOldAlerts() {
  const [oldAlerts, setOldAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOldAlerts = async () => {
    try {
      // First update any expired alerts
      await supabase.rpc('update_expired_alerts');
      
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('reactor_alerts')
        .select('id, start_date, end_date, message, alert_status, filter')
        .eq('alert_status', 'Expired')
        .order('end_date', { ascending: false });

      if (error) {
        console.error('Error fetching old alerts:', error);
        return;
      }

      setOldAlerts(data || []);
    } catch (error) {
      console.error('Error fetching old alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOldAlerts();
  }, []);

  return { oldAlerts, loading, refetch: fetchOldAlerts };
}