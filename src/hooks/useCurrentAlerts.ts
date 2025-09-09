import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useCurrentAlerts() {
  const [currentAlerts, setCurrentAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCurrentAlerts = async () => {
    try {
      // First update any expired alerts
      await supabase.rpc('update_expired_alerts');
      
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('reactor_alerts')
        .select('id, start_date, end_date, message, alert_status')
        .eq('alert_status', 'Current')
        .lte('start_date', today)
        .gte('end_date', today)
        .order('start_date', { ascending: true });

      if (error) {
        console.error('Error fetching alerts:', error);
        return;
      }

      setCurrentAlerts(data || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentAlerts();
  }, []);

  return { currentAlerts, loading, refetch: fetchCurrentAlerts };
}