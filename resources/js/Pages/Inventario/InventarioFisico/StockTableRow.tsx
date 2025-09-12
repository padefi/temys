import { TableCell, TableRow } from "@/Components/ui/table";
import { StockItem } from "./Types";
import { usePermissions } from "@/composables/permissions";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/Components/ui/tooltip";
import { BrushCleaning, Clock10, Pencil, Plus, Save } from "lucide-react";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { AjusteInventarioModal } from "./modals/ModalConfirmarAjuste";

interface Props {
  item: StockItem;
  index: number;
  stock: StockItem[]
  setStock: React.Dispatch<React.SetStateAction<StockItem[]>>;
  stockStatus: {
    status: string;
    color: string;
  };
  editedRows: Record<number, number>;
  setEditedRows: React.Dispatch<React.SetStateAction<Record<number, number>>>;
}
interface AjusteSeleccionado {
  ajusteId: number;
  productoId: number;
}


export function StockTableRow({
  item,
  index,
  stock,
  setStock,
  stockStatus,
  editedRows,
  setEditedRows
}: Props) {
  const { hasSubmenuPermission } = usePermissions();
  const { hasRole } = usePermissions();
  const [editingCell, setEditingCell] = useState<{ rowId: number, field: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // const [editedRows, setEditedRows] = useState<Record<number, number>>({})
  const [ajusteSeleccionado, setAjusteSeleccionado] = useState<AjusteSeleccionado | null>(null);
  const [isModalOpenInventario, setIsModalOpenInventario] = useState(false)



  // Manejador de clic en la celda para activar la edición
  const handleCellClick = (id: any, field: any) => {
    setEditingCell({ rowId: id, field });
  };

  // Manejador de cambio en el input editable
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
    field: keyof StockItem
  ) => {
    const value = e.target.value;
    // solo dígitos
    if (!/^\d+$/.test(value)) {
      toast.error("Solo se permiten números");
      return;
    }

    // convertir a número
    const num = Number(value);

    if (num === 0) {
      toast.error("El número no puede ser 0");
      return;
    }



    ///Validar
    const newValue = Number(e.target.value);
    setStock(prevData =>
      prevData.map(item =>
        item.id === id ? { ...item, [field]: newValue } : item)
    );

    setEditedRows(prev => ({ ...prev, [id]: newValue }));
  };

  const handleInputBlur = () => {
    if (editingCell) {
      const editedItem = stock.find(item => item.id === editingCell.rowId);
      if (!editedItem) return;
      // setEditingCell(null);
    }
  };
  // Función para calcular la diferencia
  const calculaDiferencia = (aMano: number, contada: number) => {
    if (contada > 0) {
      return (contada !== undefined ? contada : aMano) - aMano;
    }
  };


  const handleAplicarFila = async (id: number) => {
    const row = stock.find((item) => item.id === id);
    if (!row) return;

    try {
      const response = await axios.post(`/actualizar-cantidad-contadas/${id}`, {
        cantidad_contada: row.cantidad_contada,
        motivo: 'Ajuste manual individual',
      });
      const data = await response.data;

      toast.success(data.message);

      const updated = { ...editedRows };
      delete updated[id];

      setEditedRows(updated);
      setEditingCell(null);
    } catch (error: any) {
      toast.error(error.response.data.message)
      console.error("Error al aplicar fila:", error);
    }
  };

  const handleLimpiarFila = (id: number) => {
    setStock(prev =>
      prev.map(item =>
        item.id === id ? { ...item, cantidad_contada: 0 } : item
      )
    );
    const updated = { ...editedRows };
    delete updated[id];
    setEditedRows(updated);
    setEditingCell(null);
  };

  return (
    <>
      <TableRow key={item.id + index}>
        <TableCell className="font-medium">{item.producto.nombre}</TableCell>
        <TableCell>{item.almacen.nombre}</TableCell>
        <TableCell className="font-mono relative">
          <div className="flex items-center justify-center gap-2">
            {item.cantidad_actual}
          </div>
        </TableCell>

        {/* Celda editable para Cantidades Contadas */}
        {hasSubmenuPermission('inventarioFisico', 'update') && hasSubmenuPermission('inventarioFisico', 'create') &&
          <>
            <TableCell
              className="py-3 px-4 relative flex justify-center"
            >
              {/* Caso: edición activa */}
              {editingCell &&
                editingCell.rowId === item.id &&
                editingCell.field === "cantidad_contada" ? (
                <AnimatePresence
                  initial={false}
                  mode="popLayout">
                  <input
                    ref={inputRef}
                    type="text"
                    onChange={(e) => handleInputChange(e, item.id, "cantidad_contada")}
                    onBlur={handleInputBlur}
                    disabled={
                      item.estado_ajuste === "nuevo" ||
                      !hasSubmenuPermission("inventarioFisico", "update")
                    }
                    className={`w-24 p-1 border border-neutral-200 rounded-md ${item.estado_ajuste === "nuevo" ||
                      !hasSubmenuPermission("inventarioFisico", "update")
                      ? "bg-neutral-100 text-gray-500 cursor-not-allowed focus:ring-0 focus:outline-none"
                      : "focus:ring-2 focus:ring-neutral-300"
                      }`}
                  />
                </AnimatePresence>

              ) : (
                <div className="flex items-center justify-center gap-1 rounded-md w-24 h-9 ">
                  {/* Mostrar cantidad si existe */}
                  {item.cantidad_contada !== 0 && item.cantidad_contada != null ? (
                    <span>{item.cantidad_contada}</span>
                  ) : (
                    // Mostrar botón solo si no hay cantidad
                    item.estado_ajuste !== "nuevo" &&
                    hasSubmenuPermission("inventarioFisico", "update") && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.button initial={false} whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              handleCellClick(item.id, "cantidad_contada")
                            }
                          >
                            <Pencil className="color: text-amber-500" />
                          </motion.button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Agregar cantidad</p>
                        </TooltipContent>
                      </Tooltip>
                    )
                  )}

                  {/* Badge "Pendiente" */}
                  {item.estado_ajuste === "nuevo" &&
                    hasSubmenuPermission("inventarioFisico", "confirm") &&
                    hasRole("admin") && (
                      <span
                        className="inline-flex items-center px-2 py-1 text-sm font-medium rounded-full bg-orange-100 text-orange-800 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (item.ajuste_id) {
                            setAjusteSeleccionado({
                              ajusteId: item.ajuste_id,
                              productoId: item.producto.id,
                            });
                            setIsModalOpenInventario(true);
                          }
                        }}
                      >
                        <Clock10 className="inline h-4 w-4 mr-1" />
                        Pendiente
                      </span>
                    )}
                </div>
              )}
            </TableCell>

            <TableCell
              className={`py-3 px-4 font-medium ${calculaDiferencia(item.cantidad_actual, item.cantidad_contada)! > 0
                ? 'text-green-600'
                : calculaDiferencia(item.cantidad_actual, item.cantidad_contada)! < 0
                  ? 'text-red-600'
                  : 'text-gray-500'
                }`} >
              {calculaDiferencia(item.cantidad_actual, item.cantidad_contada)}
            </TableCell>

          </>
        }
        <TableCell>
          <Badge variant={stockStatus.color as | "default" | "destructive" | "secondary" | "outline"}>{stockStatus.status}</Badge>
        </TableCell>

        <TableCell>

          {editedRows[item.id] !== undefined ? (
            <>
              {hasSubmenuPermission('inventarioFisico', 'update') && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAplicarFila(item.id)}
                    className="text-xs"
                  >
                    <Save className="h-3 w-3 mr-1" /> Aplicar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleLimpiarFila(item.id)}
                    className="text-xs ml-2"
                  >
                    <BrushCleaning className="h-3 w-3 mr-1" /> Limpiar
                  </Button>
                </>
              )}
            </>
          ) : (
            <span className="text-muted-foreground text-xs"></span>
          )}

        </TableCell>

      </TableRow>

      {/* Dialog Inventario modal */}
      {isModalOpenInventario && ajusteSeleccionado && (
        <AjusteInventarioModal
          isOpen={isModalOpenInventario}
          onClose={() => setIsModalOpenInventario(false)}
          idAjuste={ajusteSeleccionado.ajusteId} // id del ajuste
          productoId={ajusteSeleccionado.productoId} // id del producto
          onApprove={() => {
            console.log("Ajuste aprobado");
            setIsModalOpenInventario(false);
          }}
          onReject={() => {
            console.log("Ajuste rechazado");
            setIsModalOpenInventario(false);
          }}
        />
      )}
    </>

  )
}