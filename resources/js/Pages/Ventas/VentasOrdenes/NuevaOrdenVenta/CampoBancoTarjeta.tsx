import { useEffect, useState } from "react"
import { Combobox } from "@/Components/ui/combobox"
import { Banco } from "@/types/Banco"
import { CuentaBancaria } from "@/types/CuentaBancaria"
import { Tarjeta } from "@/types/Tarjeta"

export default function CampoBancoTarjeta({
  tipo,
  value,
  onChange
}: {
  tipo: "banco" | "tarjeta" | "transferencia"
  value?: { bancoId?: number; cuentaId?: number } | number
  onChange: (val: any) => void
}) {
  const [data, setData] = useState<(Banco | Tarjeta)[]>([])
  const [cuentas, setCuentas] = useState<CuentaBancaria[]>([])
  const [selectedBancoId, setSelectedBancoId] = useState<number | null>(
    typeof value === "object" ? value.bancoId || null : null
  )
  const [selectedCuentaId, setSelectedCuentaId] = useState<number | null>(
    typeof value === "object" ? value.cuentaId || null : null
  )

  // Carga bancos o tarjetas
  useEffect(() => {
    const endpoint = tipo === "tarjeta" ? "tarjetas" : "bancos"
    fetch(`/${endpoint}`)
      .then((res) => res.json())
      .then(setData)
  }, [tipo])



  // Cuando cambia el banco seleccionado → actualizar cuentas
  useEffect(() => {
    if (tipo === "transferencia" && selectedBancoId) {
      const banco = (data as Banco[]).find((b) => b.id === selectedBancoId)
      setCuentas(banco?.cuenta_bancaria || [])
    }
  }, [selectedBancoId, data, tipo])

  if (tipo === "transferencia") {
    return (
      <div className="grid grid-cols-2 gap-2">
        {/* Select Banco */}
        <Combobox
          value={selectedBancoId?.toString() || ""}
          onValueChange={(val) => {
            const bancoId = Number(val)
            setSelectedBancoId(bancoId)
            setSelectedCuentaId(null) // resetea la cuenta al cambiar banco
            onChange({ bancoId, cuentaId: null })
          }}
          placeholder="Seleccionar Banco"
          options={(data as Banco[]).map((b) => ({
            label: b.banco,
            value: b.id.toString()
          }))}
        />

        {/* Select Cuenta Bancaria */}
        <Combobox
          value={selectedCuentaId?.toString() || ""}
          onValueChange={(val) => {
            const cuentaId = Number(val)
            setSelectedCuentaId(cuentaId)
            onChange({ bancoId: selectedBancoId, cuentaId })
          }}
          placeholder="Seleccionar Cuenta"
          options={cuentas.map((c) => ({
            label: `${c.numero_cuenta} - ${c.tipo_cuenta}`,
            value: c.id.toString()
          }))}
          disabled={!selectedBancoId || cuentas.length === 0}
        />
      </div>
    )
  }

  // Para banco normal o tarjeta
  return (
    <Combobox
      value={typeof value === "number" ? value.toString() : ""}
      onValueChange={(val) => onChange(Number(val))}
      placeholder={`Seleccionar ${tipo}`}
      options={data.map((d: any) => {
        if (tipo === "tarjeta") {
          const cuenta = d.cuenta_bancaria
          return {
            label: cuenta
              ? `${cuenta.banco?.banco || "Sin banco"} - ${d.tipo} - ${d.numero_tarjeta}`
              : `Sin cuenta - ${d.tipo} - ${d.numero_tarjeta}`,
            value: d.id.toString()
          }
        } else {
          return {
            label: d.banco,
            value: d.id.toString()
          }
        }
      })}
    />
  )
}
