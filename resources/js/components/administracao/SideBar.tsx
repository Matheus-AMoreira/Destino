import { Link, usePage } from '@inertiajs/react';
import {
    Camera,
    ChevronDown,
    Hotel,
    LayoutDashboard,
    MapPinned,
    Tag,
    Truck,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { dashboard } from '@/routes/administracao';
import { index as indexPacote } from '@/routes/administracao/pacote';
import { index as indexPacoteFoto } from '@/routes/administracao/pacote-foto';
import { index as indexHotel } from '@/routes/administracao/hotel';
import { index as indexTransporte } from '@/routes/administracao/transporte';
import { index as indexOferta } from '@/routes/administracao/oferta';
import { index as indexUsuario } from '@/routes/administracao/usuario';
import Image from '@/components/Image';

export default function Sidebar() {
    const { url } = usePage();
    const [isAdminOpen, setIsAdminOpen] = useState(true);

    const isActive = (path: string) => {
        // Strip query parameters for matching
        const cleanUrl = url.split('?')[0];
        const cleanPath = path.split('?')[0];

        // We match if the path is exactly the URL, or if URL represents a subpage of this domain (e.g. /administracao/hotel/novo is subpage of /administracao/hotel)
        // Wait, for subpages, we should check parent paths. E.g. /administracao/hotel/listar -> /administracao/hotel
        const getParentPath = (p: string) => {
            const parts = p.split('/');
            if (parts.length > 3) {
                return parts.slice(0, 3).join('/'); // /administracao/hotel
            }
            return p;
        };

        const parentUrl = getParentPath(cleanUrl);
        const parentPath = getParentPath(cleanPath);

        return cleanUrl === cleanPath || parentUrl === parentPath;
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
                        href={dashboard().url}
                        className={linkClass(dashboard().url)}
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
                                    href={indexPacote().url}
                                    className={linkClass(
                                        indexPacote().url,
                                        true,
                                    )}
                                >
                                    <MapPinned size={18} />
                                    <span>Pacotes de Viagem</span>
                                </Link>
                                <Link
                                    href={indexPacoteFoto().url}
                                    className={linkClass(
                                        indexPacoteFoto().url,
                                        true,
                                    )}
                                >
                                    <Camera size={18} />
                                    <span>Pacotes de Fotos</span>
                                </Link>

                                <Link
                                    href={indexHotel().url}
                                    className={linkClass(
                                        indexHotel().url,
                                        true,
                                    )}
                                >
                                    <Hotel size={18} />
                                    <span>Hotéis</span>
                                </Link>

                                <Link
                                    href={indexTransporte().url}
                                    className={linkClass(
                                        indexTransporte().url,
                                        true,
                                    )}
                                >
                                    <Truck size={18} />
                                    <span>Transporte</span>
                                </Link>
                                <Link
                                    href={indexOferta().url}
                                    className={linkClass(
                                        indexOferta().url,
                                        true,
                                    )}
                                >
                                    <Tag size={18} />
                                    <span>Ofertas</span>
                                </Link>
                                <Link
                                    href={indexUsuario().url}
                                    className={linkClass(
                                        indexUsuario().url,
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
