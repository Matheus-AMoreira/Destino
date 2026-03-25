import Icon from '@/components/Icon';
import GuestLayout from '@/layouts/GuestLayout';
import { Phone, Mail, MapPin } from 'lucide-react';
import Image from '@/components/Image';

export default function Contato() {
    return (
        <GuestLayout title="Fale Conosco">
            <div className="flex h-[75%] flex-col bg-white pt-35 md:h-full">
                <section className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-10 px-6 py-20 md:flex-row">
                    <div className="flex flex-col space-y-6 md:w-1/2">
                        <h1 className="text-4xl font-bold text-[#2071b3]">
                            Fale Conosco
                        </h1>
                        <p className="leading-relaxed text-gray-700">
                            Precisa de ajuda para planejar sua viagem, tirar
                            dúvidas sobre pacotes ou fazer uma parceria? Nossa
                            equipe está pronta para te atender.
                        </p>

                        <ul className="space-y-2 text-gray-800 drop-shadow-md">
                            <li className="flex items-center space-x-2">
                                <Phone />
                                <span>(11) 4002-8922</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <Mail />
                                <span>contato@destinoviagens.com</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <MapPin />
                                <span>São Paulo - Lorena</span>
                            </li>
                        </ul>

                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="text-gray-900 drop-shadow-md transition hover:text-[#2071b3]"
                            >
                                <div className="flex items-center space-x-2">
                                    <Icon
                                        name={'facebook'}
                                        alt={'facebook link'}
                                        size={'24px'}
                                    />
                                    <span>Facebook</span>
                                </div>
                            </a>
                            <a
                                href="#"
                                className="text-gray-800 drop-shadow-md transition hover:text-[#2071b3]"
                            >
                                <div className="flex items-center space-x-2">
                                    <Icon
                                        name={'instagram'}
                                        alt={'instagram link'}
                                        size={'24px'}
                                    />
                                    <span>Instagram</span>
                                </div>
                            </a>
                        </div>
                    </div>

                    <div className="flex justify-center md:w-1/2">
                        <Image
                            name={'logo_cor'}
                            alt={'Link para a landingpage'}
                            style="max-w-87.5 rounded-xl object-contain p-2 shadow-lg"
                        />
                    </div>
                </section>
            </div>
        </GuestLayout>
    );
}
