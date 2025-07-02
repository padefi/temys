import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { Button } from '@/Components/ui/button';
import { UserPlus } from 'lucide-react';
import { links } from '@/types/links';
import { meta } from '@/types/meta';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useDataTableParams } from '@/hooks/useDataTableParams';

export type User = {
  id: number;
  name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  module_roles: Array<{
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
  module_roles: {
    data: Role[];
  };
};

interface UserPagination {
  data: User[];
  links: links;
  meta: meta;
}

export default function UsuariosPage() {
  const { users: { data: initialUsers, links, meta }, module_roles: { data: initialModuleRoles }, module } = usePage<PageProps>().props;
  const [users, setUsers] = useState<User[]>(initialUsers);

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);
  
  return (
    <AuthenticatedLayout>
      <Head title="Dashboard" />
      <div className="mx-auto py-12 max-w sm:px-6 lg:px-8">
        <div className="overflow-hidden bg-white shadow-xs sm:rounded-lg">
          <div className="p-6 text-gray-900">
            <DataTable
              columns={columns}
              data={users}
              links={links}
              meta={meta}
              module={module as number}
              module_roles={initialModuleRoles} />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}