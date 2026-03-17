import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "./column-header";
import { Role, User } from "./page";

declare module "@tanstack/react-table" {
    interface ColumnMeta<TData, TValue> {
        label?: string;
        type?: "text" | "email" | "select" | "number" | "date" | "boolean";
    }
}

export const columns: ColumnDef<User>[] = [
    {
        id: "name",
        accessorKey: "name",
        header: ({ column, table }) => {
            const disabled = (table.options.meta as { disabled: boolean })?.disabled || false;

            return (
                <DataTableColumnHeader column={column} title="Nombre" disabled={disabled} />
            );
        },
        meta: {
            label: "nombre",
            type: "text"
        },
    },
    {
        id: "last_name",
        accessorKey: "last_name",
        header: ({ column, table }) => {
            const disabled = (table.options.meta as { disabled: boolean })?.disabled || false;

            return (
                <DataTableColumnHeader column={column} title="Apellido" disabled={disabled} />
            );
        },
        meta: {
            label: "apellido",
            type: "text"
        },
    },
    {
        id: "email",
        accessorKey: "email",
        header: ({ column, table }) => {
            const disabled = (table.options.meta as { disabled: boolean })?.disabled || false;

            return (
                <DataTableColumnHeader column={column} title="Email" disabled={disabled} />
            );
        },
        meta: {
            label: "email",
            type: "email"
        },
    },
    {
        id: "roles",
        accessorKey: "roles",
        header: ({ column, table }) => {
            const disabled = (table.options.meta as { disabled: boolean })?.disabled || false;
            const rolesData: Role[] = (table.options.meta as { roles: Role[] })?.roles || [];
            const selectOptions = rolesData.map(role => ({
                label: role.name.toUpperCase(),
                value: role.name.toUpperCase(),
            }));

            return (
                <DataTableColumnHeader column={column} title="Rol" selectOptions={selectOptions} disabled={disabled} />
            );
        },
        cell: ({ row }) => {
            if (!row.original.roles || row.original.roles.length === 0) {
                return <span className="text-sm font-medium text-red-500">Sin Rol</span>;
            }

            return (
                <span className={`font-medium ${row.original.roles[0].name === 'admin'
                    ? 'text-emerald-700'
                    : ''} text-sm`}>
                    {row.original.roles[0].name}
                </span>
            )
        },
        filterFn: (row, id, value) => {
            if (!value) return true;
            const userRoleName = row.original.roles[0]?.name?.toUpperCase();
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