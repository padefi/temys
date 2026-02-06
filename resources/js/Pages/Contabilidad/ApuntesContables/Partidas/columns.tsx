import { Partida } from "@/types/Contabilidad/Asientos/Partida";
import { ColumnDef, RowData } from '@tanstack/react-table'
import { currencyNumber } from "@/utils/formatterFunctions";
import { RowActions } from "./row-actions";
import { EditableCell } from "@/Components/Table";

type ColumnsProps = {
    editingRowId: number | null;
    onEdit: (rowId: number) => void;
    onSave: () => void;
    onCancel: () => void;
};

export const getColumns = ({
    editingRowId,
    onEdit,
    onSave,
    onCancel,
}: ColumnsProps): ColumnDef<Partida>[] => [
        {
            accessorFn: row => row.cuenta.codigo,
            id: 'cuenta',
            header: 'Cuenta',
            cell: ({ row }) => {
                const { codigo, descripcion } = row.original.cuenta;
                return (
                    <div className="flex flex-col">
                        <span className="font-semibold">{codigo}</span>
                        <span className="text-xs text-muted-foreground">
                            {descripcion}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorFn: row => row.concepto,
            id: 'concepto',
            header: 'Concepto',
            meta: {
                inputType: 'text',
            },
            cell: props => (
                <EditableCell
                    {...props}
                    isEditing={props.row.original.id === editingRowId}
                />
            ),
        },
        {
            accessorFn: (row) => row.debe,
            id: 'debe',
            header: () => <span>Debe</span>,
            meta: {
                inputType: 'number',
                format: (value: unknown) =>
                    currencyNumber(value as number),
            },
            cell: props => (
                <EditableCell
                    {...props}
                    isEditing={props.row.original.id === editingRowId}
                />
            ),
        },
        {
            accessorFn: (row) => row.haber,
            id: 'haber',
            header: () => <span>Haber</span>,
            meta: {
                inputType: 'number',
                format: (value: unknown) =>
                    currencyNumber(value as number),
            },
            cell: props => (
                <EditableCell
                    {...props}
                    isEditing={props.row.original.id === editingRowId}
                />
            ),
        },
        {
            id: "acciones",
            header: () => <span>Acciones</span>,
            cell: ({ row }) => (
                <RowActions
                    optionPermission={'asientosContables'}
                    isDisabled={editingRowId !== null && row.original.id !== editingRowId}
                    isEditing={row.original.id === editingRowId}
                    onEdit={() => onEdit(row.original.id)}
                    onSave={onSave}
                    onCancel={onCancel}
                />
            ),
        },
    ];