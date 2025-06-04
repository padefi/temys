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
    user: number;
    module: number;
}

export function Modulos({ setModuleSelected, setModuleSelectedIsAssigned, setMenuSelected, user, module }: ModulosProps) {
    const [dataModulos, setDataModulos] = useState<Modulo[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingPermissions, setLoadingPermissions] = useState(true);
    const [isClicked, setIsClicked] = useState(0);
    const [dataPermission, setDataPermission] = useState<{ sectionName: string; option: string, idOption: number, permissionAssigned: [] }>({ sectionName: '', option: '', idOption: 0, permissionAssigned: [] });

    useEffect(() => {
        fetchDataModulo();
    }, []);

    const fetchDataModulo = async () => {
        setLoading(true);

        try {
            const response = await fetch(`/user-model-panel/get-module-by-user/${user}/${module}`);
            const data = await response.json();
            
            setDataModulos(data.data);
        } catch (error) {
            console.error("Error al obtener los módulos:", error);
        } finally {
            setLoading(false);
        }
    };

    const seccion = async (option: string, idOption: number) => {
        try {
            const response = await fetch(`/user-model-panel/managed-permissions-modulos-by-user/${user}/${idOption}`);
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
            const response = await axios.post('/user-model-panel/managed-permissions-modulos-by-user/', {
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
                    {dataModulos ? (
                        dataModulos.map((modulo, index) => (
                            <div key={index} className="flex items-center justify-between">
                                {/* <Link
                                    href="#"
                                    className={cn(
                                        buttonVariants({ variant: isClicked === index ? "default" : "ghost", size: "sm" }),
                                        isClicked === index &&
                                        "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                                        "justify-start w-0 flex-1"
                                    )}
                                >
                                    {modulo.name}
                                </Link> */}
                                <p className="inline-flex items-center whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white justify-start w-0 flex-1 py-2 cursor-default">{modulo.name}</p>
                                {modulo.is_assigned === 0 && (
                                    <div key={modulo.id + index} className="flex items-center justify-between gap-3">
                                        {!modulo.has_menus && (
                                            <PermisosPopover dataPermission={dataPermission}
                                                onClick={() => {
                                                    setLoadingPermissions(true);
                                                    seccion(modulo.name, modulo.id);
                                                }}
                                                onPermissionChange={(option) => togglePermissionAssignment(modulo.id, option)}
                                                loadingPermissions={loadingPermissions} />
                                        )}
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
