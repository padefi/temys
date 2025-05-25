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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip";

interface Menu {
    id: number;
    name: string;
    is_assigned: number;
    has_submenus: boolean;
}

interface MenusProps {
    moduleSelected: number;
    moduleSelectedIsAssigned: boolean;
    setMenuSelected: (id: number) => void;
    setMenuSelectedIsAssigned: (status: boolean) => void;
    user: number;
}

export function Menus({ moduleSelected, moduleSelectedIsAssigned, setMenuSelected, setMenuSelectedIsAssigned, user }: MenusProps) {
    const [dataMenus, setDataMenus] = useState<Menu[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingPermissions, setLoadingPermissions] = useState(true);
    const [isClicked, setIsClicked] = useState(-1);
    const [dataPermission, setDataPermission] = useState<{ sectionName: string; option: string, idOption: number, permissionAssigned: [] }>({ sectionName: '', option: '', idOption: 0, permissionAssigned: [] });

    const seccion = async (option: string, idOption: number) => {
        try {
            const response = await fetch(`/control-acceso/managed-permissions-menus-by-user/${user}/${idOption}`);
            const data = await response.json();

            setDataPermission({ sectionName: 'Menu', option, idOption, permissionAssigned: data });
            setLoadingPermissions(false);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) toast.error(error.response.data.message || "Error desconocido del servidor");
            else toast.error("Error al obtener los permisos asignados al usuario");
        }
    };

    const togglePermissionAssignment = async (idMenu: number, permission: string) => {
        try {
            const response = await axios.post('/control-acceso/managed-permissions-menus-by-user/', {
                user,
                idMenu,
                permission
            })

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

    const fetchDataMenus = async () => {
        setIsClicked(-1);
        setLoading(true);

        if (moduleSelected === 0) {
            setDataMenus([]);
            return;
        }

        try {
            const response = await fetch(`/control-acceso/show-menus-by-user/${user}/${moduleSelected}`);
            const data = await response.json();
            setDataMenus(data.data);
        } catch (error) {
            console.error("Error al obtener los menús:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDataMenus();
    }, [moduleSelected]);

    const toggleMenuAssignment = async (idModule: number, idMenu: number, isAssigned: number) => {
        try {
            const response = await axios.post('/control-acceso/managed-menus-by-user/', {
                user,
                idModule,
                idMenu
            });

            const data = response.data;

            if (!data.success) {
                toast.error(data.message);
                return;
            }

            if (data.action === "add") {
                setMenuSelectedIsAssigned(true);
                toast.success(data.message);
            } else {
                setIsClicked(-1);
                setMenuSelected(0);
                setMenuSelectedIsAssigned(false);
                toast.warning(data.message);
            }

            setDataMenus((prevData) => {
                if (!prevData) return null;

                return prevData.map((menu) =>
                    menu.id === idMenu
                        ? { ...menu, is_assigned: isAssigned }
                        : menu
                );
            });

        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response) toast.error(error.response.data.message || "Error desconocido del servidor");
            else toast.error("Error al cambiar el estado del menú");
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
        <ScrollArea className="h-[calc(100vh-14rem)] md:h-[calc(100vh-19rem)] lg:h-[calc(100vh-23rem)] xl:h-[calc(100vh-29rem)] 2xl:h-[calc(100vh-39rem)] w-[-webkit-fill-available]">
            <div className="group flex flex-col gap-4 py-2">
                <nav className="grid gap-1 px-2">
                    {dataMenus && dataMenus.length > 0 ? (
                        dataMenus.map((menu, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <Link
                                    key={index}
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsClicked(index);
                                        setMenuSelected(menu.id);
                                        setMenuSelectedIsAssigned(menu.is_assigned === 1 ? true : false);
                                    }}
                                    className={cn(
                                        buttonVariants({ variant: isClicked === index ? "default" : "ghost", size: "sm" }),
                                        isClicked === index &&
                                        "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                                        "justify-start w-0 flex-1"
                                    )}
                                >
                                    {menu.name}
                                </Link>
                                {moduleSelectedIsAssigned && (
                                    menu.is_assigned === 0 ? (
                                        <Button
                                            className="p-0! hover:bg-gray-0 hover:[&>svg]:drop-shadow-[0_0_1px_rgba(217,119,6,0.5)]"
                                            variant="ghost"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                toggleMenuAssignment(moduleSelected, menu.id, 1);
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
                                                        <p>Agregar menú</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </Button>
                                    ) : (
                                        <div key={menu.id + index} className="flex items-center justify-between">
                                            {!menu.has_submenus && (
                                                <PermisosPopover dataPermission={dataPermission}
                                                    onClick={() => {
                                                        setLoadingPermissions(true);
                                                        seccion(menu.name, menu.id)
                                                    }}
                                                    onPermissionChange={(option) => togglePermissionAssignment(menu.id, option)}
                                                    loadingPermissions={loadingPermissions} />
                                            )}

                                            <ConfirmPopover seccion="menú" opcion={menu.name} onClick={() => toggleMenuAssignment(moduleSelected, menu.id, 0)} />
                                        </div>
                                    )
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No se encontraron menús.</p>
                    )}
                </nav>
            </div>
        </ScrollArea>
    );
}
