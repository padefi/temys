import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Asiento } from '@/types/Contabilidad/Asientos/Index';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { DataTable } from './data-table';
import { columns } from './columns';

type PageProps = InertiaPageProps & {
  asientos: AsientoPagination
};

interface AsientoPagination {
  data: Asiento[];
}

export default function AsientosPage() {
  const { asientos: { data: initialAsientos } } = usePage<PageProps>().props;
  const [asientos, setAsientos] = useState<Asiento[]>(initialAsientos);

  const memoizedColumns = useMemo(() => columns, []);

  useEffect(() => {
    if (asientos !== initialAsientos) setAsientos(initialAsientos);
  }, [initialAsientos]);

  return (
    <AuthenticatedLayout>
      <Head title="Asientos" />
      <div className="mx-auto py-12 max-w sm:px-6 lg:px-8">
        <div className="overflow-hidden bg-white shadow-xs sm:rounded-lg">
          <div className="p-6 text-gray-900">
            <div className='flex flex-row items-center justify-between'>
              <h1 className="text-2xl my-3 font-bold">Asientos</h1>
            </div>

            <DataTable
              columns={memoizedColumns}
              data={asientos} />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}