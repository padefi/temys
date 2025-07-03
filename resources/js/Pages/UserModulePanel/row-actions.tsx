import { Button } from "@/Components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip";
import { Ban, KeyRound, Loader2Icon, LockKeyhole, Pencil, Waypoints } from "lucide-react";
import { usePermissions } from "@/composables/permissions";
import { User } from "./page";
import { toast } from 'sonner';
import { useState } from "react";
import { PermisosDialog } from "./Permisos/PermisosDialog";
import axios from 'axios';

interface RowActionsProps {
    user: User;
    module: number;
    disabled?: boolean
}

export const RowActions: React.FC<RowActionsProps> =(
    { user, module, disabled }: RowActionsProps) => {
    const { userAuth } = usePermissions();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoadingAction, setIsLoadingAction] = useState(false);

    const actions = [
        {
            icon: Waypoints,
            tooltip: "Permisos",
            color: "text-emerald-500",
            shadowColor: "rgba(0,117,149,0.5)",
            onClick: () => { setIsDialogOpen(true) },
            disabled: isLoadingAction || disabled,
            show: true,
        },
    ];

    if (isLoadingAction) {
        return (
            <div className="text-right flex gap-3 ml-[2.4rem]">
                <Loader2Icon className="animate-spin" />
            </div>
        );
    }

    if (userAuth.id === user.id || user.module_roles.length === 0 || user.module_roles.some(role => role.name === 'encargado')) {
        return <span className="text-sm text-gray-500">Sin acciones</span>;
    }

    return (
        <>
            <div className="text-right flex gap-3">
                <TooltipProvider>
                    {actions.filter(action => action.show).map((action, index) => (
                        <Tooltip key={index}>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className={`p-0! cursor-pointer hover:bg-gray-0 hover:[&>svg]:drop-shadow-[0_0_1px_${action.shadowColor}]`}
                                    onClick={action.onClick}
                                    disabled={action.disabled}
                                >
                                    <action.icon className={`w-6! h-6! ${action.color}`} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>{action.tooltip}</p></TooltipContent>
                        </Tooltip>
                    ))}
                </TooltipProvider>
            </div>

            <PermisosDialog open={isDialogOpen} setOpen={setIsDialogOpen} user={user} module={module} />
        </>
    );
}