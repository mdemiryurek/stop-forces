export interface StopSearchRecord {
    ageRange: string;
    outcome: string;
    involvedPerson: boolean;
    selfDefinedEthnicity: string;
    gender: string;
    legislation: string | null;
    outcomeLinkedToObjectOfSearch: boolean | null;
    datetime: string;
    removalOfMoreThanOuterClothing: boolean;
    outcomeObject: {
      id: string;
      name: string;
    };
    location: {
      latitude: string;
      street: {
        id: number;
        name: string;
      };
      longitude: string;
    } | null;
    operation: string | null;
    officerDefinedEthnicity: string | null;
    type: string;
    operationName: string | null;
    objectOfSearch: string;
  }
  
  export interface AvailableDatesResponse {
    dates: string[];
    total: number;
    latest: string;
    earliest: string;
  }
  
  export interface FilterOptions {
    dateRange: {
      start: Date | null;
      end: Date | null;
    };
    location: string[];
    searchType: string[];
  }
  
  export interface PaginationState {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
  }
  
  export interface ChartData {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }[];
  }
  
  export interface ApiResponse {
    data: StopSearchRecord[];
    error?: string;
    isLoading: boolean;
  } 