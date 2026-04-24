import { ASSETS } from '@/lib/Icons';

export default function Image({ name, alt, style, noFallback = false }) {
    // Check if name is a URL or a path (starts with http, /, blob:, or data:)
    const isUrl = name && (typeof name === 'string') && (
        name.startsWith('http') || 
        name.startsWith('/') || 
        name.startsWith('blob:') || 
        name.startsWith('data:') ||
        name.includes('.')
    );
    const staticAsset = name && (typeof name === 'string') && ASSETS.IMAGES[name.toUpperCase()];
    
    const src = staticAsset || (isUrl ? name : (noFallback ? null : ASSETS.IMAGES.PLACEHOLDER));

    if (!src) return null;

    return (
        <img
            src={src}
            alt={alt || name || 'Image'}
            className={style}
            loading="lazy"
            onError={(e) => {
                if (!noFallback) {
                    e.target.onerror = null;
                    e.target.src = ASSETS.IMAGES.PLACEHOLDER;
                }
            }}
        />
    );
}
