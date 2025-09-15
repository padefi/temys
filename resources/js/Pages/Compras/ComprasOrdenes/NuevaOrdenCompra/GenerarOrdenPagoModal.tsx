import React, { useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"


type MetodoPago =
  | { tipo: "Transferencia"; banco: string; cbu: string }
  | { tipo: "Efectivo" }
  | { tipo: "Tarjeta"; cuotas: number }
  | { tipo: "Cheque"; cheques: { numero: string; fechaPago: string; fechaVencimiento: string; importe: number }[] }

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (data: {
    metodoPago: string
    importe: number
    moneda: string
    cuotas:number
    fechaPago: string
  }) => void
  totalOrden: number
  monedaOrden: string
}

export default function GenerarOrdenPagoModal({
  open,
  onClose,
  onSubmit,
  totalOrden,
  monedaOrden
}: Props) {
    const [diario, setDiario] = useState("")
    const [metodoPago, setMetodoPago] = useState("")
    const [importe, setImporte] = useState(totalOrden)
    const [moneda, setMoneda] = useState(monedaOrden)
    const [fechaPago, setFechaPago] = useState("")
    const [cuotas, setCuotas] = useState(1)
    const [cheques, setCheques] = useState<
    { numero: string; fechaPago: string; fechaVencimiento: string; importe: number }[]
    >([])



    const handleSubmit = () => {
    onSubmit({
        metodoPago,
        importe,
        moneda,
        fechaPago,
        cuotas: metodoPago === "Tarjeta" ? cuotas : 0,
        cheques: metodoPago === "Cheque" ? cheques : undefined
    })
    onClose()
    }


  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Overlay className="fixed inset-0 bg-black/50" />
      <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
        <Dialog.Title className="text-lg font-bold">Generar Orden de Pago</Dialog.Title>
        <Dialog.Close asChild>
          <button className="absolute top-3 right-3 p-1 rounded hover:bg-gray-200">
            <X size={20} />
          </button>
        </Dialog.Close>

        <div className="space-y-4 mt-4">


        <div>
        <Label>Método de Pago</Label>
        <select
            className="border p-2 rounded w-full"
            value={metodoPago}
            onChange={e => setMetodoPago(e.target.value)}
        >
            <option value="">Seleccionar método</option>
            <option value="Transferencia">Transferencia</option>
            <option value="Efectivo">Efectivo</option>
            <option value="Tarjeta">Tarjeta</option>
            <option value="Cheque">Cheque</option>
        </select>
        </div>

            {/* Si es tarjeta → cuotas */}
            {metodoPago === "Tarjeta" && (
            <div>
                <Label>Cuotas</Label>
                <Input
                type="number"
                value={cuotas}
                min={1}
                onChange={e => setCuotas(Number(e.target.value))}
                />
            </div>
            )}

            {/* Si es cheque → lista dinámica */}
            {metodoPago === "Cheque" && (
            <div className="space-y-3">
                <Label>Cheques</Label>
                {cheques.map((cheque, idx) => (
                <div key={idx} className="border p-2 rounded space-y-2">
                    <Input
                    placeholder="N° Cheque"
                    value={cheque.numero}
                    onChange={e => {
                        const updated = [...cheques]
                        updated[idx].numero = e.target.value
                        setCheques(updated)
                    }}
                    />
                    <Input
                    type="date"
                    placeholder="Fecha de Pago"
                    value={cheque.fechaPago}
                    onChange={e => {
                        const updated = [...cheques]
                        updated[idx].fechaPago = e.target.value
                        setCheques(updated)
                    }}
                    />
                    <Input
                    type="date"
                    placeholder="Fecha de Vencimiento"
                    value={cheque.fechaVencimiento}
                    onChange={e => {
                        const updated = [...cheques]
                        updated[idx].fechaVencimiento = e.target.value
                        setCheques(updated)
                    }}
                    />
                    <Input
                    type="number"
                    placeholder="Importe"
                    value={cheque.importe}
                    onChange={e => {
                        const updated = [...cheques]
                        updated[idx].importe = Number(e.target.value)
                        setCheques(updated)
                    }}
                    />
                </div>
                ))}
                <Button
                type="button"
                variant="outline"
                onClick={() =>
                    setCheques(prev => [...prev, { numero: "", fechaPago: "", fechaVencimiento: "", importe: 0 }])
                }
                >
                + Agregar Cheque
                </Button>
            </div>
            )}


            <div>
                <Label>Moneda</Label>
                <Input value={moneda} readOnly />
            </div>

            <div>
                <Label>Fecha de Pago</Label>
                <Input type="date" value={fechaPago} onChange={e => setFechaPago(e.target.value)} />
            </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit}>Confirmar</Button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
