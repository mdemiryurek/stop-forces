'use client';

import { ChartData, TooltipItem } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import ChartContainer from './ChartContainer';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

interface OutcomeChartProps {
  data: ChartData<'doughnut'>;
}

const OutcomeChart = ({ data }: OutcomeChartProps) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<'doughnut'>) => {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <ChartContainer 
      title="Stop and Search Outcomes" 
      description="Distribution of outcomes from stop and search operations"
    >
      <Doughnut data={data} options={options} />
    </ChartContainer>
  );
};

export default OutcomeChart; 