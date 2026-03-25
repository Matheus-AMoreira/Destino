import { ASSETS } from '@/lib/Icons';

export default function Image({ name, alt, style }) {
    const src = ASSETS.IMAGES[name.toUpperCase()];
    if (!src) return null;

    return <img src={src} alt={alt || name} className={style} loading="lazy" />;
}
