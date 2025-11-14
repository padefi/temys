import {
  Select,
  SelectTrigger,
  SelectContent,
} from "@/Components/ui/select";

import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/Components/ui/command";

import { useVirtualizer } from "@tanstack/react-virtual";
import React, { useState, useMemo, useRef } from "react";

type Option = {
  id: number | string;
  label: string;
  keywords?: string[];
};

interface Props {
  value: string | number | undefined;
  placeholder?: string;
  options: Option[];
  loading?: boolean;
  onChange: (value: string) => void;
  onOpen: () => void;
}

export default function SearchableSelect({
  value,
  placeholder = "Seleccionar...",
  options,
  loading = false,
  onChange,
  onOpen,
}: Props) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const initialLabel = options.find(o => String(o.id) === String(value))?.label;

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    if (!term) return options;
    return options.filter((o) =>
      (o.keywords ?? [o.label]).some((k) => k.toLowerCase().includes(term))
    );
  }, [options, search]);

  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
  });

  return (
    <Select
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) onOpen();
      }}
      // NO usamos onValueChange porque usamos CommandItem manual
      value={value ? String(value) : ""}
    >
      <SelectTrigger>
        <div className="truncate">
          {value
            ? options.find((o) => String(o.id) === String(value))?.label
            : placeholder}
        </div>
      </SelectTrigger>

      <SelectContent>
        {loading ? (
          <div className="p-3 text-center text-gray-500 text-sm">Cargando...</div>
        ) : (
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Buscar..."
              defaultValue={initialLabel}
              value={search}
              onValueChange={setSearch}
            />

            <CommandList>
              <CommandEmpty>No hay resultados.</CommandEmpty>
              <CommandGroup>
                <div
                  ref={parentRef}
                  style={{
                    height: "240px",
                    overflowY: "auto",
                  }}
                >
                  <div
                    style={{
                      height: virtualizer.getTotalSize(),
                      position: "relative",
                    }}
                  >
                    {virtualizer.getVirtualItems().map((vr) => {
                      const item = filtered[vr.index];
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
                              setOpen(false); // Cierra el select
                            }}
                          >
                            {item.label}
                          </CommandItem>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CommandGroup>
            </CommandList>
          </Command>
        )}
      </SelectContent>
    </Select>
  );
}
