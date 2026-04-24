import React, { useState } from 'react';
import Image from '@/components/Image';

interface Photo {
    url: string;
}

interface ImageCarouselProps {
    photos: Photo[];
    onImageChange?: (url: string) => void;
    className?: string;
}

export default function ImageCarousel({
    photos,
    onImageChange,
    className = 'absolute bottom-6 right-8 h-16 w-32',
}: ImageCarouselProps) {
    const [startIndex, setStartIndex] = useState(0);
    const [imagemSelecionada, setImagemSelecionada] = useState(photos[0]?.url);

    if (photos.length <= 1) return null;

    return (
        <div className={className}>
            <div className="relative flex h-full w-full items-center justify-center">
                {[-1, 0, 1].map((offset) => {
                    const idx =
                        (startIndex + offset + photos.length) % photos.length;
                    const foto = photos[idx];
                    if (!foto) return null;

                    const isCenter = offset === 0;
                    return (
                        <button
                            key={idx}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setImagemSelecionada(foto.url);
                                if (onImageChange) onImageChange(foto.url);
                                if (offset !== 0) {
                                    setStartIndex(
                                        (prev) =>
                                            (prev + offset + photos.length) %
                                            photos.length,
                                    );
                                }
                            }}
                            className={`absolute h-14 w-14 shrink-0 rounded-xl border-2 border-white transition-all duration-500 ease-out shadow-2xl ${
                                isCenter
                                    ? 'z-30 scale-125 opacity-100 translate-x-0'
                                    : offset === -1
                                      ? 'z-10 -translate-x-10 scale-90 opacity-40 grayscale hover:opacity-70'
                                      : 'z-10 translate-x-10 scale-90 opacity-40 grayscale hover:opacity-70'
                            } overflow-hidden`}
                        >
                            <Image
                                name={foto.url}
                                alt="Thumbnail"
                                style="h-full w-full object-cover"
                            />
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
