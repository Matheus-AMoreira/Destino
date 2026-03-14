import { Link } from '@inertiajs/react';
import React from 'react';

interface CardProps {
    title: string;
    description: string;
    imageUrl: string;
    detalharHref: string;
}

export default function Card({ title, description, imageUrl, detalharHref }: CardProps) {
    return (
        <div className="m-1 flex w-full flex-col overflow-hidden rounded-xl bg-white shadow-xl transition transform border-2 border-gray-300 sm:max-w-sm hover:scale-[1.02]">
            {imageUrl && (
                <img
                    className="h-48 w-full object-cover"
                    src={imageUrl === 'placeholder' ? '/placeholder.jpg' : imageUrl}
                    alt={`Viagem para ${title}`}
                />
            )}

            <div className="flex flex-col justify-between p-5">
                <div>
                    <h3 className="mb-2 text-xl font-bold text-gray-800">{title}</h3>
                    <p className="mb-4 h-10 text-sm text-gray-600 line-clamp-2">
                        {description}
                    </p>
                </div>

                <Link
                    href={detalharHref}
                    className="mt-4 w-full rounded-lg bg-blue-600 px-6 py-2.5 text-center text-white shadow-md transition duration-300 hover:bg-blue-700 cursor-pointer"
                >
                    Saiba Mais...
                </Link>
            </div>
        </div>
    );
}
