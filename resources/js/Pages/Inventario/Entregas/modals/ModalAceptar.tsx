import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DetalleProducto, EntregaItem } from "../EntregasManagement";
import { Button } from "@/components/ui/button";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    request: EntregaItem | null;
   
}

export default function AceptarEntrega({
    isOpen,
    onClose,
    request,
   

}: ModalProps) {
       const handleClose = () => {

        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Previsualización datos del remito a generar</DialogTitle>
                </DialogHeader>

                {request && (
                    <div className="space-y-4 text-sm">
                        <div><strong>Fecha:</strong> {new Date().toLocaleDateString()}</div>
                        <div><strong>Origen:</strong> {request.origen}</div>
                        <div><strong>Destino:</strong> {request.destino}</div>

                        <div>
                            <strong>Productos:</strong>
                            <ul className="ml-4 list-disc">
                                {request.productos.map((producto: DetalleProducto, index: number) => (
                                    <li key={index}>
                                        {producto.nombre} - Cantidad: {producto.cantidad}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                    <Button
                        variant="success"
                        className="hover:bg-green-700 cursor-pointer focus:outline-none focus:shadow-outline"
                        onClick={() => {
                           /*  setModalGenerarRemito(false); */
                          /*   setTimeout(() => request?.id && confirmarEnvio(entregaSeleccionada), 300); */ //Espera a que se cierre
                        }}
                    >
                        Confirmar y generar remito
                    </Button>
                    <Button
                       /*  onClick={() => setModalGenerarRemito(false)} */
                        variant="destructive"
                        className="hover:bg-red-500 cursor-pointer focus:outline-none focus:shadow-outline"
                    >
                        Cancelar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>)
}