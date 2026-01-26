import { Banco } from "@/types/Banco"
import { CuentaBancaria } from "@/types/CuentaBancaria"

export function ChequePreview({
  banco,
  numeroCheque,
  fechaCheque,
  importe,
  importeLetras,
  onFechaChange,
  onNumeroChange,



}: {
  banco?: Banco
  numeroCheque?: string
  fechaCheque?: string
  importe?: number
  importeLetras?: string
  onFechaChange?: (fechaCheque: string) => void
  onNumeroChange?: (numeroCheque: string) => void

}) {
  return (
    <div className="border rounded-xl p-5 bg-linear-to-br from-gray-50 to-white shadow-md text-sm space-y-3 font-mono">

      <div className="flex justify-between">
        <strong>{banco?.banco || "Banco no seleccionado"}</strong>
        <span>Cheque Nº</span>
        <input
          type="number"
          className="border rounded-md px-2 py-1 text-sm"
          value={numeroCheque || ""}
          min={999999}
          onChange={(e) => onNumeroChange?.(e.target.value)}
        />
      </div>



      {/* Importe */}
      <div className="border-t pt-3 space-y-1">
        <p><strong>Importe:</strong> ${importe?.toFixed(2)}</p>
        <p className="italic text-gray-600">
          {importeLetras}
        </p>
      </div>

      <div className="border-t pt-4 flex justify-between text-gray-500">
        <span>Firma</span>
        <span>Fecha</span>
        <input
          type="date"
          className="border rounded-md px-2 py-1 text-sm"
          value={fechaCheque || ""}
          onChange={(e) => onFechaChange?.(e.target.value)}
        />
      </div>
    </div>
  )
}
