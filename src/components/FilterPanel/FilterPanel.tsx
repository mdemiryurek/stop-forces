'use client';

import { useState } from 'react';
import { FilterOptions } from '@/types';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';

import Modal from '@/components/ui/Modal';
import styles from './FilterPanel.module.scss';

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableOptions: {
    searchTypes: string[];
  };
  isOpen: boolean;
  onToggle: () => void;
}

const FilterPanel = ({ 
  filters, 
  onFiltersChange, 
  availableOptions, 
  isOpen, 
  onToggle
}: FilterPanelProps) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
  };

  const handleResetFilters = () => {
    const resetFilters: FilterOptions = {
      dateRange: { start: null, end: null },
      location: [],
      searchType: [],
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
    onToggle();
  };

  const handleDateChange = (field: 'start' | 'end', value: string | null) => {
    setLocalFilters(prev => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [field]: value ? new Date(value) : null,
      },
    }));
  };

  const handleLocationChange = (value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      location: value ? [value] : [],
    }));
  };

  const handleMultiSelectChange = (field: keyof Omit<FilterOptions, 'dateRange'>, selectedValues: string[]) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: selectedValues,
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onToggle}
      title="Filter Options"
    >
      <div className={styles['filter-content']}>
        {/* Date Range */}
        <div className={styles['filter-grid']}>
          <Input
            type="month"
            label="Start Month"
            value={localFilters.dateRange.start?.toISOString().slice(0, 7) || ''}
            onChange={(e) => handleDateChange('start', e.target.value ? `${e.target.value}-01` : null)}
          />
          <Input
            type="month"
            label="End Month"
            value={localFilters.dateRange.end?.toISOString().slice(0, 7) || ''}
            onChange={(e) => handleDateChange('end', e.target.value ? `${e.target.value}-01` : null)}
          />
        </div>

        {/* Location */}
        <div className={styles['filter-section']}>
          <Input
            type="text"
            label="Location"
            placeholder="Enter a location..."
            value={localFilters.location[0] || ''}
            onChange={(e) => handleLocationChange(e.target.value)}
          />
        </div>

        {/* Search Type */}
        <div className={styles['filter-section']}>
          <Select
            multiple
            value={localFilters.searchType}
            label="Type of Search"
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, option => option.value);
              handleMultiSelectChange('searchType', selected);
            }}
            options={availableOptions.searchTypes.map(searchType => ({
              value: searchType,
              label: searchType
            }))}
          />
        </div>

        {/* Action Buttons */}
        <div className={styles['filter-actions']}>
          <Button onClick={handleApplyFilters}>
            Apply Filters
          </Button>
          <Button variant="outline" onClick={handleResetFilters}>
            Clear Filter
          </Button>
        </div>
      </div>
    </Modal>
  );
};

FilterPanel.displayName = 'FilterPanel';
export default FilterPanel;