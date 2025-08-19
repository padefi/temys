import { Skeleton } from "@/Components/ui/skeleton";
import { TableBody, TableCell, TableRow } from "@/Components/ui/table";

interface DataTableSkeletonProps {
    columnCount: number;
    rowCount?: number;
    showHeaders?: boolean;
}

export function DataTableSkeleton({ columnCount, rowCount = 10, showHeaders = false }: DataTableSkeletonProps) {
    const skeletonRows = Array.from({ length: rowCount });
    const skeletonColumns = Array.from({ length: columnCount });

    return (
        <TableBody>
            {skeletonRows.map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                    {skeletonColumns.map((_, colIndex) => (
                        <TableCell key={colIndex} className="px-6 py-3">
                            <Skeleton className="h-4 w-full" />
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </TableBody>
    );
}