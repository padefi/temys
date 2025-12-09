import { cn } from "@/lib/utils"

export function Typography({ children, className }: { children: React.ReactNode; variant?: "h1" | "h2" | "h3" | "p"; className?: string }) {
  return (
    <p className={cn("text-base text-foreground", className)}>
      {children}
    </p>
  )
}
