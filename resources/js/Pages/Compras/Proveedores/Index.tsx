import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useState } from "react";
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { columns } from "./ProveedoresColumns"
import { DataTable } from "./ProveedoresDataTable"
import { Proveedor } from '@/types/Proveedor';
import { Nacionalidad } from '@/types/Nacionalidad';
import { CondicionIva } from "@/types/CondicionIva";
import { ActividadEconomica } from "@/types/ActividadEconomica";
import { EntidadFinanciera } from "@/types/EntidadFinanciera";
import { TipoMoneda } from "@/types/TipoMoneda";
import { TipoContacto } from "@/types/TipoContacto";
import { Button } from "@/Components/ui/button"
import ProveedoresCrear from "./ProveedoresCrear";

type PageProps = InertiaPageProps & {
    proveedores: {
        data: Array<Proveedor>;
    };
    nacionalidades: Nacionalidad[];
    condicionesIva: CondicionIva[];
    actividades: ActividadEconomica[];
    entidadesFinancieras: EntidadFinanciera[];
    tiposMoneda: TipoMoneda[];
    tipoContactos: TipoContacto[];
    module: number;
};

export default function Index() {

    const {
        proveedores: { data: proveedores }, 
        nacionalidades, 
        condicionesIva, 
        actividades, 
        entidadesFinancieras, 
        tiposMoneda,
        tipoContactos, 
        module
    } = usePage<PageProps>().props;
    const [openCrear, setOpenCrear] = useState(false);

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
                            <div className="flex justify-between items-center mb-4">
                                <h1 className="text-2xl my-3 font-bold">Proveedores</h1>
                                <Button className='bg-green-600 hover:bg-green-700' onClick={() => setOpenCrear(true)}>
                                    Nuevo Proveedor
                                </Button>
                            </div>

                            <DataTable 
                                columns={columns} 
                                data={proveedores} 
                                module={module} 
                                nacionalidades={nacionalidades}
                                condicionesIva={condicionesIva}
                                actividades={actividades}
                                entidadesFinancieras={entidadesFinancieras}
                                tiposMoneda={tiposMoneda}
                                tipoContactos={tipoContactos}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <ProveedoresCrear 
                open={openCrear} 
                setOpen={setOpenCrear} 
                nacionalidades={nacionalidades} 
                condicionesIva={condicionesIva} 
                actividades={actividades}  
                entidadesFinancieras={entidadesFinancieras}
                tiposMoneda={tiposMoneda}
                tipoContactos={tipoContactos}
            />
        </AuthenticatedLayout>
    );
}
