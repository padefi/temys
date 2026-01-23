import { useState, useMemo } from "react"
import { impuestosData } from "../data/mockData"

export function useImpuestosSelection() {
  const [selectedImpuestos, setSelectedImpuestos] = useState<string[]>([])

  const toggleImpuesto = (id: string) => {
    setSelectedImpuestos(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const totalSeleccionado = useMemo(() => {
    return impuestosData
      .filter(imp => selectedImpuestos.includes(imp.id))
      .reduce((acc, imp) => acc + imp.monto, 0)
  }, [selectedImpuestos])

  return {
    selectedImpuestos,
    toggleImpuesto,
    totalSeleccionado,
    cantidadSeleccionados: selectedImpuestos.length
  }
}