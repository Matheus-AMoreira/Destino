import AdminLayout from '@/layouts/AdminLayout';
import { Link } from '@inertiajs/react';
import {
    Hotel,
    Truck,
    MapPinned,
    Tag,
    Users,
    TrendingUp,
    ArrowUpRight
} from 'lucide-react';
import { useRoute } from 'ziggy-js';

interface Stats {
    hoteis: number;
    transportes: number;
    pacotes: number;
    ofertas: number;
    usuarios: number;
}

interface Activity {
    id: number;
    description: string;
    time: string;
    causer: string;
}

interface Props {
    stats: Stats;
    activities: Activity[];
}

export default function Dashboard({ stats, activities }: Props) {
    const route = useRoute();
    const cards = [
        { label: 'Pacotes Ativos', value: stats.pacotes, icon: MapPinned, color: 'text-blue-600', bg: 'bg-blue-100' },
        { label: 'Hotéis Parceiros', value: stats.hoteis, icon: Hotel, color: 'text-emerald-600', bg: 'bg-emerald-100' },
        { label: 'Transporte', value: stats.transportes, icon: Truck, color: 'text-purple-600', bg: 'bg-purple-100' },
        { label: 'Ofertas Ativas', value: stats.ofertas, icon: Tag, color: 'text-amber-600', bg: 'bg-amber-100' },
        { label: 'Usuários', value: stats.usuarios, icon: Users, color: 'text-rose-600', bg: 'bg-rose-100' },
    ];

    return (
        <AdminLayout title="Dashboard">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">Bem-vindo ao painel de gerenciamento do Destino.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {cards.map((card) => (
                    <div key={card.label} className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md">
                        <div className={`inline-flex rounded-xl ${card.bg} p-3 ${card.color} mb-4`}>
                            <card.icon size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">{card.label}</p>
                            <h3 className="mt-1 text-2xl font-bold text-gray-900">{card.value}</h3>
                        </div>
                        <div className="absolute top-4 right-4 text-gray-300 opacity-0 transition-opacity group-hover:opacity-100">
                            <ArrowUpRight size={20} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Atividade Recente</h3>
                        <TrendingUp className="text-gray-400" size={20} />
                    </div>
                    <div className="space-y-4">
                        {activities.length > 0 ? (
                            activities.map((activity) => (
                                <div key={activity.id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold uppercase">
                                        {activity.causer.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">
                                            <span className="font-bold">{activity.causer}</span> {activity.description}
                                        </p>
                                        <p className="text-xs text-gray-500">{activity.time}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-8 text-center text-gray-500">
                                <p>Nenhuma atividade registrada ainda.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="rounded-2xl bg-white p-8 shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="mb-4 rounded-full bg-blue-50 p-4 text-blue-600">
                        <TrendingUp size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Relatórios Detalhados</h3>
                    <p className="mt-2 text-gray-500">Visualize métricas avançadas e tendências de vendas em breve.</p>
                    <Link
                        href={route('administracao.dashboard.estatisticas')}
                        className="mt-6 rounded-xl bg-gray-900 px-6 py-2 text-sm font-bold text-white shadow-lg transition hover:bg-gray-800"
                    >
                        Ver Mais
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
}
