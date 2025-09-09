import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useCustomAlerts() {
  const [customAlerts, setCustomAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomAlerts = async () => {
    try {
      // First update any expired alerts
      await supabase.rpc('update_expired_alerts');
      
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('reactor_alerts')
        .select('id, start_date, end_date, message, alert_status, filter')
        .eq('alert_status', 'Filtered')
        .gte('end_date', today)
        .order('start_date', { ascending: true });

      if (error) {
        console.error('Error fetching alerts:', error);
        return;
      }

      setCustomAlerts(data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomAlerts();
  }, []);

  return { customAlerts, loading, refetch: fetchCustomAlerts };
}