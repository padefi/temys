import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import React from 'react';

export default function Usuarios() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Usuarios
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-xs sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                        Lista de Usuarios
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}