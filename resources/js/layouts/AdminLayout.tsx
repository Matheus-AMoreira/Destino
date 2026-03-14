import GuestLayout from '@/layouts/GuestLayout';
import Sidebar from '@/components/administracao/SideBar';
import React, { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
    title: string;
}

export default function AdminLayout({ children, title }: Props) {
    return (
        <GuestLayout title={title}>
            <div className="flex flex-1 bg-gray-50/50">
                <Sidebar />
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </GuestLayout>
    );
}
