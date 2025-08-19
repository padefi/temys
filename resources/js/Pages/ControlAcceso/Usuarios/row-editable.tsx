import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip";
import { FloatingLabelInput } from "@/Components/ui/floating-label-input";
import { isEmpty, validateEmail } from "@/utils/validateFunctions";
import { ErrorMessage } from "@/Components/ui/error-message";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Button } from '@/Components/ui/button';
import { Loader2Icon, Save, XCircle } from 'lucide-react';
import { AnimatePresence, motion } from "framer-motion";
import { usePermissions } from "@/composables/permissions";
import { User } from './page';

interface RowEditableProps {
    user: User;
    type: string;
    label: string;
    initialValue: string;
    columnId: keyof User;
    selectData?: { label: string; value: string }[];
    onValueChange: (columnId: keyof User, value: string) => void;
    onSaveInlineEdit: (updatedUser: User) => void;
    onCancelInlineEdit: () => void;
    disabled?: boolean
}

export const RowEditable = React.memo(({
    user,
    type,
    label,
    initialValue,
    columnId,
    selectData = [],
    onValueChange,
    onSaveInlineEdit,
    onCancelInlineEdit,
    disabled,
}: RowEditableProps) => {
    const [localValue, setLocalValue] = useState(initialValue);
    const { hasMenuPermission } = usePermissions();
    const [isLoadingAction, setIsLoadingAction] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const initialValueSet = useRef(false);

    useEffect(() => {
        if (!initialValueSet.current || initialValue !== localValue) {
            setLocalValue(initialValue);
            initialValueSet.current = true;
        }

        setErrorMessage(validateInput(initialValue));
    }, [initialValue]);

    const validateInput = useCallback((value: string): string => {
        if (type === 'email' && !validateEmail(value)) return 'Email inválido';
        if (isEmpty(value)) return 'Campo obligatorio';
        return '';
    }, [type]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setLocalValue(newValue);
        const error = validateInput(newValue);
        setErrorMessage(error);
        onValueChange(columnId, newValue);
    };

    const handleSelectChange = useCallback((newValue: string) => {
        setLocalValue(newValue);
        const error = validateInput(newValue);
        setErrorMessage(error);
        onValueChange(columnId, newValue);
    }, [validateInput, columnId]);

    if (columnId as string !== 'actions') {
        return (
            <div className="grid items-center">
                {type === 'select' ? (
                    <Select
                        value={localValue}
                        onValueChange={handleSelectChange}
                        disabled={disabled}
                    >
                        <SelectTrigger className="h-8 w-full" variant={errorMessage ? 'error' : 'underline'}>
                            <SelectValue placeholder="Seleccionar Rol" />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {selectData.map((data, index) => (
                                <SelectItem key={index} value={data.value}>
                                    {data.value}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                ) : (
                    <FloatingLabelInput
                        id={columnId.toString()}
                        label={label}
                        type="text"
                        className="text-sm"
                        autoComplete='off'
                        variant={errorMessage ? 'error' : 'underline'}
                        value={localValue}
                        onChange={handleChange}
                        disabled={disabled}
                    />
                )}

                {/* {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>} */}
                <AnimatePresence initial={false}>
                    {errorMessage && (
                        <motion.div
                            key="error-message" // Key única para que AnimatePresence lo detecte
                            initial={{ opacity: 0, height: 0 }} // Comienza invisible y sin altura
                            animate={{ opacity: 1, height: 'auto' }} // Anima a visible y altura automática
                            exit={{ opacity: 0, height: 0 }} // Desaparece y altura a 0
                            transition={{ duration: 0.2, ease: "easeInOut" }} // Duración y tipo de easing
                            style={{ overflow: 'hidden' }} // Importante para que height: 0 oculte el contenido
                        >
                            <ErrorMessage>{errorMessage}</ErrorMessage>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    } else {
        const actions = [
            {
                icon: Save,
                tooltip: "Guardar",
                action: "save",
                color: "text-green-500",
                shadowColor: "rgba(34,197,94,0.5)",
                onClick: () => { setIsLoadingAction(true), setTimeout(() => onSaveInlineEdit(user), 100) },
                disabled: disabled || isLoadingAction,
                show: hasMenuPermission('usuariosControlAcceso', 'update') && user.is_active,
            },
            {
                icon: XCircle,
                tooltip: "Cancelar",
                action: "cancel",
                color: "text-red-500",
                shadowColor: "rgba(34,197,94,0.5)",
                onClick: () => onCancelInlineEdit(),
                disabled: disabled || isLoadingAction,
                show: true,
            }
        ];

        return (
            <div className="text-right flex gap-2">
                <TooltipProvider>
                    {actions.filter(action => action.show).map((action) => (
                        <Tooltip key={action.action}>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className={`p-0! cursor-pointer hover:bg-gray-0 hover:[&>svg]:drop-shadow-[0_0_1px_${action.shadowColor}]`}
                                    onClick={action.onClick}
                                    disabled={action.disabled}
                                >
                                    <AnimatePresence mode="wait" initial={false}>
                                        {action.action === "save" && (isLoadingAction || disabled) ? (
                                            <motion.div
                                                key="loader-save"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                transition={{ duration: 0.1, ease: "easeInOut" }}
                                            >
                                                <Loader2Icon className={`animate-spin w-6! h-6!`} />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key={`icon-${action.action}`}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                transition={{ duration: 0.1, ease: "easeInOut" }}
                                            >
                                                <action.icon className={`w-6! h-6! ${action.color}`} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>{action.tooltip}</p></TooltipContent>
                        </Tooltip>
                    ))}
                </TooltipProvider>
            </div>
        );
    }
});