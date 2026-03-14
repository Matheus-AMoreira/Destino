import GuestLayout from '@/layouts/GuestLayout';
import React from 'react';
import { BsFillTelephoneFill } from 'react-icons/bs';
import { FaFacebookSquare } from 'react-icons/fa';
import { MdContactMail, MdEmail, MdPlace } from 'react-icons/md';
import { PiInstagramLogoFill } from 'react-icons/pi';

export default function Contato() {
    return (
        <GuestLayout title="Fale Conosco">
            <div className="flex h-[75%] flex-col bg-white pt-35 md:h-full">
                <section className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-10 px-6 py-20 md:flex-row">
                    <div className="flex flex-col space-y-6 md:w-1/2">
                        <h1 className="text-4xl font-bold text-[#2071b3]">Fale Conosco</h1>
                        <p className="leading-relaxed text-gray-700">
                            Precisa de ajuda para planejar sua viagem, tirar dúvidas sobre
                            pacotes ou fazer uma parceria? Nossa equipe está pronta para te
                            atender.
                        </p>

                        <ul className="space-y-2 text-gray-800 drop-shadow-md">
                            <li className="flex items-center">
                                <BsFillTelephoneFill className="mr-2 text-2xl" />
                                <span>(11) 4002-8922</span>
                            </li>
                            <li className="flex items-center">
                                <MdEmail className="mr-2 text-2xl" />
                                <span>contato@destinoviagens.com</span>
                            </li>
                            <li className="flex items-center">
                                <MdPlace className="mr-2 text-2xl" />
                                <span>São Paulo - Lorena</span>
                            </li>
                        </ul>

                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-900 drop-shadow-md transition hover:text-[#2071b3]">
                                <div className="flex items-center">
                                    <FaFacebookSquare className="mr-1 text-2xl" />
                                    <span>Facebook</span>
                                </div>
                            </a>
                            <a href="#" className="text-gray-800 drop-shadow-md transition hover:text-[#2071b3]">
                                <div className="flex items-center">
                                    <PiInstagramLogoFill className="mr-1 text-2xl" />
                                    <span>Instagram</span>
                                </div>
                            </a>
                        </div>
                    </div>

                    <div className="flex justify-center md:w-1/2">
                        <img
                            src="/iconcor.png"
                            alt="Logo"
                            className="max-w-87.5 rounded-xl object-contain p-2 shadow-lg"
                        />
                    </div>
                </section>
            </div>
        </GuestLayout>
    );
}
