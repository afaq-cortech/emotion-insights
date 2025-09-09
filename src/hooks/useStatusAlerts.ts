import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Alert {
  id: number;
  message: string;
  alert_status: string;
  filter?: any;
}

export function useStatusAlerts(userProfile: any) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStatusAlerts = async () => {
    try {
      // Update expired alerts first
      await supabase.rpc('update_expired_alerts');
      
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch current alerts
      const { data: currentAlerts } = await supabase
        .from('reactor_alerts')
        .select('id, message, alert_status, filter')
        .eq('alert_status', 'Current')
        .lte('start_date', today)
        .gte('end_date', today);

      // Fetch filtered alerts
      const { data: filteredAlerts } = await supabase
        .from('reactor_alerts')
        .select('id, message, alert_status, filter')
        .eq('alert_status', 'Filtered')
        .lte('start_date', today)
        .gte('end_date', today);

      let relevantFiltered: Alert[] = [];
      
      // Filter the filtered alerts based on user demographics
      if (filteredAlerts && userProfile?.reactor_id) {
        for (const alert of filteredAlerts) {
          if (!alert.filter || !Array.isArray(alert.filter) || alert.filter.length === 0) {
            // If no filter, include for all users
            relevantFiltered.push(alert);
          } else {
            // Check if user matches the demographic filter
            // For now, we'll include all filtered alerts - proper demographic matching would require user demographic data
            relevantFiltered.push(alert);
          }
        }
      }

      // Combine filtered alerts first, then current alerts
      const allAlerts = [...relevantFiltered, ...(currentAlerts || [])];
      setAlerts(allAlerts);
    } catch (error) {
      console.error('Error fetching status alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatusAlerts();
  }, [userProfile?.reactor_id]);

  return { alerts, loading, refetch: fetchStatusAlerts };
}