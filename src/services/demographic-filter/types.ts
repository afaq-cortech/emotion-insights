export interface DemographicOption {
  category: string;
  value: string;
  demo: string;
}

export interface DemographicGroup {
  demo: string;
  options: Record<string, string[]>;
}

export interface DemographicFilterConfig {
  dataSource?: string;
  fieldMappings?: Record<string, string>;
  allowMultipleCategories?: boolean;
  enablePresets?: boolean;
  maxSelections?: number;
}

export interface FilterPreset {
  id: string;
  name: string;
  description?: string;
  filters: DemographicOption[];
  createdAt: Date;
  createdBy?: string;
}

export interface DemographicFilterResult {
  filters: DemographicOption[];
  sqlConditions: string[];
  queryParams: Record<string, any>;
}

export interface DemographicFilterState {
  groups: DemographicGroup[];
  selectedFilters: DemographicOption[];
  loading: boolean;
  error: string | null;
  presets: FilterPreset[];
}

export interface DemographicFilterServiceOptions {
  dataSource?: string;
  enableCaching?: boolean;
  cacheTimeout?: number;
}