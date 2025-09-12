import { useEffect, useState } from "react";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent } from "@/Components/ui/card";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import ExistenciasTable from "./ExistenciaTable";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import ChipSearch, { Chip } from "./Search";

interface ExistenciasItem {
  id: number;
  producto_id: number;
  nombre: string;
  categoria: string;
  stockActual: number;
  stockDispoble: number;
  entrada: number;
  salida: number;
  stockEstimado: number;
  estadoEntregas: string;
  estado_ajuste: string;
  cantidad_contada: number;
}

type PageProps = InertiaPageProps & {
  stocks: {
    data: ExistenciasItem[];
  };
};

export default function ExistenciaManagement() {
  const [chips, setChips] = useState<Chip[]>([]);
  const [data, setData] = useState<ExistenciasItem[]>([]);
  const { stocks } = usePage<PageProps>().props;

  useEffect(() => {
    setData(stocks.data);
  }, [stocks]);

  const filteredData = data.filter((item) => {
    if (chips.length === 0) return true;
    return chips.some((chip) =>
      item.nombre?.toLowerCase().includes(chip.value.toLowerCase())
    );
  });

  return (
    <AuthenticatedLayout
      header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Existencias</h2>}
    >
      <Head title="Existencias" />

      <Card>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
        
            <ChipSearch onChange={setChips} />

            <Badge variant="secondary" className="px-3 py-1">
              {filteredData.length} productos
            </Badge>
          </div>

          <ExistenciasTable data={filteredData} />
        </CardContent>
      </Card>
    </AuthenticatedLayout>
  );
}
