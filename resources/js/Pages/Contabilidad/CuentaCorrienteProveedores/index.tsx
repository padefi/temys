import * as Dialog from "@radix-ui/react-dialog";
import { X, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/Components/ui/table";
import { useState, useEffect } from "react";
import { Proveedor } from "@/types/Proveedor";
import axios from "axios";

type Props = {
  open: boolean;
  onClose: () => void;
  proveedor: Proveedor;
};

export default function CuentaCorrienteModal({ open, onClose, proveedor }: Props) {
  const [movimientos, setMovimientos] = useState<any[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  useEffect(() => {
    if (open && proveedor) {
      const fetchMovimientos = async () => {
        const res = await axios.get(`/contabilidad/${proveedor.id}/cuenta-corriente`);
        const data = res.data;

        // Agrupar por factura (grupo_id)
        const agrupados: any[] = [];
        const grupos: Record<number, any> = {};
        data.forEach((m: any) => {
          if (!grupos[m.grupo_id]) {
            grupos[m.grupo_id] = { ...m, ordenes_pago: [] };
            agrupados.push(grupos[m.grupo_id]);
          } else if (m.tipo.includes("Orden de Pago")) {
            grupos[m.grupo_id].ordenes_pago.push(m);
          }
        });

        // Calcular saldo acumulado total
        let saldoAcumulado = 0;
        agrupados.forEach((comp) => {
        const saldoComprobante = (comp.debe || 0) - (comp.haber || 0);

        // ✅ Solo sumar las órdenes de pago confirmadas
        const pagosConfirmados = comp.ordenes_pago
            .filter((o) => o.estado === "Confirmado")
            .reduce(
            (acc, o) =>
                acc + ((o.afecta_saldo ? o.haber : 0) - (o.afecta_saldo ? o.debe : 0)),
            0
            );

        saldoAcumulado += saldoComprobante - pagosConfirmados;
        comp.saldoAcumulado = saldoAcumulado;

        // Saldo pendiente de cada orden de pago
        comp.ordenes_pago = comp.ordenes_pago.map((o: any) => ({
            ...o,
            saldoPendiente: (o.debe || 0) - (o.haber || 0),
        }));
        });


        setMovimientos(agrupados);
      };
      fetchMovimientos();
    }
  }, [open, proveedor]);

  const toggleExpand = (idx: number) => {
    setExpandedRows((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const calcularSubtotalOrdenes = (ordenes: any[]) => {
    const subtotalDebe = ordenes.reduce((acc, o) => acc + (o.debe || 0), 0);
    const subtotalHaber = ordenes.reduce((acc, o) => acc + (o.haber || 0), 0);
    const subtotalSaldo = ordenes.reduce((acc, o) => acc + (o.saldoPendiente || 0), 0);
    return { subtotalDebe, subtotalHaber, subtotalSaldo };
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Overlay className="fixed inset-0 bg-black/50" />
      <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-2xl w-full max-w-7xl shadow-lg max-h-[90vh] overflow-auto">
        <Dialog.Title className="text-lg font-bold mb-4">Cuenta Corriente</Dialog.Title>
        <Dialog.Close asChild>
          <button className="absolute top-3 right-3 p-1 rounded hover:bg-gray-200">
            <X size={20} />
          </button>
        </Dialog.Close>

        <Table className="w-full border">
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Tipo de Comprobante</TableHead>
              <TableHead>N°</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Débito (Debe)</TableHead>
              <TableHead className="text-right">Crédito (Haber)</TableHead>
              <TableHead className="text-right">Saldo acumulado</TableHead>
            </TableRow>
          </TableHeader>

            <TableBody>
            {movimientos.map((m, idx) => {
                const subtotal = calcularSubtotalOrdenes(m.ordenes_pago || []);
                return (
                <>
                    {/* Fila principal: factura */}
                    <TableRow
                    key={`factura-${idx}`}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleExpand(idx)}
                    >
                    <TableCell className="w-4">
                        {m.ordenes_pago?.length ? (
                        expandedRows.includes(idx) ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                        ) : null}
                    </TableCell>
                    <TableCell>{new Date(m.fecha).toLocaleDateString("es-AR")}</TableCell>
                    <TableCell>{m.tipo}</TableCell>
                    <TableCell>{m.numero}</TableCell>
                    <TableCell>{m.descripcion}</TableCell>
                    <TableCell>{m.estado}</TableCell>
                    <TableCell className="text-right">{m.debe?.toFixed(2) || ""}</TableCell>
                    <TableCell className="text-right">{m.haber?.toFixed(2) || ""}</TableCell>
                    <TableCell className="text-right">{m.saldoAcumulado.toFixed(2)}</TableCell>
                    </TableRow>

                    {/* Filas expandibles: órdenes de pago */}
                    {expandedRows.includes(idx) &&
                    m.ordenes_pago?.map((op: any, j: number) => {
                        const estadoClase =
                        op.estado.toLowerCase() === "pendiente"
                            ? "text-yellow-600 font-bold"
                            : op.estado.toLowerCase() === "confirmado"
                            ? "text-green-600 font-bold"
                            : "";

                        return (
                        <TableRow key={`op-${idx}-${j}`} className="bg-gray-50">
                            <TableCell></TableCell>
                            <TableCell>{new Date(op.fecha).toLocaleDateString("es-AR")}</TableCell>
                            <TableCell className={estadoClase}>{op.tipo}</TableCell>
                            <TableCell>{op.numero}</TableCell>
                            <TableCell>{op.descripcion}</TableCell>
                            <TableCell className={estadoClase}>{op.estado}</TableCell>
                            <TableCell className="text-right">{op.debe?.toFixed(2) || ""}</TableCell>
                            <TableCell className="text-right">{op.haber?.toFixed(2) || ""}</TableCell>
                            <TableCell className="text-right">{op.estado.toLowerCase() === "confirmada" ? op.saldoPendiente?.toFixed(2) || "" : ""}</TableCell>
                        </TableRow>
                        );
                    })}

                    {/* Subtotal de órdenes de pago */}
                    {expandedRows.includes(idx) && m.ordenes_pago?.length ? (
                    <TableRow className="bg-gray-100 font-bold">
                        <TableCell></TableCell>
                        <TableCell colSpan={5} className="text-right">
                        Subtotal Órdenes de Pago:
                        </TableCell>
                        <TableCell className="text-right">{subtotal.subtotalDebe.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{subtotal.subtotalHaber.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{/*subtotal.subtotalSaldo.toFixed(2)*/}</TableCell>
                    </TableRow>
                    ) : null}
                </>
                );
            })}
            </TableBody>

        </Table>

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
