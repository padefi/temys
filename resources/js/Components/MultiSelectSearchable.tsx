import React, { useMemo, useState } from "react";
import { Check, X, Search, ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/Components/ui/popover";
import { Command, CommandItem } from "@/Components/ui/command";
import { Button } from "@/Components/ui/button";
import { cn } from "@/lib/utils";

type Option = {
  id: number;
  label: string;
  keywords?: string[];
};

interface Props {
  values: number[];
  options: Option[];
  placeholder?: string;
  onChange: (values: number[]) => void;
  searchPlaceholder?: string;
  clearable?: boolean;
}

export default function MultiSelectSearchable({
  values,
  options,
  placeholder = "Seleccionar...",
  onChange,
  searchPlaceholder = "Buscar...",
  clearable = true,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedSet = useMemo(() => new Set(values), [values]);
  const selectedOptions = useMemo(() => {
    const map = new Map(options.map((o) => [o.id, o]));
    return values.map((id) => map.get(id)).filter(Boolean) as Option[];
  }, [values, options]);

  const matchesSearch = (o: Option, term: string) => {
    if (!term) return true;
    const t = term.toLowerCase();
    return (o.keywords ?? [o.label]).some((k) => k.toLowerCase().includes(t));
  };

  const filteredSelected = useMemo(() => {
    const term = search.trim();
    return selectedOptions.filter((o) => matchesSearch(o, term));
  }, [selectedOptions, search]);

  const filteredUnselected = useMemo(() => {
    const term = search.trim();
    return options
      .filter((o) => !selectedSet.has(o.id))
      .filter((o) => matchesSearch(o, term));
  }, [options, selectedSet, search]);

  const totalResults = filteredSelected.length + filteredUnselected.length;

  const toggle = (id: number) => {
    if (selectedSet.has(id)) onChange(values.filter((v) => v !== id));
    else onChange([...values, id]);
  };

  const clearAll = () => onChange([]);

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setSearch("");
      }}
    >
      <PopoverTrigger asChild>
        <div
          role="button"
          tabIndex={0}
          className={cn(
            "w-full justify-between",
            "min-h-[42px] h-auto",
            "rounded-lg px-3 py-2",
            "text-left",
            "border border-input bg-background",
            "flex items-center gap-3",
            "outline-none",
            "focus:ring-1 focus:ring-ring"
          )}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        >
          <div className="flex-1 min-w-0">
            {selectedOptions.length === 0 ? (
              <span className="text-muted-foreground text-sm">{placeholder}</span>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {selectedOptions.map((opt) => (
                  <span
                    key={opt.id}
                    className={cn(
                      "inline-flex items-center gap-1.5",
                      "rounded-md border bg-muted/60",
                      "px-2 py-0.5",
                      "text-xs text-foreground",
                      "shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
                    )}
                    title={opt.label}
                  >
                    <span className="max-w-[220px] truncate">{opt.label}</span>

                    <button
                      type="button"
                      className={cn(
                        "ml-0.5 inline-flex h-4 w-4 items-center justify-center",
                        "rounded-sm",
                        "text-muted-foreground",
                        "hover:text-foreground",
                        "hover:bg-background/70",
                        "transition"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggle(opt.id);
                      }}
                      aria-label={`Quitar ${opt.label}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
              open ? "rotate-180" : ""
            )}
          />
        </div>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className={cn(
          "p-0 rounded-xl shadow-lg overflow-hidden",
          "w-[--radix-popover-trigger-width]",
          "max-w-[460px]"
        )}
        onWheelCapture={(e) => e.stopPropagation()}
      >
        <Command shouldFilter={false} className="p-0">
          {/* Header buscador */}
          <div className="px-3 pt-2 pb-3 bg-muted/40">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  className={cn(
                    "h-9 w-full",
                    "pl-9 pr-3",
                    "rounded-md",
                    "border border-input",
                    "bg-background",
                    "text-sm",
                    "outline-none",
                    "focus:ring-1 focus:ring-ring"
                  )}
                />
              </div>

              {clearable && values.length > 0 && (
                <Button type="button" variant="ghost" className="h-9 px-2 text-xs" onClick={clearAll}>
                  Limpiar
                </Button>
              )}
            </div>

            <div className="mt-3 h-px bg-border/70" />

            <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Seleccionadas: {values.length}</span>
              <span>Resultados: {totalResults}</span>
            </div>
          </div>

          {/* Lista con scroll */}
          <div className="max-h-[300px] overflow-y-auto overscroll-contain p-1" onWheelCapture={(e) => e.stopPropagation()}>
            {totalResults === 0 ? (
              <div className="px-3 py-3 text-sm text-muted-foreground">No hay resultados</div>
            ) : (
              <>
                {filteredSelected.length > 0 && (
                  <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
                    <div className="px-3 py-2 text-xs font-medium text-foreground">Seleccionadas</div>
                  </div>
                )}

                {filteredSelected.map((opt) => (
                  <CommandItem
                    key={opt.id}
                    onSelect={() => toggle(opt.id)}
                    className={cn(
                      "mx-1 my-0.5 rounded-md px-3 py-2 text-sm",
                      "cursor-pointer transition-colors",
                      "bg-green-50 text-green-800",
                      "hover:bg-green-100"
                    )}
                  >
                    <span className="truncate">{opt.label}</span>
                    <Check className="ml-auto h-4 w-4 text-green-600" />
                  </CommandItem>
                ))}

                {filteredUnselected.length > 0 && (
                  <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b mt-2">
                    <div className="px-3 py-2 text-xs font-medium text-foreground">Opciones</div>
                  </div>
                )}

                {filteredUnselected.map((opt) => (
                  <CommandItem
                    key={opt.id}
                    onSelect={() => toggle(opt.id)}
                    className={cn(
                      "mx-1 my-0.5 rounded-md px-3 py-2 text-sm",
                      "cursor-pointer transition-colors",
                      "hover:bg-muted"
                    )}
                  >
                    <span className="truncate">{opt.label}</span>
                  </CommandItem>
                ))}
              </>
            )}
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}