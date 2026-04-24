import { useState } from 'react';
import { ASSETS } from '@/lib/Icons';

export default function Icon({ name, alt, size = '16px', className = '' }) {
    const [hasError, setHasError] = useState(false);

    if (!name || typeof name !== 'string') {
        return null;
    }

    const src = ASSETS.ICONS[name.toUpperCase()];
    const dimension = typeof size === 'number' ? `${size}px` : size;

    if (!src || hasError) {
        return null;
    }

    return (
        <img
            src={src}
            alt={alt || name}
            className={className}
            style={{ width: dimension, height: dimension }}
            loading="lazy"
            onError={() => setHasError(true)}
        />
    );
}
