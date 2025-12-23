import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { Check, MapPin, Loader2, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Badge } from "@/Components/ui/badge";
import MapaDirecciones from "@/Components/MapaDirecciones";
import { buscarDirecciones, buscarProvincias, buscarLocalidades, buscarCalles } from "@/services/georefService";

/**
 * Interfaz para la dirección seleccionada (datos mínimos para BD)
 */
export interface DireccionSeleccionada {
  calle_id: string;
  altura: number;
}

/**
 * Interfaz para los datos completos de una dirección desde la API
 */
interface DireccionCompleta {
  calle_id: string;
  calle_nombre: string;
  altura: number;
  localidad: string;
  provincia: string;
  departamento?: string;
  nomenclatura?: string;
  lat?: number;
  lon?: number;
  alturaManual?: boolean;
  alturaOriginal?: number;
}

/**
 * Props del componente BuscadorDireccionesCompacto
 */
interface BuscadorDireccionesCompactoProps {
  /** Callback que se ejecuta cuando se selecciona una dirección válida */
  onDireccionSeleccionada: (direccion: DireccionSeleccionada) => void;
  /** Clase CSS adicional para el contenedor */
  className?: string;
  /** Deshabilitar el componente */
  disabled?: boolean;
  mostrarBorde?:boolean;
  /** Mostrar el mapa de resultados */
  mostrarMapa?: boolean;
}

/**
 * Componente BuscadorDireccionesCompacto
 * 
 * Versión compacta y minimalista con:
 * - UI optimizada y fluida
 * - Filtros siempre visibles
 * - Mapa integrado en la misma vista
 * - Diseño profesional y eficiente
 */
export default function BuscadorDireccionesCompacto({
  onDireccionSeleccionada,
  className,
  mostrarBorde,
  disabled = false,
  mostrarMapa = true,
}: BuscadorDireccionesCompactoProps) {
  // Estados principales
  const [calle, setCalle] = useState("");
  const [altura, setAltura] = useState("");
  const [provincia, setProvincia] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [direcciones, setDirecciones] = useState<DireccionCompleta[]>([]);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState<DireccionCompleta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined);
  
  // Estados para autocompletado
  const [provinciasSugeridas, setProvinciasSugeridas] = useState<string[]>([]);
  const [localidadesSugeridas, setLocalidadesSugeridas] = useState<string[]>([]);
  const [callesSugeridas, setCallesSugeridas] = useState<string[]>([]);
  const [mostrarSugerenciasProvincia, setMostrarSugerenciasProvincia] = useState(false);
  const [mostrarSugerenciasLocalidad, setMostrarSugerenciasLocalidad] = useState(false);
  const [mostrarSugerenciasCalle, setMostrarSugerenciasCalle] = useState(false);
  const [loadingSugerencias, setLoadingSugerencias] = useState(false);
  const [activeProvinciaIndex, setActiveProvinciaIndex] = useState(-1);
  const [activeLocalidadIndex, setActiveLocalidadIndex] = useState(-1);
  const [activeCalleIndex, setActiveCalleIndex] = useState(-1);

  const suggestionsCacheRef = React.useRef({
    provincia: new Map<string, string[]>(),
    localidad: new Map<string, string[]>(),
    calle: new Map<string, string[]>(),
  });

  const direccionesCacheRef = React.useRef(new Map<string, DireccionCompleta[]>());
  const searchTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounceTimersRef = React.useRef<{
    provincia?: ReturnType<typeof setTimeout>;
    localidad?: ReturnType<typeof setTimeout>;
    calle?: ReturnType<typeof setTimeout>;
  }>({});

  const searchRequestSeqRef = React.useRef(0);
  const suggestionsSeqRef = React.useRef({ provincia: 0, localidad: 0, calle: 0 });

  const dedupeDireccionesById = useCallback((items: DireccionCompleta[]) => {
    const seen = new Set<string>();
    const out: DireccionCompleta[] = [];

    for (const d of items) {
      const key = `${d.calle_id}-${d.altura}`;
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      out.push(d);
    }

    return out;
  }, []);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      if (debounceTimersRef.current.provincia) {
        clearTimeout(debounceTimersRef.current.provincia);
      }
      if (debounceTimersRef.current.localidad) {
        clearTimeout(debounceTimersRef.current.localidad);
      }
      if (debounceTimersRef.current.calle) {
        clearTimeout(debounceTimersRef.current.calle);
      }
    };
  }, []);

  const setCached = useCallback(<T,>(map: Map<string, T>, key: string, value: T, maxSize = 50) => {
    if (map.has(key)) {
      map.delete(key);
    }
    map.set(key, value);
    if (map.size > maxSize) {
      const firstKey = map.keys().next().value;
      if (firstKey !== undefined) {
        map.delete(firstKey);
      }
    }
  }, []);

  /**
   * Función para buscar direcciones con debounce
   */
  const buscarDireccionesDebounced = useCallback(
    (params: {
      calle: string;
      altura?: string;
      provincia?: string;
      localidad?: string;
    }) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      if (params.calle.length < 3) {
        setDirecciones([]);
        setError(null);
        return;
      }

      const timeout = setTimeout(async () => {
        const requestSeq = ++searchRequestSeqRef.current;
        setLoading(true);
        setError(null);

        try {
          const requestParams: any = {
            calle: params.calle,
            max: 10,
          };

          if (params.altura && !isNaN(Number(params.altura))) {
            requestParams.altura = Number(params.altura);
          }
          if (params.provincia) requestParams.provincia = params.provincia;
          if (params.localidad) requestParams.localidad = params.localidad;

          const cacheKey = JSON.stringify(requestParams);
          const cached = direccionesCacheRef.current.get(cacheKey);
          const response: any = cached ? { success: true, direcciones: cached } : await buscarDirecciones(requestParams);

          if (requestSeq !== searchRequestSeqRef.current) {
            return;
          }

          if (response?.success && Array.isArray(response?.direcciones)) {
            // OPTIMIZADO: El backend ya maneja el fallback automáticamente
            // No es necesario hacer una segunda búsqueda desde el frontend
            setDireccionSeleccionada(null);
            setSelectedIndex(undefined);
            const dedupedDirecciones = dedupeDireccionesById(response.direcciones);
            setDirecciones(dedupedDirecciones);
            if (!cached) {
              setCached(direccionesCacheRef.current, cacheKey, dedupedDirecciones);
            }
            if (dedupedDirecciones.length === 0) {
              setError("No se encontraron direcciones");
            }
          } else {
            setError("Error al buscar direcciones");
            setDirecciones([]);
          }
        } catch (err: any) {
          if (requestSeq !== searchRequestSeqRef.current) {
            return;
          }
          console.error("Error en búsqueda:", err);
          setError(err.response?.data?.error || "Error al conectar");
          setDirecciones([]);
        } finally {
          if (requestSeq === searchRequestSeqRef.current) {
            setLoading(false);
          }
        }
      }, 400);

      searchTimeoutRef.current = timeout;
    },
    []
  );

  /**
   * Efecto para buscar cuando cambian los parámetros
   */
  useEffect(() => {
    if (calle && altura) {
      buscarDireccionesDebounced({ calle, altura, provincia, localidad });
    }
  }, [calle, altura, provincia, localidad, buscarDireccionesDebounced]);

  /**
   * Handler para seleccionar una dirección
   */
  const handleSelectDireccion = useCallback((direccion: DireccionCompleta, index: number) => {
    setDireccionSeleccionada(direccion);
    setSelectedIndex(index);
    onDireccionSeleccionada({
      calle_id: direccion.calle_id,
      altura: direccion.altura,
    });
  }, [onDireccionSeleccionada]);

  /**
   * Buscar sugerencias de provincias
   * OPTIMIZADO: Con debounce de 300ms para reducir requests
   */
  const buscarSugerenciasProvincia = useCallback((texto: string) => {
    if (texto.length < 2) {
      setProvinciasSugeridas([]);
      setActiveProvinciaIndex(-1);
      return;
    }

    // Limpiar timeout anterior
    if (debounceTimersRef.current.provincia) {
      clearTimeout(debounceTimersRef.current.provincia);
    }

    // Crear nuevo timeout
    const timer = setTimeout(async () => {
      const requestSeq = ++suggestionsSeqRef.current.provincia;
      setLoadingSugerencias(true);
      try {
        const cacheKey = texto.trim().toLowerCase();
        const cached = suggestionsCacheRef.current.provincia.get(cacheKey);
        if (cached) {
          if (requestSeq === suggestionsSeqRef.current.provincia) {
            setProvinciasSugeridas(cached);
            setActiveProvinciaIndex(cached.length > 0 ? 0 : -1);
          }
          return;
        }
        const response: any = await buscarProvincias({ nombre: texto, max: 5 });
        if (response?.success && Array.isArray(response?.provincias)) {
          if (requestSeq !== suggestionsSeqRef.current.provincia) {
            return;
          }
          const nombres = response.provincias.map((p: any) => p.nombre) as string[];
          const unicos = [...new Set(nombres)];
          setProvinciasSugeridas(unicos);
          setActiveProvinciaIndex(unicos.length > 0 ? 0 : -1);
          setCached(suggestionsCacheRef.current.provincia, cacheKey, unicos);
        }
      } catch (error) {
        console.error('Error al buscar provincias:', error);
      } finally {
        if (requestSeq === suggestionsSeqRef.current.provincia) {
          setLoadingSugerencias(false);
        }
      }
    }, 300);

    debounceTimersRef.current.provincia = timer;
  }, [setCached]);

  /**
   * Buscar sugerencias de localidades
   * OPTIMIZADO: Con debounce de 300ms para reducir requests
   */
  const buscarSugerenciasLocalidad = useCallback((texto: string) => {
    if (texto.length < 2) {
      setLocalidadesSugeridas([]);
      setActiveLocalidadIndex(-1);
      return;
    }

    // Limpiar timeout anterior
    if (debounceTimersRef.current.localidad) {
      clearTimeout(debounceTimersRef.current.localidad);
    }

    // Crear nuevo timeout
    const timer = setTimeout(async () => {
      const requestSeq = ++suggestionsSeqRef.current.localidad;
      setLoadingSugerencias(true);
      try {
        const cacheKey = `${(provincia || '').trim().toLowerCase()}|${texto.trim().toLowerCase()}`;
        const cached = suggestionsCacheRef.current.localidad.get(cacheKey);
        if (cached) {
          if (requestSeq === suggestionsSeqRef.current.localidad) {
            setLocalidadesSugeridas(cached);
            setActiveLocalidadIndex(cached.length > 0 ? 0 : -1);
          }
          return;
        }
        const response: any = await buscarLocalidades({ 
          nombre: texto, 
          provincia: provincia || undefined,
          max: 5 
        });
        if (response?.success && Array.isArray(response?.localidades)) {
          if (requestSeq !== suggestionsSeqRef.current.localidad) {
            return;
          }
          const nombres = response.localidades.map((l: any) => l.nombre) as string[];
          const unicos = [...new Set(nombres)];
          setLocalidadesSugeridas(unicos);
          setActiveLocalidadIndex(unicos.length > 0 ? 0 : -1);
          setCached(suggestionsCacheRef.current.localidad, cacheKey, unicos);
        }
      } catch (error) {
        console.error('Error al buscar localidades:', error);
      } finally {
        if (requestSeq === suggestionsSeqRef.current.localidad) {
          setLoadingSugerencias(false);
        }
      }
    }, 300);

    debounceTimersRef.current.localidad = timer;
  }, [provincia, setCached]);

  /**
   * Buscar sugerencias de calles
   * OPTIMIZADO: Con debounce de 300ms para reducir requests
   */
  const buscarSugerenciasCalle = useCallback((texto: string) => {
    if (altura.trim() !== '') {
      setCallesSugeridas([]);
      setActiveCalleIndex(-1);
      return;
    }
    if (texto.length < 3) {
      setCallesSugeridas([]);
      setActiveCalleIndex(-1);
      return;
    }

    // Limpiar timeout anterior
    if (debounceTimersRef.current.calle) {
      clearTimeout(debounceTimersRef.current.calle);
    }

    // Crear nuevo timeout
    const timer = setTimeout(async () => {
      const requestSeq = ++suggestionsSeqRef.current.calle;
      setLoadingSugerencias(true);
      try {
        const cacheKey = `${(provincia || '').trim().toLowerCase()}|${texto.trim().toLowerCase()}`;
        const cached = suggestionsCacheRef.current.calle.get(cacheKey);
        if (cached) {
          if (requestSeq === suggestionsSeqRef.current.calle) {
            setCallesSugeridas(cached);
            setActiveCalleIndex(cached.length > 0 ? 0 : -1);
          }
          return;
        }
        const response: any = await buscarCalles({ 
          nombre: texto, 
          provincia: provincia || undefined,
          max: 5 
        });
        if (response?.success && Array.isArray(response?.calles)) {
          if (requestSeq !== suggestionsSeqRef.current.calle) {
            return;
          }
          const nombres = response.calles.map((c: any) => c.nombre) as string[];
          const unicos = [...new Set(nombres)];
          setCallesSugeridas(unicos);
          setActiveCalleIndex(unicos.length > 0 ? 0 : -1);
          setCached(suggestionsCacheRef.current.calle, cacheKey, unicos);
        }
      } catch (error) {
        console.error('Error al buscar calles:', error);
      } finally {
        if (requestSeq === suggestionsSeqRef.current.calle) {
          setLoadingSugerencias(false);
        }
      }
    }, 300);

    debounceTimersRef.current.calle = timer;
  }, [altura, provincia, setCached]);

  /**
   * Limpiar búsqueda
   */
  const handleLimpiar = () => {
    setCalle("");
    setAltura("");
    setProvincia("");
    setLocalidad("");
    setDirecciones([]);
    setDireccionSeleccionada(null);
    setSelectedIndex(undefined);
    setError(null);
    setProvinciasSugeridas([]);
    setLocalidadesSugeridas([]);
    setCallesSugeridas([]);
    setActiveProvinciaIndex(-1);
    setActiveLocalidadIndex(-1);
    setActiveCalleIndex(-1);
  };

  const handleMarkerClick = useCallback((index: number) => {
    const direccion = direcciones[index];
    if (direccion) {
      handleSelectDireccion(direccion, index);
    }
  }, [direcciones, handleSelectDireccion]);

  const handleKeyDownProvincia = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!mostrarSugerenciasProvincia || provinciasSugeridas.length === 0) {
      if (e.key === 'ArrowDown' && provinciasSugeridas.length > 0) {
        setMostrarSugerenciasProvincia(true);
        setActiveProvinciaIndex(0);
        e.preventDefault();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveProvinciaIndex((prev) => Math.min(prev + 1, provinciasSugeridas.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveProvinciaIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      if (activeProvinciaIndex >= 0 && activeProvinciaIndex < provinciasSugeridas.length) {
        e.preventDefault();
        setProvincia(provinciasSugeridas[activeProvinciaIndex]);
        setMostrarSugerenciasProvincia(false);
      }
    } else if (e.key === 'Escape') {
      setMostrarSugerenciasProvincia(false);
    }
  };

  const handleKeyDownLocalidad = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!mostrarSugerenciasLocalidad || localidadesSugeridas.length === 0) {
      if (e.key === 'ArrowDown' && localidadesSugeridas.length > 0) {
        setMostrarSugerenciasLocalidad(true);
        setActiveLocalidadIndex(0);
        e.preventDefault();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveLocalidadIndex((prev) => Math.min(prev + 1, localidadesSugeridas.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveLocalidadIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      if (activeLocalidadIndex >= 0 && activeLocalidadIndex < localidadesSugeridas.length) {
        e.preventDefault();
        setLocalidad(localidadesSugeridas[activeLocalidadIndex]);
        setMostrarSugerenciasLocalidad(false);
      }
    } else if (e.key === 'Escape') {
      setMostrarSugerenciasLocalidad(false);
    }
  };

  const handleKeyDownCalle = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!mostrarSugerenciasCalle || callesSugeridas.length === 0) {
      if (e.key === 'ArrowDown' && callesSugeridas.length > 0) {
        setMostrarSugerenciasCalle(true);
        setActiveCalleIndex(0);
        e.preventDefault();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveCalleIndex((prev) => Math.min(prev + 1, callesSugeridas.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveCalleIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      if (activeCalleIndex >= 0 && activeCalleIndex < callesSugeridas.length) {
        e.preventDefault();
        setCalle(callesSugeridas[activeCalleIndex]);
        setMostrarSugerenciasCalle(false);
      }
    } else if (e.key === 'Escape') {
      setMostrarSugerenciasCalle(false);
    }
  };

  /**
   * Preparar coordenadas para el mapa
   */
  const coordenadasMapa = React.useMemo(() => {
    return direcciones
      .filter((d) => d.lat != null && d.lon != null)
      .map((d, index) => ({
        lat: d.lat as number,
        lon: d.lon as number,
        nombre: `${d.calle_nombre} ${d.altura}`,
        descripcion: `${d.localidad}, ${d.provincia}`,
        index,
      }));
  }, [direcciones]);

  return (
    <div className={cn("space-y-3", className)}>
      {/* Formulario de Búsqueda Compacto */}
      <div className={`bg-card p-4 shadow-sm ${
    !mostrarBorde ? "rounded-lg border" : ""
  }`}>
        <div className="space-y-4">
          {/* Filtros opcionales arriba */}
          <div className="grid gap-3 md:grid-cols-2">
            <div className="relative space-y-2">
              <Label htmlFor="provincia" className="text-xs font-medium text-muted-foreground">
                Provincia (opcional)
              </Label>
              <Input
                id="provincia"
                placeholder="Ej: Buenos Aires"
                value={provincia}
                onChange={(e) => {
                  setProvincia(e.target.value);
                  buscarSugerenciasProvincia(e.target.value);
                  setMostrarSugerenciasProvincia(true);
                }}
                onKeyDown={handleKeyDownProvincia}
                onFocus={() => provincia.length >= 2 && setMostrarSugerenciasProvincia(true)}
                onBlur={() => setTimeout(() => setMostrarSugerenciasProvincia(false), 200)}
                disabled={disabled}
                className="text-sm"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={mostrarSugerenciasProvincia}
                aria-controls="provincia-sugerencias"
                aria-activedescendant={activeProvinciaIndex >= 0 ? `provincia-option-${activeProvinciaIndex}` : undefined}
              />
              {mostrarSugerenciasProvincia && provinciasSugeridas.length > 0 && (
                <div id="provincia-sugerencias" role="listbox" className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
                  <div className="max-h-60 overflow-auto p-1">
                    {provinciasSugeridas.map((sugerencia, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setProvincia(sugerencia);
                          setMostrarSugerenciasProvincia(false);
                        }}
                        onMouseEnter={() => setActiveProvinciaIndex(index)}
                        id={`provincia-option-${index}`}
                        role="option"
                        aria-selected={index === activeProvinciaIndex}
                        className={cn(
                          "w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent",
                          index === activeProvinciaIndex && "bg-accent"
                        )}
                      >
                        {sugerencia}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative space-y-2">
              <Label htmlFor="localidad" className="text-xs font-medium text-muted-foreground">
                Localidad (opcional)
              </Label>
              <Input
                id="localidad"
                placeholder="Ej: CABA"
                value={localidad}
                onChange={(e) => {
                  setLocalidad(e.target.value);
                  buscarSugerenciasLocalidad(e.target.value);
                  setMostrarSugerenciasLocalidad(true);
                }}
                onKeyDown={handleKeyDownLocalidad}
                onFocus={() => localidad.length >= 2 && setMostrarSugerenciasLocalidad(true)}
                onBlur={() => setTimeout(() => setMostrarSugerenciasLocalidad(false), 200)}
                disabled={disabled}
                className="text-sm"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={mostrarSugerenciasLocalidad}
                aria-controls="localidad-sugerencias"
                aria-activedescendant={activeLocalidadIndex >= 0 ? `localidad-option-${activeLocalidadIndex}` : undefined}
              />
              {mostrarSugerenciasLocalidad && localidadesSugeridas.length > 0 && (
                <div id="localidad-sugerencias" role="listbox" className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
                  <div className="max-h-60 overflow-auto p-1">
                    {localidadesSugeridas.map((sugerencia, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setLocalidad(sugerencia);
                          setMostrarSugerenciasLocalidad(false);
                        }}
                        onMouseEnter={() => setActiveLocalidadIndex(index)}
                        id={`localidad-option-${index}`}
                        role="option"
                        aria-selected={index === activeLocalidadIndex}
                        className={cn(
                          "w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent",
                          index === activeLocalidadIndex && "bg-accent"
                        )}
                      >
                        {sugerencia}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Separador visual sutil */}
          {(provincia || localidad) && (
            <div className="border-t" />
          )}

          {/* Campos principales */}
          <div className="grid gap-3 md:grid-cols-3">
            <div className="relative space-y-2 md:col-span-2">
              <Label htmlFor="calle" className="text-xs font-medium">
                Calle <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="calle"
                  placeholder="Buscar calle..."
                  value={calle}
                  onChange={(e) => {
                    setCalle(e.target.value);
                    setDireccionSeleccionada(null);
                    buscarSugerenciasCalle(e.target.value);
                    setMostrarSugerenciasCalle(true);
                  }}
                  onKeyDown={handleKeyDownCalle}
                  onFocus={() => calle.length >= 3 && setMostrarSugerenciasCalle(true)}
                  onBlur={() => setTimeout(() => setMostrarSugerenciasCalle(false), 200)}
                  disabled={disabled}
                  className="pl-9 text-sm"
                  role="combobox"
                  aria-autocomplete="list"
                  aria-expanded={mostrarSugerenciasCalle}
                  aria-controls="calle-sugerencias"
                  aria-activedescendant={activeCalleIndex >= 0 ? `calle-option-${activeCalleIndex}` : undefined}
                />
              </div>
              {mostrarSugerenciasCalle && callesSugeridas.length > 0 && (
                <div id="calle-sugerencias" role="listbox" className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
                  <div className="max-h-60 overflow-auto p-1">
                    {callesSugeridas.map((sugerencia, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setCalle(sugerencia);
                          setMostrarSugerenciasCalle(false);
                        }}
                        onMouseEnter={() => setActiveCalleIndex(index)}
                        id={`calle-option-${index}`}
                        role="option"
                        aria-selected={index === activeCalleIndex}
                        className={cn(
                          "w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent",
                          index === activeCalleIndex && "bg-accent"
                        )}
                      >
                        {sugerencia}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="altura" className="text-xs font-medium">
                Altura
              </Label>
              <Input
                id="altura"
                type="text"
                inputMode="numeric"
                placeholder="Número"
                value={altura}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || /^\d+$/.test(value)) {
                    setAltura(value);
                    setDireccionSeleccionada(null);
                  }
                }}
                disabled={disabled}
                className="text-sm"
              />
            </div>
          </div>

          {/* Botón limpiar */}
          {(calle || altura || provincia || localidad) && (
            <div className="flex justify-end border-t pt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLimpiar}
                disabled={disabled}
                className="h-7 text-xs"
              >
                <X className="mr-1 h-3 w-3" />
                Limpiar
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Resultados: Lista y Mapa lado a lado */}
      <AnimatePresence mode="wait">
        {(direcciones.length > 0 || loading || error) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn("grid gap-3", mostrarMapa && "lg:grid-cols-2")}
          >
            {/* Lista de resultados */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
              className="rounded-lg border bg-card shadow-sm"
            >
            <div className="border-b p-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Resultados</h3>
                {direcciones.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {direcciones.length}
                  </Badge>
                )}
              </div>
              {direcciones.length > 0 && direcciones[0]?.alturaManual && (
                <div className="mt-2 rounded-md bg-amber-50 px-2 py-1.5 text-xs text-amber-800 dark:bg-amber-950 dark:text-amber-200">
                  ⚠️ Altura no encontrada en la base de datos. Se usará la altura ingresada manualmente.
                </div>
              )}
            </div>

            <div className="p-2">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : error ? (
                <div className="rounded-md bg-destructive/10 p-3 text-xs text-destructive">
                  {error}
                </div>
              ) : (
                <ScrollArea className="h-75">
                  <div className="space-y-1.5 pr-3">
                    {direcciones.map((direccion, index) => (
                      <button
                        key={`${direccion.calle_id}-${direccion.altura}`}
                        onClick={() => handleSelectDireccion(direccion, index)}
                        className={cn(
                          "w-full rounded-md border p-2.5 text-left transition-all hover:border-primary hover:bg-accent",
                          direccionSeleccionada?.calle_id === direccion.calle_id &&
                            direccionSeleccionada?.altura === direccion.altura &&
                            "border-primary bg-primary/5"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                              <p className="truncate text-sm font-medium">
                                {direccion.calle_nombre} {direccion.altura}
                                {direccion.alturaManual && (
                                  <Badge variant="outline" className="ml-1.5 text-[10px] text-amber-600">
                                    Altura manual
                                  </Badge>
                                )}
                              </p>
                            </div>
                            <p className="mt-0.5 truncate text-xs text-muted-foreground">
                              {direccion.localidad}, {direccion.provincia}
                            </p>
                            {direccion.lat && direccion.lon && (
                              <p className="mt-1 text-[10px] text-muted-foreground">
                                📍 {direccion.lat.toFixed(4)}, {direccion.lon.toFixed(4)}
                              </p>
                            )}
                          </div>
                          {direccionSeleccionada?.calle_id === direccion.calle_id &&
                            direccionSeleccionada?.altura === direccion.altura && (
                              <Check className="h-4 w-4 shrink-0 text-primary" />
                            )}
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </motion.div>

          {/* Mapa */}
          {mostrarMapa && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
              className="rounded-lg border bg-card shadow-sm"
            >
            <div className="border-b p-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Mapa</h3>
                {coordenadasMapa.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {coordenadasMapa.length} ubicaciones
                  </Badge>
                )}
              </div>
            </div>

            <div className="p-2">
              {coordenadasMapa.length > 0 ? (
                <MapaDirecciones
                  coordenadas={coordenadasMapa}
                  altura="300px"
                  zoomInicial={13}
                  onMarkerClick={handleMarkerClick}
                  selectedIndex={selectedIndex}
                />
              ) : (
                <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
                  <div className="text-center text-xs text-muted-foreground">
                    <MapPin className="mx-auto mb-2 h-8 w-8 opacity-30" />
                    <p>No hay coordenadas disponibles</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
          )}
        </motion.div>
      )}
      </AnimatePresence>

      {/* Mensaje inicial */}
      {!loading && !error && direcciones.length === 0 && calle.length > 0 && calle.length < 3 && (
        <div className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
          Ingrese al menos 3 caracteres para buscar
        </div>
      )}
    </div>
  );
}
