"use client";

import { useState } from "react";
import styles from "./page.module.scss";
import Header from "@/components/Header";
import DataTable from "@/components/DataTable";
import OutcomeChart from "@/components/charts/OutcomeChart";
import TrendChart from "@/components/charts/TrendChart";
import FilterPanel from "@/components/FilterPanel";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { StatsHeader } from "@/components/StatsHeader";
import { useStopSearchData } from "@/hooks";
import { FilterOptions } from "@/types";

export default function Home() {
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  
  const {
    isLoading,
    error,
    filters,
    pagination,
    availableOptions,
    filteredData,
    paginatedData,
    chartData,
    handlePageChange,
    handleItemsPerPageChange,
    handleFiltersChange,
    handleRefresh,
  } = useStopSearchData();

  const handleFilter = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  };

  const handleFiltersChangeWithClose = (newFilters: FilterOptions) => {
    handleFiltersChange(newFilters);
    setIsFilterPanelOpen(false);
  };

  if (isLoading && filteredData.length === 0) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={handleRefresh} />;
  }

  return (
    <div className={styles.dashboard}>
      <Header />

      <StatsHeader 
        filteredData={filteredData} 
        filters={filters} 
        onFilterClick={handleFilter}
        isLoading={isLoading}
      />

      <div className={styles["dashboard-content"]}>
        <FilterPanel
          filters={filters}
          onFiltersChange={handleFiltersChangeWithClose}
          availableOptions={availableOptions}
          isOpen={isFilterPanelOpen}
          onToggle={() => setIsFilterPanelOpen(false)}
        />

        <div className={styles["charts-grid"]}>
          <OutcomeChart data={chartData.outcome} />
          <TrendChart data={chartData.trend} />
        </div>

        <div className={styles["data-section"]}>
          <div className={styles["section-header"]}>
            <h2>Search Records</h2>
          </div>
          <DataTable
            data={paginatedData}
            pagination={pagination}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      </div>
    </div>
  );
}
