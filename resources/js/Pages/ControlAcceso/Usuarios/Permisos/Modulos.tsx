import { useEffect, useState } from "react";
import { Skeleton } from "@/Components/ui/skeleton"
import { Link } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/Components/ui/button";
import { ScrollArea } from "@/Components/ui/scroll-area"
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";

import { PermisosPopover } from "./PermisosPopover";
import axios from "axios";
import { ConfirmPopover } from "./ConfimPopover";
import { RolePopover } from "./RolePopover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip";

interface Role {
    id: number;
    name: string;
}

interface Modulo {
    id: number;
    name: string;
    is_assigned: number;
    has_menus: boolean;
    has_role_module: boolean;
}

interface ModulosProps {
    setModuleSelected: (id: number) => void;
    setModuleSelectedIsAssigned: (status: boolean) => void;
    setMenuSelected: (id: number) => void;
    setMenuSelectedIsAssigned: (status: boolean) => void;
    user: number;
}

export function Modulos({ setModuleSelected, setModuleSelectedIsAssigned, setMenuSelected, setMenuSelectedIsAssigned, user }: ModulosProps) {
    const [dataModulos, setDataModulos] = useState<Modulo[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingPermissions, setLoadingPermissions] = useState(true);
    const [loadingRole, setLoadingRole] = useState(true);
    const [isClicked, setIsClicked] = useState(-1);
    const [dataPermission, setDataPermission] = useState<{ sectionName: string; option: string, idOption: number, permissionAssigned: [] }>({ sectionName: '', option: '', idOption: 0, permissionAssigned: [] });
    const [dataRole, setDataRole] = useState<{ sectionName: string; option: string, idOption: number, roles: Role[], roleAssigned: string }>({ sectionName: '', option: '', idOption: 0, roles: [], roleAssigned: '' });
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            const response = await fetch(`/control-acceso/get-module-roles`);
            const data = await response.json();

            setRoles(data.data);
        } catch (error) {
            console.error(error);
        }
    }

    const rolesPopover = async (option: string, idOption: number) => {
        const response = await fetch(`/control-acceso/get-role-module-by-user/${user}/${idOption}`);
        const data = await response.json();
        const roleAssigned = data.data ? data.data.name : '';

        setDataRole({ sectionName: 'Modulo', option, idOption, roles: roles, roleAssigned: roleAssigned });
        setLoadingRole(false);
    }

    const toggleRoleAssignment = async (idModule: number, role: string) => {
        try {
            setModuleSelectedIsAssigned(false);
            const response = await axios.post('/control-acceso/managed-role-modulos-by-user/', {
                user,
                idModule,
                role
            });

            const data = await response.data;

            if (!data.success) {
                toast.error(data.message);
                return;
            }

            setModuleSelectedIsAssigned(true);
            toast.success(data.message);

            setDataModulos((prevData) => {
                if (!prevData) return null;

                return prevData.map((modulo) =>
                    modulo.id === idModule
                        ? { ...modulo, has_role_module: true, }
                        : modulo
                );
            });
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) toast.error(error.response.data.message || "Error desconocido del servidor");
            else toast.error("Error al asignar el rol al módulo");
        }
    }

    const seccion = async (option: string, idOption: number) => {
        try {
            const response = await fetch(`/control-acceso/managed-permissions-modulos-by-user/${user}/${idOption}`);
            const data = await response.json();

            setDataPermission({ sectionName: 'Modulo', option, idOption, permissionAssigned: data });
            setLoadingPermissions(false);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) toast.error(error.response.data.message || "Error desconocido del servidor");
            else toast.error("Error al obtener los permisos asignados al usuario");
        }
    };

    const togglePermissionAssignment = async (idModule: number, permission: string) => {
        try {
            const response = await axios.post('/control-acceso/managed-permissions-modulos-by-user/', {
                user,
                idModule,
                permission
            });

            const data = await response.data;

            if (!data.success) {
                toast.error(data.message);
                return;
            }

            if (data.action === "add") toast.success(data.message);
            else toast.warning(data.message);

            setDataPermission((prev: any) => {
                const exists = prev.permissionAssigned.find((item: any) => item.name === permission);
                let newAssigned;

                if (exists) newAssigned = prev.permissionAssigned.filter((item: any) => item.name !== permission); // Quitar permiso
                else newAssigned = [...prev.permissionAssigned, { name: permission }]; // Agregar permiso

                return { ...prev, permissionAssigned: newAssigned };
            });
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) toast.error(error.response.data.message || "Error desconocido del servidor");
            else toast.error("Error al asignar el permiso al menú");
        }
    }

    const fetchDataModulos = async () => {
        setLoading(true);
        setIsClicked(-1);

        try {
            const response = await fetch(`/control-acceso/show-modulos-by-user/${user}`);
            const data = await response.json();

            setDataModulos(data.data);
        } catch (error) {
            console.error("Error al obtener los módulos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDataModulos();
    }, []);

    const toggleModuleAssignment = async (idModule: number, isAssigned: number) => {
        try {
            const response = await axios.post(`/control-acceso/managed-modulos-by-user`, {
                user,
                idModule
            });

            const data = response.data;

            if (!data.success) {
                toast.error(data.message);
                return;
            }

            if (data.action === "add") {
                toast.success(data.message);
            } else {
                setIsClicked(-1);
                setModuleSelected(0);
                setMenuSelected(0);
                setMenuSelectedIsAssigned(false);
                toast.warning(data.message);
            }

            setModuleSelectedIsAssigned(false);

            setDataModulos((prevData) => {
                if (!prevData) return null;

                return prevData.map((modulo) =>
                    modulo.id === idModule
                        ? { ...modulo, is_assigned: isAssigned, has_role_module: false, }
                        : modulo
                );
            });
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response) toast.error(error.response.data.message || "Error desconocido del servidor");
            else toast.error("Error al cambiar el estado del módulo");
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col gap-4 py-4">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        )
    }

    return (
        <ScrollArea className="h-[calc(100vh-14rem)] md:h-[calc(100vh-19rem)] lg:h-[calc(100vh-23rem)] xl:h-[calc(100vh-24rem)] 2xl:h-[calc(100vh-39rem)] w-[-webkit-fill-available]">
            <div className="group flex flex-col gap-4 py-2">
                <nav className="grid gap-1 px-2">
                    {dataModulos && dataModulos.length > 0 ? (
                        dataModulos.map((modulo, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <Link
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsClicked(index);
                                        setModuleSelected(modulo.id);
                                        setModuleSelectedIsAssigned(modulo.is_assigned === 1 && modulo.has_role_module ? true : false);
                                        setMenuSelected(0);
                                    }}
                                    className={cn(
                                        buttonVariants({ variant: isClicked === index ? "default" : "ghost", size: "sm" }),
                                        isClicked === index &&
                                        "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                                        "justify-start w-0 flex-1"
                                    )}
                                >
                                    {modulo.name}
                                </Link>
                                {modulo.is_assigned === 0 ? (
                                    <Button
                                        className="p-0! hover:bg-gray-0 hover:[&>svg]:drop-shadow-[0_0_1px_rgba(217,119,6,0.5)]"
                                        variant="ghost"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            toggleModuleAssignment(modulo.id, 1);
                                        }}
                                    >
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span>
                                                        <PlusCircle className="w-6! h-6! text-emerald-500" />
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Agregar módulo</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </Button>
                                ) : (
                                    <div key={modulo.id + index} className="flex items-center justify-between gap-3">
                                        <RolePopover dataRole={dataRole}
                                            loadingRole={loadingRole}
                                            onClick={() => {
                                                setLoadingRole(true);
                                                rolesPopover(modulo.name, modulo.id);
                                            }}
                                            onRoleChange={(option) => toggleRoleAssignment(modulo.id, option)}
                                        />

                                        {!modulo.has_menus && (
                                            <PermisosPopover dataPermission={dataPermission}
                                                onClick={() => {
                                                    setLoadingPermissions(true);
                                                    seccion(modulo.name, modulo.id);
                                                }}
                                                onPermissionChange={(option) => togglePermissionAssignment(modulo.id, option)}
                                                loadingPermissions={loadingPermissions} />
                                        )}

                                        <ConfirmPopover seccion="módulo" opcion={modulo.name} onClick={() => toggleModuleAssignment(modulo.id, 0)} />
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No se encontraron módulos.</p>
                    )}
                </nav>
            </div>
        </ScrollArea>
    );
}
