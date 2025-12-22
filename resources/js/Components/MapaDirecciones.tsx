import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/**
 * Interfaz para las coordenadas de una dirección
 */
interface Coordenadas {
  lat: number;
  lon: number;
  nombre?: string;
  descripcion?: string;
  index?: number;
}

/**
 * Props del componente MapaDirecciones
 */
interface MapaDireccionesProps {
  /** Coordenadas a mostrar en el mapa */
  coordenadas: Coordenadas[];
  /** Altura del mapa en píxeles */
  altura?: string;
  /** Zoom inicial del mapa */
  zoomInicial?: number;
  /** Clase CSS adicional */
  className?: string;
  /** Callback cuando se hace click en un marcador */
  onMarkerClick?: (index: number) => void;
  /** Índice del marcador seleccionado */
  selectedIndex?: number;
}

/**
 * Componente MapaDirecciones
 * 
 * Muestra un mapa interactivo con marcadores de las direcciones encontradas.
 * Utiliza Leaflet y OpenStreetMap.
 * 
 * @example
 * ```tsx
 * <MapaDirecciones
 *   coordenadas={[
 *     { lat: -34.6037, lon: -58.3816, nombre: "Buenos Aires" }
 *   ]}
 *   altura="400px"
 * />
 * ```
 */
export default function MapaDirecciones({
  coordenadas,
  altura = "400px",
  zoomInicial = 13,
  className = "",
  onMarkerClick,
  selectedIndex,
}: MapaDireccionesProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  /**
   * Inicializar el mapa
   */
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Crear el mapa centrado en Argentina
    const map = L.map(mapContainerRef.current).setView([-34.6037, -58.3816], zoomInicial);

    // Agregar capa de OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  /**
   * Actualizar marcadores cuando cambian las coordenadas
   */
  useEffect(() => {
    if (!mapRef.current) return;

    // Limpiar marcadores anteriores
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    if (coordenadas.length === 0) return;

    // Crear iconos personalizados (normal y seleccionado)
    const customIcon = L.icon({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const selectedIcon = L.icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    // Agregar marcadores
    const bounds = L.latLngBounds([]);
    
    coordenadas.forEach((coord, index) => {
      const isSelected = selectedIndex === index;
      const marker = L.marker([coord.lat, coord.lon], { 
        icon: isSelected ? selectedIcon : customIcon 
      }).addTo(mapRef.current!);

      // Agregar popup con información
      const popupContent = `
        <div style="min-width: 200px;">
          <strong>${coord.nombre || `Ubicación ${index + 1}`}</strong>
          ${coord.descripcion ? `<br/><span style="font-size: 0.875rem;">${coord.descripcion}</span>` : ""}
          <br/><span style="font-size: 0.75rem; color: #666;">
            Lat: ${coord.lat.toFixed(6)}, Lon: ${coord.lon.toFixed(6)}
          </span>
        </div>
      `;
      
      marker.bindPopup(popupContent);

      // Agregar evento de click
      if (onMarkerClick) {
        marker.on('click', () => {
          onMarkerClick(index);
        });
      }

      // Abrir popup si está seleccionado
      if (isSelected) {
        marker.openPopup();
      }

      markersRef.current.push(marker);
      bounds.extend([coord.lat, coord.lon]);
    });

    // Ajustar vista para mostrar todos los marcadores
    if (coordenadas.length === 1) {
      mapRef.current.setView([coordenadas[0].lat, coordenadas[0].lon], zoomInicial);
    } else if (coordenadas.length > 1) {
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [coordenadas, zoomInicial, selectedIndex, onMarkerClick]);

  return (
    <div className={className}>
      <div
        ref={mapContainerRef}
        style={{ height: altura, width: "100%" }}
        className="rounded-lg border shadow-sm"
      />
    </div>
  );
}
