import { StopSearchRecord, FilterOptions } from "@/types";
import { Button } from "@/components/ui/Button";
import { Filter } from "lucide-react";
import styles from './StatsHeader.module.scss';

interface StatsHeaderProps {
  filteredData: StopSearchRecord[];
  filters: FilterOptions;
  onFilterClick: () => void;
  isLoading?: boolean;
}

export const StatsHeader = ({ filteredData, filters, onFilterClick, isLoading = false }: StatsHeaderProps) => {
  const arrestRate = filteredData.length > 0
    ? ((filteredData.filter((r) => r.outcome.includes("Arrest")).length / filteredData.length) * 100).toFixed(1)
    : "0";

  const dateRange = filteredData.length > 0
    ? `${new Date(Math.min(...filteredData.map((r) => new Date(r.datetime).getTime()))).getFullYear()} - ${new Date(Math.max(...filteredData.map((r) => new Date(r.datetime).getTime()))).getFullYear()}`
    : "N/A";

  const activeFilters = [
    filters.dateRange.start,
    filters.dateRange.end,
    ...filters.location,
    ...filters.searchType,
  ].filter(Boolean).length;

  return (
    <div className={styles['stats-container']}>
      <div className={styles['stats-header']}>
        <div className={styles['stats-grid']}>
          <div className={styles['stat-card']}>
            <h3>Total Searches</h3>
            <p>{filteredData.length.toLocaleString()}</p>
          </div>
          <div className={styles['stat-card']}>
            <h3>Date Range</h3>
            <p>{dateRange}</p>
          </div>
          <div className={styles['stat-card']}>
            <h3>Arrest Rate</h3>
            <p>{arrestRate}%</p>
          </div>
        </div>
        <div className={styles['filter-button-container']}>
          <Button
            variant="primary"
            onClick={onFilterClick}
            disabled={isLoading}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters {activeFilters > 0 && `(${activeFilters})`}
          </Button>
        </div>
      </div>
    </div>
  );
};
