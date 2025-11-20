import { links } from "@/types/links";
import { meta } from "@/types/meta";
import { RecepcionesItem } from "@/types/Inventario/Operaciones/Recepciones/Recepciones"; 
import { useDataTableParams } from "@/hooks/useDataTableParams";
import { useState } from "react";
import { ColumnDef, ExpandedState, flexRender, getCoreRowModel, getExpandedRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, Row, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { DataTableSkeleton } from "@/Components/DataTableSkeleton";
import { DetallesSubtabla } from "./DetalleSubtabla";
import React from "react";
import { Footer } from "@/Pages/UserModulePanel/footer";


type TableProps<TData> = {
    data: RecepcionesItem[];
       links: links;
       meta: meta;
     columns: ColumnDef<RecepcionesItem>[];
  getRowCanExpand: (row: Row<TData>) => boolean
}

export default function RecepcionesTable({
  data,
  links,
  meta,
  columns,
  getRowCanExpand,
}: TableProps<RecepcionesItem>) {
    const { params, updateParams, isLoading } = useDataTableParams();
    const [expanded, setExpanded] = useState<ExpandedState>({})

    const table = useReactTable({
        data: data,
        columns,
        state: { 
            expanded 
        },
        onExpandedChange: setExpanded,
        getRowCanExpand, 
        enableRowSelection: true,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        manualFiltering: true,
        manualSorting: true,
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getExpandedRowModel: getExpandedRowModel(), 
    });

    return (
        <>
        <Table>
            <TableHeader className="sticky-header">
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <TableHead key={header.id} className="text-center">
                                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                            </TableHead>
                        ))}
                    </TableRow>
                ))}
            </TableHeader>
            <TableBody className="text-center">
                {isLoading ? (
                    <DataTableSkeleton columnCount={9} rowCount={5} showHeaders={false} />
                ) : table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                        <React.Fragment key={row.id}>
                            <TableRow data-state={row.getIsSelected() && "selected"}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>

                            {row.getIsExpanded() && (
                                <TableRow>
                                    <TableCell colSpan={columns.length}>
                                        <DetallesSubtabla detalles={row.original.detalles || []} />
                                    </TableCell>
                                </TableRow>
                            )}
                        </React.Fragment>
                    ))
                ) : (
                    <TableRow>
                        <TableCell colSpan={columns.length} className="h-24 text-center">
                            No hay resultados.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
         <Footer links={links} meta={meta} updateParams={updateParams} isLoading={isLoading} /> 
        </>
        
        
                
    );
}