import { Skeleton } from "@/Components/ui/skeleton";
import { TableCell, TableRow } from "@/Components/ui/table";
import React from "react";

interface DataTableSkeletonProps {
    colCount: number;
    rowCount?: number;
    showHeaders?: boolean;
}

export const DataTableSkeleton = React.memo(({ colCount, rowCount = 10, showHeaders = false }: DataTableSkeletonProps) => {
    const skeletonRows = React.useMemo(
        () => Array.from({ length: rowCount }),
        [rowCount]
    );

    const skeletonColumns = React.useMemo(
        () => Array.from({ length: colCount }),
        [colCount]
    );


    return (
        skeletonRows.map((_, rowIndex) => (
            <TableRow key={rowIndex}>
                {skeletonColumns.map((_, colIndex) => (
                    <TableCell key={`skeleton-row-${colIndex}`} className="px-6 py-3 h-13">
                        <Skeleton className="h-4 w-full" />
                    </TableCell>
                ))}
            </TableRow>
        ))
    );
});