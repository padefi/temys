import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { FloatingLabelInput } from '@/Components/ui/floating-label-input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip";
import { usePermissions } from "@/composables/permissions";
import { ColumnDef } from "@tanstack/react-table"
import { Ban, Funnel, FunnelX, KeyRound, Loader2Icon, LockKeyhole, Pencil, Save, Waypoints, X } from "lucide-react";
import { ArrowUpDown } from "lucide-react"
import { useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/Components/ui/select"

import { PermisosDialog } from "./Permisos/PermisosDialog";
import { ErrorMessage } from "@/Components/ui/error-message";
import { isEmpty, isUndefined, validateEmail } from '@/utils/validateFunctions';
import axios from "axios";
import { toast } from "sonner";
import { Spinner } from "@/Components/ui/spinner";

export type User = {
    id: number;
    name: string;
    last_name: string;
    email: string;
    is_active: boolean;
    roles: Array<{
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
            const { editUserId, editUserData, setEditUserData } = table.options.meta as { editUserId: number | null, editUserData: Partial<User>, setEditUserData: React.Dispatch<React.SetStateAction<Partial<User>>> };
            const value = row.original.id === editUserId
                ? (editUserData.name ?? row.getValue('name'))
                : row.getValue('name');
            const isError = isEmpty(value as string);

            if (row.original.id === editUserId) {
                return (
                    <div className="grid items-center">
                        <FloatingLabelInput
                            type="text"
                            name="name"
                            className="text-sm"
                            variant={isError ? "error" : "underline"}
                            label="Nombre"
                            defaultValue={row.getValue('name')}
                            autoComplete="off"
                            onChange={e => setEditUserData(prev => ({ ...prev, name: e.target.value }))}
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
            const { editUserId, editUserData, setEditUserData } = table.options.meta as { editUserId: number | null, editUserData: Partial<User>, setEditUserData: React.Dispatch<React.SetStateAction<Partial<User>>> };
            const value = row.original.id === editUserId
                ? (editUserData.last_name ?? row.getValue('last_name'))
                : row.getValue('last_name');
            const isError = isEmpty(value as string);

            if (row.original.id === editUserId) {
                return (
                    <div className="grid items-center">
                        <FloatingLabelInput
                            type="text"
                            name="last_name"
                            className="text-sm"
                            variant={isError ? "error" : "underline"}
                            label="Apellido"
                            defaultValue={row.getValue('last_name')}
                            autoComplete="off"
                            onChange={e => setEditUserData(prev => ({ ...prev, last_name: e.target.value }))}
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
                            autoComplete="off"
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
            const { editUserId, editUserData, setEditUserData } = table.options.meta as { editUserId: number | null, editUserData: Partial<User>, setEditUserData: React.Dispatch<React.SetStateAction<Partial<User>>> };
            const value = row.original.id === editUserId
                ? (editUserData.email ?? row.getValue('email'))
                : row.getValue('email');
            const isError = isEmpty(value as string) || !validateEmail(value as string);

            if (row.original.id === editUserId) {
                return (
                    <div className="grid items-center">
                        <FloatingLabelInput
                            type="text"
                            name="email"
                            className="text-sm"
                            variant={isError ? "error" : "underline"}
                            label="Email"
                            defaultValue={row.getValue('email')}
                            autoComplete="off"
                            onChange={e => setEditUserData(prev => ({ ...prev, email: e.target.value }))}
                        />

                        {isError &&
                            <ErrorMessage>{!validateEmail(value as string) && value ? "Email inválido" : "Campo obligatorio"}</ErrorMessage>
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
            const { editUserId, editUserData, setEditUserData, roles: rolesOptions } = table.options.meta as {
                editUserId: number | null,
                editUserData: Partial<User>,
                setEditUserData: React.Dispatch<React.SetStateAction<Partial<User>>>,
                roles: Array<{ name: string }>
            };

            // Obtener el valor actual del rol (en edición o valor original)
            const currentRole = row.original.id === editUserId
                ? (editUserData.roles?.[0]?.name ?? (row.getValue('roles') as Array<{ name: string }>)[0]?.name)
                : (row.getValue('roles') as Array<{ name: string }>)[0]?.name;
            const isError = isUndefined(currentRole);

            if (row.original.id === editUserId) {
                return (
                    <div className="grid items-center">
                        <Select
                            value={currentRole ? currentRole.toUpperCase() : ''}
                            onValueChange={value => {
                                const selectedRole = rolesOptions.find(r => r.name.toUpperCase() === value);
                                setEditUserData(prev => ({
                                    ...prev,
                                    roles: selectedRole ? [{ ...selectedRole }] : []
                                }));
                            }}
                        >
                            <SelectTrigger className="w-[180px]" variant={isError ? "error" : "underline"}>
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

                        {isError && <ErrorMessage>Debe seleccionar un rol</ErrorMessage>}
                    </div>
                )
            }

            const roles = row.getValue('roles') as Array<{ name: string }> | undefined;
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
            const { editUserId, setEditUserId, editUserData, setEditUserData, updateUser } = table.options.meta as { editUserId: number | null, setEditUserId: React.Dispatch<React.SetStateAction<number | null>>, editUserData: Partial<User>, setEditUserData: React.Dispatch<React.SetStateAction<Partial<User>>>, updateUser: (user: User) => void };
            const [loadingSaving, setLoadingSaving] = useState(false);

            let hasError = false;
            if (row.original.id === editUserId) {
                const name = editUserData.name ?? row.getValue('name');
                const last_name = editUserData.last_name ?? row.getValue('last_name');
                const email = editUserData.email ?? row.getValue('email');
                const role = editUserData.roles?.[0]?.name ?? (row.getValue('roles') as Array<{ name: string }>)[0]?.name;

                hasError =
                    isEmpty(name as string) ||
                    isEmpty(last_name as string) ||
                    isEmpty(role as string) ||
                    isEmpty(email as string) ||
                    !validateEmail(email as string);
            }

            const saveEditUser = async (user: User) => {
                setLoadingSaving(true);
                const dataToSave = {
                    id: user.id,
                    name: editUserData.name ?? user.name,
                    last_name: editUserData.last_name ?? user.last_name,
                    email: editUserData.email ?? user.email,
                    role: (editUserData.roles?.[0]?.name ?? user.roles?.[0]?.name) ?? "",
                };

                try {
                    const response = await axios.put(`/control-acceso/edit-user/${user.id}`, dataToSave);
                    const data = await response.data;

                    if (!data.success) {
                        toast.error(data.message);
                        return;
                    }

                    toast.success(data.message);
                    updateUser({
                        ...user,
                        ...dataToSave,
                        roles: [{ name: dataToSave.role }]
                    });
                    setEditUserId(null);
                    setEditUserData({});
                } catch (error) {
                    if (axios.isAxiosError(error) && error.response) toast.error(error.response.data.message || "Error desconocido del servidor");
                    else toast.error("Error al editar el usuario");
                }

                setLoadingSaving(false);
            }

            const resetUserPassword = async (user: User) => {
                setLoadingSaving(true);

                try {
                    const response = await axios.put(`/control-acceso/reset-user-password/${user.id}`);
                    const data = await response.data;

                    if (!data.success) {
                        toast.error(data.message);
                        return;
                    }

                    toast.success(data.message);
                } catch (error) {
                    if (axios.isAxiosError(error) && error.response) toast.error(error.response.data.message || "Error desconocido del servidor");
                    else toast.error("Error al restablecer la contraseña del usuario");
                }

                setLoadingSaving(false);
            }

            const managedUserActive = async (user: User) => {
                setLoadingSaving(true);

                try {
                    const response = await axios.put(`/control-acceso/managed-user-active/${user.id}`);
                    const data = await response.data;

                    if (!data.success) {
                        toast.error(data.message);
                        return;
                    }

                    if (data.action) {
                        updateUser({ ...user, roles: [], is_active: false });
                        toast.warning(data.message);
                    } else {
                        updateUser({ ...user, is_active: true });
                        toast.success(data.message);
                    }
                } catch (error) {
                    if (axios.isAxiosError(error) && error.response) toast.error(error.response.data.message || "Error desconocido del servidor");
                    else toast.error("Error al cambiar el estado del usuario");
                }

                setLoadingSaving(false);
            }

            if (loadingSaving) {
                return (
                    <div className="text-right flex gap-3 ml-[2.4rem]">
                        <Loader2Icon className="animate-spin" />
                    </div>
                );
            }

            if (!user.is_active) {
                return (
                    <div className="text-right flex gap-3 ml-[2.4rem]">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="p-0! cursor-pointer hover:bg-gray-0 hover:[&>svg]:drop-shadow-[0_0_1px_rgba(0,117,149,0.5)]"
                                        onClick={() => managedUserActive(user)}>
                                        <LockKeyhole className='w-6! h-6! text-cyan-500' />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Habilitar</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                )
            }

            if (row.original.id === editUserId) {
                return (
                    <div className="text-right flex gap-3 ml-[2.4rem]">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="p-0! cursor-pointer hover:bg-gray-0 hover:[&>svg]:drop-shadow-[0_0_1px_rgba(217,119,6,0.5)]"
                                        onClick={() => saveEditUser(user)}
                                        disabled={hasError}>
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
                                        onClick={() => {
                                            setEditUserId(null);
                                            setEditUserData({});
                                        }}>
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
                                    <Button variant="ghost"
                                        className="p-0! cursor-pointer hover:bg-gray-0 hover:[&>svg]:drop-shadow-[0_0_1px_rgba(0,117,149,0.5)]"
                                        onClick={() => resetUserPassword(user)}>
                                        <KeyRound className='w-6! h-6! text-cyan-500' />
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
                                    <Button variant="ghost"
                                        className="p-0! cursor-pointer hover:bg-gray-0 hover:[&>svg]:drop-shadow-[0_0_1px_rgba(199,0,54,0.5)]"
                                        onClick={() => managedUserActive(user)}>
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
