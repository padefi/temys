import React, { useState, useRef, useEffect, useCallback } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { X, Trash2 } from "lucide-react"
import { TipoMoneda } from '@/types/TipoMoneda'

type Props = {
  open: boolean
  onClose: () => void
  totalOrden: number
  monedaOrden: number
  tipoMonedas: TipoMoneda[]
  proveedorId: number
  onSubmit: (data: any) => void
}

export default function GenerarFacturaModal({
  open,
  onClose,
  totalOrden,
  monedaOrden,
  tipoMonedas,
  proveedorId,
  onSubmit
}: Props) {


  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Overlay className="fixed inset-0 bg-black/50" />
      <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg w-full max-w-6xl shadow-lg max-h-[90vh] overflow-auto">
        <Dialog.Title className="text-lg font-bold">Cargar Factura</Dialog.Title>
        <Dialog.Close asChild>
          <button className="absolute top-3 right-3 p-1 rounded hover:bg-gray-200"><X size={20} /></button>
        </Dialog.Close>

      </Dialog.Content>
    </Dialog.Root>
  )
}
