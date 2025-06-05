import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip";
import { usePermissions } from "@/composables/permissions";
import { ColumnDef } from "@tanstack/react-table"
import { Ban, Funnel, FunnelX, LockKeyhole, Pencil, Save, Waypoints, X } from "lucide-react";
import { ArrowUpDown } from "lucide-react"
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/Components/ui/select"

import { PermisosDialog } from "./Permisos/PermisosDialog";
import { ErrorMessage } from "@/Components/ui/error-message";
import { isEmpty, validateEmail } from '@/utils/validateFunctions';

export type User = {
    id: number;
    name: string;
    last_name: string;
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
        cell: ({ row, table }) => {
            const { editUserId } = table.options.meta as { editUserId: number | null };
            const [value, setValue] = useState(row.getValue('name') as string);
            const isError = isEmpty(value);

            useEffect(() => {
                if (row.original.id === editUserId) {
                    setValue(row.getValue('name') as string);
                }
            }, [editUserId, row]);

            if (row.original.id === editUserId) {
                return (
                    <div className="grid items-center">
                        <Input
                            type="text"
                            name="name"
                            className="text-sm"
                            variant={isError ? "error" : "underline"}
                            placeholder="Nombre"
                            defaultValue={row.getValue('name')}
                            onChange={e => setValue(e.target.value)}
                        />

                        {isError && <ErrorMessage>Campo obligatorio</ErrorMessage>}
                    </div>
                );
            }

            return <span className="text-sm">{row.getValue('name')}</span>;

        },
    },
    {
        accessorKey: 'last_name',
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
                        <span className="text-sm font-medium text-gray-900">Apellido</span>
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
        cell: ({ row, table }) => {
            const { editUserId } = table.options.meta as { editUserId: number | null };
            const [value, setValue] = useState(row.getValue('last_name') as string);
            const isError = isEmpty(value);

            useEffect(() => {
                if (row.original.id === editUserId) {
                    setValue(row.getValue('last_name') as string);
                }
            }, [editUserId, row]);

            if (row.original.id === editUserId) {
                return (
                    <div className="grid items-center">
                        <Input
                            type="text"
                            name="last_name"
                            className="text-sm"
                            variant={isError ? "error" : "underline"}
                            placeholder="Apellido"
                            defaultValue={row.getValue('last_name')}
                            onChange={e => setValue(e.target.value)}
                        />

                        {isError && <ErrorMessage>Campo obligatorio</ErrorMessage>}
                    </div>
                );
            }

            return <span className="text-sm">{row.getValue('last_name')}</span>;

        },
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
        cell: ({ row, table }) => {
            const { editUserId } = table.options.meta as { editUserId: number | null };
            const [value, setValue] = useState(row.getValue('email') as string);
            const isError = isEmpty(value) || !validateEmail(value);

            useEffect(() => {
                if (row.original.id === editUserId) {
                    setValue(row.getValue('email') as string);
                }
            }, [editUserId, row]);

            if (row.original.id === editUserId) {
                return (
                    <div className="grid items-center">
                        <Input
                            type="text"
                            name="email"
                            className="text-sm"
                            variant={isError ? "error" : "underline"}
                            placeholder="Email"
                            defaultValue={row.getValue('email')}
                            onChange={e => setValue(e.target.value)}
                        />

                        {isError &&
                            <ErrorMessage>{!validateEmail(value) ? "Email inválido" : "Campo obligatorio"}</ErrorMessage>
                        }
                    </div>
                );
            }

            return <span className="text-sm">{row.getValue('email')}</span>;
        },
    },
    {
        accessorKey: 'roles',
        header: ({ column, table }) => {
            const [filterEnabled, setFilterEnabled] = useState(false);
            const { roles } = table.options.meta as { roles: [] };

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
        cell: ({ row, table }) => {
            const roles = row.getValue('roles') as Array<{ id: number; name: string }> | undefined;
            const { editUserId, roles: rolesOptions } = table.options.meta as { editUserId: number | null; roles: [] };

            if (row.original.id === editUserId) {
                return (
                    <Select defaultValue={roles ? roles[0].name.toUpperCase() : ''}>
                        <SelectTrigger className="w-[180px]" variant="underline">
                            <SelectValue placeholder="Seleccione un rol" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Roles</SelectLabel>
                                {rolesOptions.map((role: { name: string }, index) => (
                                    <SelectItem key={index} value={role.name.toUpperCase()}>
                                        {role.name.toUpperCase()}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                )
            }

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
        cell: ({ row, table }) => {
            const user = row.original;
            const { userAuth } = usePermissions();
            const [isDialogOpen, setIsDialogOpen] = useState(false);
            const { editUserId, setEditUserId } = table.options.meta as { editUserId: number | null; setEditUserId: React.Dispatch<React.SetStateAction<number | null>>; };

            if (row.original.id === editUserId) {
                return (
                    <div className="text-right flex gap-3 ml-[2.4rem]">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="p-0! cursor-pointer hover:bg-gray-0 hover:[&>svg]:drop-shadow-[0_0_1px_rgba(217,119,6,0.5)]">
                                        <Save className='w-6! h-6! text-emerald-500' />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Guardar</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="p-0! cursor-pointer hover:bg-gray-0 hover:[&>svg]:drop-shadow-[0_0_1px_rgba(217,119,6,0.5)]"
                                        onClick={() => setEditUserId(null)}>
                                        <X className='w-6! h-6! text-red-500' />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Cancelar</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                );
            }

            return (
                userAuth.id !== user.id ? (
                    <div className="text-right flex gap-3">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="p-0! cursor-pointer hover:bg-gray-0 hover:[&>svg]:drop-shadow-[0_0_1px_rgba(217,119,6,0.5)]"
                                        onClick={() => setEditUserId(user.id)}>
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
                                        className="p-0! cursor-pointer hover:bg-gray-0 hover:[&>svg]:drop-shadow-[0_0_1px_rgba(217,119,6,0.5)]"
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
                                    <Button variant="ghost" className="p-0! cursor-pointer hover:bg-gray-0 hover:[&>svg]:drop-shadow-[0_0_1px_rgba(0,117,149,0.5)]">
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
                                    <Button variant="ghost" className="p-0! cursor-pointer hover:bg-gray-0 hover:[&>svg]:drop-shadow-[0_0_1px_rgba(199,0,54,0.5)]">
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
