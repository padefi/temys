import { cn } from "@/lib/utils"

export function Typography({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-base text-foreground", className)}>
      {children}
    </p>
  )
}
