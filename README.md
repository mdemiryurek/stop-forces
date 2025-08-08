# Stop Forces Dashboard

A comprehensive data visualization and analysis dashboard for police stop and search data from the UK Police Service. This application provides real-time insights into stop and search activities with interactive filtering, pagination, and data visualization capabilities.

## Description

The Stop Forces Dashboard is a Next.js application that shows and visualizes police stop and search data from the UK Police Data API. The application provides:

- Real-time data visualization with interactive charts
- Advanced filtering capabilities by date range, location, and search type
- Responsive data table with pagination and sorting
- ARIA labels and keyboard navigation support


## Tech Stack

### Frontend
- **Next.js 15.4.5** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5** - Type safety and development experience
- **Sass/SCSS** - Advanced CSS preprocessing
- **Chart.js 4.4.1** - Data visualization library
- **React Chart.js 2** - React wrapper for Chart.js
- **Lucide React** - Icon library

### Development Tools
- **ESLint** - Code linting and formatting
- **Turbopack** - Fast bundler for development
- **TypeScript** - Static type checking

### Deployment
- **Vercel** - Hosting and deployment platform
- **Next.js API Routes** - Backend API endpoints

## API Management

### Error Handling
The application implements comprehensive error handling at multiple levels:
```typescript
// API Route Error Handling
export async function GET(request: NextRequest) {
  try {
    // Validate parameters
    if (!date || !force) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Handle API errors
    if (!response.ok) {
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
    }
  } catch (error) {
    // Handle network errors and timeouts
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timeout. Please try again' },
        { status: 408 }
      );
    }
  }
}
```

### Data Caching
- **HTTP Caching**: API routes implement cache headers for 1-hour caching
- **Client-side Caching**: Data is cached in React state to prevent unnecessary re-fetches
- **Stale-while-revalidate**: Implements SWR pattern for optimal performance

### Data Validation
- **Input Validation**: Date format and force parameter validation
- **Data Sanitization**: Clean and validate API responses
- **Type Safety**: TypeScript interfaces ensure data consistency


## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mdemiryurek/stop-forces.git
   cd stop-forces
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   POLICE_API_BASE_URL=https://data.police.uk/api
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality


## API Endpoints

### `/api/stops-force`
- **Method**: GET
- **Parameters**: `date` (YYYY-MM), `force` (police force)
- **Response**: Array of stop and search records
- **Caching**: 1 hour with stale-while-revalidate

### `/api/available-dates`
- **Method**: GET
- **Response**: Available date ranges for data
- **Purpose**: Determine available data periods

### `/api/health`
- **Method**: GET
- **Response**: Application health status
- **Purpose**: Health monitoring

## Deployment

The application is deployed on Vercel and can be accessed at:
**https://stop-forces.vercel.app**