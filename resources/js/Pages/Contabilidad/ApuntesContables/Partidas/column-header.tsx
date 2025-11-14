import React, { useEffect, useRef, useState } from "react";
import { useDataTableParams } from "@/hooks/useDataTableParams";
import { Column } from "@tanstack/react-table";
import { InputFilter } from "@/Components/ui/input-filter";
import { ArrowDownNarrowWide, ArrowUpDown, ArrowUpNarrowWide, Funnel, FunnelX } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Button } from "@/components/ui/button";

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>;
    title: string;
    className?: string;
    selectOptions?: { label: string; value: string }[];
    disabled?: boolean;
}

export function DataTableColumnHeader<TData, TValue>({ column, title, className, selectOptions, disabled }: DataTableColumnHeaderProps<TData, TValue>) {
    const { params, updateParams, isLoading } = useDataTableParams();
    const columnId = column.id;

    const filterEnabled = !!params.filters[columnId];
    const filterInputRef = useRef<HTMLInputElement>(null);
    const initialFilterValue = params.filters[columnId] || '';
    const [isInputVisible, setIsInputVisible] = useState(filterEnabled);
    const [currentLocalFilterValue, setCurrentLocalFilterValue] = useState(initialFilterValue);

    useEffect(() => {
        setCurrentLocalFilterValue(params.filters[columnId] || '');
    }, [params.filters, columnId]);

    const currentSortColumn = params.sort?.startsWith('-') ? params.sort.substring(1) : params.sort;
    const currentSortDirection = params.sort?.startsWith('-') ? 'desc' : 'asc';

    const handleSort = () => {
        let newSort: string;
        if (currentSortColumn === columnId) {
            newSort = currentSortDirection === 'asc' ? `-${columnId}` : columnId;
        } else {
            newSort = columnId;
        }

        updateParams({
            sort: newSort,
            page: '1'
        });
    };

    const handleFilterChange = (filterValue: string | undefined) => {
        if ((window as any).__filterTimeout) clearTimeout((window as any).__filterTimeout);

        (window as any).__filterTimeout = setTimeout(() => {
            updateParams({
                filters: {
                    ...params.filters,
                    [columnId]: filterValue || '',
                },
                page: '1'
            });
            (window as any).__filterTimeout = null;
        }, 500);
    };

    const toggleFilter = () => {
        if (isInputVisible) {
            if (filterEnabled) {
                handleFilterChange(undefined);
                setCurrentLocalFilterValue('');
            }
            setIsInputVisible(false);
        } else {
            setIsInputVisible(true);
        }
    };

    useEffect(() => {
        setIsInputVisible(filterEnabled);
    }, [filterEnabled]);

    return (
        <div className={`flex gap-2 items-center ${className}`}>
            {isInputVisible && (
                <>
                    {selectOptions ? (
                        <Select
                            onValueChange={(value) => {
                                setCurrentLocalFilterValue(value);
                                handleFilterChange(value);
                            }}
                            value={currentLocalFilterValue}
                            disabled={isLoading || disabled}
                        >
                            <SelectTrigger className="uppercase">
                                <SelectValue placeholder={`Seleccionar ${title}...`} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>{title}</SelectLabel>
                                    <SelectItem value="__NO_ROLE__">SIN ROL</SelectItem>
                                    {selectOptions.map((option, index) => (
                                        <SelectItem key={index} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    ) : (
                        <InputFilter
                            type="text"
                            className="text-sm"
                            variant="filter"
                            placeholder={`Filtrar ${title}...`}
                            defaultValue={currentLocalFilterValue}
                            autoComplete="off"
                            onChange={(e) => {
                                setCurrentLocalFilterValue(e.target.value);
                                handleFilterChange(e.target.value);
                            }}
                            disabled={isLoading || disabled}
                            ref={filterInputRef}
                        />
                    )}
                </>
            )}
            <Button variant="ghost" className="uppercase" onClick={handleSort} disabled={isLoading || disabled} >
                {!isInputVisible ? title : null}
                {currentSortColumn === columnId && !isLoading && (
                    currentSortDirection === 'asc'
                        ? <ArrowUpNarrowWide className='ml-2 h-4 w-4' />
                        : <ArrowDownNarrowWide className='ml-2 h-4 w-4' />
                )}
                {isLoading
                    ? (<ArrowUpDown className="ml-2 h-4 w-4 animate-spin" />)
                    : currentSortColumn !== columnId && <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
                }
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={toggleFilter}
                disabled={isLoading || disabled}
            >
                {isInputVisible ? <FunnelX className="h-4 w-4" /> : <Funnel className="h-4 w-4" />}
            </Button>
        </div>
    );
}