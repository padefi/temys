import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip";
import { usePermissions } from "@/composables/permissions";
import { ColumnDef } from "@tanstack/react-table"
import { Funnel, FunnelX, Waypoints } from "lucide-react";
import { ArrowUpDown } from "lucide-react"
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/Components/ui/select"

import { PermisosDialog } from "./Permisos/PermisosDialog";
import axios from "axios";
import { toast } from "sonner";

export type User = {
    id: number;
    name: string;
    email: string;
    module_role: string;
}

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: 'name',
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
                        <span className="text-sm font-medium text-gray-900">Nombre</span>
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
        cell: ({ row }) => <span className="text-sm">{row.getValue('name')}</span>,
    },
    {
        accessorKey: 'email',
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
                        <span className="text-sm font-medium text-gray-900">Email</span>
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
        cell: ({ row }) => <span className="text-sm">{row.getValue('email')}</span>,
    },
    {
        accessorKey: 'module_role',
        header: ({ column }) => {
            const [filterEnabled, setFilterEnabled] = useState(false);
            const [roles, setRoles] = useState([]);

            useEffect(() => {
                getModuleRoles();
            }, []);

            const getModuleRoles = async () => {
                try {
                    const response = await fetch('/user-model-panel/get-module-roles', {
                        credentials: 'include'
                    });
                    const data = await response.json();
                    setRoles(data.data);
                } catch (error) {
                    if (axios.isAxiosError(error) && error.response) toast.error(error.response.data.message || "Error desconocido del servidor");
                    else toast.error("Error al obtener los roles");
                }
            };

            const toggleFilter = () => {
                if (filterEnabled) {
                    column.setFilterValue(undefined);
                }
                setFilterEnabled(!filterEnabled);
            };

            return (
                <div className="flex gap-2 items-center">
                    {filterEnabled ? (
                        <Select onValueChange={(value) => column.setFilterValue(value)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Seleccione un rol" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Roles</SelectLabel>
                                    {roles.map((role: { name: string }, index) => (
                                        <SelectItem key={index} value={role.name.toUpperCase()}>
                                            {role.name.toUpperCase()}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>) : (
                        <span className="text-sm font-medium text-gray-900">Rol</span>
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
            const roles = row.getValue('module_role') as string | undefined;

            if (!roles) {
                return <span className="text-sm text-red-500">Sin Rol</span>;
            }

            return (
                <span className="text-sm">
                    <span>{roles.toUpperCase()}</span>
                </span>
            );
        },
        filterFn: (row, columnId, filterValue) => {
            const roles = row.getValue(columnId) as string | undefined;

            if (!roles) {
                return filterValue === 'SIN ROL';
            }

            return roles.toUpperCase() === filterValue.toUpperCase();
        },
    },
    {
        accessorKey: 'actions',
        header: 'Acciones',
        cell: ({ row, table }) => {
            const user = row.original;
            const { module } = table.options.meta as { module: number };
            const { userAuth } = usePermissions();
            const [isDialogOpen, setIsDialogOpen] = useState(false);

            return (
                userAuth.id !== user.id && user.module_role && user.module_role !== 'encargado' ? (
                    <div className="text-right flex gap-3">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="p-0! hover:bg-gray-0 hover:[&>svg]:drop-shadow-[0_0_1px_rgba(217,119,6,0.5)]"
                                        onClick={() => setIsDialogOpen(true)}
                                    >
                                        <Waypoints className='w-6! h-6! text-emerald-500' />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Permisos</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <PermisosDialog open={isDialogOpen} setOpen={setIsDialogOpen} user={user} module={module} />
                    </div>
                ) : (
                    <span className="text-sm text-gray-500">Sin acciones</span>
                )
            )
        },
    },
]
