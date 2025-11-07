import * as React from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/Components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/Components/ui/command"
import { Button } from "@/Components/ui/button"

interface Option {
  value: string
  label: string
}

interface FilterComboboxProps {
  options?: Option[]
  items?: Option[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  emptyText?: string
  emptyLabel?: string
  loading?: boolean
}

export function FilterCombobox({
  options,
  items,
  value,
  onChange,
  placeholder = "Seleccionar...",
  emptyText = "Sin resultados",
  emptyLabel = "No se encontraron resultados",
  loading = false,
}: FilterComboboxProps) {
  const opts = options ?? items ?? []
  const [open, setOpen] = React.useState(false)

  const selectedOption = opts.find((o) => o.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[180px] justify-between"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Cargando...
            </span>
          ) : selectedOption ? (
            selectedOption.label
          ) : (
            placeholder
          )}
          {!loading && (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>

     <PopoverContent
        className="w-[180px] p-0 z-[9999]"
        align="start"
        side="bottom"
        sideOffset={4}
        avoidCollisions={false}
        alignOffset={4}
        >
        <Command>
          <CommandInput placeholder="Buscar..." />
          <CommandEmpty>{emptyText}</CommandEmpty>
          <CommandGroup>
            {opts.length > 0 ? (
              opts.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    onChange(option.value === value ? "" : option.value)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))
            ) : (
              !loading && (
                <div className="p-2 text-sm text-gray-500">{emptyText}</div>
              )
            )}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
