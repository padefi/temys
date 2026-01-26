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
  value?: { depositoBancoId?: number; depositoCuentaId?: number; numeroCheque?: string; emisorBancoId?: number; fechaCheque?: string; importeOrden?: number } | number
  onChange: (val: any) => void
}) {
    const [data, setData] = useState<(Banco | Tarjeta)[]>([])
    const [cuentas, setCuentas] = useState<CuentaBancaria[]>([])

    const importeOrden = typeof value === "object" ? value.importeOrden || null : null

    const [emisorBancoId, setEmisorBancoId] = useState<number | null>(
        typeof value === "object" ? value.emisorBancoId ?? null : null
    )

    const [depositoBancoId, setDepositoBancoId] = useState<number | null>(
        typeof value === "object" ? value.depositoBancoId || null : null
    )
    const [depositoCuentaId, setDepositoCuentaId] = useState<number | null>(
        typeof value === "object" ? value.depositoCuentaId || null : null
    )

    const [fechaCheque, setFechaCheque] = useState<string>(
        typeof value === "object" ? value.fechaCheque ?? "" : ""
    )

    const [numeroCheque, setNumeroCheque] = useState<string | null>(
        typeof value === "object" ? value.numeroCheque ?? null : null
    )

    const [loadingCheque, setLoadingCheque] = useState(false)

    // Carga bancos o tarjetas
    useEffect(() => {
        const endpoint = tipo === "tarjeta" ? "tarjetas" : "bancos"
        fetch(`/${endpoint}`)
        .then((res) => res.json())
        .then(setData)
    }, [tipo])



    // Cuando cambia el banco seleccionado → actualizar cuentas
    useEffect(() => {
        if ((tipo === "transferencia" || tipo === "cheque") && depositoBancoId) {
            const banco = (data as Banco[]).find(b => b.id === depositoBancoId)
            setCuentas(banco?.cuenta_bancaria || [])
        }
    }, [depositoBancoId, data, tipo])



  if (tipo === "transferencia") {
    return (
      <div className="grid grid-cols-2 gap-2">
        {/* Select Banco */}
        <Combobox
          value={depositoBancoId?.toString() || ""}
          onValueChange={(val) => {
            const depositoBancoId = Number(val)
            setDepositoBancoId(depositoBancoId)
            setCuentas([])
            onChange({ depositoBancoId, depositoCuentaId: null })
          }}
          placeholder="Seleccionar Banco desde donde se Transferirá"
          options={(data as Banco[]).map((b) => ({
            label: b.banco,
            value: b.id.toString()
          }))}
        />
      </div>
    )
  }

  if (tipo === "cheque") {
    return (
        <div className="space-y-3">

        <hr className="my-4" />
        <h3 className="text-lg">Datos donde se depositará el cheque</h3>
        {/* Banco */}
        <Combobox
        value={depositoBancoId?.toString() || ""}
        onValueChange={(val) => {
            const id = Number(val)
            setDepositoBancoId(id)
            setDepositoCuentaId(null)

            onChange({
            depositoBancoId: id,
            depositoCuentaId: null
            })
        }}
        placeholder="Banco receptor"
        options={(data as Banco[]).map(b => ({
            label: b.banco,
            value: b.id.toString()
        }))}
        />

        {/* Cuenta bancaria */}
        <Combobox
        value={depositoCuentaId?.toString() || ""}
        onValueChange={(val) => {
            const cuentaId = Number(val)
            setDepositoCuentaId(cuentaId)

            onChange({
            depositoBancoId,
            depositoCuentaId: cuentaId
            })
        }}
        placeholder="Cuenta receptora"
        options={cuentas.map(c => ({
            label: `${c.numero_cuenta} - ${c.tipo_cuenta}`,
            value: c.id.toString()
        }))}
        disabled={!depositoBancoId}
        />

        <hr className="my-4" />

        <h3 className="text-lg font-semibold">
        Datos del cheque
        </h3>

        <Combobox
        value={emisorBancoId?.toString() || ""}
        onValueChange={(val) => {
            const id = Number(val)
            setEmisorBancoId(id)

            onChange({
            emisorBancoId: id
            })
        }}
        placeholder="Banco emisor del cheque"
        options={(data as Banco[]).map(b => ({
            label: b.banco,
            value: b.id.toString()
        }))}
        />


        {/* Preview del cheque */}
        { 1==1 && (
        <div className="w-[600px] rounded-md border p-3 bg-muted">
        <ChequePreview

            banco={(data as Banco[]).find(b => b.id === emisorBancoId)}
            numeroCheque={numeroCheque || ""}
            fechaCheque={fechaCheque}
            importe={importeOrden || 0}
            importeLetras={numeroALetras(importeOrden || 0)}
            onFechaChange={(fecha) => {
                setFechaCheque(fecha)
                onChange({
                    emisorBancoId,
                    depositoBancoId,
                    depositoCuentaId,
                    numeroCheque,
                    fechaCheque: fecha,
                })
            }}
            onNumeroChange={(numero) => {
                setNumeroCheque(numero)
                onChange({
                    emisorBancoId,
                    depositoBancoId,
                    depositoCuentaId,
                    fechaCheque,
                    numeroCheque: numero,
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
