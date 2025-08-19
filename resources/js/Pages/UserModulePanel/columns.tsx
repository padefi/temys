import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "./column-header";
import { Role, User } from "./page";

declare module "@tanstack/react-table" {
    interface ColumnMeta<TData, TValue> {
        label: string;
        type?: "text" | "email" | "select" | "number" | "date" | "boolean";
    }
}

export const columns: ColumnDef<User>[] = [
    {
        id: "name",
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Nombre" />
        )
    },
    {
        id: "last_name",
        accessorKey: "last_name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Apellido" />
        )
    },
    {
        id: "email",
        accessorKey: "email",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        )
    },
    {
        id: "module_roles",
        accessorKey: "module_roles",
        header: ({ column, table }) => {
            const disabled = (table.options.meta as { disabled: boolean })?.disabled || false;
            const moduleRolesData: Role[] = (table.options.meta as { roles: Role[] })?.roles || [];
            const selectOptions = moduleRolesData.map(role => ({
                label: role.name.toUpperCase(),
                value: role.name.toUpperCase(),
            }));

            return (
                <DataTableColumnHeader column={column} title="Rol" selectOptions={selectOptions} disabled={disabled} />
            );
        },
        cell: ({ row }) => {
            if (!row.original.module_roles || row.original.module_roles.length === 0) {
                return <span className="text-sm text-red-500">Sin Rol</span>;
            }

            return (
                <span className={`font-medium ${row.original.module_roles[0].name === 'encargado'
                    ? 'text-emerald-700'
                    : ''} text-sm`}>
                    {row.original.module_roles[0].name}
                </span>
            )
        },
        filterFn: (row, value) => {
            if (!value) return true;
            const userRoleName = row.original.module_roles[0]?.name?.toUpperCase();
            return userRoleName === value;
        },
        meta: {
            label: "rol",
            type: "select"
        },
    },
    {
        id: "actions",
        enableSorting: false,
        enableColumnFilter: false,
        header: "Acciones",
    },
];