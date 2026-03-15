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
    Package,
    MapPin,
    Globe,
    Building2,
    Filter,
} from 'lucide-react';
import React, { useEffect, useRef, useMemo, useState } from 'react';

Chart.register(...registerables);

interface DadoCompra {
    mes: number;
    status: string;
    total: number;
}

interface DestinoPopular {
    cidade: string;
    estado: string;
    total: number;
}

interface UserCrescimento {
    ano: number;
    total: number;
}

interface Regiao {
    id: string;
    nome: string;
}

interface Estado {
    id: string;
    sigla: string;
    nome: string;
    regiao_id: string;
}

interface Props {
    dados: DadoCompra[];
    destinosPopulares: DestinoPopular[];
    crescimentoUsuarios: UserCrescimento[];
    ano: number;
    anosDisponiveis: number[];
    regioes: Regiao[];
    estados: Estado[];
    filtros: {
        regiao_id: string | null;
        estado_id: string | null;
    };
}

type TabType = 'vendas' | 'destinos' | 'usuarios';

export default function Estatisticas({
    dados,
    destinosPopulares,
    crescimentoUsuarios,
    ano,
    anosDisponiveis,
    regioes,
    estados,
    filtros,
}: Props) {
    const [activeTab, setActiveTab] = useState<TabType>('vendas');
    const chartRef = useRef<HTMLCanvasElement>(null);
    const destinosChartRef = useRef<HTMLCanvasElement>(null);
    const usersChartRef = useRef<HTMLCanvasElement>(null);

    const chartInstance = useRef<Chart | null>(null);
    const destinosChartInstance = useRef<Chart | null>(null);
    const usersChartInstance = useRef<Chart | null>(null);

    const labels = [
        'Jan',
        'Fev',
        'Mar',
        'Abr',
        'Mai',
        'Jun',
        'Jul',
        'Ago',
        'Set',
        'Out',
        'Nov',
        'Dez',
    ];

    const chartData = useMemo(() => {
        const datasets = {
            ACEITO: new Array(12).fill(0),
            PENDENTE: new Array(12).fill(0),
            RECUSADO: new Array(12).fill(0),
        };

        dados.forEach((d) => {
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

    const destinosChartData = useMemo(() => {
        return {
            labels: destinosPopulares.map((d) => `${d.cidade} (${d.estado})`),
            datasets: [
                {
                    label: 'Viagens',
                    data: destinosPopulares.map((d) => d.total),
                    backgroundColor: '#3b82f6', // Blue 500
                    borderRadius: 8,
                    barThickness: 32,
                },
            ],
        };
    }, [destinosPopulares]);

    const usersChartData = useMemo(() => {
        return {
            labels: crescimentoUsuarios.map((u) => u.ano.toString()),
            datasets: [
                {
                    label: 'Usuários Cadastrados',
                    data: crescimentoUsuarios.map((u) => u.total),
                    backgroundColor: '#8b5cf6', // Violet 500
                    borderRadius: 8,
                    barThickness: 48,
                },
            ],
        };
    }, [crescimentoUsuarios]);

    useEffect(() => {
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1f2937',
                    padding: 12,
                    cornerRadius: 8,
                },
            },
            scales: {
                x: { grid: { display: false } },
                y: {
                    beginAtZero: true,
                    grid: { color: '#f3f4f6' },
                    ticks: { stepSize: 1 },
                },
            },
        };

        if (activeTab === 'vendas' && chartRef.current) {
            chartInstance.current?.destroy();
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                chartInstance.current = new Chart(ctx, {
                    type: 'bar',
                    data: chartData,
                    options: {
                        ...chartOptions,
                        scales: {
                            ...chartOptions.scales,
                            x: { ...chartOptions.scales.x, stacked: true },
                            y: { ...chartOptions.scales.y, stacked: true },
                        },
                    },
                });
            }
        }

        if (activeTab === 'destinos' && destinosChartRef.current) {
            destinosChartInstance.current?.destroy();
            const ctx = destinosChartRef.current.getContext('2d');
            if (ctx) {
                destinosChartInstance.current = new Chart(ctx, {
                    type: 'bar',
                    data: destinosChartData,
                    options: chartOptions,
                });
            }
        }

        if (activeTab === 'usuarios' && usersChartRef.current) {
            usersChartInstance.current?.destroy();
            const ctx = usersChartRef.current.getContext('2d');
            if (ctx) {
                usersChartInstance.current = new Chart(ctx, {
                    type: 'bar',
                    data: usersChartData,
                    options: chartOptions,
                });
            }
        }

        return () => {
            chartInstance.current?.destroy();
            destinosChartInstance.current?.destroy();
            usersChartInstance.current?.destroy();
        };
    }, [activeTab, chartData, destinosChartData, usersChartData]);

    const totalVendas = useMemo(
        () => dados.reduce((acc, curr) => acc + curr.total, 0),
        [dados],
    );

    const handleFilterChange = (key: string, value: any) => {
        router.get(
            route('administracao.dashboard.estatisticas'),
            {
                ...filtros,
                ano,
                [key]: value,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const estadosFiltrados = useMemo(() => {
        if (!filtros.regiao_id) return estados;
        return estados.filter((e) => e.regiao_id === filtros.regiao_id);
    }, [estados, filtros.regiao_id]);

    return (
        <AdminLayout title="Estatísticas">
            <Head title="Estatísticas de Vendas" />

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-2 text-blue-600">
                        <Link
                            href={route('administracao.dashboard')}
                            className="flex items-center gap-1 text-sm font-bold hover:underline"
                        >
                            <ChevronLeft size={16} />
                            Voltar ao Dashboard
                        </Link>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-gray-900">
                        Estatísticas do Sistema
                    </h1>
                    <p className="mt-1 font-medium text-gray-500">
                        Análise detalhada de vendas, destinos e usuários.
                    </p>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
                    <Calendar size={18} className="ml-2 text-gray-400" />
                    <select
                        value={ano}
                        onChange={(e) =>
                            handleFilterChange('ano', e.target.value)
                        }
                        className="cursor-pointer border-none bg-transparent pr-8 font-bold text-gray-700 focus:ring-0"
                    >
                        {anosDisponiveis.map((a) => (
                            <option key={a} value={a}>
                                {a}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Browser-like Tabs */}
            <div className="mb-0 ml-4 flex w-fit items-center gap-1 rounded-t-3xl border-x border-t border-gray-200 bg-gray-100/50 p-1.5">
                <TabButton 
                    active={activeTab === 'vendas'} 
                    onClick={() => setActiveTab('vendas')} 
                    icon={TrendingUp} 
                    label="Vendas" 
                />
                <TabButton 
                    active={activeTab === 'destinos'} 
                    onClick={() => setActiveTab('destinos')} 
                    icon={MapPin} 
                    label="Destinos" 
                />
                <TabButton 
                    active={activeTab === 'usuarios'} 
                    onClick={() => setActiveTab('usuarios')} 
                    icon={Users} 
                    label="Usuários" 
                />
            </div>

            <div className="relative z-10 mb-8 rounded-tr-[40px] rounded-b-[40px] border border-gray-200 bg-white p-8 shadow-2xl shadow-blue-100/50 transition-all">
                {activeTab === 'vendas' && (
                    <div>
                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    Histórico Mensal de Vendas
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Status das compras realizadas em {ano}
                                </p>
                            </div>
                            <div className="flex items-center gap-4 sm:flex">
                                <LegendItem color="bg-emerald-500" label="Concluído" />
                                <LegendItem color="bg-amber-500" label="Em Andamento" />
                                <LegendItem color="bg-red-500" label="Cancelado" />
                            </div>
                        </div>

                        <div className="h-112.5 w-full">
                            {totalVendas > 0 ? (
                                <canvas ref={chartRef}></canvas>
                            ) : (
                                <EmptyState icon={BarChart3} message="Sem vendas registradas neste ano" />
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'destinos' && (
                    <div>
                        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">
                                    Destinos Mais Procurados
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Top cidades com vendas aprovadas
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <FilterSelect 
                                    icon={Globe} 
                                    value={filtros.regiao_id || ''} 
                                    onChange={(v) => handleFilterChange('regiao_id', v)}
                                    options={regioes.map(r => ({ value: r.id, label: r.nome }))}
                                    placeholder="Todas as Regiões"
                                />
                                <FilterSelect 
                                    icon={Building2} 
                                    value={filtros.estado_id || ''} 
                                    onChange={(v) => handleFilterChange('estado_id', v)}
                                    options={estadosFiltrados.map(e => ({ value: e.id, label: e.nome }))}
                                    placeholder="Todos os Estados"
                                />
                            </div>
                        </div>

                        <div className="h-112.5 w-full">
                            {destinosPopulares.length > 0 ? (
                                <canvas ref={destinosChartRef}></canvas>
                            ) : (
                                <EmptyState icon={MapPin} message="Nenhum destino encontrado" />
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'usuarios' && (
                    <div>
                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-gray-900">
                                Evolução de Usuários Cadastrados
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Crescimento da base de usuários ao longo do tempo
                            </p>
                        </div>

                        <div className="h-112.5 w-full">
                            {crescimentoUsuarios.length > 0 ? (
                                <canvas ref={usersChartRef}></canvas>
                            ) : (
                                <EmptyState icon={Users} message="Dados de usuários indisponíveis" />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 rounded-2xl px-6 py-2.5 text-sm font-bold transition-all ${
                active
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:bg-gray-200/50 hover:text-gray-700'
            }`}
        >
            <Icon size={18} />
            {label}
        </button>
    );
}

function FilterSelect({ icon: Icon, value, onChange, options, placeholder }: { icon: any, value: string, onChange: (v: string) => void, options: { value: string, label: string }[], placeholder: string }) {
    return (
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 p-1.5">
            <Icon size={16} className="ml-2 text-gray-400" />
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="cursor-pointer border-none bg-transparent pr-8 text-xs font-bold text-gray-600 focus:ring-0"
            >
                <option value="">{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

function LegendItem({ color, label }: { color: string; label: string }) {
    return (
        <div className="flex items-center gap-1.5">
            <div className={`h-3 w-3 rounded-full ${color}`}></div>
            <span className="text-xs font-bold tracking-tight text-gray-600 uppercase">
                {label}
            </span>
        </div>
    );
}

function EmptyState({ icon: Icon, message }: { icon: any; message: string }) {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center rounded-[32px] border-2 border-dashed border-gray-100 bg-gray-50/30 text-gray-400">
            <Icon size={48} className="mb-4 opacity-20" />
            <p className="text-[10px] font-bold tracking-widest uppercase">
                {message}
            </p>
        </div>
    );
}
