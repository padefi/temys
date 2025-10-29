import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DetalleProducto, EntregaItem } from "../EntregasManagement";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { router } from "@inertiajs/react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    request: EntregaItem | null;
    setRemitoActual: React.Dispatch<React.SetStateAction<EntregaItem | null>>;

}

export default function AceptarEntrega({
    isOpen,
    onClose,
    request,
    setRemitoActual
}: ModalProps) {
    const handleClose = () => {
        onClose();
    };

    const generarRemitoPdf = (entrega: any) => {
        //Abre el PDF ya generado por mPDF en el backend
        window.open(route('remitos.mostrar', entrega.id), '_blank');
    };


    function Confirmar(entrega: any) {
        axios.post(route('entregas.confirmar-envio', entrega.id))
            .then(() => {
                setRemitoActual(entrega);
                generarRemitoPdf(entrega);
                handleClose(); 
                router.reload({ only: ['ordenEntregas'] });
            })
    }

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
                        onClick={() => Confirmar(request)}
                    >
                        Confirmar y generar remito
                    </Button>

                    <Button

                        variant="destructive"
                        className="hover:bg-red-500 cursor-pointer focus:outline-none focus:shadow-outline"
                    >
                        Cancelar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>)
}