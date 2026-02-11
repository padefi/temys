import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { EntregaItem } from "@/types/Inventario/Operaciones/Entregas/Entregas";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { useDataTableParams } from "@/hooks/useDataTableParams";
import { DataTableSkeleton } from "@/Components/Table/AnimatedRows/DataTableSkeleton";
import React from "react";
import { DetalleProductos } from "./DetallesProductos";
import { motion, AnimatePresence } from 'framer-motion';
import { DetalleCancelado } from "./DetallesMotivoCancelacion";

import { links } from "@/types/links";
import { meta } from "@/types/meta";
import { Footer } from '@/Pages/UserModulePanel/footer';

type TableProps = {
    data: EntregaItem[];
    links: links;
    meta: meta;
    columns: ColumnDef<EntregaItem>[];
    expandedProductos: { [key: number]: boolean };
    expandedMotivos: { [key: number]: boolean };
}

export default function EntregasTable({ 
    data,
    links,
    meta, 
    columns, 
    expandedProductos,
    expandedMotivos 
}: TableProps) {
    const { params, updateParams, isLoading } = useDataTableParams();
    const table = useReactTable({
        data: data,
        columns,
        enableRowSelection: true,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        manualFiltering: true,
        manualSorting: true,
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
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
                    table.getRowModel().rows.map((row) => {
                        const item = row.original;
                        const showProductos = expandedProductos[item.id];
                        const showMotivo = expandedMotivos[item.id];

                        return (
                            <React.Fragment key={row.id}>
                                <TableRow data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>

                                {/* Expansión de Productos */}
                                <AnimatePresence>
                                    {showProductos && (
                                        <TableRow>
                                            <TableCell colSpan={columns.length} className="p-0">
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-4 border-l-4 border-emerald-500">
                                                        <DetalleProductos productos={item.productos || []} />
                                                    </div>
                                                </motion.div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </AnimatePresence>

                                {/* Expansión de Motivo de Cancelación */}
                                <AnimatePresence>
                                    {showMotivo && item.cancelacion && (
                                        <TableRow>
                                            <TableCell colSpan={columns.length} className="p-0">
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-4 border-l-4 border-red-500">
                                                        <DetalleCancelado cancelacion={item.cancelacion || []} />
                                                    </div>
                                            
                                                </motion.div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </AnimatePresence>
                            </React.Fragment>
                        );
                    })
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