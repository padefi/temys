import { Head, usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table"

export default function CargaProductos() {

    //const { proveedores: { data: proveedores }, module } = usePage<PageProps>().props;

    return (
    <Tabs defaultValue="account" className="w-[100%]">
        <TabsList>
            <TabsTrigger value="productos">Productos</TabsTrigger>
            <TabsTrigger value="mas-info">Más Info</TabsTrigger>
        </TabsList>
        <TabsContent value="productos">
            <Table>
                <TableCaption>Ingrese más productos.</TableCaption>

                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[100px]">Producto</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Precio Unitario</TableHead>
                    <TableHead className="text-right">impuestos</TableHead>
                    <TableHead className="text-right">% Desc.</TableHead>
                    <TableHead className="text-right">Importe</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    <TableRow>
                    <TableCell className="font-medium">INV001</TableCell>
                    <TableCell>Paid</TableCell>
                    <TableCell>Credit Card</TableCell>
                    <TableCell className="text-right">$250.00</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TabsContent>
        <TabsContent value="mas-info">Change your password here.</TabsContent>
    </Tabs>
    );
}
