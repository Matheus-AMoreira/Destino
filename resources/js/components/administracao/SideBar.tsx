import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    MapPinned,
    Camera,
    Hotel,
    Truck,
    Users,
    ChevronDown,
    Tag,
} from 'lucide-react';
import { useState } from 'react';
import Image from '@/components/Image';

export default function Sidebar() {
    const { url } = usePage();
    const [isAdminOpen, setIsAdminOpen] = useState(true);

    const isActive = (path: string) => {
        if (path === '/administracao/dashboard') {
            return url === path;
        }

        return url === path || url.startsWith(`${path}/`);
    };

    const linkClass = (path: string, isSubItem = false) => `
        flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors mb-1
        ${isSubItem ? 'text-sm pl-8' : ''}
        ${
            isActive(path)
                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                : 'text-gray-700 hover:bg-gray-100'
        }
    `;

    return (
        <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col bg-white shadow-lg">
            <div className="flex justify-center border-b border-gray-200 p-6">
                <Link href="/">
                    <Image
                        name={'logo_cor'}
                        alt={'Paula viagens logo'}
                        style="max-h-full max-w-full rounded-xl object-contain p-2"
                    />
                </Link>
            </div>

            <nav className="flex-1 overflow-y-auto p-4">
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
                            className="flex w-full items-center justify-between rounded-lg px-4 py-2 font-bold text-gray-800 hover:bg-gray-50"
                        >
                            <span className="text-xs tracking-wider uppercase">
                                Opções
                            </span>
                            <ChevronDown
                                size={16}
                                className={`transform transition-transform ${isAdminOpen ? 'rotate-180' : ''}`}
                            />
                        </button>

                        {isAdminOpen && (
                            <div className="mt-1 space-y-1">
                                <Link
                                    href="/administracao/pacote/listar"
                                    className={linkClass(
                                        '/administracao/pacote',
                                        true,
                                    )}
                                >
                                    <MapPinned size={18} />
                                    <span>Pacotes de Viagem</span>
                                </Link>
                                <Link
                                    href="/administracao/pacotedefoto/listar"
                                    className={linkClass(
                                        '/administracao/pacotedefoto',
                                        true,
                                    )}
                                >
                                    <Camera size={18} />
                                    <span>Pacotes de Fotos</span>
                                </Link>

                                <Link
                                    href="/administracao/hotel/listar"
                                    className={linkClass(
                                        '/administracao/hotel',
                                        true,
                                    )}
                                >
                                    <Hotel size={18} />
                                    <span>Hotéis</span>
                                </Link>

                                <Link
                                    href="/administracao/transporte/listar"
                                    className={linkClass(
                                        '/administracao/transporte',
                                        true,
                                    )}
                                >
                                    <Truck size={18} />
                                    <span>Transporte</span>
                                </Link>
                                <Link
                                    href="/administracao/oferta/listar"
                                    className={linkClass(
                                        '/administracao/oferta',
                                        true,
                                    )}
                                >
                                    <Tag size={18} />
                                    <span>Ofertas</span>
                                </Link>
                                <Link
                                    href="/administracao/usuario/listar"
                                    className={linkClass(
                                        '/administracao/usuario',
                                        true,
                                    )}
                                >
                                    <Users size={18} />
                                    <span>Usuários</span>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <div className="border-t p-4 text-center text-xs text-gray-400">
                Versão 2.0.0
            </div>
        </aside>
    );
}
