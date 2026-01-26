import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
import { Terminal } from 'lucide-react';
import VentasOrdenesListado from './VentasOrdenesListado/Index';
import { Button } from '@/Components/ui/button';
import { toast } from 'sonner';

export default function Index() {
  const { props } = usePage();
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);

  useEffect(() => {
    if (props.cotizacion_exitosa) {
      setMostrarAlerta(true);
      setTimeout(() => setMostrarAlerta(false), 5000);
    }
  }, [props.cotizacion_exitosa]);

  const handleGenerarOrdenVenta = () => {

    if (selectedOrders.length === 0) {
      toast.error('No se han seleccionado órdenes de venta.');
      return;
    }

    router.post('/ventas/cotizaciones-ordenes/generar-orden-venta', { ordenes: selectedOrders, usuario_id: props.auth.user.id }, {
      onSuccess: () => {
        console.log("Generar Orden de Venta para:", selectedOrders);
        toast.success(`Orden de Venta Generada para ${selectedOrders.length} órdenes.`);
        setSelectedOrders([]);
      },
      onError: (errors) => {
        toast.error(errors.message);
      }
    });

  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
           Ordenes de Venta
        </h2>
      }
    >
      {mostrarAlerta && (
        <Alert variant="default" className="mb-4">
          <Terminal className="h-4 w-4" />
          <AlertTitle>¡Cotización enviada!</AlertTitle>
          <AlertDescription>La cotización fue registrada correctamente.</AlertDescription>
        </Alert>
      )}
      <Head title="Ordenes de Venta" />

      <div className="py-12">
        <div className="mx-auto max-w sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-xs sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <div className="flex gap-4 mt-6 justify-end">
                <Button
                  className="bg-green-800 hover:bg-green-900 text-white"
                  variant="outline"
                  onClick={() => router.visit('/ventas/ordenes-ventas/nueva')}
                >
                  Nueva Orden de Venta
                </Button>

                {selectedOrders.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={handleGenerarOrdenVenta}
                  >
                    Generar Orden de Venta ({selectedOrders.length})
                  </Button>
                )}
              </div>

              <h1 className="text-2xl my-3 font-bold">Ordenes de Venta</h1>
              <hr className="my-3" />

              <VentasOrdenesListado onSelectionChange={setSelectedOrders} />

            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
