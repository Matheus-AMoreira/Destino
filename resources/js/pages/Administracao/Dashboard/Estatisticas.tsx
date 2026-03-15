import AdminLayout from '@/layouts/AdminLayout';
import { Head, router, Link } from '@inertiajs/react';
import { Chart, registerables } from 'chart.js';
import { 
    Calendar, 
    ChevronLeft, 
    TrendingUp, 
    BarChart3, 
    PieChart,
    ArrowUpRight,
    Users,
    Package
} from 'lucide-react';
import React, { useEffect, useRef, useMemo } from 'react';

Chart.register(...registerables);

interface DadoCompra {
    mes: number;
    status: string;
    total: number;
}

interface Props {
    dados: DadoCompra[];
    ano: number;
    anosDisponiveis: number[];
}

export default function Estatisticas({ dados, ano, anosDisponiveis }: Props) {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);

    const labels = [
        'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
        'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];

    const chartData = useMemo(() => {
        const datasets = {
            ACEITO: new Array(12).fill(0),
            PENDENTE: new Array(12).fill(0),
            RECUSADO: new Array(12).fill(0),
        };

        dados.forEach(d => {
            const status = d.status as keyof typeof datasets;
            if (datasets[status]) {
                datasets[status][d.mes - 1] = d.total;
            }
        });

        return {
            labels,
            datasets: [
                {
                    label: 'Concluídas',
                    data: datasets.ACEITO,
                    backgroundColor: '#10b981', // Emerald 500
                    borderRadius: 4,
                },
                {
                    label: 'Em Andamento',
                    data: datasets.PENDENTE,
                    backgroundColor: '#f59e0b', // Amber 500
                    borderRadius: 4,
                },
                {
                    label: 'Canceladas',
                    data: datasets.RECUSADO,
                    backgroundColor: '#ef4444', // Red 500
                    borderRadius: 4,
                },
            ],
        };
    }, [dados]);

    useEffect(() => {
        if (!chartRef.current) return;

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');
        if (!ctx) return;

        chartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end',
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'circle',
                            padding: 20,
                            font: { size: 12, family: 'Inter', weight: 'bold' }
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1f2937',
                        padding: 12,
                        titleFont: { size: 14, weight: 'bold' },
                        bodyFont: { size: 13 },
                        cornerRadius: 8,
                        displayColors: true,
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                        grid: { display: false },
                        ticks: { font: { weight: 'bold' } }
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true,
                        grid: { color: '#f3f4f6' },
                        ticks: { stepSize: 1 }
                    }
                }
            }
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [chartData]);

    const totalVendas = useMemo(() => dados.reduce((acc, curr) => acc + curr.total, 0), [dados]);
    const concluidas = useMemo(() => dados.filter(d => d.status === 'ACEITO').reduce((acc, curr) => acc + curr.total, 0), [dados]);
    const pendentes = useMemo(() => dados.filter(d => d.status === 'PENDENTE').reduce((acc, curr) => acc + curr.total, 0), [dados]);
    const canceladas = useMemo(() => dados.filter(d => d.status === 'RECUSADO').reduce((acc, curr) => acc + curr.total, 0), [dados]);

    return (
        <AdminLayout title="Estatísticas">
            <Head title="Estatísticas de Vendas" />
            
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                        <Link href={route('administracao.dashboard')} className="hover:underline flex items-center gap-1 text-sm font-bold">
                            <ChevronLeft size={16} />
                            Voltar ao Dashboard
                        </Link>
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Estatísticas de Vendas</h1>
                    <p className="text-gray-500 mt-1 font-medium">Acompanhe o desempenho das suas ofertas mês a mês.</p>
                </div>

                <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                    <Calendar size={18} className="text-gray-400 ml-2" />
                    <select 
                        value={ano} 
                        onChange={(e) => router.get(route('administracao.dashboard.estatisticas'), { ano: e.target.value })}
                        className="bg-transparent border-none focus:ring-0 font-bold text-gray-700 pr-8 cursor-pointer"
                    >
                        {anosDisponiveis.map(a => (
                            <option key={a} value={a}>{a}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <StatCard label="Total de Viagens" value={totalVendas} icon={BarChart3} color="blue" />
                <StatCard label="Concluídas" value={concluidas} icon={TrendingUp} color="emerald" />
                <StatCard label="Em Andamento" value={pendentes} icon={Users} color="amber" />
                <StatCard label="Canceladas" value={canceladas} icon={Package} color="rose" />
            </div>

            <div className="rounded-[32px] bg-white p-8 shadow-xl shadow-blue-50/50 border border-gray-100">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Volume de Viagens por Mês</h3>
                        <p className="text-sm text-gray-500 mt-1">Status das compras realizadas em {ano}</p>
                    </div>
                    <div className="flex items-center gap-4 hidden sm:flex">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                            <span className="text-xs font-bold text-gray-600">Concluído</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                            <span className="text-xs font-bold text-gray-600">Em Andamento</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-xs font-bold text-gray-600">Cancelado</span>
                        </div>
                    </div>
                </div>

                <div className="h-[400px] w-full">
                    {totalVendas > 0 ? (
                        <canvas ref={chartRef}></canvas>
                    ) : (
                        <div className="h-full w-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">
                            <PieChart size={48} className="mb-4 opacity-20" />
                            <p className="font-bold uppercase tracking-widest text-xs">Sem dados para este ano</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

function StatCard({ label, value, icon: Icon, color }: { label: string, value: number, icon: any, color: 'blue' | 'emerald' | 'amber' | 'rose' }) {
    const colors = {
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        amber: 'bg-amber-50 text-amber-600 border-amber-100',
        rose: 'bg-rose-50 text-rose-600 border-rose-100',
    };

    return (
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 group hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`rounded-xl p-2.5 ${colors[color]} border`}>
                    <Icon size={20} />
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight size={18} className="text-gray-300" />
                </div>
            </div>
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
                <h3 className="mt-1 text-2xl font-black text-gray-900 tracking-tight">{value}</h3>
            </div>
        </div>
    );
}
