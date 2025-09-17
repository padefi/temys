import { useEffect, useState } from "react";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent } from "@/Components/ui/card";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import ExistenciasTable from "./ExistenciasTable";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import ChipSearch, { Chip } from "./Search";
import { ExistenciasItem } from "../../../types/Inventario";
import { HistorialMovimientoEstadistica } from "../HistorialMovimiento/HistorialMovimientoEstadistica";

type PageProps = InertiaPageProps & {
  stocks: {
    data: ExistenciasItem[];
  };
};

export default function ExistenciaManagement() {
  const [chips, setChips] = useState<Chip[]>([]);
  const { stocks } = usePage<PageProps>().props;
  const [data, setData] = useState<ExistenciasItem[]>(stocks.data);


  const filteredData = data.filter((item) => {
    if (chips.length === 0) return true;
    return chips.some((chip) =>
      item.nombre?.toLowerCase().includes(chip.value.toLowerCase())
    );
  });

  console.log(filteredData)

  return (
    <AuthenticatedLayout
      header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Existencias</h2>}
    >
      <Head title="Existencias" />

     


      <div className="mx-auto w-full p-6 space-y-6">
      <div className="flex justify-between">
        <span>Existencias</span>
        <ChipSearch onChange={setChips} />
        <span></span>
      </div>
      <Card>
        <CardContent>
          <HistorialMovimientoEstadistica data={filteredData}></HistorialMovimientoEstadistica>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
        
           {/*  <ChipSearch onChange={setChips} /> */}

            <Badge variant="secondary" className="px-3 py-1">
              {filteredData.length} productos
            </Badge>
          </div>

          <ExistenciasTable data={filteredData} />
        </CardContent>
      </Card>
      </div>

    </AuthenticatedLayout>
  );
}
