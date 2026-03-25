import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip";
import { usePermissions } from "@/composables/permissions";
import { ColumnDef } from "@tanstack/react-table"
import { Funnel, FunnelX, Waypoints, CreditCard, ClipboardPen, Receipt  } from "lucide-react";
import { ArrowUpDown } from "lucide-react"
import { useEffect, useState } from "react";

import ProveedoresEditar from "./ProveedoresEditar";
import { Proveedor } from '@/types/Proveedor';
import CuentaCorrienteModal from "@/Pages/Contabilidad/CuentaCorrienteProveedores"

import type { Nacionalidad } from "@/types/Nacionalidad";
import type { CondicionIva } from "@/types/CondicionIva";
import type { ActividadEconomica } from "@/types/ActividadEconomica";
import type { EntidadFinanciera } from "@/types/EntidadFinanciera";
import type { TipoMoneda } from "@/types/TipoMoneda";
import type { TipoContacto } from "@/types/TipoContacto";

export const columns: ColumnDef<Proveedor>[] = [
    {
        accessorKey: 'razon_social',
        header: ({ column }) => {
            const [filterEnabled, setFilterEnabled] = useState(false);

            const toggleFilter = () => {
                if (filterEnabled) {
                    column.setFilterValue(undefined);
                }
                setFilterEnabled(!filterEnabled);
            };

            return (
                <div className="flex gap-2 items-center">
                    {filterEnabled ? (
                        <Input
                            type="text"
                            placeholder="Filtrar..."
                            className="border rounded px-2 py-1 text-sm"
                            value={(column.getFilterValue() as string) || ""}
                            onChange={(e) => column.setFilterValue(e.target.value)}
                        />) : (
                        <span className="text-sm font-medium text-gray-900">Razón Social</span>
                    )}
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleFilter}
                    >
                        {filterEnabled ? <FunnelX className="h-4 w-4" /> : <Funnel className="h-4 w-4" />}
                    </Button>
                </div>
            )
        },
        cell: ({ row }) => <span className="text-sm">{row.getValue('razon_social')}</span>,
    },
    {
        accessorKey: 'nombre_fantasia',
        header: ({ column }) => {
            const [filterEnabled, setFilterEnabled] = useState(false);

            const toggleFilter = () => {
                if (filterEnabled) {
                    column.setFilterValue(undefined);
                }
                setFilterEnabled(!filterEnabled);
            };

            return (
                <div className="flex gap-2 items-center">
                    {filterEnabled ? (
                        <Input
                            type="text"
                            placeholder="Filtrar..."
                            className="border rounded px-2 py-1 text-sm"
                            value={(column.getFilterValue() as string) || ""}
                            onChange={(e) => column.setFilterValue(e.target.value)}
                        />) : (
                        <span className="text-sm font-medium text-gray-900">Nombre Fantasía</span>
                    )}
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleFilter}
                    >
                        {filterEnabled ? <FunnelX className="h-4 w-4" /> : <Funnel className="h-4 w-4" />}
                    </Button>
                </div>
            )
        },
        cell: ({ row }) => <span className="text-sm">{row.getValue('nombre_fantasia')}</span>,
    },
    {
        accessorKey: 'padron.tipo_documento',
        header: ({ column }) => {
            const [filterEnabled, setFilterEnabled] = useState(false);

            const toggleFilter = () => {
                if (filterEnabled) {
                    column.setFilterValue(undefined);
                }
                setFilterEnabled(!filterEnabled);
            };

            return (
                <div className="flex gap-2 items-center">
                    {filterEnabled ? (
                        <Input
                            type="text"
                            placeholder="Filtrar..."
                            className="border rounded px-2 py-1 text-sm"
                            value={(column.getFilterValue() as string) || ""}
                            onChange={(e) => column.setFilterValue(e.target.value)}
                        />
                    ) : (
                        <span className="text-sm font-medium text-gray-900">Tipo Documento</span>
                    )}
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleFilter}
                    >
                        {filterEnabled ? <FunnelX className="h-4 w-4" /> : <Funnel className="h-4 w-4" />}
                    </Button>
                </div>
            )
        },
        cell: ({ row }) => {
            const padron = row.original.padron;
            return <span className="text-sm">{(padron as { tipo_documento?: string })?.tipo_documento || 'N/A'}</span>;
        }
    },
    {
        accessorKey: 'padron.documento',
        header: ({ column }) => {
            const [filterEnabled, setFilterEnabled] = useState(false);

            const toggleFilter = () => {
                if (filterEnabled) {
                    column.setFilterValue(undefined);
                }
                setFilterEnabled(!filterEnabled);
            };

            return (
                <div className="flex gap-2 items-center">
                    {filterEnabled ? (
                        <Input
                            type="text"
                            placeholder="Filtrar..."
                            className="border rounded px-2 py-1 text-sm"
                            value={(column.getFilterValue() as string) || ""}
                            onChange={(e) => column.setFilterValue(e.target.value)}
                        />
                    ) : (
                        <span className="text-sm font-medium text-gray-900">N°Documento</span>
                    )}
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleFilter}
                    >
                        {filterEnabled ? <FunnelX className="h-4 w-4" /> : <Funnel className="h-4 w-4" />}
                    </Button>
                </div>
            )
        },
        cell: ({ row }) => {
            const padron = row.original.padron;
            return <span className="text-sm">{(padron as { documento?: string })?.documento || 'N/A'}</span>;
        }
    },
    {
        accessorKey: 'tipo',
        header: ({ column }) => {
            const [filterEnabled, setFilterEnabled] = useState(false);
    
            const toggleFilter = () => {
                if (filterEnabled) {
                    column.setFilterValue(undefined);
                }
                setFilterEnabled(!filterEnabled);
            };
    
            return (
                <div className="flex gap-2 items-center">
                    {filterEnabled ? (
                        <Input
                            type="text"
                            placeholder="Filtrar..."
                            className="border rounded px-2 py-1 text-sm"
                            value={(column.getFilterValue() as string) || ""}
                            onChange={(e) => column.setFilterValue(e.target.value)}
                        />
                    ) : (
                        <span className="text-sm font-medium text-gray-900">Tipo</span>
                    )}
    
                    <Button
                        variant="ghost"
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
    
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleFilter}
                    >
                        {filterEnabled ? (
                            <FunnelX className="h-4 w-4" />
                        ) : (
                            <Funnel className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            );
        },
        cell: ({ row }) => (
            <span className="text-sm">
                {row.getValue('tipo')}
            </span>
        ),
    },
    {
        accessorKey: 'actions',
        header: 'Acciones',
        cell: ({ row, table }) => {
            const user = row.original;
            //const { module } = table.options.meta as { module: number };
            const {
                //module,
                nacionalidades,
                condicionesIva,
                actividades,
                entidadesFinancieras,
                tiposMoneda,
                tipoContactos,
            } = table.options.meta as {
                //module: number;
                nacionalidades: Nacionalidad[];
                condicionesIva: CondicionIva[];
                actividades: ActividadEconomica[];
                entidadesFinancieras: EntidadFinanciera[];
                tiposMoneda: TipoMoneda[];
                tipoContactos: TipoContacto[];
            };
            const { userAuth } = usePermissions();
            const [isDialogOpen, setIsDialogOpen] = useState(false);
            const [isModalCCOpen, setIsModalCCOpen] = useState(false);

            return (
                userAuth.id ? (
                    <>
                    <div className="text-right flex gap-3">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="p-0! hover:bg-gray-0 hover:[&>svg]:drop-shadow-[0_0_1px_rgba(217,119,6,0.5)]"
                                        onClick={() => setIsDialogOpen(true)}
                                    >
                                        <ClipboardPen className='w-6! h-6! text-emerald-500' />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Ver / Editar</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <ProveedoresEditar
                            open={isDialogOpen}
                            setOpen={setIsDialogOpen}
                            proveedor={row.original}
                            nacionalidades={nacionalidades}
                            condicionesIva={condicionesIva}
                            actividades={actividades}
                            entidadesFinancieras={entidadesFinancieras}
                            tiposMoneda={tiposMoneda}
                            tipoContactos={tipoContactos}
                        />

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="p-0! hover:bg-gray-0 hover:[&>svg]:drop-shadow-[0_0_1px_rgba(217,119,6,0.5)]"
                                        onClick={() => setIsModalCCOpen(true)}
                                    >
                                        <Receipt className='w-6! h-6! text-emerald-500' />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Cuenta Corriente</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <CuentaCorrienteModal open={isModalCCOpen} onClose={() => setIsModalCCOpen(false)} proveedor={row.original} />
                    </div>
                    </>
                ) : (
                    <span className="text-sm text-gray-500">Sin acciones</span>
                )
            )
        },
    },
]
