"use client"

import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { defineStepper } from "@stepperize/react"
import { X, Plus } from "lucide-react"

const { useStepper, steps } = defineStepper(
  {
    id: "informacion-basica",
    title: "Información Básica",
    description: "Datos identificatorios",
  },
  {
    id: "clasificacion",
    title: "Clasificación",
    description: "Tipo y ocupación",
  },
  {
    id: "superficies",
    title: "Superficies",
    description: "Medidas en m²",
  },
  {
    id: "detalles",
    title: "Detalles",
    description: "Información adicional",
  },
  {
    id: "domicilio",
    title: "Domicilio",
    description: "Ubicación del inmueble",
  },
  {
    id: "contactos",
    title: "Contactos",
    description: "Información de contacto",
  },
)

interface Contacto {
  id: string
  tipo: string
  valor: string
  descripcion: string
}

interface InmuebleFormData {
  num_partida: string
  estado_id: string
  nombre_completo: string
  nombre_fantasia: string
  tipo_inmueble_id: string
  tipo_ocupacion_id: string
  superficie_cubierta: string
  superficie_libre: string
  superficie_total: string
  antiguedad: string
  // Campos para Casa/Departamento
  num_ambientes: string
  num_banos: string
  num_dormitorios: string
  tiene_cochera: string
  num_cocheras: string
  tiene_piscina: string
  tiene_jardin: string
  // Campos para Oficina
  num_piso: string
  tiene_ascensor: string
  num_oficinas: string
  // Campos para Local Comercial
  metros_frente: string
  altura_local: string
  tiene_vidriera: string
  // Campos para Terreno
  tiene_agua: string
  tiene_luz: string
  tiene_gas: string
  tiene_cloacas: string
  tipo_suelo: string
  tiene_desnivel: string
  // Campos para Galpón
  altura_libre: string
  num_portones: string
  capacidad_carga: string
  tiene_oficinas: string
  // Campos para Edificio
  num_pisos: string
  num_unidades: string
  observaciones: string
  calle: string
  numero: string
  piso: string
  codigo_postal: string
  localidad: string
  provincia: string
  pais: string
}

export function InmuebleForm() {
  const stepper = useStepper()

  const [formData, setFormData] = useState<InmuebleFormData>({
    num_partida: "",
    estado_id: "",
    nombre_completo: "",
    nombre_fantasia: "",
    tipo_inmueble_id: "",
    tipo_ocupacion_id: "",
    superficie_cubierta: "",
    superficie_libre: "",
    superficie_total: "",
    antiguedad: "",
    num_ambientes: "",
    num_banos: "",
    num_dormitorios: "",
    tiene_cochera: "",
    num_cocheras: "",
    tiene_piscina: "",
    tiene_jardin: "",
    num_piso: "",
    tiene_ascensor: "",
    num_oficinas: "",
    metros_frente: "",
    altura_local: "",
    tiene_vidriera: "",
    tiene_agua: "",
    tiene_luz: "",
    tiene_gas: "",
    tiene_cloacas: "",
    tipo_suelo: "",
    tiene_desnivel: "",
    altura_libre: "",
    num_portones: "",
    capacidad_carga: "",
    tiene_oficinas: "",
    num_pisos: "",
    num_unidades: "",
    observaciones: "",
    calle: "",
    numero: "",
    piso: "",
    codigo_postal: "",
    localidad: "",
    provincia: "",
    pais: "Argentina",
  })

  const [contactos, setContactos] = useState<Contacto[]>([{ id: "1", tipo: "telefono", valor: "", descripcion: "" }])

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simular envío
    await new Promise((resolve) => setTimeout(resolve, 1500))

    console.log("Datos del inmueble:", formData)
    console.log("Contactos:", contactos)
    alert("Inmueble registrado exitosamente")
    setIsSubmitting(false)
    stepper.reset()
  }

  const handleInputChange = (field: keyof InmuebleFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const agregarContacto = () => {
    const nuevoContacto: Contacto = {
      id: Date.now().toString(),
      tipo: "telefono",
      valor: "",
      descripcion: "",
    }
    setContactos([...contactos, nuevoContacto])
  }

  const eliminarContacto = (id: string) => {
    if (contactos.length > 1) {
      setContactos(contactos.filter((c) => c.id !== id))
    }
  }

  const actualizarContacto = (id: string, campo: keyof Contacto, valor: string) => {
    setContactos(contactos.map((c) => (c.id === id ? { ...c, [campo]: valor } : c)))
  }

  const isStepValid = () => {
    switch (stepper.current.id) {
      case "informacion-basica":
        return formData.num_partida && formData.estado_id && formData.nombre_completo
      case "clasificacion":
        return formData.tipo_inmueble_id && formData.tipo_ocupacion_id
      case "superficies":
        return formData.superficie_cubierta && formData.superficie_libre && formData.superficie_total
      case "detalles":
        return true
      case "domicilio":
        return formData.calle && formData.numero && formData.localidad && formData.provincia
      case "contactos":
        return contactos.some((c) => c.valor.trim() !== "")
      default:
        return false
    }
  }

  const renderDetallesFields = () => {
    const tipoInmueble = formData.tipo_inmueble_id

    // Casa o Departamento
    if (tipoInmueble === "1" || tipoInmueble === "2") {
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="antiguedad" className="text-secondary font-semibold uppercase text-xs">
              Antigüedad (años)
            </Label>
            <Input
              id="antiguedad"
              type="number"
              value={formData.antiguedad}
              onChange={(e) => handleInputChange("antiguedad", e.target.value)}
              className="border-2 border-secondary bg-input text-foreground h-12"
              placeholder="Ej: 10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="num_ambientes" className="text-secondary font-semibold uppercase text-xs">
              Número de Ambientes
            </Label>
            <Input
              id="num_ambientes"
              type="number"
              value={formData.num_ambientes}
              onChange={(e) => handleInputChange("num_ambientes", e.target.value)}
              className="border-2 border-secondary bg-input text-foreground h-12"
              placeholder="Ej: 3"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="num_dormitorios" className="text-secondary font-semibold uppercase text-xs">
              Número de Dormitorios
            </Label>
            <Input
              id="num_dormitorios"
              type="number"
              value={formData.num_dormitorios}
              onChange={(e) => handleInputChange("num_dormitorios", e.target.value)}
              className="border-2 border-secondary bg-input text-foreground h-12"
              placeholder="Ej: 2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="num_banos" className="text-secondary font-semibold uppercase text-xs">
              Número de Baños
            </Label>
            <Input
              id="num_banos"
              type="number"
              value={formData.num_banos}
              onChange={(e) => handleInputChange("num_banos", e.target.value)}
              className="border-2 border-secondary bg-input text-foreground h-12"
              placeholder="Ej: 1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tiene_cochera" className="text-secondary font-semibold uppercase text-xs">
              Tiene Cochera
            </Label>
            <Select value={formData.tiene_cochera} onValueChange={(value) => handleInputChange("tiene_cochera", value)}>
              <SelectTrigger className="border-2 border-secondary bg-input text-foreground h-12">
                <SelectValue placeholder="Seleccione una opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="si">Sí</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.tiene_cochera === "si" && (
            <div className="space-y-2">
              <Label htmlFor="num_cocheras" className="text-secondary font-semibold uppercase text-xs">
                Número de Cocheras
              </Label>
              <Input
                id="num_cocheras"
                type="number"
                value={formData.num_cocheras}
                onChange={(e) => handleInputChange("num_cocheras", e.target.value)}
                className="border-2 border-secondary bg-input text-foreground h-12"
                placeholder="Ej: 1"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="tiene_piscina" className="text-secondary font-semibold uppercase text-xs">
              Tiene Piscina
            </Label>
            <Select value={formData.tiene_piscina} onValueChange={(value) => handleInputChange("tiene_piscina", value)}>
              <SelectTrigger className="border-2 border-secondary bg-input text-foreground h-12">
                <SelectValue placeholder="Seleccione una opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="si">Sí</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tiene_jardin" className="text-secondary font-semibold uppercase text-xs">
              Tiene Jardín
            </Label>
            <Select value={formData.tiene_jardin} onValueChange={(value) => handleInputChange("tiene_jardin", value)}>
              <SelectTrigger className="border-2 border-secondary bg-input text-foreground h-12">
                <SelectValue placeholder="Seleccione una opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="si">Sí</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )
    }

    // Oficina
    if (tipoInmueble === "3") {
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="antiguedad" className="text-secondary font-semibold uppercase text-xs">
              Antigüedad (años)
            </Label>
            <Input
              id="antiguedad"
              type="number"
              value={formData.antiguedad}
              onChange={(e) => handleInputChange("antiguedad", e.target.value)}
              className="border-2 border-secondary bg-input text-foreground h-12"
              placeholder="Ej: 10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="num_piso" className="text-secondary font-semibold uppercase text-xs">
              Número de Piso
            </Label>
            <Input
              id="num_piso"
              type="number"
              value={formData.num_piso}
              onChange={(e) => handleInputChange("num_piso", e.target.value)}
              className="border-2 border-secondary bg-input text-foreground h-12"
              placeholder="Ej: 3"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tiene_ascensor" className="text-secondary font-semibold uppercase text-xs">
              Tiene Ascensor
            </Label>
            <Select
              value={formData.tiene_ascensor}
              onValueChange={(value) => handleInputChange("tiene_ascensor", value)}
            >
              <SelectTrigger className="border-2 border-secondary bg-input text-foreground h-12">
                <SelectValue placeholder="Seleccione una opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="si">Sí</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="num_oficinas" className="text-secondary font-semibold uppercase text-xs">
              Número de Oficinas
            </Label>
            <Input
              id="num_oficinas"
              type="number"
              value={formData.num_oficinas}
              onChange={(e) => handleInputChange("num_oficinas", e.target.value)}
              className="border-2 border-secondary bg-input text-foreground h-12"
              placeholder="Ej: 2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="num_banos" className="text-secondary font-semibold uppercase text-xs">
              Número de Baños
            </Label>
            <Input
              id="num_banos"
              type="number"
              value={formData.num_banos}
              onChange={(e) => handleInputChange("num_banos", e.target.value)}
              className="border-2 border-secondary bg-input text-foreground h-12"
              placeholder="Ej: 1"
            />
          </div>
        </>
      )
    }

    // Local Comercial
    if (tipoInmueble === "4") {
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="antiguedad" className="text-secondary font-semibold uppercase text-xs">
              Antigüedad (años)
            </Label>
            <Input
              id="antiguedad"
              type="number"
              value={formData.antiguedad}
              onChange={(e) => handleInputChange("antiguedad", e.target.value)}
              className="border-2 border-secondary bg-input text-foreground h-12"
              placeholder="Ej: 10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="metros_frente" className="text-secondary font-semibold uppercase text-xs">
              Metros de Frente
            </Label>
            <Input
              id="metros_frente"
              type="number"
              step="0.01"
              value={formData.metros_frente}
              onChange={(e) => handleInputChange("metros_frente", e.target.value)}
              className="border-2 border-secondary bg-input text-foreground h-12"
              placeholder="Ej: 8.5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="altura_local" className="text-secondary font-semibold uppercase text-xs">
              Altura del Local (m)
            </Label>
            <Input
              id="altura_local"
              type="number"
              step="0.01"
              value={formData.altura_local}
              onChange={(e) => handleInputChange("altura_local", e.target.value)}
              className="border-2 border-secondary bg-input text-foreground h-12"
              placeholder="Ej: 3.5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tiene_vidriera" className="text-secondary font-semibold uppercase text-xs">
              Tiene Vidriera
            </Label>
            <Select
              value={formData.tiene_vidriera}
              onValueChange={(value) => handleInputChange("tiene_vidriera", value)}
            >
              <SelectTrigger className="border-2 border-secondary bg-input text-foreground h-12">
                <SelectValue placeholder="Seleccione una opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="si">Sí</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="num_banos" className="text-secondary font-semibold uppercase text-xs">
              Número de Baños
            </Label>
            <Input
              id="num_banos"
              type="number"
              value={formData.num_banos}
              onChange={(e) => handleInputChange("num_banos", e.target.value)}
              className="border-2 border-secondary bg-input text-foreground h-12"
              placeholder="Ej: 1"
            />
          </div>
        </>
      )
    }

    // Terreno
    if (tipoInmueble === "5") {
      return (
        <>
          <div className="col-span-2">
            <h3 className="text-lg font-semibold text-secondary mb-4">Servicios Disponibles</h3>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tiene_agua" className="text-secondary font-semibold uppercase text-xs">
              Tiene Agua
            </Label>
            <Select value={formData.tiene_agua} onValueChange={(value) => handleInputChange("tiene_agua", value)}>
              <SelectTrigger className="border-2 border-secondary bg-input text-foreground h-12">
                <SelectValue placeholder="Seleccione una opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="si">Sí</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tiene_luz" className="text-secondary font-semibold uppercase text-xs">
              Tiene Luz
            </Label>
            <Select value={formData.tiene_luz} onValueChange={(value) => handleInputChange("tiene_luz", value)}>
              <SelectTrigger className="border-2 border-secondary bg-input text-foreground h-12">
                <SelectValue placeholder="Seleccione una opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="si">Sí</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tiene_gas" className="text-secondary font-semibold uppercase text-xs">
              Tiene Gas
            </Label>
            <Select value={formData.tiene_gas} onValueChange={(value) => handleInputChange("tiene_gas", value)}>
              <SelectTrigger className="border-2 border-secondary bg-input text-foreground h-12">
                <SelectValue placeholder="Seleccione una opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="si">Sí</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tiene_cloacas" className="text-secondary font-semibold uppercase text-xs">
              Tiene Cloacas
            </Label>
            <Select value={formData.tiene_cloacas} onValueChange={(value) => handleInputChange("tiene_cloacas", value)}>
              <SelectTrigger className="border-2 border-secondary bg-input text-foreground h-12">
                <SelectValue placeholder="Seleccione una opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="si">Sí</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2">
            <h3 className="text-lg font-semibold text-secondary mb-4 mt-4">Características del Terreno</h3>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo_suelo" className="text-secondary font-semibold uppercase text-xs">
              Tipo de Suelo
            </Label>
            <Select value={formData.tipo_suelo} onValueChange={(value) => handleInputChange("tipo_suelo", value)}>
              <SelectTrigger className="border-2 border-secondary bg-input text-foreground h-12">
                <SelectValue placeholder="Seleccione el tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="arcilloso">Arcilloso</SelectItem>
                <SelectItem value="arenoso">Arenoso</SelectItem>
                <SelectItem value="rocoso">Rocoso</SelectItem>
                <SelectItem value="mixto">Mixto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tiene_desnivel" className="text-secondary font-semibold uppercase text-xs">
              Tiene Desnivel
            </Label>
            <Select
              value={formData.tiene_desnivel}
              onValueChange={(value) => handleInputChange("tiene_desnivel", value)}
            >
              <SelectTrigger className="border-2 border-secondary bg-input text-foreground h-12">
                <SelectValue placeholder="Seleccione una opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="si">Sí</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )
    }

    // Galpón
    if (tipoInmueble === "6") {
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="antiguedad" className="text-secondary font-semibold uppercase text-xs">
              Antigüedad (años)
            </Label>
            <Input
              id="antiguedad"
              type="number"
              value={formData.antiguedad}
              onChange={(e) => handleInputChange("antiguedad", e.target.value)}
              className="border-2 border-secondary bg-input text-foreground h-12"
              placeholder="Ej: 10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="altura_libre" className="text-secondary font-semibold uppercase text-xs">
              Altura Libre (m)
            </Label>
            <Input
              id="altura_libre"
              type="number"
              step="0.01"
              value={formData.altura_libre}
              onChange={(e) => handleInputChange("altura_libre", e.target.value)}
              className="border-2 border-secondary bg-input text-foreground h-12"
              placeholder="Ej: 6.5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="num_portones" className="text-secondary font-semibold uppercase text-xs">
              Número de Portones
            </Label>
            <Input
              id="num_portones"
              type="number"
              value={formData.num_portones}
              onChange={(e) => handleInputChange("num_portones", e.target.value)}
              className="border-2 border-secondary bg-input text-foreground h-12"
              placeholder="Ej: 2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacidad_carga" className="text-secondary font-semibold uppercase text-xs">
              Capacidad de Carga (kg)
            </Label>
            <Input
              id="capacidad_carga"
              type="number"
              value={formData.capacidad_carga}
              onChange={(e) => handleInputChange("capacidad_carga", e.target.value)}
              className="border-2 border-secondary bg-input text-foreground h-12"
              placeholder="Ej: 5000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tiene_oficinas" className="text-secondary font-semibold uppercase text-xs">
              Tiene Oficinas
            </Label>
            <Select
              value={formData.tiene_oficinas}
              onValueChange={(value) => handleInputChange("tiene_oficinas", value)}
            >
              <SelectTrigger className="border-2 border-secondary bg-input text-foreground h-12">
                <SelectValue placeholder="Seleccione una opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="si">Sí</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.tiene_oficinas === "si" && (
            <div className="space-y-2">
              <Label htmlFor="num_oficinas" className="text-secondary font-semibold uppercase text-xs">
                Número de Oficinas
              </Label>
              <Input
                id="num_oficinas"
                type="number"
                value={formData.num_oficinas}
                onChange={(e) => handleInputChange("num_oficinas", e.target.value)}
                className="border-2 border-secondary bg-input text-foreground h-12"
                placeholder="Ej: 2"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="num_banos" className="text-secondary font-semibold uppercase text-xs">
              Número de Baños
            </Label>
            <Input
              id="num_banos"
              type="number"
              value={formData.num_banos}
              onChange={(e) => handleInputChange("num_banos", e.target.value)}
              className="border-2 border-secondary bg-input text-foreground h-12"
              placeholder="Ej: 1"
            />
          </div>
        </>
      )
    }

    // Edificio
    if (tipoInmueble === "7") {
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="antiguedad" className="text-secondary font-semibold uppercase text-xs">
              Antigüedad (años)
            </Label>
            <Input
              id="antiguedad"
              type="number"
              value={formData.antiguedad}
              onChange={(e) => handleInputChange("antiguedad", e.target.value)}
              className="border-2 border-secondary bg-input text-foreground h-12"
              placeholder="Ej: 10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="num_pisos" className="text-secondary font-semibold uppercase text-xs">
              Número de Pisos
            </Label>
            <Input
              id="num_pisos"
              type="number"
              value={formData.num_pisos}
              onChange={(e) => handleInputChange("num_pisos", e.target.value)}
              className="border-2 border-secondary bg-input text-foreground h-12"
              placeholder="Ej: 5"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="num_unidades" className="text-secondary font-semibold uppercase text-xs">
              Número de Unidades
            </Label>
            <Input
              id="num_unidades"
              type="number"
              value={formData.num_unidades}
              onChange={(e) => handleInputChange("num_unidades", e.target.value)}
              className="border-2 border-secondary bg-input text-foreground h-12"
              placeholder="Ej: 20"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tiene_ascensor" className="text-secondary font-semibold uppercase text-xs">
              Tiene Ascensor
            </Label>
            <Select
              value={formData.tiene_ascensor}
              onValueChange={(value) => handleInputChange("tiene_ascensor", value)}
            >
              <SelectTrigger className="border-2 border-secondary bg-input text-foreground h-12">
                <SelectValue placeholder="Seleccione una opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="si">Sí</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )
    }

    // Si no hay tipo seleccionado
    return (
      <div className="col-span-2 text-center py-8">
        <p className="text-muted-foreground">
          Seleccione un tipo de inmueble en el paso anterior para ver los campos específicos
        </p>
      </div>
    )
  }

  const InformacionBasicaStep = () => (
    <Card className="border-4 border-secondary bg-card">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b-2 border-border">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-secondary-foreground font-bold">
            1
          </div>
          <div>
            <h2 className="text-xl font-bold text-secondary uppercase tracking-wide">Información Básica</h2>
            <p className="text-sm text-muted-foreground">Datos identificatorios del inmueble</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="num_partida" className="text-secondary font-semibold uppercase text-xs">
              Número de Partida *
            </Label>
            <Input
              id="num_partida"
              value={formData.num_partida}
              onChange={(e) => handleInputChange("num_partida", e.target.value)}
              className="border-2 border-secondary bg-input text-foreground h-12"
              placeholder="Ingrese el número de partida"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estado_id" className="text-secondary font-semibold uppercase text-xs">
              Estado *
            </Label>
            <Select
              value={formData.estado_id}
              onValueChange={(value) => handleInputChange("estado_id", value)}
              required
            >
              <SelectTrigger className="border-2 border-secondary bg-input text-foreground h-12">
                <SelectValue placeholder="Seleccione el estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Activo</SelectItem>
                <SelectItem value="2">Inactivo</SelectItem>
                <SelectItem value="3">En Mantenimiento</SelectItem>
                <SelectItem value="4">En Venta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nombre_completo" className="text-secondary font-semibold uppercase text-xs">
              Nombre Completo *
            </Label>
            <Input
              id="nombre_completo"
              value={formData.nombre_completo}
              onChange={(e) => handleInputChange("nombre_completo", e.target.value)}
              className="border-2 border-secondary bg-input text-foreground h-12"
              placeholder="Nombre completo del inmueble"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nombre_fantasia" className="text-secondary font-semibold uppercase text-xs">
              Nombre Fantasía
            </Label>
            <Input
              id="nombre_fantasia"
              value={formData.nombre_fantasia}
              onChange={(e) => handleInputChange("nombre_fantasia", e.target.value)}
              className="border-2 border-secondary bg-input text-foreground h-12"
              placeholder="Nombre comercial o fantasía"
            />
          </div>
        </div>
      </div>
    </Card>
  )

  const ClasificacionStep = () => (
    <Card className="border-4 border-secondary bg-card">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b-2 border-border">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-secondary-foreground font-bold">
            2
          </div>
          <div>
            <h2 className="text-xl font-bold text-secondary uppercase tracking-wide">Clasificación</h2>
            <p className="text-sm text-muted-foreground">Tipo y características del inmueble</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="tipo_inmueble_id" className="text-secondary font-semibold uppercase text-xs">
              Tipo de Inmueble *
            </Label>
            <Select
              value={formData.tipo_inmueble_id}
              onValueChange={(value) => handleInputChange("tipo_inmueble_id", value)}
              required
            >
              <SelectTrigger className="border-2 border-secondary bg-input text-foreground h-12">
                <SelectValue placeholder="Seleccione el tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Casa</SelectItem>
                <SelectItem value="2">Departamento</SelectItem>
                <SelectItem value="3">Oficina</SelectItem>
                <SelectItem value="4">Local Comercial</SelectItem>
                <SelectItem value="5">Terreno</SelectItem>
                <SelectItem value="6">Galpón</SelectItem>
                <SelectItem value="7">Edificio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo_ocupacion_id" className="text-secondary font-semibold uppercase text-xs">
              Tipo de Ocupación *
            </Label>
            <Select
              value={formData.tipo_ocupacion_id}
              onValueChange={(value) => handleInputChange("tipo_ocupacion_id", value)}
              required
            >
              <SelectTrigger className="border-2 border-secondary bg-input text-foreground h-12">
                <SelectValue placeholder="Seleccione la ocupación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Propio</SelectItem>
                <SelectItem value="2">Alquilado</SelectItem>
                <SelectItem value="3">Desocupado</SelectItem>
                <SelectItem value="4">En Comodato</SelectItem>
                <SelectItem value="5">En Litigio</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  )

  const SuperficiesStep = () => (
    <Card className="border-4 border-secondary bg-card">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b-2 border-border">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-secondary-foreground font-bold">
            3
          </div>
          <div>
            <h2 className="text-xl font-bold text-secondary uppercase tracking-wide">Medidas y Superficies</h2>
            <p className="text-sm text-muted-foreground">Especifique las dimensiones en metros cuadrados</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="superficie_cubierta" className="text-secondary font-semibold uppercase text-xs">
              Superficie Cubierta (m²) *
            </Label>
            <Input
              id="superficie_cubierta"
              type="number"
              step="0.01"
              value={formData.superficie_cubierta}
              onChange={(e) => handleInputChange("superficie_cubierta", e.target.value)}
              className="border-2 border-secondary bg-input text-foreground h-12"
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="superficie_libre" className="text-secondary font-semibold uppercase text-xs">
              Superficie Libre (m²) *
            </Label>
            <Input
              id="superficie_libre"
              type="number"
              step="0.01"
              value={formData.superficie_libre}
              onChange={(e) => handleInputChange("superficie_libre", e.target.value)}
              className="border-2 border-secondary bg-input text-foreground h-12"
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="superficie_total" className="text-secondary font-semibold uppercase text-xs">
              Superficie Total (m²) *
            </Label>
            <Input
              id="superficie_total"
              type="number"
              step="0.01"
              value={formData.superficie_total}
              onChange={(e) => handleInputChange("superficie_total", e.target.value)}
              className="border-2 border-secondary bg-input text-foreground h-12"
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div className="bg-muted border-2 border-border p-4 rounded">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Nota:</span> La superficie total debe ser igual a la suma de
            la superficie cubierta y libre.
          </p>
        </div>
      </div>
    </Card>
  )

  const DetallesStep = () => (
    <Card className="border-4 border-secondary bg-card">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b-2 border-border">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-secondary-foreground font-bold">
            4
          </div>
          <div>
            <h2 className="text-xl font-bold text-secondary uppercase tracking-wide">
              Información Adicional del Inmueble
            </h2>
            <p className="text-sm text-muted-foreground">Detalles específicos según el tipo de inmueble</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{renderDetallesFields()}</div>

        <div className="space-y-2">
          <Label htmlFor="observaciones" className="text-secondary font-semibold uppercase text-xs">
            Observaciones
          </Label>
          <Textarea
            id="observaciones"
            value={formData.observaciones}
            onChange={(e) => handleInputChange("observaciones", e.target.value)}
            className="border-2 border-secondary bg-input text-foreground min-h-[120px]"
            placeholder="Ingrese cualquier información adicional relevante sobre el inmueble..."
          />
        </div>
      </div>
    </Card>
  )

  const DomicilioStep = () => (
    <Card className="border-4 border-secondary bg-card">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b-2 border-border">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-secondary-foreground font-bold">
            5
          </div>
          <div>
            <h2 className="text-xl font-bold text-secondary uppercase tracking-wide">Domicilio del Inmueble</h2>
            <p className="text-sm text-muted-foreground">Ubicación física del inmueble</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="calle" className="text-secondary font-semibold uppercase text-xs">
              Calle *
            </Label>
            <Input
              id="calle"
              value={formData.calle}
              onChange={(e) => handleInputChange("calle", e.target.value)}
              className="border-2 border-secondary bg-input text-foreground h-12"
              placeholder="Nombre de la calle"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="numero" className="text-secondary font-semibold uppercase text-xs">
              Número *
            </Label>
            <Input
              id="numero"
              value={formData.numero}
              onChange={(e) => handleInputChange("numero", e.target.value)}
              className="border-2 border-secondary bg-input text-foreground h-12"
              placeholder="Número"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="piso" className="text-secondary font-semibold uppercase text-xs">
              Piso / Departamento
            </Label>
            <Input
              id="piso"
              value={formData.piso}
              onChange={(e) => handleInputChange("piso", e.target.value)}
              className="border-2 border-secondary bg-input text-foreground h-12"
              placeholder="Ej: 3° A"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="codigo_postal" className="text-secondary font-semibold uppercase text-xs">
              Código Postal
            </Label>
            <Input
              id="codigo_postal"
              value={formData.codigo_postal}
              onChange={(e) => handleInputChange("codigo_postal", e.target.value)}
              className="border-2 border-secondary bg-input text-foreground h-12"
              placeholder="Ej: 1234"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="localidad" className="text-secondary font-semibold uppercase text-xs">
              Localidad / Ciudad *
            </Label>
            <Input
              id="localidad"
              value={formData.localidad}
              onChange={(e) => handleInputChange("localidad", e.target.value)}
              className="border-2 border-secondary bg-input text-foreground h-12"
              placeholder="Nombre de la localidad"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="provincia" className="text-secondary font-semibold uppercase text-xs">
              Provincia *
            </Label>
            <Select
              value={formData.provincia}
              onValueChange={(value) => handleInputChange("provincia", value)}
              required
            >
              <SelectTrigger className="border-2 border-secondary bg-input text-foreground h-12">
                <SelectValue placeholder="Seleccione la provincia" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Buenos Aires">Buenos Aires</SelectItem>
                <SelectItem value="CABA">Ciudad Autónoma de Buenos Aires</SelectItem>
                <SelectItem value="Catamarca">Catamarca</SelectItem>
                <SelectItem value="Chaco">Chaco</SelectItem>
                <SelectItem value="Chubut">Chubut</SelectItem>
                <SelectItem value="Córdoba">Córdoba</SelectItem>
                <SelectItem value="Corrientes">Corrientes</SelectItem>
                <SelectItem value="Entre Ríos">Entre Ríos</SelectItem>
                <SelectItem value="Formosa">Formosa</SelectItem>
                <SelectItem value="Jujuy">Jujuy</SelectItem>
                <SelectItem value="La Pampa">La Pampa</SelectItem>
                <SelectItem value="La Rioja">La Rioja</SelectItem>
                <SelectItem value="Mendoza">Mendoza</SelectItem>
                <SelectItem value="Misiones">Misiones</SelectItem>
                <SelectItem value="Neuquén">Neuquén</SelectItem>
                <SelectItem value="Río Negro">Río Negro</SelectItem>
                <SelectItem value="Salta">Salta</SelectItem>
                <SelectItem value="San Juan">San Juan</SelectItem>
                <SelectItem value="San Luis">San Luis</SelectItem>
                <SelectItem value="Santa Cruz">Santa Cruz</SelectItem>
                <SelectItem value="Santa Fe">Santa Fe</SelectItem>
                <SelectItem value="Santiago del Estero">Santiago del Estero</SelectItem>
                <SelectItem value="Tierra del Fuego">Tierra del Fuego</SelectItem>
                <SelectItem value="Tucumán">Tucumán</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pais" className="text-secondary font-semibold uppercase text-xs">
              País
            </Label>
            <Input
              id="pais"
              value={formData.pais}
              onChange={(e) => handleInputChange("pais", e.target.value)}
              className="border-2 border-secondary bg-input text-foreground h-12"
              placeholder="País"
            />
          </div>
        </div>
      </div>
    </Card>
  )

  const ContactosStep = () => (
    <Card className="border-4 border-secondary bg-card">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b-2 border-border">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-secondary-foreground font-bold">
            6
          </div>
          <div>
            <h2 className="text-xl font-bold text-secondary uppercase tracking-wide">Información de Contacto</h2>
            <p className="text-sm text-muted-foreground">Agregue uno o más medios de contacto</p>
          </div>
        </div>

        <div className="space-y-4">
          {contactos.map((contacto, index) => (
            <Card key={contacto.id} className="border-2 border-border bg-muted/30 p-4">
              <div className="flex items-start gap-4">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`tipo-${contacto.id}`} className="text-secondary font-semibold uppercase text-xs">
                      Tipo de Contacto
                    </Label>
                    <Select
                      value={contacto.tipo}
                      onValueChange={(value) => actualizarContacto(contacto.id, "tipo", value)}
                    >
                      <SelectTrigger className="border-2 border-secondary bg-input text-foreground h-12">
                        <SelectValue placeholder="Seleccione el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="telefono">Teléfono</SelectItem>
                        <SelectItem value="celular">Celular</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`valor-${contacto.id}`} className="text-secondary font-semibold uppercase text-xs">
                      {contacto.tipo === "email" ? "Email" : "Número"}
                    </Label>
                    <Input
                      id={`valor-${contacto.id}`}
                      type={contacto.tipo === "email" ? "email" : "tel"}
                      value={contacto.valor}
                      onChange={(e) => actualizarContacto(contacto.id, "valor", e.target.value)}
                      className="border-2 border-secondary bg-input text-foreground h-12"
                      placeholder={contacto.tipo === "email" ? "ejemplo@correo.com" : "+54 11 1234-5678"}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor={`descripcion-${contacto.id}`}
                      className="text-secondary font-semibold uppercase text-xs"
                    >
                      Descripción
                    </Label>
                    <Input
                      id={`descripcion-${contacto.id}`}
                      value={contacto.descripcion}
                      onChange={(e) => actualizarContacto(contacto.id, "descripcion", e.target.value)}
                      className="border-2 border-secondary bg-input text-foreground h-12"
                      placeholder="Ej: Contacto principal"
                    />
                  </div>
                </div>

                {contactos.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => eliminarContacto(contacto.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 mt-7"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={agregarContacto}
            className="w-full border-2 border-dashed border-secondary text-secondary hover:bg-secondary/10 h-12 bg-transparent"
          >
            <Plus className="h-5 w-5 mr-2" />
            Agregar otro contacto
          </Button>
        </div>

        <div className="bg-muted border-2 border-border p-4 rounded">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Nota:</span> Puede agregar múltiples formas de contacto. Al
            menos un contacto debe tener un valor ingresado.
          </p>
        </div>
      </div>
    </Card>
  )

  const currentStepIndex = stepper.all.findIndex((step) => step.id === stepper.current.id)

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6 p-6 border-4 border-secondary rounded-lg bg-card">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-secondary uppercase tracking-wide">Registro de Inmueble</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Paso {currentStepIndex + 1} de {steps.length}
            </span>
          </div>
        </div>

        <nav aria-label="Pasos del formulario" className="group my-4">
          <ol className="flex items-center justify-between gap-2" aria-orientation="horizontal">
            {stepper.all.map((step, index, array) => (
              <React.Fragment key={step.id}>
                <li className="flex items-center gap-4 flex-shrink-0">
                  <Button
                    type="button"
                    role="tab"
                    variant={index <= currentStepIndex ? "default" : "secondary"}
                    aria-current={stepper.current.id === step.id ? "step" : undefined}
                    aria-posinset={index + 1}
                    aria-setsize={steps.length}
                    aria-selected={stepper.current.id === step.id}
                    className="flex size-10 items-center justify-center rounded-full"
                    onClick={() => stepper.goTo(step.id)}
                  >
                    {index + 1}
                  </Button>
                  <span className="text-sm font-medium hidden sm:inline">{step.title}</span>
                </li>
                {index < array.length - 1 && (
                  <Separator className={`flex-1 ${index < currentStepIndex ? "bg-primary" : "bg-muted"}`} />
                )}
              </React.Fragment>
            ))}
          </ol>
        </nav>
      </div>

      <div className="space-y-4">
        {stepper.switch({
          "informacion-basica": () => <InformacionBasicaStep />,
          clasificacion: () => <ClasificacionStep />,
          superficies: () => <SuperficiesStep />,
          detalles: () => <DetallesStep />,
          domicilio: () => <DomicilioStep />,
          contactos: () => <ContactosStep />,
        })}

        <div className="flex justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground h-12 px-8 bg-transparent"
            onClick={stepper.prev}
            disabled={stepper.isFirst}
          >
            Anterior
          </Button>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="border-2 border-border text-muted-foreground hover:bg-muted h-12 px-8 bg-transparent"
              onClick={() => {
                if (confirm("¿Está seguro que desea cancelar? Se perderán los datos ingresados.")) {
                  setFormData({
                    num_partida: "",
                    estado_id: "",
                    nombre_completo: "",
                    nombre_fantasia: "",
                    tipo_inmueble_id: "",
                    tipo_ocupacion_id: "",
                    superficie_cubierta: "",
                    superficie_libre: "",
                    superficie_total: "",
                    antiguedad: "",
                    num_ambientes: "",
                    num_banos: "",
                    num_dormitorios: "",
                    tiene_cochera: "",
                    num_cocheras: "",
                    tiene_piscina: "",
                    tiene_jardin: "",
                    num_piso: "",
                    tiene_ascensor: "",
                    num_oficinas: "",
                    metros_frente: "",
                    altura_local: "",
                    tiene_vidriera: "",
                    tiene_agua: "",
                    tiene_luz: "",
                    tiene_gas: "",
                    tiene_cloacas: "",
                    tipo_suelo: "",
                    tiene_desnivel: "",
                    altura_libre: "",
                    num_portones: "",
                    capacidad_carga: "",
                    tiene_oficinas: "",
                    num_pisos: "",
                    num_unidades: "",
                    observaciones: "",
                    calle: "",
                    numero: "",
                    piso: "",
                    codigo_postal: "",
                    localidad: "",
                    provincia: "",
                    pais: "Argentina",
                  })
                  setContactos([{ id: "1", tipo: "telefono", valor: "", descripcion: "" }])
                  stepper.reset()
                }
              }}
            >
              Cancelar
            </Button>

            {!stepper.isLast ? (
              <Button
                type="button"
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 font-semibold"
                onClick={stepper.next}
                disabled={!isStepValid()}
              >
                Siguiente
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 px-8 font-semibold"
              >
                {isSubmitting ? "Guardando..." : "Registrar Inmueble"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}
