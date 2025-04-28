import { usePage } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from '@inertiajs/core';

type User = {
    id: number;
    name: string;
    email: string;
};

type PageProps = InertiaPageProps & {
    auth: {
        user: User;
    };
};

export function usePermissions() {
    const { auth: { user: userAuth } } = usePage<PageProps>().props;

    /* const hasRole = (name) => usePage().props.auth.user.roles.includes(name);
    const hasPermission = (name) => usePage().props.auth.user.permissions.includes(name);
    const hasPermissionColumn = (dataArray) => dataArray.some(data => hasPermission(data)); */

    return { userAuth };
}