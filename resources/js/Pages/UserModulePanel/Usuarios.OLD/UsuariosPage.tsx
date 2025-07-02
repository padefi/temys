import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { User, columns } from "./UsuariosColumns"
import { DataTable } from "./UsuariosDataTable"


type PageProps = InertiaPageProps & {
    users: {
        data: Array<User>;
    };
    module: number;
};

export default function UsuariosPage() {
    const { users: { data: users }, module } = usePage<PageProps>().props;

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-xs sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl my-3 font-bold">Usuarios</h1>
                            <DataTable columns={columns} data={users} module={module} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout >
    );
}