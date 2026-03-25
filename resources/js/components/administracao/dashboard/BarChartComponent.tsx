import type { Dispatch } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

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
    setYear: Dispatch<React.SetStateAction<number>>;
    isLoading: boolean;
}

// Gera uma lista de anos a partir de 2020 até ano atual + 1
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
    return (
        <div className="rounded-lg border border-gray-200 bg-white shadow-md">
            <div className="flex justify-between border-b border-gray-200 p-6">
                <h2 className="flex items-center text-xl font-bold text-gray-900">
                    {title}
                </h2>
                <div className="flex-rol flex items-center gap-2">
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
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey={xAxisKey} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {bars.map((bar) => (
                                <Bar
                                    key={bar.key}
                                    dataKey={bar.key}
                                    name={bar.label}
                                    fill={bar.color}
                                    radius={[4, 4, 0, 0]}
                                />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
