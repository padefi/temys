import { ColumnDef } from '@tanstack/react-table'
import { currencyNumber } from "@/utils/formatterFunctions";
import { RowActions } from "./row-actions";
import { EditableCell } from "@/Components/Table";
import { Partida } from '@/types/Contabilidad/Asientos';
import { required } from "@/utils/validateFunctions";
import { Cuenta } from '@/types/Contabilidad/PlanCuentas';
import { cuentaToOption } from '@/utils/adapters/cuentaAdapter';

type ColumnsProps = {
    editingRowId: number | null;
    hasErrors: boolean;
    onEdit: (rowId: number) => void;
    onSave: () => void;
    onCancel: () => void;
    onDelete: (rowId: number) => void;
    planCuentas: Cuenta[];
};

export const getColumns = ({
    editingRowId,
    hasErrors,
    onEdit,
    onSave,
    onCancel,
    onDelete,
    planCuentas,
}: ColumnsProps): ColumnDef<Partida, any>[] => [
        {
            id: 'cuenta.id',
            accessorKey: 'cuenta.id',
            header: 'Cuenta',
            meta: {
                inputType: 'select',
                rules: [required()],
                options: cuentaToOption(planCuentas),
            },
            cell: props => {
                const { id: idCuenta } = props.row.original.cuenta;
                const cuenta = planCuentas.find((c) => c.id === Number(idCuenta));
                const codigo = cuenta?.codigo ?? "---";
                const descripcion = cuenta?.descripcion ?? "Sin cuenta seleccionada";
                const isEditing = props.row.original.id === editingRowId;

                if (!isEditing) {
                    return (
                        <div className="flex flex-col">
                            <span className="font-semibold">{codigo}</span>
                            <span className="text-xs text-muted-foreground">
                                {descripcion}
                            </span>
                        </div>
                    );
                }

                return (
                    <EditableCell {...props} isEditing={props.row.original.id === editingRowId} />
                );
            },
            size: 200,
        },
        {
            accessorKey: 'concepto',
            header: 'Concepto',
            meta: {
                inputType: 'text',
            },
            cell: props => <EditableCell {...props} isEditing={props.row.original.id === editingRowId} />,
        },
        {
            accessorKey: 'debe',
            header: "Debe",
            meta: {
                inputType: 'number',
                format: (value: number) => currencyNumber(value),
                rules: [
                    required(),
                    (v: number) => v >= 0 || "No puede ser negativo",
                ],
            },
            cell: props => <EditableCell {...props} isEditing={props.row.original.id === editingRowId} />,
        },
        {
            accessorKey: 'haber',
            header: "Haber",
            meta: {
                inputType: 'number',
                format: (value: number) => currencyNumber(value),
                rules: [
                    required(),
                    (v: number) => v >= 0 || "No puede ser negativo",
                ],
            },
            cell: props => <EditableCell {...props} isEditing={props.row.original.id === editingRowId} />,
        },
        {
            id: "acciones",
            header: "Acciones",
            enableSorting: false,
            cell: ({ row }) => {
                const isDisabled = editingRowId !== null && row.original.id !== editingRowId;

                return (
                    <RowActions
                        optionPermission={'asientosContables'}
                        isDisabled={isDisabled}
                        isEditing={row.original.id === editingRowId}
                        hasErrors={hasErrors}
                        onEdit={() => onEdit(row.original.id)}
                        onSave={onSave}
                        onCancel={onCancel}
                        onDelete={() => onDelete(row.original.id)}
                    />
                );
            },
        },
    ];