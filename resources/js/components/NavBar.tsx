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
                        <span className="flex items-center space-x-2 font-bold text-white">
                            <Link
                                href={`/${auth.user.nome}/viagem/listar`}
                                className="flex items-center space-x-2 hover:text-[#2071b3]"
                            >
                                <FaUser className="text-xl" />
                                <span>Usuário: {auth.user.nome}</span>
                            </Link>
                            <span className="ml-2">|</span>
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="ml-2 flex items-center space-x-1 font-bold text-white hover:cursor-pointer hover:text-[#2071b3] hover:underline"
                            >
                                <BiSolidLogOutCircle className="text-xl" />
                                <span>Logout</span>
                            </Link>
                        </span>
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
