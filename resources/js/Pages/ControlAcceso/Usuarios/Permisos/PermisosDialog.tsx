import { PropsWithChildren, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/Components/ui/dialog"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/Components/ui/resizable"
import { Button } from "@/Components/ui/button";
import { Separator } from "@/Components/ui/separator";

import { Modulos } from "./Modulos";
import { Menus } from "./Menus";
import { Submenus } from "./Submenus";
import { Sucursales } from "./Sucursales";

interface user {
    id: number,
    name: string,
}

interface PermisosDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    user: user;
}

const PermisosDialog = ({ open, setOpen, user }: PropsWithChildren<PermisosDialogProps>) => {
    const [branchSelected, setBranchSelected] = useState(0);
    const [branchSelectedIsAssigned, setBranchSelectedIsAssigned] = useState(false);
    const [moduleSelected, setModuleSelected] = useState(0);
    const [moduleSelectedIsAssigned, setModuleSelectedIsAssigned] = useState(false);
    const [moduleSelectedRoleModule, setModuleSelectedRoleModule] = useState('');
    const [menuSelected, setMenuSelected] = useState(0);
    const [menuSelectedIsAssigned, setMenuSelectedIsAssigned] = useState(false);
console.log(open);

    useEffect(() => {
        setBranchSelected(0);
        setBranchSelectedIsAssigned(false);
        setModuleSelected(0);
        setModuleSelectedIsAssigned(false);
        setModuleSelectedRoleModule('');
        setMenuSelected(0);
        setMenuSelectedIsAssigned(false);
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent onInteractOutside={(e) => e.preventDefault()} className="min-w-[calc(100vw-3rem)] min-h-[calc(100vh-5rem)] md:min-w-[calc(100vw-10rem)] md:min-h-[calc(100vh-10rem)] lg:min-w-[calc(100vw-19rem)] lg:min-h-[calc(100vh-19rem)] xl:min-w-[calc(100vw-25rem)] xl:min-h-[calc(100vh-10rem)] 2xl:min-w-[calc(100vw-55rem)] 2xl:min-h-[calc(100vh-30rem)] [&_a]:text-wrap">
                <DialogHeader>
                    <DialogTitle>
                        Permisos del usuario
                        <strong className="text-amber-500"> {user.name}</strong>
                    </DialogTitle>
                    <DialogDescription>
                        <span className="font-semibold">Seleccione los modulos, menus y submenus que desea asignar al usuario.</span>
                    </DialogDescription>
                </DialogHeader>
                <ResizablePanelGroup
                    orientation="horizontal"
                    className="min-h-[calc(100vh-10rem)] max-h-[calc(100vh-10rem)] md:min-h-[calc(100vh-15rem)] md:max-h-[calc(100vh-15rem)] lg:min-h-[calc(100vh-20rem)] lg:max-h-[calc(100vh-20rem)] xl:min-h-[calc(100vh-20rem)] xl:max-h-[calc(100vh-25rem)] 2xl:min-h-[calc(100vh-35rem)] 2xl:max-h-[calc(100vh-35rem)] rounded-lg border"
                >
                    <ResizablePanel defaultSize={25}>
                        <div className="flex h-13 items-center justify-center">
                            <span className="font-semibold">Sucursales</span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-center">
                            <Sucursales setBranchSelected={setBranchSelected}
                                setBranchSelectedIsAssigned={setBranchSelectedIsAssigned}
                                setModuleSelected={setModuleSelected}
                                setModuleSelectedIsAssigned={setModuleSelectedIsAssigned}
                                user={user.id} />
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={25}>
                        <div className="flex h-13 items-center justify-center">
                            <span className="font-semibold">Modulos</span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-center">
                            <Modulos branchSelected={branchSelected}
                                branchSelectedIsAssigned={branchSelectedIsAssigned}
                                setModuleSelected={setModuleSelected}
                                setModuleSelectedIsAssigned={setModuleSelectedIsAssigned}
                                setMenuSelected={setMenuSelected}
                                setMenuSelectedIsAssigned={setMenuSelectedIsAssigned}
                                setModuleSelectedRoleModule={setModuleSelectedRoleModule}
                                user={user.id} />
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={25}>
                        <div className="flex h-13 items-center justify-center">
                            <span className="font-semibold">Menus</span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-center">
                            <Menus branchSelected={branchSelected}
                                branchSelectedIsAssigned={branchSelectedIsAssigned}
                                moduleSelected={moduleSelected}
                                moduleSelectedIsAssigned={moduleSelectedIsAssigned}
                                moduleSelectedRoleModule={moduleSelectedRoleModule}
                                setMenuSelected={setMenuSelected}
                                setMenuSelectedIsAssigned={setMenuSelectedIsAssigned}
                                user={user.id} />
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel defaultSize={25}>
                        <div className="flex h-13 items-center justify-center">
                            <span className="font-semibold">Submenus</span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-center">
                            <Submenus branchSelected={branchSelected}
                                branchSelectedIsAssigned={branchSelectedIsAssigned}
                                moduleSelected={moduleSelected}
                                moduleSelectedIsAssigned={moduleSelectedIsAssigned}
                                moduleSelectedRoleModule={moduleSelectedRoleModule}
                                menuSelected={menuSelected}
                                menuSelectedIsAssigned={menuSelectedIsAssigned}
                                user={user.id} />
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

export default PermisosDialog;
