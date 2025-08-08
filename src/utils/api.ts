import { StopSearchRecord, ApiResponse, AvailableDatesResponse } from "@/types";
import { convertApiRecord, delay } from "./helpers";

const BASE_URL = "/api/stops-force";
const FORCE = "metropolitan";

export const generateDateRange = async (): Promise<string[]> => {
  try {
    const availableDates = await fetchAvailableDates();
    
    if (!availableDates || availableDates.dates.length === 0) {
      console.warn('No available dates found from API');
      return [];
    }
    
    const last12Months = availableDates.dates.slice(0, 12);
    
    return last12Months;
  } catch (error) {
    console.error('Error fetching available dates:', error);
    return [];
  }
};

export const fetchStopSearchData = async (
  date: string
): Promise<StopSearchRecord[]> => {
  try {
    const url = `${BASE_URL}?date=${date}&force=${FORCE}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Police API error for ${date}: ${response.status} - ${errorText}`);
      return [];
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.warn(`Police API returned invalid data format for ${date}: expected array, got ${typeof data}`);
      return [];
    }

    const filteredData = data.filter((record: unknown) => {
      return (
        record &&
        typeof record === "object" &&
        record !== null &&
        "datetime" in record &&
        "outcome" in record
      );
    });

    const convertedData = filteredData.map(convertApiRecord);

    return convertedData;
  } catch (error) {
    console.warn(`Police API request failed for ${date}:`, error);
    return [];
  }
};

export const fetchAllStopSearchData = async (): Promise<ApiResponse> => {
  const dates = await generateDateRange();
  let error: string | undefined;

  if (dates.length === 0) {
    return {
      data: [],
      error: 'No available dates found',
      isLoading: false,
    };
  }

  try {
    const allData: StopSearchRecord[] = [];
    
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      
      try {
        const data = await fetchStopSearchData(date);
        allData.push(...data);
        
        if (i < dates.length - 1) {
          await delay(500);
        }
      } catch (err) {
        console.error(`Failed to fetch data for ${date}:`, err);
      }
    }

    return {
      data: allData,
      isLoading: false,
    };
  } catch (err) {
    error = err instanceof Error ? err.message : "An unknown error occurred";
    return {
      data: [],
      error,
      isLoading: false,
    };
  }
};

export const fetchAvailableDates = async (): Promise<AvailableDatesResponse | null> => {
  try {
    const response = await fetch('/api/available-dates', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Available dates API error: ${response.status} - ${errorText}`);
      return null;
    }

    const data: AvailableDatesResponse = await response.json();
    
    return data;
  } catch (error) {
    console.error('Error fetching available dates:', error);
    return null;
  }
};
