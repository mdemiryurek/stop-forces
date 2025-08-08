import { StopSearchRecord, FilterOptions, ChartData } from '@/types';
import { format, parseISO, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

export const paginateData = (data: StopSearchRecord[], page: number, itemsPerPage: number): StopSearchRecord[] => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
};

export const filterData = (data: StopSearchRecord[], filters: FilterOptions): StopSearchRecord[] => {
  return data.filter(record => {
    const recordDate = parseISO(record.datetime);
    
    if (filters.dateRange.start && filters.dateRange.end) {
      const startDate = startOfDay(filters.dateRange.start);
      const endDate = endOfDay(filters.dateRange.end);
      
      if (!isWithinInterval(recordDate, { start: startDate, end: endDate })) {
        return false;
      }
    }
    
    if (filters.location.length > 0) {
      const searchLocation = filters.location[0].toLowerCase().trim();
      const recordLocation = record.location?.street?.name?.toLowerCase() || '';
      
      if (!recordLocation.includes(searchLocation)) {
        return false;
      }
    }
    
    if (filters.searchType.length > 0 && !filters.searchType.includes(record.type)) {
      return false;
    }
    
    return true;
  });
};

export const getUniqueValues = (data: StopSearchRecord[], field: keyof StopSearchRecord): string[] => {
  const values = data.map(record => record[field] as string).filter(Boolean);
  return [...new Set(values)].sort();
};

export const getSearchTypeValues = (data: StopSearchRecord[]): string[] => {
  return getUniqueValues(data, 'type');
};

export const generateOutcomeChartData = (data: StopSearchRecord[]): ChartData => {
  const outcomeCounts = data.reduce((acc, record) => {
    acc[record.outcome] = (acc[record.outcome] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ];

  return {
    labels: Object.keys(outcomeCounts),
    datasets: [{
      label: 'Number of Searches',
      data: Object.values(outcomeCounts),
      backgroundColor: colors.slice(0, Object.keys(outcomeCounts).length),
      borderColor: colors.slice(0, Object.keys(outcomeCounts).length),
      borderWidth: 1
    }]
  };
};

export const generateMonthlyTrendChartData = (data: StopSearchRecord[]): ChartData => {
  const monthlyCounts = data.reduce((acc, record) => {
    const month = format(parseISO(record.datetime), 'yyyy-MM');
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Only include months that have actual data
  const monthsWithData = Object.keys(monthlyCounts).sort();
  
  return {
    labels: monthsWithData.map(month => format(parseISO(`${month}-01`), 'MMM yyyy')),
    datasets: [{
      label: 'Searches per Month',
      data: monthsWithData.map(month => monthlyCounts[month]),
      backgroundColor: ['rgba(59, 130, 246, 0.2)'],
      borderColor: ['#3B82F6'],
      borderWidth: 2
    }]
  };
};