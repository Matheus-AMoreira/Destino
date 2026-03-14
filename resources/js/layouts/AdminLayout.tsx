import Sidebar from '@/components/administracao/SideBar';
import { Head } from '@inertiajs/react';
import { ReactNode } from 'react';

interface Props {
    children: ReactNode;
    title?: string;
}

export default function AdminLayout({ children, title }: Props) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Head title={title} />
            
            <Sidebar />

            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
