import * as React from "react"
import { cn } from "@/lib/utils"

const inputVariants = {
  default: "",
  filled: "bg-gray-100 border-gray-300",
  filter: "border-0 border-b-2 rounded-none rounded-t-md focus-visible:ring-0 focus-visible:border-transparent focus-visible:border-b-gray-600",
  underline: "border-0 border-b-2 rounded-none rounded-t-md focus-visible:ring-0 focus-visible:border-emerald-600",
  error: "border-0 border-b-2 rounded-none border-red-600 rounded-t-md focus-visible:ring-0 focus-visible:border-red-600",
}

type InputProps = React.ComponentProps<"input"> & {
  variant?: keyof typeof inputVariants
}

function InputFilter({ className, type, variant = "default", ...props }: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "uppercase file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        inputVariants[variant],
        className
      )}
      {...props}
    />
  )
}

export { InputFilter }
