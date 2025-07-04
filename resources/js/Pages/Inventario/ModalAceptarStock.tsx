"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, Check, X } from "lucide-react"
import { Button } from "@/Components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Textarea } from "@/Components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select"
import { Alert, AlertDescription } from "@/Components/ui/alert"
import axios from "axios"

interface StockRequest {
  id: string
  producto: string
  almacenSolicitante: string
  cantidadSolicitada: number
  prioridad: "Alta" | "Media" | "Baja"
  justificacion: string
  stockActual: number
  stockMinimo: number
}

interface StockApprovalModalProps {
  isOpen: boolean
  onClose: () => void
  request: StockRequest | null
  onApprove: (requestId: string, approvedQuantity: number, notes: string) => void
  onReject: (requestId: string, reason: string) => void
}

export default function ModalAceptarStock({ isOpen, onClose, request, onApprove, onReject }: StockApprovalModalProps) {


  const [approvedQuantity, setApprovedQuantity] = useState("")
  const [notes, setNotes] = useState("")
  const [action, setAction] = useState<"approve" | "reject" | null>(null)

  if (!request) return null

  const handleSubmit = () => {
    if (action === "approve") {
      const quantity = Number.parseInt(approvedQuantity) || 0
      onApprove(request.id, quantity, notes)
    } else if (action === "reject") {
      onReject(request.id, notes)
    }

    // Reset form
    setApprovedQuantity("")
    setNotes("")
    setAction(null)
    onClose()
  }

  const handleClose = () => {
    setApprovedQuantity("")
    setNotes("")
    setAction(null)
    onClose()
  }

  const isLowStock = request.stockActual <= request.stockMinimo

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Aprobar Solicitud de Stock</DialogTitle>
          <DialogDescription>Revisa y aprueba o rechaza la solicitud de transferencia de stock</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Stock Alert */}
          {isLowStock && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <div className="font-medium">Stock Bajo Detectado</div>
                <div className="text-sm mt-1">
                  <div>{request.producto}</div>
                  <div>
                    Stock actual: {request.stockActual} | Mínimo: {request.stockMinimo}
                  </div>
                  <div>Almacén: {request.almacenSolicitante}</div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Request Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Almacén Solicitante</Label>
              <Input value={request.almacenSolicitante} disabled />
            </div>
            <div className="space-y-2">
              <Label>Producto</Label>
              <Input value={request.producto} disabled />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Cantidad Solicitada</Label>
              <Input value={request.cantidadSolicitada.toString()} disabled />
            </div>
            <div className="space-y-2">
              <Label>Prioridad</Label>
              <Select value={request.prioridad} disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Media">Media</SelectItem>
                  <SelectItem value="Baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Original Justification */}
          <div className="space-y-2">
            <Label>Justificación Original</Label>
            <Textarea value={request.justificacion} disabled className="min-h-[60px] resize-none" />
          </div>

          {/* Approval Section */}
          {action === "approve" && (
            <div className="space-y-4 p-4 border rounded-lg bg-green-50">
              <div className="space-y-2">
                <Label htmlFor="approved-quantity">Cantidad Aprobada</Label>
                <Input
                  id="approved-quantity"
                  type="number"
                  placeholder="Ingresa la cantidad a aprobar"
                  value={approvedQuantity}
                  onChange={(e) => setApprovedQuantity(e.target.value)}
                  max={request.cantidadSolicitada}
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="approval-notes">Notas de Aprobación</Label>
                <Textarea
                  id="approval-notes"
                  placeholder="Notas adicionales (opcional)..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
              </div>
            </div>
          )}

          {/* Rejection Section */}
          {action === "reject" && (
            <div className="space-y-4 p-4 border rounded-lg bg-red-50">
              <div className="space-y-2">
                <Label htmlFor="rejection-reason">Motivo del Rechazo</Label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Explica el motivo del rechazo..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[80px] resize-none"
                  required
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>

          {!action && (
            <>
              <Button variant="destructive" onClick={() => setAction("reject")} className="gap-2">
                <X className="h-4 w-4" />
                Rechazar
              </Button>
              <Button onClick={() => setAction("approve")} className="gap-2">
                <Check className="h-4 w-4" />
                Aprobar
              </Button>
            </>
          )}

          {action === "approve" && (
            <Button
              onClick={handleSubmit}
              disabled={!approvedQuantity || Number.parseInt(approvedQuantity) <= 0}
              className="gap-2"
            >
              <Check className="h-4 w-4" />
              Confirmar Aprobación
            </Button>
          )}

          {action === "reject" && (
            <Button variant="destructive" onClick={handleSubmit} disabled={!notes.trim()} className="gap-2">
              <X className="h-4 w-4" />
              Confirmar Rechazo
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
