import { useEffect, useState } from "react";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent } from "@/Components/ui/card";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import ExistenciasTable from "./ExistenciasTable";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import ChipSearch, { Chip } from "./Search";
import { ExistenciasItem } from "../../../types/Inventario";
import { ExistenciasEstadistica } from "./ExistenciasEstadistica";
import { log } from "console";
import { links } from "@/types/links";
import { meta } from "@/types/meta";
import { Download, Settings2 } from "lucide-react";
import { Button } from "@/Components/ui/button";

type PageProps = InertiaPageProps & {
  stocks: {
    data: ExistenciasItem[];
    links: links;
    meta: meta
  };
};

export default function ExistenciaManagement() {
  const [chips, setChips] = useState<Chip[]>([]);
  const { stocks } = usePage<PageProps>().props;
  const [data, setData] = useState<ExistenciasItem[]>(stocks.data);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  console.log(stocks);


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

      <div className="mx-auto w-full p-6 space-y-6">
        <div className="flex justify-between">
          <span className="text-xl font-light">Existencias</span>
          <ChipSearch onChange={setChips} />
          <Button variant="secondary" size="icon" className="size-8 bg-slate-200"><Download className="text-slate-900" /></Button>
        </div>
        <Card>
          <CardContent>
            <ExistenciasEstadistica data={filteredData}></ExistenciasEstadistica>
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

            <ExistenciasTable data={filteredData} links={stocks.links} meta={stocks.meta} editingIndex={editingIndex} setEditingIndex={setEditingIndex} />
          </CardContent>
        </Card>
      </div>

    </AuthenticatedLayout>
  );
}
