import { Link } from '@inertiajs/react';
import {
    Mail,
    MailCheck,
    MapPin,
    MapPinned,
    Phone,
    UserCheck,
} from 'lucide-react';
import { useRoute } from 'ziggy-js';
import Icon from '@/components/Icon';
import Image from '@/components/Image';

export default function Footer() {
    const route = useRoute();
    
    return (
        <footer className="w-full bg-[#ff944d] px-8 py-10 text-blue-900">
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 text-lg md:grid-cols-4">
                <div className="flex flex-col items-start">
                    <Image
                        name={'logo_cor'}
                        alt={'Link para a landingpage'}
                        style="mb-4 w-65 pt-4 pl-15 select-none"
                    />
                </div>

                <div>
                    <h3 className="mb-4 flex items-center space-x-2 text-xl font-bold text-blue-700">
                        <MapPinned className="text-2xl" />
                        <span>Navegação</span>
                    </h3>
                    <ul className="space-y-2">
                        <li>
                            <Link
                                href={route('home')}
                                className="text-white drop-shadow-md transition hover:text-[#2071b3]"
                            >
                                Início
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={route('buscar')}
                                className="text-white drop-shadow-md transition hover:text-[#2071b3]"
                            >
                                Pacotes
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={route('entrar')}
                                className="text-white drop-shadow-md transition hover:text-[#2071b3]"
                            >
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={route('cadastro')}
                                className="text-white drop-shadow-md transition hover:text-[#2071b3]"
                            >
                                Cadastro
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="mb-4 flex items-center space-x-2 text-xl font-bold text-blue-700">
                        <MailCheck className="text-2xl" />
                        <span>Contato</span>
                    </h3>
                    <ul className="space-y-2 text-white drop-shadow-md">
                        <li className="flex items-center space-x-2">
                            <Phone className="text-xl" />
                            <span>(11) 4002-8922</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <Mail className="text-xl" />
                            <span>contato@destinoviagens.com</span>
                        </li>
                        <li className="flex items-center space-x-2">
                            <MapPin className="text-xl" />
                            <span>São Paulo - Lorena</span>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="mb-4 flex items-center space-x-2 text-xl font-bold text-blue-700">
                        <UserCheck className="text-2xl" />
                        <span>Siga-nos</span>
                    </h3>
                    <div className="flex space-x-4">
                        <a
                            href={route('home')}
                            className="flex items-center space-x-2 text-white drop-shadow-md transition hover:text-[#2071b3]"
                        >
                            <Icon
                                name={'facebook_white'}
                                alt={'facebook link'}
                                size={'24px'}
                            />
                            <span>Facebook</span>
                        </a>
                        <a
                            href={route('home')}
                            className="flex items-center space-x-2 text-white drop-shadow-md transition hover:text-[#2071b3]"
                        >
                            <Icon
                                name={'instagram_white'}
                                alt={'instagram link'}
                                size={'24px'}
                            />
                            <span>Instagram</span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
