import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/Components/ui/tooltip";
import { Tabs, TabsContent } from "@/Components/ui/tabs";
import { usePermissions } from "@/composables/permissions";
import { Button } from "@/Components/ui/button";
import { Plus } from "lucide-react";
import { usePage } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { SolicitarStock } from "./modals/ModalCrearSolicitudStock";
import { StockItem } from "../../../types/Inventario";
import { StockInventarioItem } from "../../../types/Inventario";
import { StockFilters } from "./StockFilters";
import { CardTable } from "./CardTable";
import { StockTable } from "./modeloDataTable";
import { toast } from "sonner";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";

type PageProps = InertiaPageProps & {
  stocks: {
    data: StockInventarioItem[];
  };
};

export default function StockManagement() {
  const [productosDisponibles, setProductosDisponibles] = useState<StockInventarioItem[]>([]);
  const [solicitudDialogOpen, setsolicitudDialogOpen] = useState(false);
  const { stocks } = usePage<PageProps>().props;
  const { hasSubmenuPermission } = usePermissions();
  const [stock, setStock] = useState<StockInventarioItem[]>([]);
  const [filteredStock, setFilteredStock] = useState<StockItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [editedRows, setEditedRows] = useState<Record<number, number>>({})


  const handleAplicarTodo = async () => {
    const dataRows = Object.entries(editedRows).map(([id, cantidad]) => ({
      id: Number(id),
      cantidad_contada: cantidad,
    }));

    try {
      const response = await axios.post("/actualizar-cantidad-contadas-masivo", {
        data: dataRows,
      });
      const data = await response.data;
      toast.success(data.message);
      setEditedRows({});

    } catch (error: any) {
      toast.error(error.response.data.message)
      console.error("Error al aplicar todo:", error);
    }
  };



  useEffect(() => {
    setStock(stocks.data);
  }, [stocks]);

  const handleAbrirModal = () => {
    const productosFiltrados = stock.filter(
      (item) => item.cantidad_actual <= item.stock_minimo
    );
    setProductosDisponibles(productosFiltrados);
    setsolicitudDialogOpen(true);

  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">Inventario</h2>
      }>
      <Head title="Inventario" />
      <div className="mx-auto w-full p-6 space-y-6">
        <div className=" flex justify-between">
          {hasSubmenuPermission('inventarioFisico', 'confirm') &&
            <Tooltip>
              <TooltipTrigger asChild>
                {hasSubmenuPermission("inventarioFisico", "create") && (
                  <Button size="sm" variant="outline" onClick={handleAbrirModal} className="text-xs"> <Plus className="h-3 w-3 mr-1" /> Solicitar </Button>
                )}
              </TooltipTrigger>
              <TooltipContent>
                <p>Solicitudes de stock</p>
              </TooltipContent>
            </Tooltip>}
          <span>inventario Fisico</span>
        </div>
        
        <StockFilters
          stock={stock}

        />
        <Card>
          <CardHeader className="flex justify-between">
            <div>
              <CardTitle>Inventario de Productos</CardTitle>
              <CardDescription>Lista completa de productos con información de stock y ubicación</CardDescription>
            </div>
            <div>
              {hasSubmenuPermission('inventarioFisico', 'update') &&
                <Button size="sm" variant="outline" onClick={handleAplicarTodo} className="text-xs" disabled={Object.keys(editedRows).length === 0} >
                  <Plus className="h-3 w-3 mr-1" /> Aplicar todo
                </Button>
              }
            </div>
          </CardHeader>
          <CardContent>
            <StockTable
              stock={stock}
              setStock={setStock}
              editedRows={editedRows}
              setEditedRows={setEditedRows}
            />
          </CardContent>
        </Card>
      </div>

      {/* Dialog para solicitar stock */}
      {solicitudDialogOpen && <SolicitarStock open={solicitudDialogOpen} onClose={() => setsolicitudDialogOpen(false)} productos={productosDisponibles} />}
    </AuthenticatedLayout>
  );
}
