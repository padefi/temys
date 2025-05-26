import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip";
import { usePermissions } from "@/composables/permissions";
import { ColumnDef } from "@tanstack/react-table"
import { Ban, Funnel, FunnelX, LockKeyhole, Pencil, Waypoints } from "lucide-react";
import { ArrowUpDown } from "lucide-react"
import { useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/Components/ui/select"

import { PermisosDialog } from "./Permisos/PermisosDialog";

export type User = {
    id: number;
    name: string;
    email: string;
    roles: Array<{
        id: number;
        name: string;
    }>;
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
        accessorKey: 'roles',
        header: ({ column }) => {
            const [filterEnabled, setFilterEnabled] = useState(false);

            const toggleFilter = () => {
                if (filterEnabled) {
                    column.setFilterValue(undefined);
                }
                setFilterEnabled(!filterEnabled);
            };

            const rolesSelected = [
                { id: 1, name: 'ADMIN' },
                { id: 2, name: 'EMPLEADO' },
                { id: 3, name: 'SIN ROL' },
            ];

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
                                    {rolesSelected.map((role) => (
                                        <SelectItem key={role.id} value={role.name}>
                                            {role.name}
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
            const roles = row.getValue('roles') as Array<{ id: number; name: string }> | undefined;

            if (!roles || roles.length === 0) {
                return <span className="text-sm text-red-500">Sin Rol</span>;
            }

            return (
                <span className="text-sm">
                    {roles[0].name === 'admin' ? (
                        <span className="text-emerald-700">{roles[0].name}</span>
                    ) : (
                        <span>EMPLEADO</span>
                    )}
                </span>
            );
        },
        filterFn: (row, columnId, filterValue) => {
            const roles = row.getValue(columnId) as Array<{ id: number; name: string }> | undefined;

            if (!roles || roles.length === 0) {
                return filterValue === 'SIN ROL';
            }

            if (filterValue === 'EMPLEADO') {
                return roles.some((role) => role.name.toUpperCase() !== 'ADMIN' && role.name.toUpperCase() !== 'SIN ROL');
            }

            return roles.some((role) => role.name.toUpperCase() === filterValue.toUpperCase());
        },
    },
    {
        accessorKey: 'actions',
        header: 'Acciones',
        cell: ({ row }) => {
            const user = row.original
            const { userAuth } = usePermissions();
            const [isDialogOpen, setIsDialogOpen] = useState(false);

            return (
                userAuth.id !== user.id ? (
                    <div className="text-right flex gap-3">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" className="p-0! hover:bg-gray-0 hover:[&>svg]:drop-shadow-[0_0_1px_rgba(217,119,6,0.5)]">
                                        <Pencil className='w-6! h-6! text-amber-500' />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Editar</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

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

                        <PermisosDialog open={isDialogOpen} setOpen={setIsDialogOpen} user={user} />

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" className="p-0! hover:bg-gray-0 hover:[&>svg]:drop-shadow-[0_0_1px_rgba(0,117,149,0.5)]">
                                        <LockKeyhole className='w-6! h-6! text-cyan-500' />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Reestablecer contraseña</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" className="p-0! hover:bg-gray-0 hover:[&>svg]:drop-shadow-[0_0_1px_rgba(199,0,54,0.5)]">
                                        <Ban className='w-6! h-6! text-red-500' />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Deshabilitar</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                ) : (
                    <span className="text-sm text-gray-500">Sin acciones</span>
                )
            )
        },
    },
]
