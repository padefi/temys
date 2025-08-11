import { useEffect, useState } from "react";
import { Skeleton } from "@/Components/ui/skeleton"
import { Button } from "@/Components/ui/button";
import { ScrollArea } from "@/Components/ui/scroll-area"
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";

import { PermisosPopover } from "./PermisosPopover";
import { RemovePopover } from "./RemovePopover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";

interface Submenu {
    id: number;
    name: string;
    is_assigned: number;
}

interface SubemnusProps {
    moduleSelected: number;
    moduleSelectedIsAssigned: boolean;
    moduleSelectedRoleModule: string;
    menuSelected: number;
    menuSelectedIsAssigned: boolean;
    user: number;
}

export function Submenus({ moduleSelected, moduleSelectedIsAssigned, moduleSelectedRoleModule, menuSelected, menuSelectedIsAssigned, user }: SubemnusProps) {
    const [dataSubmenus, setDataSubmenus] = useState<Submenu[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingPermissions, setLoadingPermissions] = useState(true);
    const [dataPermission, setDataPermission] = useState<{ sectionName: string; option: string, idOption: number, permissionAssigned: [] }>({ sectionName: '', option: '', idOption: 0, permissionAssigned: [] });

    const seccion = async (option: string, idOption: number) => {
        try {
            const response = await fetch(`/user-model-panel/managed-permissions-submenus-by-user/${user}/${idOption}`);
            const data = await response.json();

            setDataPermission({ sectionName: 'Submenu', option, idOption, permissionAssigned: data });
            setLoadingPermissions(false);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) toast.error(error.response.data.message || "Error desconocido del servidor");
            else toast.error("Error al obtener los permisos asignados al usuario");
        }
    };

    const togglePermissionAssignment = async (idSubmenu: number, permission: string) => {
        try {
            const response = await axios.post('/user-model-panel/managed-permissions-submenus-by-user/', {
                user,
                idSubmenu,
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
            else toast.error("Error al asignar el permiso al submenú");
        }
    }

    const fetchDataSubmenus = async () => {
        setLoading(true);

        if (menuSelected === 0) {
            setDataSubmenus([]);
            return;
        }

        try {
            const response = await fetch(`/user-model-panel/show-submenus-by-user/${user}/${menuSelected}`);
            const data = await response.json();
            setDataSubmenus(data.data);
        } catch (error) {
            console.error("Error al obtener los submenus:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDataSubmenus();
    }, [menuSelected]);

    const toggleSubmenuAssignment = async (idModule: number, idMenu: number, idSubmenu: number, isAssigned: number) => {
        try {
            const response = await axios.post('/user-model-panel/managed-submenus-by-user/', {
                user,
                idModule,
                idMenu,
                idSubmenu
            })

            const data = await response.data;

            if (!data.success) {
                toast.error(data.message);
                return;
            }

            if (data.action === "add") toast.success(data.message);
            else toast.warning(data.message);

            setDataSubmenus((prevData) => {
                if (!prevData) return null;

                return prevData.map((submenu) =>
                    submenu.id === idSubmenu
                        ? { ...submenu, is_assigned: isAssigned }
                        : submenu
                );
            });
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) toast.error(error.response.data.message || "Error desconocido del servidor");
            else toast.error("Error al cambiar el estado del submenú");
        }
    };

    return (
        <AnimatePresence mode="wait">
            {loading ? (
                <motion.div
                    key="skeleton"
                    className="flex flex-col gap-4 py-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </motion.div>
            ) : (
                <ScrollArea className="h-[calc(100vh-14rem)] md:h-[calc(100vh-19rem)] lg:h-[calc(100vh-23rem)] xl:h-[calc(100vh-24rem)] 2xl:h-[calc(100vh-39rem)] w-[-webkit-fill-available]">
                    <motion.div
                        key="content"
                        className="group flex flex-col gap-4 py-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                        <nav className="grid gap-1 px-2">
                            {dataSubmenus && dataSubmenus.length > 0 ? (
                                dataSubmenus.map((submenu, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <p className="text-sm font-medium py-2 cursor-default">{submenu.name}</p>
                                        {moduleSelectedIsAssigned && menuSelectedIsAssigned && (
                                            <AnimatePresence mode="wait">
                                                {submenu.is_assigned === 0 ? (
                                                    <motion.div
                                                        key={`${submenu.id}-assigned-0`}
                                                        className="flex items-center justify-between gap-3"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ duration: 0.25 }}
                                                    >
                                                        <Button
                                                            className="p-0! hover:bg-gray-0 hover:[&>svg]:drop-shadow-[0_0_1px_rgba(217,119,6,0.5)]"
                                                            variant="ghost"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                toggleSubmenuAssignment(moduleSelected, menuSelected, submenu.id, 1);
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
                                                                        <p>Agregar submenú</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </Button>
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        key={`${submenu.id}-assigned-1`}
                                                        className="flex items-center justify-between gap-3"
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ duration: 0.25 }}
                                                    >
                                                        <PermisosPopover dataPermission={dataPermission}
                                                            onClick={() => {
                                                                setLoadingPermissions(true);
                                                                seccion(submenu.name, submenu.id);
                                                            }}
                                                            onPermissionChange={(option) => togglePermissionAssignment(submenu.id, option)}
                                                            loadingPermissions={loadingPermissions}
                                                            disabled={moduleSelectedRoleModule == "encargado"} />

                                                        <RemovePopover seccion="submenú"
                                                            opcion={submenu.name} onClick={() => toggleSubmenuAssignment(moduleSelected, menuSelected, submenu.id, 0)}
                                                            disabled={moduleSelectedRoleModule == "encargado"} />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p>No se encontraron submenús.</p>
                            )}
                        </nav>
                    </motion.div>
                </ScrollArea>
            )}
        </AnimatePresence>
    );
}
