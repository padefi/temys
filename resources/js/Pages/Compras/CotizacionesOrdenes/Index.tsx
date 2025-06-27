import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';



export default function Index() {

    //const { proveedores: { data: proveedores }, module } = usePage<PageProps>().props;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    CotizacionesOrdenes
                </h2>
            }
        >
            <Head title="CotizacionesOrdenes" />
            <div className="py-12">
                <div className="mx-auto max-w sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-xs sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl my-3 font-bold">Cotizaciones</h1>
                            <button
                                type="button"
                                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                onClick={() => location.href = '/compras/cotizaciones-ordenes/nueva-cotizacion'}
                            >
                                Nueva Cotización
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
