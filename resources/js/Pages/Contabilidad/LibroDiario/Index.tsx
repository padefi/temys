import { useState } from "react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head, router, usePage } from "@inertiajs/react"
import { Input } from "@/Components/ui/input"
import { Button } from "@/Components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/Components/ui/select"
import { Typography } from "@/Components/ui/typography"
import { generarPdf } from "@/utils/generarLibroDiario"

export default function Index() {
    const { ejercicios, asientos, ejercicio_id: ejercicioIdProp, desde: desdeProp, hasta: hastaProp } = usePage().props

    const [ejercicioId, setEjercicioId] = useState(ejercicioIdProp ?? "")
    const [desde, setDesde] = useState(desdeProp ?? "")
    const [hasta, setHasta] = useState(hastaProp ?? "")

    const filtrosCompletos = ejercicioId !== "" && desde !== "" && hasta !== ""

    const handleBuscar = () => {
        router.get("/contabilidad/libroDiarioListar", {
            ejercicio_id: ejercicioId,
            desde,
            hasta
        }, {
            preserveState: true,
            preserveScroll: true
        })
    }

    const handleExportarPdf = () => {


                generarPdf(
                    asientosOrdenados,
                    desde,
                    hasta
                )
    }

    // ============================
    // ORDENAR ASIENTOS POR FECHA
    // ============================
    const asientosOrdenados = [...(asientos ?? [])].sort(
        (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    )

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Libro Diario</h2>}
        >
            <Head title="Libro Diario" />

            <div className="p-6 space-y-6">
                <Typography className="text-2xl font-bold text-gray-800">Libro Diario</Typography>

                {/* FILTROS */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">

                    <div className="flex flex-col">
                        <label className="mb-1 font-medium">Ejercicio</label>
                        <Select value={ejercicioId} onValueChange={setEjercicioId}>
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
                        <label className="mb-1 font-medium">Desde</label>
                        <Input type="date" value={desde} onChange={e => setDesde(e.target.value)} />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-1 font-medium">Hasta</label>
                        <Input type="date" value={hasta} onChange={e => setHasta(e.target.value)} />
                    </div>

                    <div className="flex gap-2">
                        <Button onClick={handleBuscar} className="w-full" disabled={!filtrosCompletos}>
                            Buscar
                        </Button>
                        <Button variant="outline" onClick={handleExportarPdf} className="w-full" disabled={!filtrosCompletos}>
                            Exportar PDF
                        </Button>
                    </div>
                </div>

                {/* LISTA DE ASIENTOS */}
                <div className="space-y-10 mt-6">

                    {!asientosOrdenados.length && (
                        <p className="text-gray-500 text-center mt-10">Filtre para ver movimientos.</p>
                    )}

                    {asientosOrdenados.map(asiento => (
                        <div key={asiento.id} className="border rounded-lg p-4 shadow-sm">

                            {/* ENCABEZADO DEL ASIENTO */}
                            <div className="mb-2">
                                <h3 className="font-bold text-lg">
                                    Asiento Nº {String(asiento.numero).padStart(3, "0")}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Fecha: {asiento.fecha}
                                </p>
                                <p className="text-sm text-gray-600">
                                    Concepto: {asiento.concepto}
                                </p>
                            </div>

                            {/* TABLA DE PARTIDAS */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="p-2 text-left">Cuenta</th>
                                            <th className="p-2 text-left">Descripción</th>
                                            <th className="p-2 text-right">Debe</th>
                                            <th className="p-2 text-right">Haber</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {asiento.partidas.map((p, i) => (
                                            <tr key={i} className="border-b">
                                                <td className="p-2">{p.cuenta.codigo}</td>
                                                <td className="p-2">{p.cuenta.descripcion}</td>
                                                <td className="p-2 text-right">{p.debe}</td>
                                                <td className="p-2 text-right">{p.haber}</td>
                                            </tr>
                                        ))}
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
