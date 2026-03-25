import { Link } from '@inertiajs/react';
import Image from '../Image';

interface CardProps {
    title: string;
    description: string;
    imageUrl: string;
    detalharHref: string;
}

export default function Card({
    title,
    description,
    imageUrl,
    detalharHref,
}: CardProps) {
    return (
        <div className="m-1 flex w-full transform flex-col overflow-hidden rounded-xl border-2 border-gray-300 bg-white shadow-xl transition hover:scale-[1.02] sm:max-w-sm">
            {imageUrl && (
                <Image
                    name={imageUrl}
                    alt={`Viagem para ${title}`}
                    style="h-48 w-full object-cover"
                />
            )}

            <div className="flex flex-col justify-between p-5">
                <div>
                    <h3 className="mb-2 text-xl font-bold text-gray-800">
                        {title}
                    </h3>
                    <p className="mb-4 line-clamp-2 h-10 text-sm text-gray-600">
                        {description}
                    </p>
                </div>

                <Link
                    href={detalharHref}
                    className="mt-4 w-full cursor-pointer rounded-lg bg-blue-600 px-6 py-2.5 text-center text-white shadow-md transition duration-300 hover:bg-blue-700"
                >
                    Saiba Mais...
                </Link>
            </div>
        </div>
    );
}
