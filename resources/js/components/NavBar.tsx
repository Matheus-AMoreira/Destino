import { Link, usePage } from '@inertiajs/react';
import {
    History,
    MapPin,
    User,
    ShieldUser,
    ChevronDown,
    LogOut,
    PackageSearch,
    MailCheck,
} from 'lucide-react';

export default function Navbar() {
    const { auth } = usePage().props as any;

    return (
        <header className="bg-[#ff944d] px-8 pt-3 pb-1 shadow-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
                <Link href="/" className="pl-0 font-bold text-white">
                    <div className="flex flex-col items-start">
                        <img
                            src="/logo.png"
                            alt="Logo"
                            className="w-25 select-none"
                        />
                    </div>
                </Link>
                <nav className="flex gap-6 pr-0 pl-0 text-lg">
                    <Link
                        href="/buscar"
                        data={{ termo: '', precoMax: 0, page: 0, size: 12 }}
                        className="flex items-center space-x-2 font-bold text-white hover:text-[#2071b3]"
                    >
                        <PackageSearch className="text-xl" />
                        <span>Buscar Pacotes</span>
                    </Link>
                    <Link
                        href="/contato"
                        className="flex items-center space-x-2 font-bold text-white hover:text-[#2071b3]"
                    >
                        <MailCheck className="text-xl" />
                        <span>Contato</span>
                    </Link>
                    {auth?.user ? (
                        <div className="group relative flex items-center">
                            <button className="flex items-center space-x-2 py-2 font-bold text-white transition-colors hover:text-[#2071b3] focus:outline-none">
                                {auth?.user?.role === 'ADMINISTRADOR' ? (
                                    <ShieldUser />
                                ) : (
                                    <User />
                                )}
                                <span>
                                    {auth.user.nome} {auth.user.sobre_nome}
                                </span>
                            </button>
                            <ChevronDown color="white" />

                            {/* Dropdown Menu */}
                            <div className="invisible absolute top-full right-0 z-50 w-56 origin-top scale-95 transform rounded-xl border border-gray-100 bg-white py-2 opacity-0 shadow-2xl transition-all duration-300 group-hover:visible group-hover:scale-100 group-hover:opacity-100">
                                <div className="mb-1 border-b border-gray-50 px-4 py-2">
                                    <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                                        Sua Conta
                                    </p>
                                </div>

                                {auth?.user?.role === 'ADMINISTRADOR' && (
                                    <Link
                                        href={route('administracao.dashboard')}
                                        className="flex items-center space-x-3 px-4 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                    >
                                        <ShieldUser />
                                        <span>Administração</span>
                                    </Link>
                                )}

                                <Link
                                    href={route('usuario.viagem.listar', {
                                        user: auth.user.id,
                                        view: 'andamento',
                                    })}
                                    className="flex items-center space-x-3 px-4 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                >
                                    <MapPin />
                                    <span>Minhas Viagens</span>
                                </Link>

                                <Link
                                    href={route('usuario.viagem.listar', {
                                        user: auth.user.id,
                                        view: 'concluidas',
                                    })}
                                    className="flex items-center space-x-3 px-4 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                >
                                    <History />
                                    <span>Histórico de Compra</span>
                                </Link>

                                <Link
                                    href={route('usuario.perfil.edit')}
                                    className="flex items-center space-x-3 px-4 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                >
                                    <User size={18} />
                                    <span>Editar Perfil</span>
                                </Link>

                                <div className="mt-1 border-t border-gray-50 pt-1">
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="flex w-full items-center space-x-3 px-4 py-3 text-left text-sm font-bold text-red-500 transition-colors hover:bg-red-50"
                                    >
                                        <LogOut />
                                        <span>Logout</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Link
                            href="/entrar"
                            className="flex items-center space-x-2 font-bold text-white hover:text-[#2071b3]"
                        >
                            <CircleArrowRight />
                            <span>Conecte-se</span>
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}
