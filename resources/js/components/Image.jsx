import { ASSETS } from '@/lib/Icons';

export default function Image({ name, alt, style }) {
    return (
        <img
            src={ASSETS.IMAGES[name.toUpperCase()]}
            alt={alt || name || 'Image'}
            className={style}
            loading="lazy"
        />
    );
}
