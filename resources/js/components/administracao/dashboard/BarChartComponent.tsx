import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import type { Dispatch, SetStateAction } from 'react';

Chart.register(...registerables);

interface BarChartComponentProps {
    title: string;
    data: any[];
    xAxisKey: string;
    bars: {
        key: string;
        label: string;
        color: string;
    }[];
    year: number;
    setYear: Dispatch<SetStateAction<number>>;
    isLoading: boolean;
}

const currentYear = new Date().getFullYear() + 1;
const years = Array.from(
    { length: currentYear - 2020 + 1 },
    (_, i) => currentYear - i,
);

export const BarChartComponent: React.FC<BarChartComponentProps> = ({
    title,
    data,
    xAxisKey,
    bars,
    year,
    setYear,
}) => {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);

    useEffect(() => {
        if (chartRef.current) {
            chartInstance.current?.destroy();
            const ctx = chartRef.current.getContext('2d');

            if (ctx) {
                chartInstance.current = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: data.map(item => item[xAxisKey]),
                        datasets: bars.map(bar => ({
                            label: bar.label,
                            data: data.map(item => item[bar.key]),
                            backgroundColor: bar.color,
                            borderRadius: 4,
                        })),
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                            },
                        },
                    },
                });
            }
        }

        return () => {
            chartInstance.current?.destroy();
        };
    }, [data, bars, xAxisKey]);

    return (
        <div className="rounded-lg border border-gray-200 bg-white shadow-md">
            <div className="flex justify-between border-b border-gray-200 p-6">
                <h2 className="flex items-center text-xl font-bold text-gray-900">
                    {title}
                </h2>
                <div className="flex items-center gap-2">
                    <label className="font-medium text-gray-600">
                        Filtrar Ano:
                    </label>
                    <select
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="rounded-md border border-gray-300 bg-white p-2 text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        {years.map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="p-6">
                <div className="h-80 w-full">
                    <canvas ref={chartRef} />
                </div>
            </div>
        </div>
    );
};
