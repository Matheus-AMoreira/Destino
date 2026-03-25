import type { PropsWithChildren } from 'react';
import Sidebar from '@/components/administracao/SideBar';
import GuestLayout from '@/layouts/GuestLayout';

interface Props extends PropsWithChildren {
    title: string;
}

export default function AdminLayout({ children, title }: Props) {
    return (
        <GuestLayout title={title}>
            <div className="flex flex-1 bg-gray-50/50">
                <Sidebar />
                <main className="flex-1 overflow-y-auto p-8">{children}</main>
            </div>
        </GuestLayout>
    );
}
