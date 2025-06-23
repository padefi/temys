import { DataTableParams } from '@/types';
import { usePage, router } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';


export function useDataTableParams() {
    const { props: inertiaProps } = usePage();
    const prevFilters: Record<string, any> = inertiaProps.filters || {};
    const currentRouteParams = route().params;
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const unsubscribeStart = router.on('start', () => {
            setIsLoading(true);
        });
        const unsubscribeFinish = router.on('finish', () => {
            setIsLoading(false);
        });
        const unsubscribeError = router.on('error', () => {
            setIsLoading(false);
        });

        return () => {
            unsubscribeStart();
            unsubscribeFinish();
            unsubscribeError();
        };
    }, []);

    const initialFilters: { [key: string]: string } = {};

    for (const key in prevFilters) {
        if (Object.prototype.hasOwnProperty.call(prevFilters, key)) {
            initialFilters[key] = String(prevFilters[key]);
        }
    }

    const initialSort = currentRouteParams.sort?.toString() ?? '';

    const params: DataTableParams = {
        page: currentRouteParams.page?.toString() ?? '1',
        per_page: currentRouteParams.per_page?.toString() ?? '10',
        sort: initialSort,
        filters: initialFilters,
    };

    const updateParams = useCallback((newParams: Partial<DataTableParams>) => {
        const mergedParams: Record<string, string | { [key: string]: string } | undefined> = { ...params, ...newParams };
        const queryStringParts: string[] = [];
        
        for (const key in mergedParams) {
            if (Object.prototype.hasOwnProperty.call(mergedParams, key)) {
                const value = mergedParams[key];
                if (key === 'filters' && typeof value === 'object' && value !== null) {
                    for (const filterKey in value) {
                        if (Object.prototype.hasOwnProperty.call(value, filterKey) && value[filterKey] !== '') {
                            queryStringParts.push(`filter[${filterKey}]=${encodeURIComponent(value[filterKey])}`);
                        }
                    }
                } else if (value !== undefined && value !== '') {
                    queryStringParts.push(`${key}=${encodeURIComponent(value as string)}`);
                }
            }
        }

        const queryString = queryStringParts.join('&');
        const baseUrl = route(`${route().current()}`);
        const newUrl = `${baseUrl}?${queryString}`;

        router.visit(newUrl, { preserveState: true, preserveScroll: true });
    }, [params]);

    return { params, updateParams, isLoading };
}