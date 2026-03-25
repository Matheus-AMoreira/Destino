import Footer from '@/components/Footer';
import Navbar from '@/components/NavBar';
import { Head } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function GuestLayout({
    children,
    title,
}: PropsWithChildren<{ title?: string }>) {
    return (
        <div className="flex min-h-screen flex-col bg-linear-to-br from-[#e4f3ff] via-[#ffffff] to-[#e4f3ff]">
            <Head title={title} />
            <Navbar />
            <main className="flex flex-1 flex-col">{children}</main>
            <Footer />
        </div>
    );
}
