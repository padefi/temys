import React, { useMemo, useRef, useState } from "react";
import { Select, SelectTrigger, SelectContent } from "@/Components/ui/select";
import { Command, CommandList, CommandEmpty, CommandItem } from "@/Components/ui/command";
import { Check, Search } from "lucide-react";
import { useVirtualizer } from "@tanstack/react-virtual";

export type Option = {
  id: number | string;
  label: string;
  keywords?: string[];
};

interface Props {
  value?: number | string;
  placeholder?: string;
  options: Option[];
  loading?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  onChange: (value: string) => void;
  onOpen?: () => void;
}

export default function SearchableSelect({
  value,
  placeholder = "Seleccionar...",
  options,
  loading = false,
  disabled = false,
  clearable = false,
  onChange,
  onOpen,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return options;
    const term = search.toLowerCase();
    return options.filter((o) =>
      (o.keywords ?? [o.label]).some((k) => k.toLowerCase().includes(term))
    );
  }, [options, search]);

  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 36,
  });

  const stringValue = value === null || value === undefined ? "" : String(value);
  const hasValue = stringValue !== "";
  const selectedLabel = options.find((o) => String(o.id) === stringValue)?.label;

  return (
    <Select
      disabled={disabled}
      open={open}
      onOpenChange={(o) => {
        if (disabled) return;
        setOpen(o);
        if (o) onOpen?.();
        if (!o) setSearch("");
      }}
      value={stringValue}
      //value={value ? String(value) : ""}
    >
      <SelectTrigger className="min-h-10.5 rounded-lg" disabled={disabled}>
        <span className="truncate text-sm">{selectedLabel ?? placeholder}</span>
      </SelectTrigger>

      <SelectContent className="p-0 rounded-xl overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-4 text-sm text-muted-foreground text-center">
            Cargando...
          </div>
        ) : (
          <Command shouldFilter={false} className="p-0">
            {/* Header buscador */}
            <div className="px-3 pt-2 pb-3 bg-muted/40">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar..."
                    className="
                      h-9 w-full
                      pl-9 pr-3
                      rounded-md
                      border border-input
                      bg-background
                      text-sm
                      outline-none
                      focus:ring-1 focus:ring-ring
                    "
                  />
                </div>

                {/*{clearable && value && (*/}
                {clearable && hasValue && (
                  <button
                    type="button"
                    className="
                      h-9 px-2 rounded-md
                      text-xs text-muted-foreground
                      hover:text-foreground hover:bg-background/70
                      transition
                    "
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onChange("");
                      setOpen(false);
                    }}
                  >
                    Limpiar
                  </button>
                )}
              </div>

              {/* Línea divisora */}
              <div className="mt-3 h-px bg-border/70" />
            </div>

            <CommandList className="p-0">
              <CommandEmpty className="py-4 text-sm text-muted-foreground text-center">
                No hay resultados
              </CommandEmpty>

              <div ref={parentRef} className="max-h-60 overflow-y-auto px-1 pb-1">
                <div
                  style={{
                    height: virtualizer.getTotalSize(),
                    position: "relative",
                  }}
                >
                  {virtualizer.getVirtualItems().map((vr) => {
                    const item = filtered[vr.index];
                    const selected = String(item.id) === stringValue;

                    return (
                      <div
                        key={item.id}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          transform: `translateY(${vr.start}px)`,
                        }}
                      >
                        <CommandItem
                          value={String(item.id)}
                          onSelect={() => {
                            onChange(String(item.id));
                            setOpen(false);
                          }}
                          className={`
                            mx-1 my-0.5 rounded-md px-3 py-2 text-sm
                            cursor-pointer transition-colors
                            ${selected ? "bg-green-50 text-green-800" : "hover:bg-muted"}
                          `}
                        >
                          <span className="truncate">{item.label}</span>
                          {selected && (
                            <Check className="ml-auto h-4 w-4 text-green-600" />
                          )}
                        </CommandItem>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CommandList>
          </Command>
        )}
      </SelectContent>
    </Select>
  );
}