import { Button } from "@/Components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip";
import { Ban, KeyRound, Loader2Icon, LockKeyhole, Pencil, Waypoints } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
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
    disabled?: boolean
}

export const RowActions = React.memo((
    { user, onUserUpdate, onEditClick, isEditing, disabled }: RowActionsProps) => {
    const { userAuth, hasMenuPermission } = usePermissions();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoadingAction, setIsLoadingAction] = useState(false);
    const [loadingAction, setLoadingAction] = useState<string | null>(null);

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

    const managedUserActive = async (user: User, action: string) => {
        setIsLoadingAction(true);

        try {
            const response = await axios.patch(`/control-acceso/${action}-user-active/${user.id}`);
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
            action: "edit",
            color: "text-amber-500",
            shadowColor: "rgba(217,119,6,0.5)",
            onClick: () => { setLoadingAction('edit'), onEditClick() },
            disabled: isLoadingAction || disabled || isEditing,
            show: hasMenuPermission('usuariosControlAcceso', 'update') && user.is_active,
        },
        {
            icon: Waypoints,
            tooltip: "Permisos",
            action: "permissions",
            color: "text-emerald-500",
            shadowColor: "rgba(0,117,149,0.5)",
            onClick: () => { setLoadingAction('permissions'), setIsDialogOpen(true) },
            disabled: isLoadingAction || disabled,
            show: hasMenuPermission('usuariosControlAcceso', 'update') && user.is_active,
        },
        {
            icon: KeyRound,
            tooltip: "Reestablecer contraseña",
            action: "reset-password",
            color: "text-cyan-500",
            shadowColor: "rgba(0,117,149,0.5)",
            onClick: () => { setLoadingAction('reset-password'), resetUserPassword(user); },
            disabled: isLoadingAction || disabled,
            show: hasMenuPermission('usuariosControlAcceso', 'update') && user.is_active,
        },
        {
            icon: Ban,
            tooltip: "Deshabilitar usuario",
            action: "disable",
            color: "text-red-500",
            shadowColor: "rgba(199,0,54,0.5)",
            onClick: () => { setLoadingAction('disable'), managedUserActive(user, 'disable') },
            disabled: isLoadingAction || disabled,
            show: hasMenuPermission('usuariosControlAcceso', 'avoid') && user.is_active,
        },
        {
            icon: LockKeyhole,
            tooltip: "Habilitar usuario",
            action: "enable",
            color: "text-cyan-500",
            shadowColor: "rgba(0,117,149,0.5)",
            onClick: () => { setLoadingAction('enable'), managedUserActive(user, 'enable') },
            disabled: isLoadingAction || disabled,
            show: hasMenuPermission('usuariosControlAcceso', 'restore') && !user.is_active,
        },
    ];

    if (userAuth.id === user.id) {
        return <span className="text-sm text-gray-500">Sin acciones</span>;
    }

    return (
        <div className="text-right flex gap-3">
            <TooltipProvider>
                <AnimatePresence initial={false}>
                    {actions.filter(action => action.show && !(action.tooltip === "Permisos" && (user.roles.length === 0 || user.roles.some(role => role.name === 'admin')))).map((action) => (
                        <motion.div
                            key={action.tooltip}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.35, ease: "easeInOut" }}
                        >
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className={`p-0! cursor-pointer hover:bg-gray-0 hover:[&>svg]:drop-shadow-[0_0_1px_${action.shadowColor}]`}
                                        onClick={action.onClick}
                                        disabled={action.disabled && !(isLoadingAction && action.action == loadingAction)}
                                    >
                                        {isLoadingAction && action.action == loadingAction ? (
                                            <Loader2Icon className="animate-spin w-6! h-6!" />
                                        ) : (
                                            <action.icon className={`w-6! h-6! ${action.color}`} />
                                        )}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>{action.tooltip}</p></TooltipContent>
                            </Tooltip>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </TooltipProvider>

            {user.roles.length !== 0 && user.roles.some(role => role.name !== 'admin') &&
                <Suspense fallback={null}>
                    <PermisosDialog open={isDialogOpen} setOpen={setIsDialogOpen} user={user} />
                </Suspense>
            }
        </div>
    );
});