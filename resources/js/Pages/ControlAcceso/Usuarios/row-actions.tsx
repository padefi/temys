import { Button } from "@/Components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip";
import { Ban, KeyRound, Loader2Icon, LockKeyhole, Pencil, Waypoints } from "lucide-react";
import { usePermissions } from "@/composables/permissions";
import { User } from "./page";
import { toast } from 'sonner';
import React, { Suspense, useState } from "react";
import axios from 'axios';

const PermisosDialog = React.lazy(() => import("./Permisos/PermisosDialog"));

interface RowActionsProps {
    user: User;
    onUserUpdate: (updatedUser: User) => void;
    onEditClick: () => void;
    isEditing: boolean;
    isLoadingAction?: boolean;
    hasValidationErrors?: boolean;
    disabled?: boolean
}

export const RowActions = React.memo((
    { user, onUserUpdate, onEditClick, isEditing, disabled }: RowActionsProps) => {
    const { userAuth } = usePermissions();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoadingAction, setIsLoadingAction] = useState(false);

    const resetUserPassword = async (user: User) => {
        setIsLoadingAction(true);

        try {
            const response = await axios.put(`/control-acceso/reset-user-password/${user.id}`);
            const data = await response.data;

            if (!data.success) {
                toast.error(data.message);
                return;
            }

            toast.success(data.message);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) toast.error(error.response.data.message || "Error desconocido del servidor");
            else toast.error("Error al restablecer la contraseña del usuario");
        } finally {
            setIsLoadingAction(false);
        }
    }

    const managedUserActive = async () => {
        setIsLoadingAction(true);

        try {
            const response = await axios.put(`/control-acceso/managed-user-active/${user.id}`);
            const data = response.data;

            if (!data.success) {
                toast.error(data.message);
                return;
            }

            const updatedUser = { ...user, is_active: data.action === 'enable' ? true : false, roles: [] };
            onUserUpdate(updatedUser);

            if (data.action === 'enable') toast.success(data.message);
            else toast.warning(data.message);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data.message || "Error desconocido del servidor");
            } else {
                toast.error("Error al cambiar el estado del usuario");
            }
        } finally {
            setIsLoadingAction(false);
        }
    };

    const actions = [
        {
            icon: Pencil,
            tooltip: "Editar",
            color: "text-amber-500",
            shadowColor: "rgba(217,119,6,0.5)",
            onClick: onEditClick,
            disabled: isLoadingAction || disabled || isEditing,
            show: true,
        },
        {
            icon: Waypoints,
            tooltip: "Permisos",
            color: "text-emerald-500",
            shadowColor: "rgba(0,117,149,0.5)",
            onClick: () => { setIsDialogOpen(true) },
            disabled: isLoadingAction || disabled,
            show: true,
        },
        {
            icon: KeyRound,
            tooltip: "Reestablecer contraseña",
            color: "text-cyan-500",
            shadowColor: "rgba(0,117,149,0.5)",
            onClick: () => { resetUserPassword(user); },
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

    if (!user.is_active) {
        return (
            <div className="text-right flex gap-3 ml-[2.4rem]">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                className="p-0! cursor-pointer hover:bg-gray-0 hover:[&>svg]:drop-shadow-[0_0_1px_rgba(0,117,149,0.5)]"
                                onClick={managedUserActive}
                                disabled={isLoadingAction}
                            >
                                <LockKeyhole className='w-6! h-6! text-cyan-500' />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Habilitar</p></TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        );
    }

    if (userAuth.id === user.id) {
        return <span className="text-sm text-gray-500">Sin acciones</span>;
    }

    return (
        <>
            <div className="text-right flex gap-3">
                <TooltipProvider>
                    {actions.filter(action => action.show).map((action, index) => (
                        action.tooltip === "Permisos" && (user.roles.length === 0 || user.roles.some(role => role.name === 'admin')) ? null :
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
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                className="p-0! cursor-pointer hover:bg-gray-0 hover:[&>svg]:drop-shadow-[0_0_1px_rgba(199,0,54,0.5)]"
                                onClick={managedUserActive}
                                disabled={isLoadingAction || disabled}
                            >
                                <Ban className='w-6! h-6! text-red-500' />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Deshabilitar</p></TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            {user.roles.length !== 0 && user.roles.some(role => role.name !== 'admin') &&
                <Suspense fallback={null}>
                    <PermisosDialog open={isDialogOpen} setOpen={setIsDialogOpen} user={user} />
                </Suspense>
            }
        </>
    );
});