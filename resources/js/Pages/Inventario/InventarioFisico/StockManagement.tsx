import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/Components/ui/tooltip";
import { usePermissions } from "@/composables/permissions";
import { Button } from "@/Components/ui/button";
import { Bell, Plus } from "lucide-react";
import { usePage } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { SolicitarStock } from "./modals/ModalCrearSolicitudStock";
import { StockInventarioItem } from "../../../types/Inventario";
import { StockTable } from "./modeloDataTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { links } from "@/types/links";
import { meta } from "@/types/meta";
import { EstadisticaInventario } from "./EstadisticasInventario";
import axios from "axios";
import { Badge } from "@/Components/ui/badge";
import SolicitudesStock from "./modals/ModalSolicitudesEntrantes";

type PageProps = InertiaPageProps & {
  stocks: {
    data: StockInventarioItem[];
    links: links;
    meta: meta;
  };
};

export default function StockManagement() {
  const [productosDisponibles, setProductosDisponibles] = useState<StockInventarioItem[]>([]);
  const [solicitudDialogOpen, setsolicitudDialogOpen] = useState(false);
  const { stocks } = usePage<PageProps>().props;
  const { hasSubmenuPermission } = usePermissions();
  const [stock, setStock] = useState<StockInventarioItem[]>([]);
  const [solicitudes, setSolicitudes] = useState()
  const [solicitudesStockDialogOpen, setSolicitudesStockDialogOpen] = useState(false);
  
/* 
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
  }; */

  useEffect(() => {
    setStock(stocks.data);
  }, [stocks]);

  console.log(stocks)
  const handleAbrirModal = () => {
    const productosFiltrados = stock.filter(
      (item) => item.cantidad_actual <= item.stock_minimo
    );
    setProductosDisponibles(productosFiltrados);
    setsolicitudDialogOpen(true);

  };

    const handleSolicitudes = async () => {
    try {
      const res = await axios.get(`/solicitudes-stock/`)
      setSolicitudes(res.data)
      setSolicitudesStockDialogOpen(true)
    } catch (err) {
      console.error("Error al cargar detalles de la solicitud", err)
    }
  }


  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">Inventario</h2>
      }>
      <Head title="Inventario" />
      <div className="mx-auto w-full p-6 space-y-6">
        <div className=" flex justify-between">
            <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="lg" onClick={() => handleSolicitudes()}>
                <Badge variant={"success"}>1</Badge>
                <Bell className="h-4 " />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Solicitudes de stock</p>
            </TooltipContent>
          </Tooltip>
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
         {/*  <span>inventario Fisico</span> */}
        </div>
        
        <EstadisticaInventario data={stock}></EstadisticaInventario>
    
        <Card>
          <CardHeader className="flex justify-between">
            <div>
              <CardTitle>Inventario de Productos</CardTitle>
              <CardDescription>Lista completa de productos con información de stock y ubicación</CardDescription>
            </div>
           {/*  <div>
              {hasSubmenuPermission('inventarioFisico', 'update') &&
                <Button size="sm" variant="outline" onClick={handleAplicarTodo} className="text-xs" disabled={Object.keys(editedRows).length === 0} >
                  <Plus className="h-3 w-3 mr-1" /> Aplicar todo
                </Button>
              }
            </div> */}
          </CardHeader>
          <CardContent>
            <StockTable
              data={stock}
              links={stocks.links}
              meta={stocks.meta}             
              setStock={setStock}
            />
          </CardContent>
        </Card>
      </div>

      {/* Dialog para solicitar stock */}
      {solicitudDialogOpen && <SolicitarStock open={solicitudDialogOpen} onClose={() => setsolicitudDialogOpen(false)} productos={productosDisponibles} />}
        {solicitudesStockDialogOpen && <SolicitudesStock isOpen={solicitudesStockDialogOpen} onClose={() => setSolicitudesStockDialogOpen(false)} requests={solicitudes}></SolicitudesStock>}
    </AuthenticatedLayout>
  );
}
