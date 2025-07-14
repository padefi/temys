import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
  } from "@/Components/ui/select";
  import { Button } from "@/Components/ui/button";
  import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
  import { forwardRef, useImperativeHandle } from "react";
  import { links } from "@/types/links";
  import { meta } from "@/types/meta";
  
  export interface FooterRef {
    goToPage: (pageLink: string | null) => void;
  }
  
  interface FooterProps {
    links: links;
    meta: meta;
    updateParams: (params: any) => void;
    isLoading: boolean;
    disabled: boolean;
  }
  
  export const Footer = forwardRef<FooterRef, FooterProps>(function Footer({
    links,
    meta,
    updateParams,
    isLoading,
    disabled,
  }, ref) {
    const goToPage = (pageLink: string | null) => {
      if (pageLink && !isLoading) {
        const url = new URL(pageLink);
        const page = url.searchParams.get("page") || "1";
        updateParams({ page });
      }
    };
  
    useImperativeHandle(ref, () => ({ goToPage }));
  
    if (!meta) return null; // evita errores si meta no está
  
    const perPage = meta.per_page ?? 10;
    const currentPage = meta.current_page ?? 1;
    const lastPage = meta.last_page ?? 1;
  
    return (
        <div className="flex justify-between py-4 text-sm">
          <div className="flex items-center gap-2">
            <span>Registros por página</span>
            <Select
              value={perPage.toString()}
              onValueChange={(val) => updateParams({ per_page: val, page: '1' })}
              disabled={isLoading || disabled}
            >
              <SelectTrigger className="w-20 h-8">
                <SelectValue placeholder={perPage.toString()} />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 50].map(size => (
                  <SelectItem key={size} value={`${size}`}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span>Página {currentPage} de {lastPage}</span>
            <Button size="sm" variant="outline" onClick={() => goToPage(links.first)} disabled={!links.prev || isLoading || disabled}>
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => goToPage(links.prev)} disabled={!links.prev || isLoading || disabled}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => goToPage(links.next)} disabled={!links.next || isLoading || disabled}>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => goToPage(links.last)} disabled={!links.next || isLoading || disabled}>
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      );
    });
  