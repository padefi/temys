import React, { useEffect, useState } from "react";
import { Skeleton } from "@/Components/ui/skeleton"
import { Link } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/Components/ui/button";
import { ScrollArea } from "@/Components/ui/scroll-area"
import { MinusCircle, PlusCircle } from "lucide-react";

interface Submenu {
    id: number;
    name: string;
    is_assigned: number;
}

interface SubemnusProps {
    menuSelected: number;
    user: number;
}

export function Submenus({ menuSelected, user }: SubemnusProps) {
    const [dataSubmenus, setDataSubmenus] = useState<Submenu[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [isClicked, setIsClicked] = useState(-1);

    useEffect(() => {
        const fetchDataSubmenus = async () => {
            setIsClicked(-1);
            setLoading(true);

            if (menuSelected === 0) {
                setDataSubmenus([]);
                return;
            }

            try {
                const response = await fetch(`/control-acceso/show-submenus-by-user/${user}/${menuSelected}`);
                const data = await response.json();
                setDataSubmenus(data.data);
            } catch (error) {
                console.error("Error al obtener los submenus:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDataSubmenus();
    }, [menuSelected]);

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
                    {dataSubmenus && dataSubmenus.length > 0 ? (
                        dataSubmenus.map((submenu, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <Link
                                    key={index}
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsClicked(index);
                                    }}
                                    className={cn(
                                        buttonVariants({ variant: isClicked === index ? "default" : "ghost", size: "sm" }),
                                        isClicked === index &&
                                        "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                                        "justify-start"
                                    )}
                                >
                                    {submenu.name}
                                </Link>
                                {submenu.is_assigned === 0 ? (
                                    <Button
                                        className="p-0! hover:bg-gray-0 hover:[&>svg]:drop-shadow-[0_0_1px_rgba(217,119,6,0.5)]"
                                        variant="ghost"
                                        onClick={(e) => {
                                            e.preventDefault();
                                        }}
                                    >
                                        <PlusCircle className="w-6! h-6! text-emerald-500" />
                                    </Button>
                                ) : (
                                    <Button
                                        className="p-0! hover:bg-gray-0 hover:[&>svg]:drop-shadow-[0_0_1px_rgba(199,0,54,0.5)]"
                                        variant="ghost"
                                        onClick={(e) => {
                                            e.preventDefault();
                                        }}
                                    >
                                        <MinusCircle className="w-6! h-6! text-red-400" />
                                    </Button>
                                )
                                }
                            </div>
                        ))
                    ) : (
                        <p>No se encontraron submenús.</p>
                    )}
                </nav>
            </div>
        </ScrollArea>
    );
}
