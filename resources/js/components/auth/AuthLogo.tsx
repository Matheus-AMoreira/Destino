import { Link } from '@inertiajs/react';
import Image from '@/components/Image';

export default function AuthLogo() {
    return (
        <div className="hidden w-1/2 items-center justify-center md:flex">
            <div className="flex h-80 w-80 items-center justify-center rounded-2xl bg-white shadow-[5px_5px_20px_rgba(0,0,0,0.4)]">
                <Link href="/">
                    <Image
                        name={'logo_cor'}
                        alt={'Paula viagens logo'}
                        style="max-h-full max-w-full rounded-xl object-contain p-2"
                    />
                </Link>
            </div>
        </div>
    );
}
