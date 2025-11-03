import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EntregaItem } from "../EntregasManagement";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
  
    remitoActual:EntregaItem |null;

}


export default function MostrarRemito({
    isOpen,
    onClose,
    remitoActual

}: ModalProps) {
    const handleClose = () => {
        onClose();
    };

    
    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-5xl h-[90vh]">
                <DialogHeader>
                     <DialogTitle>Remito #{String(1).padStart(8, "0")}</DialogTitle> 
                </DialogHeader>

                <div className="mt-4 h-[75vh]">
                    <iframe
                        src={remitoActual ? route('remitos.mostrar', remitoActual.id) : ""}
                        title="Remito PDF"
                        width="100%"
                        height="100%"
                        style={{ border: "none" }}
                    />
                </div>

                <DialogFooter className="mt-0">
                  <Button
    onClick={handleClose}  // 👈 Usar handleClose
    className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 font-bold px-3 py-4 cursor-pointer focus:outline-none focus:shadow-outline"
>
    Cerrar
</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}