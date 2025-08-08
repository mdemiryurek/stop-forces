import { useState, useEffect, useMemo, useCallback } from 'react';
import { StopSearchRecord, FilterOptions, PaginationState } from '@/types';
import { fetchAllStopSearchData } from '@/utils/api';
import {
  filterData,
  paginateData,
  getSearchTypeValues,
  generateOutcomeChartData,
  generateMonthlyTrendChartData,
} from '@/utils/dataProcessing';

export const useStopSearchData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);
  const [allData, setAllData] = useState<StopSearchRecord[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: { start: null, end: null },
    location: [],
    searchType: [],
  });
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 20,
    totalItems: 0,
  });

  // Available filter options
  const availableOptions = useMemo(
    () => ({
      searchTypes: getSearchTypeValues(allData),
    }),
    [allData]
  );

  // Fetch data
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchAllStopSearchData();

      if (response.error) {
        setError(response.error);
      } else {
        setAllData(response.data);
        setLastUpdated(new Date());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Apply filters when data or filters change
  const filteredData = useMemo(() => {
    const filtered = filterData(allData, filters);
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
      totalItems: filtered.length,
    }));
    return filtered;
  }, [allData, filters]);

  // Get paginated data
  const paginatedData = useMemo(() => {
    return paginateData(
      filteredData,
      pagination.currentPage,
      pagination.itemsPerPage
    );
  }, [filteredData, pagination.currentPage, pagination.itemsPerPage]);

  // Generate chart data
  const chartData = useMemo(
    () => ({
      outcome: generateOutcomeChartData(filteredData),
      trend: generateMonthlyTrendChartData(filteredData),
    }),
    [filteredData]
  );

  // Handlers
  const handlePageChange = useCallback((page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  }, []);

  const handleItemsPerPageChange = useCallback((itemsPerPage: number) => {
    setPagination((prev) => ({
      ...prev,
      itemsPerPage,
      currentPage: 1,
    }));
  }, []);

  const handleFiltersChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setLastUpdated(new Date());
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    // State
    isLoading,
    lastUpdated,
    error,
    filters,
    pagination,
    availableOptions,
    
    // Data
    filteredData,
    paginatedData,
    chartData,
    
    // Handlers
    handlePageChange,
    handleItemsPerPageChange,
    handleFiltersChange,
    handleRefresh,
    fetchData,
  };
};
