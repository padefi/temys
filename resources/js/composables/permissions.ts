import { usePage } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";

type Role = { id: number; name: string };
type Permission = {
    id: number;
    key: string;
    permissions: Array<{ name: string }>;
};

type User = {
    id: number;
    name: string;
    last_name: string;
    email: string;
    roles: Array<{ id: number; name: string }>;
    moduleRoles: Array<{ id: number; name: string }>;
};

type Permissions = {
    roles: Role[];
    modules_role: Role[];
    module_permissions: Permission[];
    menu_permissions: Permission[];
    submenu_permissions: Permission[];
};

type PageProps = InertiaPageProps & {
    auth: {
        user: User;
        permissions: Permissions;
    };
};

export function usePermissions() {
    const {
        auth: { user: userAuth, permissions },
    } = usePage<PageProps>().props;

    const hasModulePermission = (moduleKey: string, permissionName: string) =>
        permissions.module_permissions.some(
            (p) =>
                p.key === moduleKey &&
                p.permissions.find((p) => p.name === permissionName)
        );

    const hasMenuPermission = (menKey: string, permissionName: string) =>
        permissions.menu_permissions.some(
            (p) =>
                p.key === menKey &&
                p.permissions.find((p) => p.name === permissionName)
        );

    const hasSubmenuPermission = (
        submenKey: string,
        permissionName: string
    ) =>
        permissions.submenu_permissions.some(
            (p) =>
                p.key === submenKey &&
                p.permissions.find((p) => p.name === permissionName)
        );

    const hasRole = (roleName: string) =>
        permissions.roles.some((r) => r.name === roleName);

    return {
        userAuth,
        hasModulePermission,
        hasMenuPermission,
        hasSubmenuPermission,
        hasRole,
    };
}
