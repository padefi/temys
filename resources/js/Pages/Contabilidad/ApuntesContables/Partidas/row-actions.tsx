import { Button } from "@/Components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/Components/ui/tooltip";
import { usePermissions } from "@/composables/permissions";
import { Pencil, Save, Trash2, XCircle } from "lucide-react";

type RowActionsProps = {
    optionPermission: string;
    isDisabled: boolean;
    isEditing: boolean;
    hasErrors: boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
    onDelete: () => void;
};

export function RowActions({
    optionPermission,
    isDisabled,
    isEditing,
    hasErrors,
    onEdit,
    onSave,
    onCancel,
    onDelete,
}: RowActionsProps) {
    const { hasSubmenuPermission } = usePermissions();

    const actions = [
        {
            icon: Pencil,
            tooltip: "Editar",
            action: "edit",
            color: "text-amber-500",
            shadowColor: "rgba(217,119,6,0.5)",
            onClick: onEdit,
            disabled: isEditing || isDisabled,
            show: hasSubmenuPermission(optionPermission, 'update') && !isEditing,
        },
        {
            icon: Trash2,
            tooltip: "Eliminar",
            action: "disable",
            color: "text-red-500",
            shadowColor: "rgba(199,0,54,0.5)",
            onClick: onDelete,
            disabled: isEditing || isDisabled,
            show: hasSubmenuPermission(optionPermission, 'avoid') && !isEditing,
        },
        {
            icon: Save,
            tooltip: "Guardar",
            action: "save",
            color: "text-green-500",
            shadowColor: "rgba(34,197,94,0.5)",
            onClick: onSave,
            disabled: !isEditing || hasErrors,
            show: hasSubmenuPermission(optionPermission, 'update') && isEditing,
        },
        {
            icon: XCircle,
            tooltip: "Cancelar",
            action: "cancel",
            color: "text-red-500",
            shadowColor: "rgba(34,197,94,0.5)",
            onClick: onCancel,
            disabled: !isEditing,
            show: isEditing,
        }
    ];

    return (
        <div className="text-right flex gap-3">
            {actions.map((action) => {
                if (!action.show) {
                    return null;
                }

                return (
                    <Tooltip key={action.action}>
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
                );
            })}
        </div>
    );
}
