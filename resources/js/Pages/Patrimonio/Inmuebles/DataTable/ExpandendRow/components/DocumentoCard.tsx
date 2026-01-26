import { Button } from "@/Components/ui/button"
import { Eye, Download, FileImage, FileText } from "lucide-react"
import { Documento } from "@/types/Patrimonio/Inmuebles" 

interface DocumentoCardProps {
  documento: Documento
}

function getFileIcon(tipo: string) {
  switch (tipo) {
    case "pdf":
      return <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(239, 68, 68, 0.15)" }}><FileText className="h-5 w-5" style={{ color: "#ef4444" }} /></div>
    case "jpg":
    case "png":
      return <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(16, 185, 129, 0.15)" }}><FileImage className="h-5 w-5" style={{ color: "#10b981" }} /></div>
    default:
      return <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center"><FileText className="h-5 w-5 text-muted-foreground" /></div>
  }
}

export function DocumentoCard({ documento }: DocumentoCardProps) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors">
      <div className="flex items-center gap-3">
        {getFileIcon(documento.tipo)}
        <div>
          <p className="font-medium text-sm">{documento.nombre}</p>
          <p className="text-xs text-muted-foreground">
            Cargado el: {documento.fecha} - {documento.tamaño}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Eye className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Download className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    </div>
  )
}