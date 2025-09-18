import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { History, Pencil } from "lucide-react";
import { useState } from "react";
import { ExistenciaModal } from "./modals/ModalAjusteExistencia";
import { router } from "@inertiajs/react";
import { ExistenciasItem } from "../../../types/Inventario";
import { Footer } from "@/Pages/UserModulePanel/footer";
import { links } from "@/types/links";
import { meta } from "@/types/meta";
import { useDataTableParams } from "@/hooks/useDataTableParams";
import { DataTableSkeleton } from "@/Components/DataTableSkeleton";

interface ExistenciaTableProps {
  data: ExistenciasItem[],
  links: links,
  meta: meta,
  editingIndex: number | null;
  setEditingIndex: (val: number | null) => void;

}

export default function ExistenciasTable({ data, links, meta }: ExistenciaTableProps) {
  const { params, updateParams, isLoading } = useDataTableParams();
  const [selected, setSelected] = useState<number[]>([]);
  const [idProducto, setIdProducto] = useState<number>();
  const [ajusteDialogOpen, setAjusteDialogOpen] = useState(false);
  const [isAllChecked, setIsAllChecked] = useState(false);

  const toggleRow = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );

    if (selected.length === data.length - 1) {
      setIsAllChecked(true);
      return;
    }

    setIsAllChecked(false);
  }

  const toggleAll = () => {
    if (isAllChecked) {
      setSelected([]); // desmarcar todos
    } else {
      setSelected(data.map((item: any) => item.id)); // marcar todos
    }
    setIsAllChecked(!isAllChecked);
  };

  const handleOpenWithFilter = (idProducto: number) => {
    router.visit(`/inventario/historialMoviminto/movimiento/${idProducto}`); //renderiza pagina con id
  };


  return (
    <>
      <Table>
        <TableHeader className="sticky-header">
          <TableRow>
            <TableHead className="text-center">  <Checkbox
              checked={isAllChecked}
              onCheckedChange={toggleAll}
            /></TableHead>
            <TableHead className="text-center">Producto</TableHead>
            <TableHead className="text-center">Categoria del producto</TableHead>
            <TableHead className="text-center">Existencia actual</TableHead>
            <TableHead className="text-center">Existencia utilizable</TableHead>
            <TableHead className="text-center">Entrante</TableHead>
            <TableHead className="text-center">Saliente</TableHead>
            <TableHead className="text-center">Existencia estimada</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-center">
          {isLoading ? (
            <DataTableSkeleton columnCount={9} rowCount={5} showHeaders={false}></DataTableSkeleton>
          ) : (
            data.map((item: any) => {
              const entrada = item.entrada || 0;
              const salida = item.salida || 0;
              // Calcular stock disponible según estado de entrega
              const stockDisponible =
                item.stockActual - (item.estadoEntregas === "pendiente" ? salida : 0);
              // Calcular stock estimado
              const stockEstimado = stockDisponible - salida + entrada;

              return (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(item.id)}
                      onCheckedChange={() => toggleRow(item.id)}
                    />
                  </TableCell>
                  <TableCell>{item.nombre}</TableCell>
                  <TableCell>{item.categoria}</TableCell>
                  <TableCell>
                    {item.stockActual}
                    {item.cantidad_contada == 0 || item.cantidad_contada == null && (
                      <Button
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (item.producto_id) {
                            setIdProducto(item.producto_id);
                            setAjusteDialogOpen(true);
                          }
                        }}
                      >
                        <Pencil className="w-4 h-4 text-amber-500" />
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>{stockDisponible}</TableCell>
                  <TableCell>{entrada}</TableCell>
                  <TableCell>{salida}</TableCell>
                  <TableCell>{stockEstimado}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="hover:bg-accent/10" onClick={() => { handleOpenWithFilter(item.producto_id) }}>
                      <History className="h-4 w-4" /> Historial
                    </Button>
                  </TableCell>
                </TableRow>)
            }
            ))}
        </TableBody>
      </Table>
      <Footer
        links={links}
        meta={meta}
        updateParams={updateParams}
        isLoading={isLoading} />

      {ajusteDialogOpen && idProducto && (<ExistenciaModal isOpen={ajusteDialogOpen}
        onClose={() => setAjusteDialogOpen(false)}
        idProducto={idProducto}
      ></ExistenciaModal>)}

    </>

  )
}