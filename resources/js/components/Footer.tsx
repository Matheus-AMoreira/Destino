import { Link } from '@inertiajs/react';
import React from 'react';
import { BsFillTelephoneFill } from 'react-icons/bs';
import { FaFacebookSquare } from 'react-icons/fa';
import { MdContactMail, MdEmail, MdPlace } from 'react-icons/md';
import { PiInstagramLogoFill, PiMapPinAreaFill } from 'react-icons/pi';
import { RiUserFollowFill } from 'react-icons/ri';

export default function Footer() {
    return (
        <footer className="w-full bg-[#ff944d] px-8 py-10 text-blue-900">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 text-lg md:grid-cols-4">
                <div className="flex flex-col items-start">
                    <img
                        src="/logo.png"
                        alt="Logo"
                        className="w-65 mb-4 select-none pl-15 pt-4"
                    />
                </div>

                <div>
                    <h3 className="mb-4 flex items-center space-x-2 text-xl font-bold text-blue-700">
                        <PiMapPinAreaFill className="text-2xl" />
                        <span>Navegação</span>
                    </h3>
                    <ul className="space-y-2">
                        <li>
                            <Link href="/" className="text-white drop-shadow-md transition hover:text-[#2071b3]">
                                Início
                            </Link>
                        </li>
                        <li>
                            <Link href="/buscar" className="text-white drop-shadow-md transition hover:text-[#2071b3]">
                                Pacotes
                            </Link>
                        </li>
                        <li>
                            <Link href="/entrar" className="text-white drop-shadow-md transition hover:text-[#2071b3]">
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link href="/cadastro" className="text-white drop-shadow-md transition hover:text-[#2071b3]">
                                Cadastro
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="mb-4 flex items-center space-x-2 text-xl font-bold text-blue-700">
                        <MdContactMail className="text-2xl" />
                        <span>Contato</span>
                    </h3>
                    <ul className="space-y-2 text-white drop-shadow-md">
                        <li className="flex items-center space-x-2">
                            <BsFillTelephoneFill className="text-xl" />
                            <span>(11) 4002-8922</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <MdEmail className="text-xl" />
                            <span>contato@destinoviagens.com</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <MdPlace className="text-xl" />
                            <span>São Paulo - Lorena</span>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="mb-4 flex items-center space-x-2 text-xl font-bold text-blue-700">
                        <RiUserFollowFill className="text-2xl" />
                        <span>Siga-nos</span>
                    </h3>
                    <div className="flex space-x-4">
                        <a href="#" className="flex items-center space-x-2 text-white drop-shadow-md transition hover:text-[#2071b3]">
                            <FaFacebookSquare className="text-2xl" />
                            <span>Facebook</span>
                        </a>
                        <a href="#" className="flex items-center space-x-2 text-white drop-shadow-md transition hover:text-[#2071b3]">
                            <PiInstagramLogoFill className="text-2xl" />
                            <span>Instagram</span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
