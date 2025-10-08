import { AlertTriangle, Bell, Package, Search } from "lucide-react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Almacen, StockInventarioItem, StockItem } from "../../../types/Inventario"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { useEffect, useState } from "react";
import axios from "axios";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/Components/ui/tooltip";
import SolicitudesStock from "./modals/ModalSolicitudesEntrantes"; 

interface Props {
  stock: StockInventarioItem[]
}


export function StockFilters({
  stock,
}: Props) {

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAlmacen, setselectedAlmacen] = useState("all");
  const [stockFiltro, setstockFiltro] = useState("all");
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
  const [solicitudes, setSolicitudes] = useState()
  const [solicitudesStockDialogOpen, setSolicitudesStockDialogOpen] = useState(false);
  useEffect(() => {
    axios
      .get("/inventario/almacenes")
      .then((res) => setAlmacenes(res.data.data))
      .catch((err) => console.error("Error al cargar almacenes", err));
  }, []);

useEffect(() => {
  const filtered = stock.filter((item) => {
    const matchesSearch = item.producto
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesWarehouse =
      selectedAlmacen === "all" || item.almacen === selectedAlmacen;
    const matchesStockFiltro =
      stockFiltro === "all" ||
      (stockFiltro === "low" &&
        item.cantidad_actual > 0 &&
        item.cantidad_actual <= item.stock_minimo) ||
      (stockFiltro === "normal" && item.cantidad_actual > item.stock_minimo) ||
      (stockFiltro === "empty" && item.cantidad_actual === 0);
    return matchesSearch && matchesWarehouse && matchesStockFiltro;
  });

  
}, [stock]);


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

    <>

      <Card>
        <CardHeader className="text-xl flex justify-between">

          <CardTitle>Filtros</CardTitle>

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

        </CardHeader>

        <CardContent>
          {/*Filtros*/}
      {/*     <div className="grid  grid-cols-1 md:grid-cols-3 gap-35">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar producto</Label>
              <div className="relative w-46">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="search" placeholder="Nombre" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); currentPage; }} className="pl-8" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Almacén</Label>
              <Select value={selectedAlmacen} onValueChange={(value) => { setselectedAlmacen(value); currentPage; }}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar almacén" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los almacenes</SelectItem>
                  {almacenes.map((almacen) => (
                    <SelectItem key={almacen.id} value={almacen.nombre} >{almacen.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Estado de stock</Label>
              <Select value={stockFiltro} onValueChange={(value) => { setstockFiltro(value); currentPage }} >
                <SelectTrigger className="w-46">
                  <SelectValue placeholder="Estado de stock" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="low">Stock bajo</SelectItem>
                  <SelectItem value="normal">Stock normal</SelectItem>
                  <SelectItem value="empty">Sin stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div> */}

          {/* Resumen compacto */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-35 text-sm text-muted-foreground mt-8">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>Total Productos:</span>
              <span className="font-bold text-gray-700">{stock.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span>Stock Bajo:</span>
              <span className="font-bold text-red-700">
                {stock.filter((item) => item.cantidad_actual <= item.stock_minimo).length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-red-500" />
              <span>Sin Stock:</span>
              <span className="font-bold text-red-700">{stock.filter((item) => item.cantidad_actual === 0).length}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Dialog Solicitudes de stock para aprobar */}
      {solicitudesStockDialogOpen && <SolicitudesStock isOpen={solicitudesStockDialogOpen} onClose={() => setSolicitudesStockDialogOpen(false)} requests={solicitudes}></SolicitudesStock>}

      
    </>

  );

}
