import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Button } from '@/Components/ui/button';
import { UserPlus } from 'lucide-react';
import { links } from '@/types/links';
import { meta } from '@/types/meta';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useDataTableParams } from '@/hooks/useDataTableParams';
import { usePermissions } from "@/composables/permissions";

export type User = {
  id: number;
  name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  roles: Array<{
    id: number;
    name: string;
  }>;
}

export type Role = {
  id: number;
  name: string;
}

type PageProps = InertiaPageProps & {
  users: UserPagination;
  roles: {
    data: Role[];
  };
};

interface UserPagination {
  data: User[];
  links: links;
  meta: meta;
}

export default function UsuariosPage() {
  const { users: { data: initialUsers, links, meta }, roles: { data: initialRoles } } = usePage<PageProps>().props;
  const { hasMenuPermission } = usePermissions();
  const [newUser, setNewUser] = useState(false);
  const [editingNewUserIndex, setEditingNewUserIndex] = useState<number | null>(null);
  const [editingUserIndex, setEditingUserIndex] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const { isLoading } = useDataTableParams();

  const memoizedColumns = useMemo(() => columns, []);
  const memoizedRoles = useMemo(() => initialRoles, [initialRoles]);

  useEffect(() => {
    if (users !== initialUsers) setUsers(initialUsers);
  }, [initialUsers]);

  const handleAddNewUser = useCallback(() => {
    if (users.some(u => u.id === 0) || newUser) {
      toast.error("Ya se encuentra creando un nuevo usuario");
      return;
    }
    setNewUser(true);
  }, [users, newUser]);

  const cancelCreateUser = useCallback(() => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== 0));
    setEditingNewUserIndex(null);
    setNewUser(false);
  }, []);

  useEffect(() => {
    if (newUser && meta.current_page === meta.last_page && !isLoading) {
      if (!users.some(u => u.id === 0)) {
        const newUserObj: User = { id: 0, name: "", last_name: "", email: "", is_active: true, roles: [{ id: 0, name: "" }] };
        const updatedUsers = [...users, newUserObj];
        setUsers(updatedUsers);
        setEditingNewUserIndex(updatedUsers.length - 1);
      } else {
        const idx = users.findIndex(u => u.id === 0);
        setEditingNewUserIndex(null);
        setTimeout(() => setEditingNewUserIndex(idx), 0);
      }
    }
  }, [newUser, meta.current_page, meta.last_page, isLoading, users]);

  return (
    <AuthenticatedLayout>
      <Head title="Dashboard" />
      <div className="mx-auto py-12 max-w sm:px-6 lg:px-8">
        <div className="overflow-hidden bg-white shadow-xs sm:rounded-lg">
          <div className="p-6 text-gray-900">
            <div className='flex flex-row items-center justify-between'>
              <h1 className="text-2xl my-3 font-bold">Usuarios</h1>
              {hasMenuPermission('usuariosControlAcceso', 'create') &&
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={handleAddNewUser}
                  disabled={newUser || editingUserIndex !== null}>
                  <UserPlus className='w-5! h-5!' />
                  <span>Nuevo usuario</span>
                </Button>
              }
            </div>
            <DataTable
              columns={memoizedColumns}
              data={users}
              links={links}
              meta={meta}
              roles={memoizedRoles}
              newUser={newUser}
              setNewUser={setNewUser}
              editingNewUserIndex={editingNewUserIndex}
              cancelCreateUser={cancelCreateUser}
              editingUserIndex={editingUserIndex}
              setEditingUserIndex={setEditingUserIndex} />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
