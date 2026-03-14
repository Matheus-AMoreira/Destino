import { Link, usePage } from '@inertiajs/react';
import React from 'react';
import { BiSolidLogInCircle, BiSolidLogOutCircle } from 'react-icons/bi';
import { FaUser } from 'react-icons/fa';
import { LuPackageSearch } from 'react-icons/lu';
import { MdContactMail } from 'react-icons/md';
import { TbMapPinCog } from 'react-icons/tb';

export default function Navbar() {
    const { auth } = usePage().props as any;

    return (
        <header className="bg-[#ff944d] px-8 pb-1 pt-3 shadow-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
                <Link href="/" className="pl-0 font-bold text-white">
                    <div className="flex flex-col items-start">
                        <img src="/logo.png" alt="Logo" className="w-25 select-none" />
                    </div>
                </Link>
                <nav className="flex gap-6 pl-0 pr-0 text-lg">
                    <Link
                        href="/buscar"
                        data={{ termo: '', precoMax: 0, page: 0, size: 12 }}
                        className="flex items-center space-x-2 font-bold text-white hover:text-[#2071b3]"
                    >
                        <LuPackageSearch className="text-xl" />
                        <span>Buscar Pacotes</span>
                    </Link>
                    <Link
                        href="/contato"
                        className="flex items-center space-x-2 font-bold text-white hover:text-[#2071b3]"
                    >
                        <MdContactMail className="text-xl" />
                        <span>Contato</span>
                    </Link>
                    {auth?.user?.role === 'ADMINISTRADOR' && (
                        <Link
                            href="/administracao"
                            className="flex items-center space-x-2 font-bold text-white hover:text-[#2071b3]"
                        >
                            <TbMapPinCog className="text-xl" />
                            <span>Administração</span>
                        </Link>
                    )}
                    {auth?.user ? (
                        <div className="relative flex items-center group">
                            <button className="flex items-center space-x-2 font-bold text-white hover:text-[#2071b3] focus:outline-none py-2 transition-colors">
                                <FaUser className="text-xl" />
                                <span>{auth.user.nome} {auth.user.sobre_nome}</span>
                                <svg className="w-4 h-4 ml-1 fill-current transition-transform duration-200 group-hover:rotate-180" viewBox="0 0 20 20">
                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            <div className="absolute top-[100%] right-0 w-56 bg-white rounded-xl shadow-2xl py-2 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 z-50 border border-gray-100 transform origin-top scale-95 group-hover:scale-100">
                                <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sua Conta</p>
                                </div>
                                
                                <Link
                                    href={route('usuario.viagem.listar', { usuario: auth.user.nome, view: 'andamento' })}
                                    className="flex items-center space-x-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                >
                                    <TbMapPinCog className="text-xl" />
                                    <span>Minhas Viagens</span>
                                </Link>

                                <Link
                                    href={route('usuario.viagem.listar', { usuario: auth.user.nome, view: 'concluidas' })}
                                    className="flex items-center space-x-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Histórico de Compra</span>
                                </Link>

                                <div className="border-t border-gray-50 mt-1 pt-1">
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="w-full text-left flex items-center space-x-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                        <BiSolidLogOutCircle className="text-xl" />
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
                            <BiSolidLogInCircle className="text-xl" />
                            <span>Conecte-se</span>
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}
