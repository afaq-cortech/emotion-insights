import React from 'react';
import { DemographicSelector } from './DemographicSelector';
import { DemographicOption, DemographicFilterConfig } from '@/services/demographic-filter/types';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

interface CompactDemographicFilterProps {
  onSelectionChange: (filters: DemographicOption[]) => void;
  config?: DemographicFilterConfig;
  buttonText?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  disabled?: boolean;
}

export const CompactDemographicFilter: React.FC<CompactDemographicFilterProps> = ({
  onSelectionChange,
  config,
  buttonText = "Filter",
  size = "sm",
  variant = "outline",
  disabled = false
}) => {
  const trigger = (
    <Button variant={variant} size={size} disabled={disabled}>
      <Filter className="h-4 w-4 mr-2" />
      {buttonText}
    </Button>
  );

  return (
    <DemographicSelector
      onSelectionChange={onSelectionChange}
      config={config}
      trigger={trigger}
      compact={true}
    />
  );
};