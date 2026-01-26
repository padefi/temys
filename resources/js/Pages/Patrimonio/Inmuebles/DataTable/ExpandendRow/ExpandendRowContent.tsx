import { Row } from "@tanstack/react-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { Info, Receipt, FileText } from "lucide-react"
import type { Inmueble } from "@/types/Patrimonio/Inmuebles"
import { DatosGeneralesTab } from "./tabs/DatosGenerales"
import { ImpuestosTab } from "./tabs/ImpuestosTab"
import { DocumentacionTab } from "./tabs/DocumentacionTab"

interface ExpandedRowContentProps<TData extends Inmueble> {
  row: Row<TData>
}

export function ExpandedRowContent<TData extends Inmueble>({ row }: ExpandedRowContentProps<TData>) {
  const inmueble = row.original

  return (
    <div className="p-4 bg-muted/30 border-t">
      <Tabs defaultValue="datos" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="datos" className="gap-2">
            <Info className="h-4 w-4" />
            Datos Generales
          </TabsTrigger>
          <TabsTrigger value="impuestos" className="gap-2">
            <Receipt className="h-4 w-4" />
            Impuestos
          </TabsTrigger>
          <TabsTrigger value="documentacion" className="gap-2">
            <FileText className="h-4 w-4" />
            Documentación
          </TabsTrigger>
        </TabsList>

        <TabsContent value="datos" className="mt-0">
          <DatosGeneralesTab inmueble={inmueble} />
        </TabsContent>

        <TabsContent value="impuestos" className="mt-0">
          <ImpuestosTab />
        </TabsContent>

        <TabsContent value="documentacion" className="mt-0">
          <DocumentacionTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}