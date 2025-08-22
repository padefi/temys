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
            (p: Permission) =>
                p.key === moduleKey &&
                p.permissions.find((p) => p.name === permissionName)
        );

    const hasMenuPermission = (menKey: string, permissionName: string) =>
        permissions.menu_permissions.some(
            (p: Permission) =>
                p.key === menKey &&
                p.permissions.find((p) => p.name === permissionName)
        );

    const hasSubmenuPermission = (submenKey: string, permissionName: string) =>
        permissions.submenu_permissions.some(
            (p: Permission) =>
                p.key === submenKey &&
                p.permissions.find((p) => p.name === permissionName)
        );

    const hasSubmenuStartsWithPermission = (
        submenKey: string,
        permissionName: string
    ) =>
        permissions.submenu_permissions.some(
            (p: Permission) =>
                p.key.startsWith(submenKey) &&
                p.permissions.find((p) => p.name === permissionName)
        );

    const hasRole = (roleName: string) =>
        permissions.roles.some((r: Role) => r.name === roleName);

    function createCamelCaseFromUrlPath(path: any) {
        const parts = path.split("/").filter(Boolean).reverse();

        if (parts.length < 2) {
            return null;
        }

        const camelCaseParts = parts.map((part: any) => {
            return part.replace(/-([a-z])/g, (match: any, letter: any) => {
                return letter.toUpperCase();
            });
        });

        const finalCamelCase = camelCaseParts
            .map((part: any, index: any) => {
                if (index === 0) {
                    return part;
                }
                return part.charAt(0).toUpperCase() + part.slice(1);
            })
            .join("");

        return finalCamelCase;
    }

    return {
        userAuth,
        hasModulePermission,
        hasMenuPermission,
        hasSubmenuPermission,
        hasSubmenuStartsWithPermission,
        createCamelCaseFromUrlPath,
        hasRole,
    };
}
