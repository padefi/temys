import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import MultipleSelector, { Option } from "@/Components/ui/multiple-selector";
import React from "react";
import axios from "axios";

export default function Producto() {
  const [selectedOptions, setSelectedOptions] = React.useState<Option[]>([]);
  const [options, setOptions] = React.useState<Option[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get("/getCategorias");

        // Transformar los datos recibidos del backend
        const transformed = response.data.map((item: any) => ({
          label: item.descripcion,
          value: String(item.id),
        }));

        setOptions(transformed);
      } catch (error) {
        console.error("Error cargando opciones:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const handleChange = async (newSelected: Option[]) => {
    const knownValues = options.map((opt) => opt.value);
    const newlyCreated = newSelected.filter((opt) => !knownValues.includes(opt.value));

    for (const newOpt of newlyCreated) {
      try {
        const response = await axios.post("/store", {
          descripcion: newOpt.label,
        });

        const saved = response.data;

        // Agregamos la nueva opción transformada
        setOptions((prev) => [...prev, saved]);
      } catch (error) {
        console.error("Error guardando nueva opción:", error);
      }
    }

    setSelectedOptions(newSelected);
  };

  return (
    <AuthenticatedLayout
      header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Inventario</h2>}
    >
      <Head title="Inventario" />

        {loading ? (
          <p className="text-sm text-gray-500">Cargando opciones...</p>
        ) : (
                <MultipleSelector
                    className="w-40 border-none! focus-within:ring-0 focus-within:ring-offset-0"
                    defaultOptions={options}
                    placeholder="Categorias"
                    creatable
                    maxSelected={1}
                    badgeClassName="bg-green-500 text-white"
                    inputProps={{ className: "text-sm placeholder:text-slate-500 rounded-full w-30" }}
                    onChange={handleChange}
                    hideInputWhenSelected 
            />
        )}
    </AuthenticatedLayout>
  );
}
