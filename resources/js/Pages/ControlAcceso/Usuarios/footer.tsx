import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Button } from "@/Components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { numberFormatter } from "@/utils/formatterFunctions";
import { links } from "@/types/links";
import { meta } from "@/types/meta";
import { forwardRef, useImperativeHandle } from "react";

interface FooterProps {
    links: links;
    meta: meta;
    updateParams: (params: any) => void;
    isLoading: boolean;
    disabled: boolean;
}

export const Footer = forwardRef(function Footer(
    { links, meta, updateParams, isLoading, disabled }: FooterProps,
    ref
) {
    const handlePageSizeChange = (value: string) => {
        updateParams({ per_page: value, page: '1' });
    };

    const goToPage = (pageLink: string | null) => {
        if (pageLink && !isLoading) {
            const url = new URL(pageLink);
            const page = url.searchParams.get('page') || '1';
            updateParams({ page: page });
        }
    };

    useImperativeHandle(ref, () => ({
        goToPage,
    }));

    return (
        <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Registros por página</p>
                <Select
                    value={`${meta.per_page}`}
                    onValueChange={handlePageSizeChange}
                    disabled={isLoading || disabled}
                >
                    <SelectTrigger className="h-8 w-[70px]">
                        <SelectValue placeholder={meta.per_page} />
                    </SelectTrigger>
                    <SelectContent side="top">
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <SelectItem key={pageSize} value={`${pageSize}`}>
                                {pageSize}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <p className="text-sm font-medium">de {numberFormatter(meta.total)}</p>
            </div>
            <div className="flex items-center justify-center text-sm font-medium">
                Página {numberFormatter(meta.current_page)} de {" "}{numberFormatter(meta.last_page)}
            </div>
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(links.first)}
                    disabled={!links.prev || isLoading || disabled}
                >
                    <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(links.prev)}
                    disabled={!links.prev || isLoading || disabled}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(links.next)}
                    disabled={!links.next || isLoading || disabled}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(links.last)}
                    disabled={!links.next || isLoading || disabled}
                >
                    <ChevronsRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
});
