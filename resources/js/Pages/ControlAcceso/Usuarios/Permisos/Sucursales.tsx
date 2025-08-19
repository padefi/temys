import { useEffect, useState } from "react";
import { Skeleton } from "@/Components/ui/skeleton"
import { Link } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/Components/ui/button";
import { ScrollArea } from "@/Components/ui/scroll-area"
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";

import { RemovePopover } from "./RemovePopover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";

interface Sucursal {
    id: number;
    name: string;
    is_assigned: number;
}

interface SucursalesProps {
    setBranchSelected: (id: number) => void;
    setBranchSelectedIsAssigned: (status: boolean) => void;
    setModuleSelected: (id: number) => void;
    setModuleSelectedIsAssigned: (status: boolean) => void;
    user: number;
}

export function Sucursales({ setBranchSelected, setBranchSelectedIsAssigned, setModuleSelected, setModuleSelectedIsAssigned, user }: SucursalesProps) {
    const [dataSucursales, setDataSucursales] = useState<Sucursal[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [isClicked, setIsClicked] = useState(-1);

    useEffect(() => {
        fetchDataSucursales();
    }, []);

    const fetchDataSucursales = async () => {
        setLoading(true);
        setIsClicked(-1);

        try {
            const response = await fetch(`/control-acceso/show-branches-by-user/${user}`);
            const data = await response.json();

            setDataSucursales(data.data);
        } catch (error) {
            console.error("Error al obtener las sucursales:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleBranchAssignment = async (idBranch: number, isAssigned: number, index: number) => {
        try {
            const response = await axios.post(`/control-acceso/managed-branches-by-user`, {
                user,
                idBranch
            });

            const data = response.data;

            if (!data.success) {
                toast.error(data.message);
                return;
            }

            if (data.action === "add") {
                toast.success(data.message);
            } else {
                setModuleSelected(0);
                setModuleSelectedIsAssigned(false);
                toast.warning(data.message);
            }

            setIsClicked(index);
            setBranchSelected(isAssigned === 1 ? idBranch : 0);
            setBranchSelectedIsAssigned(isAssigned === 1 ? true : false);
            setDataSucursales((prevData) => {
                if (!prevData) return null;

                return prevData.map((sucursal) =>
                    sucursal.id === idBranch
                        ? { ...sucursal, is_assigned: isAssigned }
                        : sucursal
                );
            });
        } catch (error: any) {
            if (axios.isAxiosError(error) && error.response) toast.error(error.response.data.message || "Error desconocido del servidor");
            else toast.error("Error al cambiar el estado de la sucursal");
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
                            {dataSucursales && dataSucursales.length > 0 ? (
                                dataSucursales.map((sucursal, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <Link
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setIsClicked(index);
                                                setBranchSelected(sucursal.id);
                                                setBranchSelectedIsAssigned(sucursal.is_assigned === 1 ? true : false);
                                                setModuleSelected(0);
                                            }}
                                            className={cn(
                                                buttonVariants({ variant: isClicked === index ? "default" : "ghost", size: "sm" }),
                                                isClicked === index &&
                                                "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                                                "justify-start w-0 flex-1"
                                            )}
                                        >
                                            {sucursal.name}
                                        </Link>

                                        <AnimatePresence mode="wait">
                                            {sucursal.is_assigned === 0 ? (
                                                <motion.div
                                                    key={`${sucursal.id}-assigned-0`}
                                                    className="flex items-center justify-between gap-3"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.25, ease: "easeInOut" }}
                                                >
                                                    <Button
                                                        className="p-0! hover:bg-gray-0 hover:[&>svg]:drop-shadow-[0_0_1px_rgba(217,119,6,0.5)]"
                                                        variant="ghost"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            toggleBranchAssignment(sucursal.id, 1, index);
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
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key={`${sucursal.id}-assigned-1`}
                                                    className="flex items-center justify-between gap-3"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.25, ease: "easeInOut" }}
                                                >
                                                    <RemovePopover seccion="módulo" opcion={sucursal.name} onClick={() => toggleBranchAssignment(sucursal.id, 0, -1)} disabled={false} />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))
                            ) : (
                                <p>No se encontraron sucursales.</p>
                            )}
                        </nav>
                    </motion.div>
                </ScrollArea>
            )}
        </AnimatePresence>
    );
}
