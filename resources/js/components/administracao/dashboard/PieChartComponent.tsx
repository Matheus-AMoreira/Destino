import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

interface PieChartComponentProps {
  title: string;
  data: ChartData[];
  colors: string[];
}

export const PieChartComponent: React.FC<PieChartComponentProps> = ({
  title,
  data,
  colors,
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const total = data.reduce((acc, item) => acc + item.value, 0);

  useEffect(() => {
    if (chartRef.current) {
      chartInstance.current?.destroy();
      const ctx = chartRef.current.getContext('2d');

      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: data.map(item => item.name),
            datasets: [{
              data: data.map(item => item.value),
              backgroundColor: colors,
              borderWidth: 1,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const label = context.label || '';
                    const value = context.parsed || 0;
                    const percentage = total > 0 ? ((value / total) * 100).toFixed(0) : 0;
                    return `${label}: ${value} (${percentage}%)`;
                  }
                }
              }
            },
          },
        });
      }
    }

    return () => {
      chartInstance.current?.destroy();
    };
  }, [data, colors, total]);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      </div>
      <div className="p-6">
        <div className="h-80 w-full flex flex-col">
          <h3 className="font-bold mb-4">Total: {total}</h3>
          <div className="flex-1 min-h-0">
            <canvas ref={chartRef} />
          </div>
        </div>
      </div>
    </div>
  );
};
