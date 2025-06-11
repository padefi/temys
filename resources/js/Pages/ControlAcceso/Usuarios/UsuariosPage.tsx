import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { User, columns } from "./UsuariosColumns"
import { DataTable } from "./UsuariosDataTable"
import { useEffect, useState } from 'react';
import axios from "axios";
import { toast } from "sonner";
import { Button } from '@/Components/ui/button';
import { UserPlus } from 'lucide-react';
import { create } from 'domain';

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
    const [newUser, setNewUser] = useState(false);
    const [editUserId, setEditUserId] = useState<number | null>(null);
    const [editUserData, setEditUserData] = useState<Partial<User>>({});
    const [users, setUsers] = useState<User[]>(initialUsers);

    const createUser = (user: User) => {
        if (user.id === 0 && newUser) {
            toast.error("Ya se encuentra creando un nuevo usuario");
            return;
        }

        setUsers(prevUsers => [user, ...prevUsers]);
        setEditUserId(user.id);
    };

    const cancelCreateUser = () => {
        setUsers(prevUsers => prevUsers.filter(user => user.id !== 0));
        setNewUser(false);
    };

    const updateUser = (updatedUser: User, action: string) => {
        let userId = updatedUser.id;
        if (action === 'store') userId = 0
        
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === userId ? { ...user, ...updatedUser } : user
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
                            <div className='flex flex-row items-center justify-between'>
                                <h1 className="text-2xl my-3 font-bold">Usuarios</h1>
                                <Button variant="outline"
                                    className="cursor-pointer"
                                    onClick={() => {
                                        createUser({ id: 0, name: "", email: "", last_name: "", is_active: true, roles: [] });
                                        setNewUser(true);
                                    }}
                                    disabled={newUser || editUserId !== null}>
                                    <UserPlus className='w-5! h-5!' />
                                    <span>Nuevo usuario</span>
                                </Button>
                            </div>
                            <DataTable
                                columns={columns}
                                data={users}
                                editUserId={editUserId}
                                setEditUserId={setEditUserId}
                                editUserData={editUserData}
                                setEditUserData={setEditUserData}
                                roles={initialRoles}
                                cancelCreateUser={cancelCreateUser}
                                updateUser={updateUser} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout >
    );
}