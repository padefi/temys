"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/Components/ui/button"
import { Calendar } from "../../../../Components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../../../../Components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface DatePickerProps {
  value?: Date
  onChange?: (date?: Date) => void
  placeholder?: string
}

export function DatePicker({ value, onChange, placeholder }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date"
          className={cn(
            "w-full justify-between font-normal bg-input border-2 border-secondary text-foreground h-12"
          )}
        >
          {value ? format(value, "dd/MM/yyyy") : placeholder || "Seleccionar fecha"}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0 bg-input border-2 border-secondary" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange?.(date)
            setOpen(false)
          }}
          captionLayout="dropdown"
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
