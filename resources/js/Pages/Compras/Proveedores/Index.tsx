import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import {  columns } from "./ProveedoresColumns"
import { DataTable } from "./ProveedoresDataTable"
import { Proveedor } from '@/types/proveedores'; // Cambia la ruta según tu estructura

type PageProps = InertiaPageProps & {
    proveedores: {
        data: Array<Proveedor>;
    };
    module: number;
};

export default function Index() {

    const { proveedores: { data: proveedores }, module } = usePage<PageProps>().props;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Proveedores
                </h2>
            }
        >
            <Head title="Proveedores" />
            <div className="py-12">
                <div className="mx-auto max-w sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-xs sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl my-3 font-bold">Proveedores</h1>
                            <DataTable columns={columns} data={proveedores} module={module} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
