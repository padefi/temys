import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { Button } from "@/Components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import axios from "axios"
import { useEffect, useState } from "react"
import AceptarStock from "./ModalAprobarORechazarStock"

interface Solicitudes  {
  id: number
  nombre_producto: string
  nombre_almacen: string
  prioridad: string
  fecha: Date
}
interface SolicitudesModalProps {
  isOpen: boolean
  onClose: () => void,
  requests?:Solicitudes[]
}


export default function SolicitudesStock({ isOpen, onClose,requests }: SolicitudesModalProps) {
  const [solicitudesStock, setSolicitudesStock] = useState<Solicitudes[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [solicitudesAceptar, setSolicitudesAceptar] = useState(null)

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5) 

  useEffect(() => {
  if (requests) {
    setSolicitudesStock(requests)
  } 
}, [requests])


  // Cálculos para paginación
  const totalPages = Math.ceil(solicitudesStock.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = solicitudesStock.slice(startIndex, endIndex)

  const handleClose = () => {
    onClose()
    setCurrentPage(1) // Reset página al cerrar
  } 

  const openModal = async (id: number) => {
    try {
      const res = await axios.get(`/solicitudes-stock/${id}`)
      setSolicitudesAceptar(res.data)
      setIsModalOpen(true)
    } catch (err) {
      console.error("Error al cargar detalles de la solicitud", err)
    }
  }

  const handleAprobado = (id: any, qty: any, notes: any) => {
    console.log("Aprobado", id, qty, notes)
    setIsModalOpen(false)
  }

  const handleRechazado = (id: any, reason: any) => {
    console.log("Rechazado", id, reason)
    setIsModalOpen(false)
  }

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="w-full max-w-[90vw] sm:max-w-[60vw] max-h-[80vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Solicitudes de Stock</DialogTitle>
            <DialogDescription>Revisa y gestiona las solicitudes entrantes.</DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Almacén Solicitante</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentItems.length > 0 ? (
                  currentItems.map((solicitud) => (
                    <TableRow key={solicitud.id}>
                      <TableCell>{solicitud.nombre_producto}</TableCell>
                      <TableCell>{solicitud.nombre_almacen}</TableCell>
                      <TableCell >
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                solicitud.prioridad === "Urgente"
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-700"}`}>
                            {solicitud.prioridad ?? "Media"}
                        </span>
                        </TableCell>
                      <TableCell>{new Date(solicitud.fecha).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => openModal(solicitud.id)}>
                          Ver Detalles
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No hay solicitudes disponibles
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Controles de paginación */}
          {solicitudesStock.length > 0 && (
            <div className="flex items-center justify-between px-2 py-4 border-t flex-shrink-0">
              <div className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1} de {solicitudesStock.length}{" "}
                solicitudes
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={goToPreviousPage} disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button variant="outline" size="sm" onClick={goToNextPage} disabled={currentPage === totalPages}>
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AceptarStock
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        request={solicitudesAceptar}
        onAprobado={handleAprobado}
        onRechazado={handleRechazado}
      />
    </>
  )
}
