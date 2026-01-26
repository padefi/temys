import { useEffect, useState } from "react"
import { Combobox } from "@/Components/ui/combobox"
import { Banco } from "@/types/Banco"
import { CuentaBancaria } from "@/types/CuentaBancaria"
import { Tarjeta } from "@/types/Tarjeta"
import { ChequePreview } from "./ChequePreview"
import { numeroALetras } from "@/utils/numeroALetras"



export default function CampoBancoTarjeta({
  tipo,
  value,
  onChange
}: {
  tipo: "banco" | "tarjeta" | "transferencia" | "cheque"
  value?: { bancoId?: number; cuentaId?: number; importeOrden?: number } | number
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
  const importeOrden = typeof value === "object" ? value.importeOrden || null : null



  const [proximoCheque, setProximoCheque] = useState<number | null>(null)
  const [loadingCheque, setLoadingCheque] = useState(false)
  const [fechaCheque, setFechaCheque] = useState<string>("")

  // Carga bancos o tarjetas
  useEffect(() => {
    const endpoint = tipo === "tarjeta" ? "tarjetas" : "bancos"
    fetch(`/${endpoint}`)
      .then((res) => res.json())
      .then(setData)
  }, [tipo])



  // Cuando cambia el banco seleccionado → actualizar cuentas
    useEffect(() => {
        if ((tipo === "transferencia" || tipo === "cheque") && selectedBancoId) {
            const banco = (data as Banco[]).find(b => b.id === selectedBancoId)
            setCuentas(banco?.cuenta_bancaria || [])
        }
    }, [selectedBancoId, data, tipo])

    // Cuando cambia la cuenta bancaria seleccionada → actualizar próximo cheque
    useEffect(() => {
        if (tipo === "cheque" && selectedCuentaId) {
        setLoadingCheque(true)
        fetch(`/cuentas-bancarias/${selectedCuentaId}/proximo-cheque`)
            .then(res => res.json())
            .then(data => { console.log("RESPUESTA CHEQUE", data)
                setProximoCheque(data.numero)
        })
            .finally(() => setLoadingCheque(false))
        }
    }, [selectedCuentaId, tipo])

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
            setCuentas([])
            onChange({ bancoId, cuentaId: null })
          }}
          placeholder="Seleccionar Banco desde donde se Transferirá"
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
          placeholder="Seleccionar Cuenta desde donde se Transferirá"
          options={cuentas.map((c) => ({
            label: `${c.numero_cuenta} - ${c.tipo_cuenta}`,
            value: c.id.toString()
          }))}
          disabled={!selectedBancoId || cuentas.length === 0}
        />
      </div>
    )
  }

  if (tipo === "cheque") {
    return (
        <div className="space-y-3">
        {/* Banco */}
        <Combobox
            value={selectedBancoId?.toString() || ""}
            onValueChange={(val) => {
            const bancoId = Number(val)
            setSelectedBancoId(bancoId)
            setSelectedCuentaId(null)
            setCuentas([])
            setProximoCheque(null)
            onChange({
            bancoId: selectedBancoId,
            cuentaId: selectedCuentaId,
            numeroCheque: proximoCheque,
            fechaCheque
            })
            }}
            placeholder="Seleccionar Banco"
            options={(data as Banco[]).map((b) => ({
            label: b.banco,
            value: b.id.toString()
            }))}
        />

        {/* Cuenta bancaria */}
        <Combobox
            value={selectedCuentaId?.toString() || ""}
            onValueChange={(val) => {
            const cuentaId = Number(val)
            setSelectedCuentaId(cuentaId)
            onChange({
                bancoId: selectedBancoId,
                cuentaId: selectedCuentaId,
                numeroCheque: proximoCheque,
                fechaCheque
            })
            }}
            placeholder="Seleccionar Cuenta bancaria"
            options={cuentas.map((c) => ({
            label: `${c.numero_cuenta} - ${c.tipo_cuenta}`,
            value: c.id.toString()
            }))}
            disabled={!selectedBancoId}
        />

        {/* Número de cheque */}
        {selectedCuentaId && (
            <div className="rounded-md border p-3 bg-muted">
            {loadingCheque ? (
                <span>Calculando número de cheque…</span>
            ) : (
                <span className="font-semibold">
                Próximo Nº de Cheque: {proximoCheque}
                </span>
            )}
            </div>
        )}

        {/* Preview del cheque */}
        {proximoCheque !== null && (
        <div className="w-[600px] rounded-md border p-3 bg-muted">
        <ChequePreview

            banco={(data as Banco[]).find(b => b.id === selectedBancoId)}
            cuenta={cuentas.find(c => c.id === selectedCuentaId)}
            numero={proximoCheque}
            fecha={fechaCheque}
            importe={importeOrden || 0}
            importeLetras={numeroALetras(importeOrden || 0)}
            onFechaChange={(fecha) => {
                setFechaCheque(fecha)
                onChange({
                bancoId: selectedBancoId,
                cuentaId: selectedCuentaId,
                numeroCheque: proximoCheque,
                fechaCheque: fecha
                })
            }}



        />
        </div>
        )}

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
