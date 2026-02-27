import { Table, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { flexRender, RowData, Table as TanstackTable } from '@tanstack/react-table';
import { useDataTableParams } from '@/hooks/useDataTableParams';
import { AnimatedEditableRow, AnimatedTableBody, DataTableSkeleton } from './AnimatedRows';
import { ReactNode } from 'react';

type DataTableProps<TData extends RowData> = {
    table: TanstackTable<TData>;
    children?: ReactNode;
};

export function DataTable<TData extends RowData & { id: number }>({ table, children }: DataTableProps<TData>) {
    const { isLoading } = useDataTableParams();
    const editingRowId = table.options.meta?.editingRowId as number | null;

    return (
        <Table className="w-full">
            <TableHeader className="sticky-header">
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                            return (
                                <TableHead key={header.id} >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            );
                        })}
                    </TableRow>
                ))}
            </TableHeader>
            <AnimatedTableBody bodyKey={isLoading ? "loading" : "data"}>
                {isLoading ? (
                    <DataTableSkeleton colCount={table.getAllColumns().length} rowCount={(table.getRowModel().rows.length) || 10} />
                ) : (
                    table.getRowModel().rows.map((row) => (
                        <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                        >
                            {row.getVisibleCells().map((cell) => {
                                const isEditing = editingRowId === row.original.id;

                                return (
                                    <TableCell key={cell.id}>
                                        <AnimatedEditableRow identity={cell.id} isEditing={isEditing}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </AnimatedEditableRow>
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))
                )}
            </AnimatedTableBody>
            {children}
        </Table>
    );
}
