import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { DialogTrigger } from "@radix-ui/react-dialog";
import axios from "axios";
import { useEffect, useState } from "react";
import Producto from "./SelectCategoriaModelo";
import { Button } from "@headlessui/react";
import AceptarStock from "./ModalAprobarORechazarStock";

interface SolicitudesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Producto = {
    id: number;
    nombre: string;
    descripcion: string;
    modelo_id?: number;
    subcategoria_id?: number;
};

type Almacen = {
    id: number;
    nombre: string;
};

type Solicitudes = {
    id: number;
    nombre_producto: string;
    nombre_almacen: string;
    prioridad: string;
    fecha: Date;
};

export default function SolicitudesStock({
    isOpen,
    onClose,
}: SolicitudesModalProps) {
    const [solicitudesStock, setSolicitudesStock] = useState<Solicitudes[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [solicitudesAceptar, setSolicitudesAceptar] = useState(null);

    useEffect(() => {
        axios
            .get("/solicitudes-stock")
            .then((res) => {
                console.log("Respuesta de solicitudes-stock:", res.data); // 👈 aquí lo imprimes
                setSolicitudesStock(res.data); // o el path correcto si es diferente
            })
            .catch((err) =>
                console.error("Error al cargar solicitudes de stock", err)
            );
    }, []);

    const handleSubmit = () => {};

    const handleClose = () => {
        onClose();
    };
  // Al abrir modal, setea solicitud
 const openModal = async (id: number) => {
  try {
    const res = await axios.get(`/solicitudes-stock/${id}`);
    setSolicitudesAceptar(res.data); // datos completos
    setIsModalOpen(true);
  } catch (err) {
    console.error("Error al cargar detalles de la solicitud", err);
  }
};


  const handleApprove = (id:any, qty:any, notes:any) => {
    console.log("Aprobado", id, qty, notes);
    setIsModalOpen(false);
  };

  const handleReject = (id:any, reason:any) => {
    console.log("Rechazado", id, reason);
    setIsModalOpen(false);
  };
    return (
        <>
        <Dialog open={isOpen} onOpenChange={handleClose} >
           <DialogContent className="w-full max-w-[90vw] h-190 sm:max-w-[90vw] ">

                <DialogHeader>
                    <DialogTitle>Solicitudes de Stock</DialogTitle>
                    <DialogDescription>
                        Revisa y gestiona las solicitudes entrantes.
                    </DialogDescription>
                </DialogHeader>

                <div>
                    <Table >
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
                            {solicitudesStock.length > 0 ? (
                                solicitudesStock.map((solicitud) => (
                                    <TableRow key={solicitud.id}>
                                        <TableCell>
                                            {solicitud.nombre_producto}
                                        </TableCell>
                                        <TableCell>
                                            {solicitud.nombre_almacen}
                                        </TableCell>
                                        <TableCell>
                                            {solicitud.prioridad ?? "Normal"}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(
                                                solicitud.fecha
                                            ).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Button onClick={()=>openModal(solicitud.id)}>Ver Detalles</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="text-center"
                                    >
                                        No hay solicitudes disponibles
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>

        <AceptarStock isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        request={solicitudesAceptar}
        onApprove={handleApprove}
        onReject={handleReject}></AceptarStock>
        </>




    );
}
