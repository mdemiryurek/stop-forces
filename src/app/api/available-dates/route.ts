import { NextResponse } from 'next/server';

// Environment variables
const POLICE_API_BASE_URL = process.env.POLICE_API_BASE_URL;
const REQUEST_TIMEOUT = 10000;

interface PoliceApiResponse {
  date: string;
  'stop-and-search': string[];
}

interface AvailableDatesResponse {
  dates: string[];
  total: number;
  latest: string;
  earliest: string;
}

export async function GET() {
  try {
    const url = `${POLICE_API_BASE_URL}/crimes-street-dates`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Police API error: ${response.status}, body: ${errorText}`);

      if (response.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later' },
          { status: 429 }
        );
      }

      return NextResponse.json(
        { 
          error: `Police API error: ${response.status}`,
          details: errorText
        },
        { status: response.status }
      );
    }

    const data: PoliceApiResponse[] = await response.json();
    
    // Filter for dates where metropolitan is available
    const metropolitanDates = data
      .filter(item => item['stop-and-search'].includes('metropolitan'))
      .map(item => item.date)
      .sort((a, b) => b.localeCompare(a)); // Sort descending (latest first)

    if (metropolitanDates.length === 0) {
      return NextResponse.json(
        { error: 'No Metropolitan Police data available' },
        { status: 404 }
      );
    }

    const result: AvailableDatesResponse = {
      dates: metropolitanDates,
      total: metropolitanDates.length,
      latest: metropolitanDates[0],
      earliest: metropolitanDates[metropolitanDates.length - 1]
    };

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400', // 1 hour cache
      },
    });
  } catch (error) {
    console.error('Error fetching available dates from Police API:', error);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timeout. Please try again' },
          { status: 408 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to fetch available dates from Police API' },
      { status: 500 }
    );
  }
}
