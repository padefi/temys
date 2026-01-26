import { Upload } from "lucide-react"
import { useCallback, useState } from "react"

export function UploadZone() {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    // Lógica para subir el archivo
  }, [])

  return (
    <div 
      className="border-2 border-dashed rounded-lg p-8 text-center transition-colors"
      style={{
        borderColor: isDragging ? "#10b981" : "rgba(128, 128, 128, 0.25)",
        backgroundColor: isDragging ? "rgba(16, 185, 129, 0.08)" : undefined
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        Haga clic o arrastre un archivo para subir
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        PDF, JPG o PNG hasta 10MB
      </p>
    </div>
  )
}