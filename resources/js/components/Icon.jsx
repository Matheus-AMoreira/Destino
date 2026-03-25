import { ASSETS } from '@/lib/Icons';

export default function Icon({ name, alt, size = '16px' }) {
    const src = ASSETS.ICONS[name.toUpperCase()];
    const dimension = typeof size === 'number' ? `${size}px` : size;
    if (!src) return null;

    return (
        <img
            src={src}
            alt={alt || name}
            style={{ width: dimension, height: dimension }}
            loading="lazy"
        />
    );
}
