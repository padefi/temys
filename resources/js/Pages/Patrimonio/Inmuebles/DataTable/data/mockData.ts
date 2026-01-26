import { Impuesto, Documento } from "@/types/Patrimonio/Inmuebles" 

export const impuestosData: Impuesto[] = [
  { id: "1", nombre: "ABL / Alumbrado Barrido Limpieza", periodo: "05/2024", vencimiento: "15 Jun 2024", monto: 4250.00, estado: "Pendiente" },
  { id: "2", nombre: "Inmobiliario Provincial", periodo: "Cuota 3/2024", vencimiento: "10 Jun 2024", monto: 12800.00, estado: "Pendiente" },
  { id: "3", nombre: "Tasa de Seguridad e Higiene", periodo: "04/2024", vencimiento: "12 May 2024", monto: 7150.00, estado: "Vencido" },
  { id: "4", nombre: "ABL / Alumbrado Barrido Limpieza", periodo: "04/2024", vencimiento: "15 May 2024", monto: 4250.00, estado: "Pagado" },
]

export const documentosData: Documento[] = [
  { id: "1", nombre: "Escritura_Propiedad.pdf", tipo: "pdf", fecha: "12 May 2024", tamaño: "2.4 MB" },
  { id: "2", nombre: "Plano_Mensura.jpg", tipo: "jpg", fecha: "15 May 2024", tamaño: "4.8 MB" },
  { id: "3", nombre: "Reglamento_Copropiedad.pdf", tipo: "pdf", fecha: "20 May 2024", tamaño: "1.2 MB" },
]