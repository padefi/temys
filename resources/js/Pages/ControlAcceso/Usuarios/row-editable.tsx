import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/Components/ui/tooltip";
import { FloatingLabelInput } from "@/Components/ui/floating-label-input";
import { isEmpty, validateEmail } from "@/utils/validateFunctions";
import { ErrorMessage } from "@/Components/ui/error-message";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Button } from '@/Components/ui/button';
import { Loader2Icon, Save, XCircle } from 'lucide-react';
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

export const RowEditable: React.FC<RowEditableProps> = ({
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
}) => {
    const [localValue, setLocalValue] = useState(initialValue);
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

                {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
            </div>
        );
    } else {
        if (disabled) {
            return (
                <div className="text-right flex gap-3 ml-[2.4rem]">
                    <Loader2Icon className="animate-spin" />
                </div>
            );
        }

        return (
            <div className="text-right flex gap-3">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                className="p-0! cursor-pointer hover:bg-gray-0 hover:[&>svg]:drop-shadow-[0_0_1px_rgba(34,197,94,0.5)]"
                                onClick={() => onSaveInlineEdit(user)}
                                disabled={disabled}
                            >
                                <Save className='w-6! h-6! text-green-500' />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Guardar</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                className="p-0! cursor-pointer hover:bg-gray-0 hover:[&>svg]:drop-shadow-[0_0_1px_rgba(239,68,68,0.5)]"
                                onClick={onCancelInlineEdit}
                                disabled={disabled}
                            >
                                <XCircle className='w-6! h-6! text-red-500' />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Cancelar</p></TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        );
    }
};