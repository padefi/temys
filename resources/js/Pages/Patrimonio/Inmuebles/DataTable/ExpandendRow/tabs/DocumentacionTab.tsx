import { Button } from "@/Components/ui/button"
import { Upload } from "lucide-react"
import { documentosData } from "../../data/mockData"
import { DocumentoCard } from "../components/DocumentoCard"
import { UploadZone } from "../components/UploadZone"

export function DocumentacionTab() {
  return (
    <div className="bg-background rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Archivos Adjuntos</h3>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Upload className="h-4 w-4" />
          Subir Documento
        </Button>
      </div>

      <div className="space-y-2 mb-6">
        {documentosData.map((doc) => (
          <DocumentoCard key={doc.id} documento={doc} />
        ))}
      </div>

      <UploadZone />

      <div className="flex items-center justify-between mt-6 pt-4 border-t">
        <p className="text-sm text-muted-foreground">
          Última actualización de documentos: 24 May 2024
        </p>
        <Button variant="link" className="text-muted-foreground">
          Cerrar Detalle
        </Button>
      </div>
    </div>
  )
}