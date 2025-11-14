"use client";

import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable, CellContext } from "@tanstack/react-table";
import { Table, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { useState, useEffect, useMemo } from "react";
import { DataTableSkeleton } from "@/Components/DataTableSkeleton";
import { useDataTableParams } from "@/hooks/useDataTableParams";
import { AnimatePresence, motion } from "framer-motion";
import { Partida } from "@/types/Contabilidad/Asientos/Index";
import { currencyNumber } from "@/utils/formatterFunctions";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData extends Partida, TValue>({
    columns: initialColumns,
    data: initialData,
}: DataTableProps<TData, TValue>) {
    const { params, isLoading } = useDataTableParams();
    const [tableData, setTableData] = useState<TData[]>(initialData);
    const [totales, setTotales] = useState({ debe: 0, haber: 0 });

    useEffect(() => {
        setTableData(initialData);

        const totDebe = initialData.reduce(
            (acc, v) => acc + parseFloat(String(v.debe ?? 0)),
            0
        );

        const totHaber = initialData.reduce(
            (acc, v) => acc + parseFloat(String(v.haber ?? 0)),
            0
        );

        setTotales({ debe: totDebe, haber: totHaber });
    }, [initialData]);

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

            <div className="mt-3 flex justify-end gap-6 font-semibold text-sm">
                <div>
                    <span className="text-muted-foreground">Total Debe:</span>
                    {currencyNumber(totales.debe)}
                </div>
                <div>
                    <span className="text-muted-foreground">Total Haber:</span>
                    {currencyNumber(totales.haber)}
                </div>
                <div>
                    <span className="text-muted-foreground">Balance:</span>
                    {currencyNumber(totales.debe - totales.haber)}
                </div>
            </div>
        </div>
    );
}