import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { DemographicFilterService } from '@/services/demographic-filter/DemographicFilterService';
import { 
  DemographicOption, 
  DemographicGroup, 
  DemographicFilterState,
  DemographicFilterConfig 
} from '@/services/demographic-filter/types';

export function useDemographicFilters(config: DemographicFilterConfig = {}) {
  const [state, setState] = useState<DemographicFilterState>({
    groups: [],
    selectedFilters: [],
    loading: false,
    error: null,
    presets: []
  });

  const { toast } = useToast();
  
  // Memoize the service instance to prevent recreating on every render
  const service = useMemo(() => new DemographicFilterService({
    dataSource: config.dataSource,
    enableCaching: true
  }), [config.dataSource]);

  const fetchGroups = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const groups = await service.fetchDemographicGroups();
      setState(prev => ({ ...prev, groups, loading: false }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch demographic options';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [service, toast]);

  const isOptionSelected = useCallback((category: string, value: string): boolean => {
    return state.selectedFilters.some(filter => 
      filter.category === category && filter.value === value
    );
  }, [state.selectedFilters]);

  const toggleOption = useCallback((category: string, value: string, demo: string) => {
    setState(prev => {
      const isSelected = prev.selectedFilters.some(filter => 
        filter.category === category && filter.value === value
      );
      
      let updatedFilters: DemographicOption[];
      
      if (isSelected) {
        updatedFilters = prev.selectedFilters.filter(
          filter => !(filter.category === category && filter.value === value)
        );
      } else {
        // Check max selections limit
        if (config.maxSelections && prev.selectedFilters.length >= config.maxSelections) {
          return prev; // Don't add if at limit
        }
        
        updatedFilters = [...prev.selectedFilters, { category, value, demo }];
      }
      
      return { ...prev, selectedFilters: updatedFilters };
    });
  }, [config.maxSelections]);

  const clearAllFilters = useCallback(() => {
    setState(prev => ({ ...prev, selectedFilters: [] }));
  }, []);

  const setSelectedFilters = useCallback((filters: DemographicOption[]) => {
    setState(prev => ({ ...prev, selectedFilters: filters }));
  }, []);

  const getSelectedCountForCategory = useCallback((category: string): number => {
    return state.selectedFilters.filter(filter => filter.category === category).length;
  }, [state.selectedFilters]);

  const getGroupedSelectedFilters = useCallback(() => {
    return DemographicFilterService.groupSelectedFilters(state.selectedFilters);
  }, [state.selectedFilters]);

  const buildQuery = useCallback(() => {
    return service.buildFilterQuery(state.selectedFilters);
  }, [service, state.selectedFilters]);

  // Auto-fetch on mount if no manual trigger needed
  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return {
    // State
    groups: state.groups,
    selectedFilters: state.selectedFilters,
    loading: state.loading,
    error: state.error,
    presets: state.presets,

    // Actions
    fetchGroups,
    toggleOption,
    clearAllFilters,
    setSelectedFilters,
    isOptionSelected,
    getSelectedCountForCategory,
    getGroupedSelectedFilters,
    buildQuery,

    // Utilities
    formatCategoryLabel: DemographicFilterService.formatCategoryLabel
  };
}