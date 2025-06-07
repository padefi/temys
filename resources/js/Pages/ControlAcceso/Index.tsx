import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Control de Acceso
                </h2>
            }
        >
            <Head title="Control de Acceso" />

        </AuthenticatedLayout>
    );
}
