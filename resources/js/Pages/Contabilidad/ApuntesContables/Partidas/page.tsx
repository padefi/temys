import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Head, router } from '@inertiajs/react';
import { ArrowLeftIcon } from 'lucide-react';
import TableContainer from './table-container';

export default function PartidasPage() {
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
                        </div>

                        <div>
                            <div className="rounded-md border uppercase">
                                <TableContainer />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}