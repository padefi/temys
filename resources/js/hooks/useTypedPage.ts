import { PageProps } from "@/types";
import { usePage } from "@inertiajs/react";

export function useTypedPage<T extends PageProps>() {
    return usePage<T>();
}
