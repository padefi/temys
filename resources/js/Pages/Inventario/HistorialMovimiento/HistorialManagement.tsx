import { useEffect, useState } from "react";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent } from "@/Components/ui/card";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";

import { PageProps as InertiaPageProps } from "@inertiajs/core";
import ChipSearch, { Chip } from "../Existencias/Search";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import Checkbox from "@/Components/Checkbox";
import { Button } from "@/Components/ui/button";
import { History, Pencil } from "lucide-react";

interface ExistenciasItem {
    id: number;
    fecha: string; 
    tipo_movimiento: string;
    nombreProducto: string;
    origen: string;
    destino: string;
    usuarioCreacion: string
    cantidad: number;
}


type PageProps = InertiaPageProps & {
    movimientoStocks: {data: ExistenciasItem[]} ;
    initialChips?: number;
};

export default function historialManagement({ movimientoStocks }: PageProps) {
    const { props } = usePage<PageProps>();
    const [chips, setChips] = useState<Chip[]>([])
    const nombreProducto = props.nombreProducto;

    console.log(movimientoStocks)






    const SetNombreProd = () => {
        if (nombreProducto) {
            const data: Chip = {
                value: nombreProducto as string,
            }
            setChips([data]);
        }
    }

    useEffect(() => {
        SetNombreProd();
    }, []);

    return (
        <div>
            <ChipSearch initialChips={chips} onChange={setChips} />
            <p> productos encontrados</p>


               <Table>
        <TableHeader className="sticky-header">
          <TableRow>
        {/*     <TableHead className="text-center">  <Checkbox
              checked={isAllChecked ? true : isIndeterminate ? "indeterminate" : false}
              onCheckedChange={toggleAll}
            /></TableHead> */}
            <TableHead className="text-center">Producto</TableHead>
            <TableHead className="text-center">Fecha</TableHead>
            <TableHead className="text-center">Tipo movimiento</TableHead>
            <TableHead className="text-center">Nombre de producto</TableHead>
            <TableHead className="text-center">Origen</TableHead>
            <TableHead className="text-center">Destino</TableHead>
            <TableHead className="text-center">Usuario creacion</TableHead>
            <TableHead className="text-center">Cantidad</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-center">
          {movimientoStocks.data.map((item: any) => {


            const entrada = item.entrada || 0;
            const salida = item.salida || 0;

            // Calcular stock disponible según estado de entrega
            const stockDisponible =
              item.stockActual - (item.estadoEntregas === "pendiente" ? salida : 0);

            // Calcular stock estimado
            const stockEstimado = stockDisponible - salida + entrada;


            return (
              <TableRow key={item.id}>
                <TableCell>
                  <Checkbox
                   /*  checked={selected.includes(item.id)}
                    onCheckedChange={() => toggleRow(item.id)} */
                  />
                </TableCell>
                <TableCell>{item.fecha}</TableCell>
                <TableCell>{item.tipo_movimiento}</TableCell>
                <TableCell>
                  {item.nombreProducto}
           
                </TableCell>

                <TableCell>{item.origen}</TableCell>
                <TableCell>{item.destino}</TableCell>
                <TableCell>{item.usuarioCreacion}</TableCell>
                <TableCell>{item.cantidad}</TableCell>
              

              </TableRow>)
          })}



        </TableBody>
      </Table>
            {/* <Tabla data={filteredData} /> */}
        </div>
    );
}


