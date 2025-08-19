"use client";

import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable, CellContext } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { useState, useEffect, useMemo } from "react";
import { DataTableSkeleton } from "./data-table-skeleton";
import { useDataTableParams } from "@/hooks/useDataTableParams";
import { RowActions } from "./row-actions";
import { User } from "./page";
import { Footer } from "./footer";
import { links } from "@/types/links";
import { meta } from "@/types/meta";


interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    links: links;
    meta: meta;
    module: number;
    module_roles: Array<{ id: number; name: string }>
}

export function DataTable<TData extends User, TValue>({
    columns: initialColumns,
    data: initialData,
    links,
    meta,
    module,
    module_roles,
}: DataTableProps<TData, TValue>) {
    const { params, updateParams, isLoading } = useDataTableParams();
    const [tableData, setTableData] = useState<TData[]>(initialData);

    useEffect(() => {
        setTableData(initialData);
    }, [initialData]);

    const columns = useMemo(() => {
        return initialColumns.map(col => {
            return {
                ...col,
                cell: ({ getValue, row: { original } }: CellContext<TData, TValue>) => {
                    const cellValue = getValue();
                    const initialCellOriginalValue = Array.isArray(cellValue)
                        ? (cellValue[0] as { name: string })?.name as string ?? "SIN ROL"
                        : (cellValue as string);

                    if (col.id === 'module_roles') {
                        return (
                            <div>
                                <span className={`font-medium
                                    ${(initialCellOriginalValue === 'encargado')
                                        ? 'text-amber-700'
                                        : initialCellOriginalValue === 'SIN ROL'
                                            ? 'text-red-500'
                                            : ''
                                    } text-sm`}>{initialCellOriginalValue}</span>
                            </div>
                        );
                    } else if (col.id === 'actions') {
                        return (
                            <RowActions
                                user={original as User}
                                module={module}
                                disabled={false}
                            />
                        );
                    }

                    return cellValue;
                },
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
        meta: {
            roles: module_roles,
        },
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
                                        <TableHead key={header.id}>
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
                    {isLoading ? (
                        <DataTableSkeleton columnCount={columns.length} rowCount={10} showHeaders={false} />
                    ) : (
                        <TableBody>
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
                        </TableBody>
                    )}
                </Table>
            </div>

            <Footer
                links={links}
                meta={meta}
                updateParams={updateParams}
                isLoading={isLoading} />
        </div>
    );
}