import { NextRequest, NextResponse } from 'next/server';

// Environment variables
const POLICE_API_BASE_URL = process.env.POLICE_API_BASE_URL;
const REQUEST_TIMEOUT = 10000;

const validateDate = (date: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}$/; // YYYY-MM format
  return dateRegex.test(date);
};

const validateForce = (force: string): boolean => {
  return force.length > 0 && force.length <= 50; // Basic validation
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const force = searchParams.get('force');

  if (!date || !force) {
    return NextResponse.json(
      { 
        error: 'Missing required parameters', 
        required: ['date', 'force'],
        received: { date: !!date, force: !!force }
      },
      { status: 400 }
    );
  }

  if (!validateDate(date)) {
    return NextResponse.json(
      { error: 'Invalid date format. Expected YYYY-MM format' },
      { status: 400 }
    );
  }

  if (!validateForce(force)) {
    return NextResponse.json(
      { error: 'Invalid force parameter' },
      { status: 400 }
    );
  }

  try {
    const url = `${POLICE_API_BASE_URL}/stops-force?date=${encodeURIComponent(date)}&force=${encodeURIComponent(force)}`;

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

      if (response.status === 404) {
        return NextResponse.json(
          { error: 'No data found for the specified date and force' },
          { status: 404 }
        );
      }
      
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

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400', // 1 hour cache
      },
    });
  } catch (error) {
    console.error('Error proxying request to Police API:', error);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timeout. Please try again' },
          { status: 408 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to fetch data from Police API' },
      { status: 500 }
    );
  }
} 