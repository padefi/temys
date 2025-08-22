import { Skeleton } from "@/Components/ui/skeleton";
import { cn } from "@/lib/utils"
import React from "react";

interface DataDialogSkeletonProps {
    rowCount?: number;
    className?: string;
}

export const DialogSkeleton = React.memo(({ rowCount = 10, className }: DataDialogSkeletonProps) => {
    const skeletonRows = Array.from({ length: rowCount });

    return (
        skeletonRows.map((_, rowIndex) => (
            <Skeleton key={rowIndex} className={cn("h-4", className)} />
        ))
    )
});
