import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { User, columns } from "./UsuariosColumns"
import { DataTable } from "./UsuariosDataTable"
import { useEffect, useState } from 'react';
import axios from "axios";
import { toast } from "sonner";

type PageProps = InertiaPageProps & {
    users: {
        data: User[];
    };
    roles: {
        data: Role[];
    };
};

interface Role {
    name: string;
}

export default function UsuariosPage() {
    const { users: { data: initialUsers }, roles: { data: initialRoles } } = usePage<PageProps>().props;
    const [editUserId, setEditUserId] = useState<number | null>(null);
    const [editUserData, setEditUserData] = useState<Partial<User>>({});
    const [users, setUsers] = useState<User[]>(initialUsers);

    const updateUser = (updatedUser: User) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === updatedUser.id ? { ...user, ...updatedUser } : user
            )
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-xs sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-2xl my-3 font-bold">Usuarios</h1>
                            <DataTable
                                columns={columns}
                                data={users}
                                editUserId={editUserId}
                                setEditUserId={setEditUserId}
                                editUserData={editUserData}
                                setEditUserData={setEditUserData}
                                roles={initialRoles}
                                updateUser={updateUser} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout >
    );
}