import { useState } from "react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head, router, usePage } from "@inertiajs/react"
import { Input } from "@/Components/ui/input"
import { Button } from "@/Components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/Components/ui/select"
import { Typography } from "@/Components/ui/typography"
import { generarPdf } from "@/utils/generarLibroMayorEmpresa"

//import dayjs from "dayjs"

export default function Index() {
    const { ejercicios, asientos, ejercicio_id: ejercicioIdProp, desde: desdeProp, hasta: hastaProp, empresas, proveedor_id: proveedorIdProp } = usePage().props

    const [ejercicioId, setEjercicioId] = useState(ejercicioIdProp ?? "")
    const [desde, setDesde] = useState(desdeProp ?? "")
    const [hasta, setHasta] = useState(hastaProp ?? "")
    const [proveedorId, setProveedorId] = useState(proveedorIdProp ?? "")

    const filtrosCompletos = ejercicioId !== "" && desde !== "" && hasta !== "" && proveedorId !== ""

    const handleBuscar = () => {
        router.get("/contabilidad/libroMayorEmpresaListar", {
            ejercicio_id: ejercicioId,
            desde,
            hasta,
            proveedor_id: proveedorId
        }, {
            preserveState: true,
            preserveScroll: true
        })
    }

    const handleExportarPdf = () => {
        const proveedor = empresas.find(e => String(e.id) === String(proveedorId))

        generarPdf(
            cuentasOrdenadas,
            (proveedor?.razon_social ?? "") + " " + (proveedor?.nombre_fantasia ?? ""),
            desde,
            hasta
        )
    }



    // ============================
    // AGRUPAR MAYOR POR CUENTA
    // ============================
    const cuentas = {}

    asientos?.forEach(a => {
        a.partidas.forEach(p => {

            if (!cuentas[p.cuenta.codigo]) {
                cuentas[p.cuenta.codigo] = {
                    cuenta: p.cuenta,
                    movimientos: []
                }
            }

            cuentas[p.cuenta.codigo].movimientos.push({
                fecha: a.fecha,
                numero: a.numero,
                concepto: a.concepto,
                debe: p.debe,
                haber: p.haber
            })
        })
    })

    const cuentasOrdenadas = Object.entries(cuentas)
    .sort(([codigoA], [codigoB]) => Number(codigoA) - Number(codigoB))
    .map(([codigo, data]) => ({ codigo, ...data }))

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Libro Mayor por Empresa</h2>}
        >
            <Head title="Libro Mayor por Empresa" />

            <div className="p-6 space-y-6">
            <Typography className="text-2xl font-bold text-gray-800">Libro Mayor por Empresa</Typography>
                {/* =======================
                    FILTROS
                ======================== */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">

                    <div className="flex flex-col">
                        <label className="mb-1 font-medium">Ejercicio</label>
                        <Select onValueChange={setEjercicioId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione un ejercicio" />
                            </SelectTrigger>
                            <SelectContent>
                                {ejercicios.map(e => (
                                    <SelectItem key={e.id} value={String(e.id)}>
                                        {e.descripcion}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 font-medium">Proveedor</label>
                        <Select onValueChange={setProveedorId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Seleccione un proveedor" />
                            </SelectTrigger>
                            <SelectContent>
                                {empresas.map(e => (
                                    <SelectItem key={e.id} value={String(e.id)}>
                                        {e.razon_social
                                        + ' - ' + e.nombre_fantasia}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 font-medium">Desde</label>
                        <Input type="date" value={desde} onChange={e => setDesde(e.target.value)} />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 font-medium">Hasta</label>
                        <Input type="date" value={hasta} onChange={e => setHasta(e.target.value)} />
                    </div>


                </div>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">


                    <div className="flex gap-2">
                        <Button onClick={handleBuscar} className="w-full" disabled={!filtrosCompletos}>Buscar</Button>
                        <Button variant="outline" onClick={handleExportarPdf} className="w-full" disabled={!filtrosCompletos}>Exportar PDF</Button>
                    </div>
                </div>

                {/* =======================
                    LIBRO MAYOR POR PROVEEDOR
                ======================== */}
                <div className="space-y-6 mt-6">

                    {Object.keys(cuentasOrdenadas).length === 0 && (
                        <p className="text-gray-500 text-center mt-10">Filtre para ver movimientos.</p>
                    )}

                    {Object.values(cuentasOrdenadas).map((grupo) => (
                        <div key={grupo.cuenta.id} className="border rounded-lg p-2 shadow-sm">

                            {/* Encabezado */}
                            <h3 className="font-bold">
                                {grupo.cuenta.codigo} - {grupo.cuenta.descripcion}
                            </h3>

                            {/* Tabla */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="text-left">Fecha</th>
                                            <th className="text-left">Asiento</th>
                                            <th className="text-left">Concepto</th>
                                            <th className="text-right">Debe</th>
                                            <th className="text-right">Haber</th>
                                            <th className="text-right">Saldo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(() => {
                                            let saldo = 0; // saldo acumulado por cuenta

                                            return grupo.movimientos.map((m, i) => {
                                                saldo += (Number(m.debe) - Number(m.haber));

                                                return (
                                                    <tr key={i} className="border-b">
                                                        <td className="">{m.fecha}</td>
                                                        <td className="">{String(m.numero).padStart(3, "0")}</td>
                                                        <td className="">{m.concepto}</td>
                                                        <td className=" text-right">{m.debe}</td>
                                                        <td className=" text-right">{m.haber}</td>
                                                        <td className=" text-right font-semibold">
                                                            {saldo.toFixed(2)}
                                                        </td>
                                                    </tr>
                                                );
                                            });
                                        })()}
                                    </tbody>

                                </table>
                            </div>

                        </div>
                    ))}

                </div>

            </div>
        </AuthenticatedLayout>
    )
}
