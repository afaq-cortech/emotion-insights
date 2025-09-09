import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ReactorWarning {
  id: number;
  level: string | null;
  level_desc?: string | null;
  message: string | null;
  created_at: string;
}

export const useReactorWarnings = () => {
  const [warnings, setWarnings] = useState<ReactorWarning[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWarnings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reactor_warnings')
        .select('id, level, level_desc, message, created_at')
        .order('level', { ascending: true });

      if (error) {
        console.error('Error fetching reactor warnings:', error);
        return;
      }

      setWarnings(data || []);
    } catch (error) {
      console.error('Error fetching reactor warnings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarnings();
  }, []);

  const refetch = () => {
    fetchWarnings();
  };

  return {
    warnings,
    loading,
    refetch,
  };
};