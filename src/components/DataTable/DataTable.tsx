'use client';

import { useState } from 'react';
import { StopSearchRecord, PaginationState } from '@/types';
import { format, parseISO } from 'date-fns';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from './DataTable.module.scss';

interface DataTableProps {
  data: StopSearchRecord[];
  pagination: PaginationState;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

type SortField = keyof StopSearchRecord;
type SortOrder = 'asc' | 'desc';

const DataTable = ({ data, pagination, onPageChange }: DataTableProps) => {
  const [sortField, setSortField] = useState<SortField>('datetime');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue === null && bValue === null) return 0;
    if (aValue === null) return 1;
    if (bValue === null) return -1;
    
    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const totalPages = Math.ceil(pagination.totalItems / pagination.itemsPerPage);

  const getPageRange = () => {
    const maxVisiblePages = 5;
    const currentPage = pagination.currentPage;
    
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const pageRange = getPageRange();

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ChevronUp className="w-4 h-4" />;
    }
    return sortOrder === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  const getOutcomeBadgeClass = (outcome: string) => {
    if (outcome.includes('Arrest')) return styles['badge-red'];
    if (outcome.includes('Community')) return styles['badge-yellow'];
    if (outcome.includes('No further action')) return styles['badge-green'];
    return styles['badge-gray'];
  };

  return (
    <div className={styles['data-table']}>
      <div className={styles['table-container']}>
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('datetime')}>
                <div className="flex items-center gap-sm">
                  Date & Time
                  <SortIcon field="datetime" />
                </div>
              </th>
              <th onClick={() => handleSort('ageRange')}>
                <div className="flex items-center gap-sm">
                  Age Range
                  <SortIcon field="ageRange" />
                </div>
              </th>
              <th onClick={() => handleSort('gender')}>
                <div className="flex items-center gap-sm">
                  Gender
                  <SortIcon field="gender" />
                </div>
              </th>
              <th onClick={() => handleSort('selfDefinedEthnicity')}>
                <div className="flex items-center gap-sm">
                  Ethnicity
                  <SortIcon field="selfDefinedEthnicity" />
                </div>
              </th>
              <th onClick={() => handleSort('type')}>
                <div className="flex items-center gap-sm">
                  Search Type
                  <SortIcon field="type" />
                </div>
              </th>
              <th onClick={() => handleSort('outcome')}>
                <div className="flex items-center gap-sm">
                  Outcome
                  <SortIcon field="outcome" />
                </div>
              </th>
              <th onClick={() => handleSort('objectOfSearch')}>
                <div className="flex items-center gap-sm">
                  Object of Search
                  <SortIcon field="objectOfSearch" />
                </div>
              </th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((record, index) => (
              <tr key={`${record.datetime}-${index}`}>
                <td>
                  {format(parseISO(record.datetime), 'dd/MM/yyyy HH:mm')}
                </td>
                <td>{record.ageRange || 'Not specified'}</td>
                <td>{record.gender || 'Not specified'}</td>
                <td>
                  <div className={styles['truncate']} title={record.selfDefinedEthnicity || 'Not specified'}>
                    {record.selfDefinedEthnicity || 'Not specified'}
                  </div>
                </td>
                <td>{record.type || 'Not specified'}</td>
                <td>
                  <span className={`${styles.badge} ${getOutcomeBadgeClass(record.outcome)}`}>
                    {record.outcome || 'Not specified'}
                  </span>
                </td>
                <td>
                  <div className={styles['truncate']} title={record.objectOfSearch || 'Not specified'}>
                    {record.objectOfSearch || 'Not specified'}
                  </div>
                </td>
                <td>
                  <div title={record.location ? `${record.location.street.name} (${record.location.latitude}, ${record.location.longitude})` : 'No location data'}>
                    {record.location?.street.name || 'No location data'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles['pagination']}>
        <div className={styles['pagination-info']} id="pagination-info">
          <p>
            Showing{' '}
            <span className="font-medium">
              {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}
            </span>
            {' '}to{' '}
            <span className="font-medium">
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
            </span>
            {' '}of{' '}
            <span className="font-medium">{pagination.totalItems}</span>
            {' '}results
          </p>
        </div>
        <nav className={styles['pagination-controls']} aria-label="Pagination navigation">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            aria-label={`Go to previous page, page ${pagination.currentPage - 1}`}
            aria-describedby="pagination-info"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          
          {pageRange[0] > 1 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(1)}
                aria-label="Go to page 1"
                aria-describedby="pagination-info"
              >
                1
              </Button>
              {pageRange[0] > 2 && (
                <span className="p-sm text-center text-sm text-gray-700" aria-hidden="true">...</span>
              )}
            </>
          )}
          
          {pageRange.map((page) => (
            <Button
              key={page}
              variant={page === pagination.currentPage ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onPageChange(page)}
              className={page === pagination.currentPage ? 'active' : ''}
              aria-label={`Go to page ${page}`}
              aria-describedby="pagination-info"
              aria-current={page === pagination.currentPage ? 'page' : undefined}
            >
              {page}
            </Button>
          ))}
          
          {pageRange[pageRange.length - 1] < totalPages && (
            <>
              {pageRange[pageRange.length - 1] < totalPages - 1 && (
                <span className="p-sm text-center text-sm text-gray-700" aria-hidden="true">...</span>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(totalPages)}
                aria-label={`Go to page ${totalPages}`}
                aria-describedby="pagination-info"
              >
                {totalPages}
              </Button>
            </>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === totalPages}
            aria-label={`Go to next page, page ${pagination.currentPage + 1}`}
            aria-describedby="pagination-info"
          >
            <ChevronRight className="w-4 h-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </nav>
      </div>
    </div>
  );
};

DataTable.displayName = 'DataTable';
export default DataTable; 