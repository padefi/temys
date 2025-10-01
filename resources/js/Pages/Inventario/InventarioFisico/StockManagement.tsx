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
import { InventarioItem } from "../../../types/Inventario";
import { StockFilters } from "./StockFilters";
import { CardTable } from "./CardTable";
import { meta } from "@/types/meta";
import { links } from "@/types/links";


interface StockPagination {
    data: InventarioItem[];
    links: links;
    meta: meta;
}


type PageProps = InertiaPageProps & {
  stocks:
   StockPagination
  
};

export default function StockManagement() {
  const [productosDisponibles, setProductosDisponibles] = useState<InventarioItem[]>([]);
  const [solicitudDialogOpen, setsolicitudDialogOpen] = useState(false);
  const { stocks:{ data: stock, links, meta }  } = usePage<PageProps>().props;
  const [stockData, setstockData] = useState<InventarioItem[]>(stock); 
  const { hasSubmenuPermission } = usePermissions();
  
  const [filteredStock, setFilteredStock] = useState<InventarioItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);


   useEffect(() => {
        if (stockData != stock) setstockData(stock)
    }, [stock]);

  const handleAbrirModal = () => {
    const productosFiltrados = stockData.filter(
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

        <Tabs defaultValue="stock" className="space-y-4">
          <TabsContent value="stock" className="space-y-4">
             <StockFilters
              stock={stock}
              currentPage={currentPage}
              setFilteredStock={setFilteredStock}
              filteredStock={filteredStock}
            /> *
          <CardTable stockFiltrado={filteredStock} stocks={stock} currentPage={currentPage} setCurrentPage={setCurrentPage}></CardTable>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog para solicitar stock */}
      {solicitudDialogOpen && <SolicitarStock open={solicitudDialogOpen} onClose={() => setsolicitudDialogOpen(false)} productos={productosDisponibles} />}
    </AuthenticatedLayout>
  );
}
