import { PropsWithChildren, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/Components/ui/dialog"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/Components/ui/resizable"
import { Button } from "@/Components/ui/button";
import { Separator } from "@/Components/ui/separator";

import { Modulos } from "./Modulos";
import { Menus } from "./Menus";
import { Submenus } from "./Submenus";

interface PermisosDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    user: number;
}

export function PermisosDialog({ open, setOpen, user }: PropsWithChildren<PermisosDialogProps>) {
    const [moduleSelected, setModuleSelected] = useState(0);
    const [menuSelected, setMenuSelected] = useState(0);

    useEffect(() => {
        setModuleSelected(0);
        setMenuSelected(0);
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="min-w-[calc(100vw-3rem)] min-h-[calc(100vh-5rem)] md:min-w-[calc(100vw-10rem)] md:min-h-[calc(100vh-10rem)] lg:min-w-[calc(100vw-19rem)] lg:min-h-[calc(100vh-19rem)] xl:min-w-[calc(100vw-30rem)] xl:min-h-[calc(100vh-20rem)] 2xl:min-w-[calc(100vw-65rem)] 2xl:min-h-[calc(100vh-30rem)] [&_a]:text-wrap">
                <DialogHeader>
                    <DialogTitle>Permisos del Usuario</DialogTitle>
                </DialogHeader>
                <ResizablePanelGroup
                    direction="horizontal"
                    className="min-h-[calc(100vh-10rem)] max-h-[calc(100vh-10rem)] md:min-h-[calc(100vh-15rem)] md:max-h-[calc(100vh-15rem)] lg:min-h-[calc(100vh-20rem)] lg:max-h-[calc(100vh-20rem)] xl:min-h-[calc(100vh-25rem)] xl:max-h-[calc(100vh-25rem)] 2xl:min-h-[calc(100vh-35rem)] 2xl:max-h-[calc(100vh-35rem)] rounded-lg border"
                >
                    <ResizablePanel defaultSize={33}>
                        <div className="flex h-[52px] items-center justify-center">
                            <span className="font-semibold">Modulos</span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-center">
                            <Modulos setModuleSelected={setModuleSelected} setMenuSelected={setMenuSelected} user={user} />
                        </div>
                    </ResizablePanel>
                    <Separator orientation="vertical" />
                    <ResizablePanel defaultSize={33}>
                        <div className="flex h-[52px] items-center justify-center">
                            <span className="font-semibold">Menus</span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-center">
                            <Menus moduleSelected={moduleSelected} setMenuSelected={setMenuSelected} user={user} />
                        </div>
                    </ResizablePanel>
                    <Separator orientation="vertical" />
                    <ResizablePanel defaultSize={33}>
                        <div className="flex h-[52px] items-center justify-center">
                            <span className="font-semibold">Submenus</span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-center">
                            <Submenus menuSelected={menuSelected} user={user} />
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};