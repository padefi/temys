import * as React from "react"

import { cn } from "@/lib/utils"

type ErrorProps = {
  className?: string
} & React.ComponentProps<"p">

function ErrorMessage({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "text-[11px]/5 mx-2 font-medium text-red-600",
        className
      )}
      {...props}
    />
  )
}

export { ErrorMessage }
