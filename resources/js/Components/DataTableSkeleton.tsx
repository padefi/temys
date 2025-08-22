import { Skeleton } from "@/Components/ui/skeleton";
import { TableCell, TableRow } from "@/Components/ui/table";
import React from "react";

interface DataTableSkeletonProps {
    columnCount: number;
    rowCount?: number;
    showHeaders?: boolean;
}

export const DataTableSkeleton = React.memo(({ columnCount, rowCount = 10, showHeaders = false }: DataTableSkeletonProps) => {
    const skeletonRows = Array.from({ length: rowCount });
    const skeletonColumns = Array.from({ length: columnCount });

    return (
        skeletonRows.map((_, rowIndex) => (
            <TableRow key={rowIndex}>
                {skeletonColumns.map((_, colIndex) => (
                    <TableCell key={colIndex} className="px-6 py-3 h-[52px]">
                        <Skeleton className="h-4 w-full" />
                    </TableCell>
                ))}
            </TableRow>
        ))
    );
});