import React, { useEffect, useState } from "react";
import { Skeleton } from "@/Components/ui/skeleton"
import { Link } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/Components/ui/button";
import { ScrollArea } from "@/Components/ui/scroll-area"
import { MinusCircle, PlusCircle } from "lucide-react";

interface Menu {
    id: number;
    name: string;
    is_assigned: number;
}

interface MenusProps {
    moduleSelected: number;
    setMenuSelected: (id: number) => void;
    user: number;
}

export function Menus({ moduleSelected, setMenuSelected, user }: MenusProps) {
    const [dataMenus, setDataMenus] = useState<Menu[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [isClicked, setIsClicked] = useState(-1);

    useEffect(() => {
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

        fetchDataMenus();
    }, [moduleSelected]);

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
                                    }}
                                    className={cn(
                                        buttonVariants({ variant: isClicked === index ? "default" : "ghost", size: "sm" }),
                                        isClicked === index &&
                                        "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                                        "justify-start"
                                    )}
                                >
                                    {menu.name}
                                </Link>
                                {menu.is_assigned === 0 ? (
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
                        <p>No se encontraron menús.</p>
                    )}
                </nav>
            </div>
        </ScrollArea>
    );
}
