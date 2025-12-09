import { useState } from "react"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout"
import { Head, router, usePage } from "@inertiajs/react"
import { Input } from "@/Components/ui/input"
import { Button } from "@/Components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/Components/ui/select"
import { Typography } from "@/Components/ui/typography"
import { generarPdfBalance } from "@/utils/generarBalanceGeneral"

export default function Index() {
    const { ejercicios, balance, ejercicio_id: ejercicioIdProp, desde: desdeProp, hasta: hastaProp } = usePage().props

    const [ejercicioId, setEjercicioId] = useState(ejercicioIdProp ?? "")
    const [desde, setDesde] = useState(desdeProp ?? "")
    const [hasta, setHasta] = useState(hastaProp ?? "")

    const filtrosCompletos = ejercicioId !== "" && desde !== "" && hasta !== ""

    const handleBuscar = () => {
        router.get("/contabilidad/balanceGeneralListar", {
            ejercicio_id: ejercicioId,
            desde,
            hasta
        }, {
            preserveState: true,
            preserveScroll: true
        })
    }

    const handleExportarPdf = () => {
        generarPdfBalance(balance, desde, hasta)
    }

    // AGRUPAR POR GRUPO + SUBGRUPO
    const grupos = {}
    for (const c of balance ?? []) {
        const g = c.grupo || "Sin grupo"
        const sg = c.subgrupo || "General"

        if (!grupos[g]) grupos[g] = {}
        if (!grupos[g][sg]) grupos[g][sg] = []

        grupos[g][sg].push(c)
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Balance General</h2>}
        >
            <Head title="Balance General" />

            <div className="p-6 space-y-6">
                <Typography className="text-2xl font-bold text-gray-800">Balance General</Typography>

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

                {/* BALANCE */}
                <div className="space-y-8 mt-6">
                    {!balance?.length && (
                        <p className="text-gray-500 text-center mt-10">Filtre para ver resultados.</p>
                    )}

                    {Object.keys(grupos).map(grupo => (
                        <div key={grupo} className="border rounded-lg p-4 shadow-sm bg-gray-50">
                            <h2 className="text-xl font-bold mb-4">{grupo}</h2>

                            {Object.keys(grupos[grupo]).map(sub => (
                                <div key={sub} className="mb-4">
                                    <h3 className="font-semibold text-lg mb-2">{sub}</h3>

                                    <table className="w-full text-sm">
                                        <tbody>
                                            {grupos[grupo][sub].map(c => (
                                                <tr key={c.cuenta_id} className="border-b">
                                                    <td className="p-2">{c.codigo}</td>
                                                    <td className="p-2">{c.descripcion}</td>
                                                    <td className="p-2 text-right">
                                                        {c.saldo.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))}

                        </div>
                    ))}
                </div>

            </div>
        </AuthenticatedLayout>
    )
}
