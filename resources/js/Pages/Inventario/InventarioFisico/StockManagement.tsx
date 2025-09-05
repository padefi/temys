import React, { useEffect, useRef, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/Components/ui/tooltip";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/Components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Tabs, TabsContent } from "@/Components/ui/tabs";
import { DataTableSkeleton } from "@/Components/DataTableSkeleton";
import { usePermissions } from "@/composables/permissions";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Label } from "@/Components/ui/label";
import { Package, AlertTriangle, Plus, Search, ArrowUpDown, ArrowDownWideNarrow, ArrowUpNarrowWide, Bell, Save, BrushCleaning, Clock10, SquarePen, Pencil } from "lucide-react";
import { Input } from "@/Components/ui/input";
import { usePage } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { SolicitarStock } from "./modals/ModalCrearSolicitudStock"; 

import { Almacen, StockItem } from "./Types"; 
import axios from "axios";
import { toast } from 'sonner';
import { AnimatePresence, motion } from "framer-motion";
import { StockFilters } from "./StockFilters";
import { StockTable } from "./StockTable"; 
import { CardTable } from "./CardTable"; 

type PageProps = InertiaPageProps & {
  stocks: {
    data: StockItem[];
  };
};

export default function StockManagement() {
  const [productosDisponibles, setProductosDisponibles] = useState<StockItem[]>([]);

  const [solicitudDialogOpen, setsolicitudDialogOpen] = useState(false);

  const { stocks } = usePage<PageProps>().props;

  const { hasSubmenuPermission } = usePermissions();


 const [stock, setStock] = useState<StockItem[]>([]);

 


  const [filteredStock, setFilteredStock] = useState<StockItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);

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
                  <Button size="sm" variant="outline"  onClick={handleAbrirModal}  className="text-xs"> <Plus className="h-3 w-3 mr-1" /> Solicitar </Button>
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
            />

          <CardTable stockFiltrado={filteredStock}  stocks={stocks} currentPage={currentPage} setCurrentPage={setCurrentPage}></CardTable>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog para solicitar stock */}
      {solicitudDialogOpen && <SolicitarStock open={solicitudDialogOpen} onClose={() => setsolicitudDialogOpen(false)} productos={productosDisponibles} />}



    </AuthenticatedLayout>


  );
}
