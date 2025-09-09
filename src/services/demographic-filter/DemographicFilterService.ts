import { supabase } from '@/integrations/supabase/client';
import { 
  DemographicGroup, 
  DemographicOption, 
  DemographicFilterResult,
  DemographicFilterServiceOptions 
} from './types';

export class DemographicFilterService {
  private cache: Map<string, { data: DemographicGroup[], timestamp: number }> = new Map();
  private cacheTimeout: number;
  private dataSource: 'demo_prelim' | string;
  private enableCaching: boolean;

  constructor(options: DemographicFilterServiceOptions = {}) {
    this.dataSource = options.dataSource || 'demo_prelim';
    this.enableCaching = options.enableCaching ?? true;
    this.cacheTimeout = options.cacheTimeout || 5 * 60 * 1000; // 5 minutes default
  }

  async fetchDemographicGroups(): Promise<DemographicGroup[]> {
    const cacheKey = this.dataSource;
    
    // Check cache first
    if (this.enableCaching && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
    }

    try {
      // Type assertion for dynamic table name - in production this would be validated
      const { data, error } = await supabase
        .from(this.dataSource as 'demo_prelim')
        .select('demo, demo_options')
        .not('demo_options', 'is', null);

      if (error) throw error;

      const groups = this.processDemographicData(data || []);
      
      // Cache the result
      if (this.enableCaching) {
        this.cache.set(cacheKey, { data: groups, timestamp: Date.now() });
      }

      return groups;
    } catch (error) {
      console.error('Error fetching demographic data:', error);
      throw new Error('Failed to fetch demographic options');
    }
  }

  private processDemographicData(data: any[]): DemographicGroup[] {
    const groups: DemographicGroup[] = [];
    
    data.forEach(row => {
      if (row.demo_options && row.demo) {
        const options = typeof row.demo_options === 'string' 
          ? JSON.parse(row.demo_options) 
          : row.demo_options;
        
        const demoOptions: Record<string, Set<string>> = {};
        
        if (Array.isArray(options)) {
          options.forEach(option => {
            if (!demoOptions['options']) {
              demoOptions['options'] = new Set();
            }
            demoOptions['options'].add(String(option));
          });
        } else if (typeof options === 'object') {
          Object.entries(options).forEach(([category, values]) => {
            if (!demoOptions[category]) {
              demoOptions[category] = new Set();
            }
            if (Array.isArray(values)) {
              values.forEach(value => demoOptions[category].add(String(value)));
            } else if (values) {
              demoOptions[category].add(String(values));
            }
          });
        }

        const finalOptions: Record<string, string[]> = {};
        Object.entries(demoOptions).forEach(([key, valueSet]) => {
          finalOptions[key] = Array.from(valueSet).sort();
        });

        groups.push({
          demo: row.demo,
          options: finalOptions
        });
      }
    });

    return groups;
  }

  buildFilterQuery(filters: DemographicOption[]): DemographicFilterResult {
    const sqlConditions: string[] = [];
    const queryParams: Record<string, any> = {};
    
    // Group filters by demo and category for proper AND/OR logic
    const groupedFilters: Record<string, Record<string, string[]>> = {};
    
    filters.forEach(filter => {
      if (!groupedFilters[filter.demo]) {
        groupedFilters[filter.demo] = {};
      }
      if (!groupedFilters[filter.demo][filter.category]) {
        groupedFilters[filter.demo][filter.category] = [];
      }
      groupedFilters[filter.demo][filter.category].push(filter.value);
    });

    // Build SQL conditions
    Object.entries(groupedFilters).forEach(([demo, categories]) => {
      const categoryConditions: string[] = [];
      
      Object.entries(categories).forEach(([category, values]) => {
        const paramKey = `${category}_${Date.now()}_${Math.random()}`;
        categoryConditions.push(`${category} = ANY($${paramKey})`);
        queryParams[paramKey] = values;
      });
      
      if (categoryConditions.length > 0) {
        sqlConditions.push(`(${categoryConditions.join(' AND ')})`);
      }
    });

    return {
      filters,
      sqlConditions,
      queryParams
    };
  }

  clearCache(): void {
    this.cache.clear();
  }

  // Filter helper methods
  static formatCategoryLabel(category: string): string {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  static groupSelectedFilters(filters: DemographicOption[]): Record<string, Record<string, string[]>> {
    const grouped: Record<string, Record<string, string[]>> = {};
    
    filters.forEach(filter => {
      if (!grouped[filter.demo]) {
        grouped[filter.demo] = {};
      }
      if (!grouped[filter.demo][filter.category]) {
        grouped[filter.demo][filter.category] = [];
      }
      grouped[filter.demo][filter.category].push(filter.value);
    });
    
    return grouped;
  }
}