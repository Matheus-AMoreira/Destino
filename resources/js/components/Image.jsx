import { useState } from 'react';
import { ASSETS } from '@/lib/Icons';

export default function Image({ name, alt, style, noFallback = false }) {
    const [hasError, setHasError] = useState(false);

    // Check if name is a URL or a path (starts with http, /, blob:, or data:)
    const isUrl =
        name &&
        typeof name === 'string' &&
        (name.startsWith('http') ||
            name.startsWith('/') ||
            name.startsWith('blob:') ||
            name.startsWith('data:') ||
            name.includes('.'));
    
    const staticAsset =
        name && typeof name === 'string' && ASSETS.IMAGES[name.toUpperCase()];

    let src =
        staticAsset || (isUrl ? name : noFallback ? null : ASSETS.IMAGES.PLACEHOLDER);

    // If we already tried the placeholder and it failed, or if we have an error and no fallback, return null
    if (hasError) {
        if (noFallback || src === ASSETS.IMAGES.PLACEHOLDER) {
            return null;
        }
        src = ASSETS.IMAGES.PLACEHOLDER;
    }

    if (!src) return null;

    return (
        <img
            src={src}
            alt={alt || name || 'Image'}
            className={style}
            loading="lazy"
            onError={() => setHasError(true)}
        />
    );
}
