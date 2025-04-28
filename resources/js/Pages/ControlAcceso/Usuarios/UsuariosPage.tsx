import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { UserLock, UserPen, UserRoundX } from "lucide-react"
import { Button } from "@/Components/ui/button"
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/Components/ui/tooltip';
import { usePermissions } from '@/composables/permissions';

import { User, columns } from "./UsuariosColumns"
import { DataTable } from "./UsuariosDataTable"

/* type User = {
    id: number;
    name: string;
    email: string;
    roles: Array<{
        id: number;
        name: string;
    }>;
} */

type PageProps = InertiaPageProps & {
    users: {
        data: Array<User>;
    };
};

export default function UsuariosPage() {
    const { users: { data: users } } = usePage<PageProps>().props;
    const { userAuth } = usePermissions();

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-xs sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl my-3 font-bold">Usuarios</h1>
                            <DataTable columns={columns} data={users} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout >
    );
}