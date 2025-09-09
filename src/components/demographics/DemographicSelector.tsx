import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X, Filter } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDemographicFilters } from '@/hooks/useDemographicFilters';
import { DemographicOption, DemographicFilterConfig } from '@/services/demographic-filter/types';

interface DemographicSelectorProps {
  onSelectionChange: (filters: DemographicOption[]) => void;
  config?: DemographicFilterConfig;
  trigger?: React.ReactNode;
  compact?: boolean;
  disabled?: boolean;
}

export const DemographicSelector: React.FC<DemographicSelectorProps> = ({ 
  onSelectionChange, 
  config = {},
  trigger,
  compact = false,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const {
    groups,
    selectedFilters,
    loading,
    error,
    toggleOption,
    clearAllFilters,
    isOptionSelected,
    getSelectedCountForCategory,
    getGroupedSelectedFilters,
    formatCategoryLabel
  } = useDemographicFilters(config);

  const processFilters = () => {
    onSelectionChange(selectedFilters);
    setIsOpen(false);
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" disabled={disabled}>
      <Filter className="h-4 w-4 mr-2" />
      Filter Demographics
      {selectedFilters.length > 0 && (
        <Badge variant="secondary" className="ml-2">
          {selectedFilters.length}
        </Badge>
      )}
    </Button>
  );

  if (error) {
    return (
      <div className="text-sm text-destructive">
        Error loading demographic options: {error}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 flex-wrap">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            {trigger || defaultTrigger}
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                Select Demographic Filters
                {selectedFilters.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    Clear All
                  </Button>
                )}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Selected Filters Summary */}
              {selectedFilters.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">Selected Filters ({selectedFilters.length}):</h4>
                    {config.maxSelections && (
                      <span className="text-xs text-muted-foreground">
                        {selectedFilters.length}/{config.maxSelections}
                      </span>
                    )}
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                        Clear All
                      </Button>
                      <Button variant="default" size="sm" onClick={processFilters}>
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="space-y-2">
                      {Object.entries(getGroupedSelectedFilters()).map(([demo, categories], demoIndex) => (
                        <div key={demo} className="space-y-1">
                          <div className="flex items-center gap-2">
                            {demoIndex > 0 && <span className="text-xs font-medium text-muted-foreground">AND</span>}
                            <span className="text-sm font-medium">{demo}:</span>
                          </div>
                          <div className="ml-4 space-y-1">
                            {Object.entries(categories).map(([category, values], categoryIndex) => (
                              <div key={category} className="flex items-center gap-2 flex-wrap">
                                {categoryIndex > 0 && <span className="text-xs text-muted-foreground">AND</span>}
                                <span className="text-sm">{formatCategoryLabel(category)}:</span>
                                <div className="flex items-center gap-1 flex-wrap">
                                  {values.map((value, valueIndex) => (
                                    <div key={value} className="flex items-center gap-1">
                                      {valueIndex > 0 && <span className="text-xs text-muted-foreground">OR</span>}
                                      <Badge variant="secondary" className="flex items-center gap-1">
                                        <span className="text-xs">{value}</span>
                                        <button
                                          onClick={() => toggleOption(category, value, demo)}
                                          className="ml-1 hover:text-destructive"
                                        >
                                          <X className="h-3 w-3" />
                                        </button>
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {loading ? (
                <div className="text-center text-muted-foreground py-8">
                  Loading demographic options...
                </div>
              ) : (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-8">
                    {groups.map((group, groupIndex) => (
                      <div key={groupIndex} className="space-y-4">
                        <h2 className="text-lg font-semibold border-b pb-2">
                          {group.demo}
                        </h2>
                        <div className={`grid gap-6 ${compact ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                          {Object.entries(group.options).map(([category, values]) => (
                            <div key={category} className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium text-sm">
                                  {formatCategoryLabel(category)}
                                </h3>
                                {getSelectedCountForCategory(category) > 0 && (
                                  <Badge variant="outline" className="text-xs">
                                    {getSelectedCountForCategory(category)} selected
                                  </Badge>
                                )}
                              </div>
                              <div className={`grid gap-2 ${compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
                                {values.map((value) => (
                                  <div key={value} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`${category}-${value}`}
                                      checked={isOptionSelected(category, value)}
                                      onCheckedChange={() => toggleOption(category, value, group.demo)}
                                      disabled={config.maxSelections && selectedFilters.length >= config.maxSelections && !isOptionSelected(category, value)}
                                    />
                                    <label
                                      htmlFor={`${category}-${value}`}
                                      className="text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 truncate"
                                    >
                                      {value}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Applied Filters Display */}
        {!compact && selectedFilters.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Applied:</span>
            <div className="flex items-center gap-2 flex-wrap">
              {Object.entries(getGroupedSelectedFilters()).map(([demo, categories], demoIndex) => (
                <div key={demo} className="flex items-center gap-1">
                  {demoIndex > 0 && <span className="text-xs">AND</span>}
                  <Badge variant="outline" className="text-xs">
                    {demo}: {Object.entries(categories).map(([category, values], catIndex) => (
                      <span key={category}>
                        {catIndex > 0 && " AND "}
                        {formatCategoryLabel(category)} ({values.join(" OR ")})
                      </span>
                    ))}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};