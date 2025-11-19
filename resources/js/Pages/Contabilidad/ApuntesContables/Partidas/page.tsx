import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Partida } from '@/types/Contabilidad/Asientos/Index';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { DataTable } from './data-table';
import { columns } from './columns';
import { Button } from '@/Components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';

type PageProps = InertiaPageProps & {
  partidas: {
    data: Partida[];
  },
  numero: number;
};

export default function PartidasPage() {
  const { partidas: { data: initialPartidas }, numero } = usePage<PageProps>().props;
  const [partidas, setPartidas] = useState<Partida[]>(initialPartidas);

  const memoizedColumns = useMemo(() => columns, []);

  useEffect(() => {
    setPartidas(initialPartidas);
  }, []);

  const handleBack = () => {
    router.visit('../asientos');
  }

  return (
    <AuthenticatedLayout>
      <Head title="Partidas" />
      <div className="mx-auto py-12 max-w sm:px-6 lg:px-8">
        <div className="overflow-hidden bg-white shadow-xs sm:rounded-lg">
          <div className="p-6 text-gray-900">
            <div className='flex gap-3 items-center'>
              <Button size="icon" variant="outline" onClick={handleBack}>
                <ArrowLeftIcon />
              </Button>
              <h1 className="text-2xl my-3 font-bold">Asiento {numero}</h1>
            </div>

            <DataTable
              columns={memoizedColumns}
              data={partidas} />
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}