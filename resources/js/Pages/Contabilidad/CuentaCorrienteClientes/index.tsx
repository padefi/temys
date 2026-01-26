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
import axios from "axios";
import { Cliente } from "@/types/Cliente";

type Props = {
  open: boolean;
  onClose: () => void;
  cliente: Cliente;
};

export default function CuentaCorrienteModal({ open, onClose, cliente }: Props) {
  const [movimientos, setMovimientos] = useState<any[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  useEffect(() => {
    if (!open || !cliente) return;

    const fetchMovimientos = async () => {
        const res = await axios.get(`/contabilidad/clientes/${cliente.id}/cuenta-corriente`);
        const data = res.data;

        // Agrupar por comprobante (grupo_id)
        const agrupados: any[] = [];
        const grupos: Record<number, any> = {};

        data.forEach((m: any) => {
            if (!grupos[m.grupo_id]) {
            grupos[m.grupo_id] = {
                ...m,
                detalles: [],
            };
            agrupados.push(grupos[m.grupo_id]);
            } else {
            grupos[m.grupo_id].detalles.push(m);
            }
        });

        /////Ordena por fecha
        agrupados.sort(
            (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
        );

        // Calcular saldo acumulado
        let saldoAcumulado = 0;

        agrupados.forEach((comp) => {
            const saldoBase =
            comp.tipo === "Anticipo"
                ? 0
                : (comp.debe || 0) - (comp.haber || 0);

            const totalAplicado = (comp.detalles || []).reduce(
            (acc: number, d: any) =>
                acc + (d.afecta_saldo ? (d.haber || 0) - (d.debe || 0) : 0),
            0
            );

            saldoAcumulado += saldoBase - totalAplicado;
            comp.saldoAcumulado = saldoAcumulado;
        });

        setMovimientos(agrupados);
    };

    fetchMovimientos();
  }, [open, cliente]);

  const toggleExpand = (idx: number) => {
    setExpandedRows((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Overlay className="fixed inset-0 bg-black/50" />
      <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-2xl w-full max-w-7xl shadow-lg max-h-[90vh] overflow-auto">
        <Dialog.Title className="text-lg font-bold mb-4">
          Cuenta Corriente
        </Dialog.Title>

        <Dialog.Close asChild>
          <button className="absolute top-3 right-3 p-1 rounded hover:bg-gray-200">
            <X size={20} />
          </button>
        </Dialog.Close>

        <Table className="w-full border">
          <TableHeader>
            <TableRow>
              <TableHead />
              <TableHead>Fecha</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>N°</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Debe</TableHead>
              <TableHead className="text-right">Haber</TableHead>
              <TableHead className="text-right">Saldo</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {movimientos.map((m, idx) => (
              <>
                {/* Comprobante principal */}
                <TableRow
                  key={`main-${idx}`}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleExpand(idx)}
                >
                  <TableCell className="w-4">
                    {m.detalles.length ? (
                      expandedRows.includes(idx) ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )
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

                {/* Detalles: aplicaciones / OP */}
                {expandedRows.includes(idx) &&
                  m.detalles.map((d: any, j: number) => (
                    <TableRow key={`det-${idx}-${j}`} className="bg-gray-50">
                      <TableCell />
                      <TableCell>{new Date(d.fecha).toLocaleDateString("es-AR")}</TableCell>
                      <TableCell className="italic text-blue-600">
                        {d.tipo}
                      </TableCell>
                      <TableCell>{d.numero}</TableCell>
                      <TableCell>{d.descripcion}</TableCell>
                      <TableCell>{d.estado}</TableCell>
                      <TableCell className="text-right">{d.debe?.toFixed(2) || ""}</TableCell>
                      <TableCell className="text-right">{d.haber?.toFixed(2) || ""}</TableCell>
                      <TableCell />
                    </TableRow>
                  ))}
              </>
            ))}
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
