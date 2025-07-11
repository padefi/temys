
import { Button } from "@/Components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  startIndex: number;
  goToPreviousPage: () => void;
  goToNextPage: () => void;
  goToPage: (page: number) => void;
  itemLabel?: string; 
}

export const Pagination = ({
  totalItems,
  currentPage,
  totalPages,
  startIndex,
  goToPreviousPage,
  goToNextPage,
  goToPage,
  itemLabel = "elementos",
}: PaginationProps) => {



    
  if (totalItems === 0) return null;

  return (
    <div className="flex items-center justify-between px-2 py-4 border-t">
      <div className="text-sm text-muted-foreground">
        Mostrando {startIndex + 1} de {totalItems} {itemLabel}
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={goToPreviousPage} disabled={currentPage === 1}>
          <ChevronLeft className="h-4 w-4" /> Anterior
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => goToPage(page)}
            className="w-8 h-8 p-0"
          >
            {page}
          </Button>
        ))}
        <Button variant="outline" size="sm" onClick={goToNextPage} disabled={currentPage === totalPages}>
          Siguiente <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
