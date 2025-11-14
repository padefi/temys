"use client";

import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable, CellContext } from "@tanstack/react-table";
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { useState, useEffect, useMemo } from "react";
import { DataTableSkeleton } from "@/Components/DataTableSkeleton";
import { useDataTableParams } from "@/hooks/useDataTableParams";
import { AnimatePresence, motion } from "framer-motion";
import { Asiento } from "@/types/Contabilidad/Asientos/Index";
import { router } from "@inertiajs/react";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData extends Asiento, TValue>({
    columns: initialColumns,
    data: initialData,
}: DataTableProps<TData, TValue>) {
    const { params, isLoading } = useDataTableParams();
    const [tableData, setTableData] = useState<TData[]>(initialData);

    useEffect(() => {
        setTableData(initialData);
    }, [initialData]);

    const handlePartidas = (asiento: Asiento) => {
        router.visit(`asiento/${asiento.id}`);
    }

    const columns = useMemo(() => {
        return initialColumns.map(col => {
            return {
                ...col,
                cell: col.cell ?? (({ getValue }: CellContext<TData, TValue>) => getValue()),
            }
        });
    }, [initialColumns]);

    const table = useReactTable({
        data: tableData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters: Object.entries(params.filters).map(([id, value]) => ({ id, value })),
            sorting: params.sort ? [{ id: params.sort.replace('-', ''), desc: params.sort.startsWith('-') }] : [],
        },
        manualFiltering: true,
        manualSorting: true,
    });

    return (
        <div>
            <div className="rounded-md border uppercase">
                <Table>
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
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.tbody
                                key="skeleton"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.35, ease: "easeInOut" }}
                            >
                                <DataTableSkeleton columnCount={columns.length} rowCount={tableData.length || 10} showHeaders={false} />
                            </motion.tbody>
                        ) : (
                            <motion.tbody
                                key="tbody"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.35, ease: "easeInOut" }}
                            >
                                {tableData.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && "selected"}
                                            className="cursor-pointer"
                                            onClick={() => handlePartidas(row.original)}
                                        >
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            Sin resultados.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </motion.tbody>
                        )}
                    </AnimatePresence>
                </Table>
            </div>
        </div>
    );
}