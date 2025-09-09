// Legacy wrapper - kept for backward compatibility
// This component now uses the new reusable demographic filtering system
import React from 'react';
import { DemographicSelector as NewDemographicSelector } from '@/components/demographics/DemographicSelector';
import { DemographicOption } from '@/services/demographic-filter/types';

interface DemographicSelectorProps {
  onSelectionChange: (filters: DemographicOption[]) => void;
}

export const DemographicSelector: React.FC<DemographicSelectorProps> = ({ 
  onSelectionChange 
}) => {
  return (
    <NewDemographicSelector 
      onSelectionChange={onSelectionChange}
      config={{ dataSource: 'demo_prelim' }}
    />
  );
};