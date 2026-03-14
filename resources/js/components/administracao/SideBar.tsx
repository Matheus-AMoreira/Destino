import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    MapPinned, 
    Camera, 
    Hotel, 
    Truck, 
    Users, 
    ChevronDown,
    Map
} from 'lucide-react';
import { useState } from 'react';

export default function Sidebar() {
    const { url } = usePage();
    const [isAdminOpen, setIsAdminOpen] = useState(true);

    const isActive = (path: string) => url.startsWith(path);

    const linkClass = (path: string, isSubItem = false) => `
        flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors mb-1
        ${isSubItem ? 'text-sm pl-8' : ''}
        ${isActive(path)
            ? 'bg-blue-50 text-blue-600 border border-blue-200'
            : 'text-gray-700 hover:bg-gray-100'
        }
    `;

    return (
        <aside className="sticky top-0 h-screen w-64 shrink-0 flex flex-col bg-white shadow-lg">
            <div className="p-6 border-b border-gray-200 flex justify-center">
                <Link href="/">
                    <img
                        src="/iconcor.png"
                        alt="Logo"
                        className="h-12 w-auto object-contain cursor-pointer"
                    />
                </Link>
            </div>

            <nav className="p-4 flex-1 overflow-y-auto">
                <div className="space-y-1">
                    <Link
                        href="/administracao/dashboard"
                        className={linkClass('/administracao/dashboard')}
                    >
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>

                    <div>
                        <button
                            onClick={() => setIsAdminOpen(!isAdminOpen)}
                            className="w-full flex items-center justify-between px-4 py-2 rounded-lg font-bold text-gray-800 hover:bg-gray-50"
                        >
                            <span className="text-xs uppercase tracking-wider">Opções</span>
                            <ChevronDown 
                                size={16} 
                                className={`transform transition-transform ${isAdminOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {isAdminOpen && (
                            <div className="mt-1 space-y-1">
                                <Link
                                    href="/administracao/pacote/listar"
                                    className={linkClass('/administracao/pacote', true)}
                                >
                                    <MapPinned size={18} />
                                    <span>Pacotes de Viagem</span>
                                </Link>
                                <Link
                                    href="/administracao/pacotedefoto/listar"
                                    className={linkClass('/administracao/pacotedefoto', true)}
                                >
                                    <Camera size={18} />
                                    <span>Pacotes de Fotos</span>
                                </Link>

                                <Link
                                    href="/administracao/hotel/listar"
                                    className={linkClass('/administracao/hotel', true)}
                                >
                                    <Hotel size={18} />
                                    <span>Hotéis</span>
                                </Link>

                                <Link
                                    href="/administracao/transporte/listar"
                                    className={linkClass('/administracao/transporte', true)}
                                >
                                    <Truck size={18} />
                                    <span>Transporte</span>
                                </Link>
                                <Link
                                    href="/administracao/usuario/listar"
                                    className={linkClass('/administracao/usuario', true)}
                                >
                                    <Users size={18} />
                                    <span>Usuários</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <div className="p-4 border-t text-xs text-gray-400 text-center">
                Versão 2.0.0
            </div>
        </aside>
    );
}
