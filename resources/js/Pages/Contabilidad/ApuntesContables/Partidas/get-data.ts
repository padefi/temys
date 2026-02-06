import { Partida } from "@/types/Contabilidad/Asientos/Partida";
import { PageProps as InertiaPageProps } from "@inertiajs/core";
import { usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

type PageProps = InertiaPageProps & {
    partidas: {
        data: Partida[];
    };
    numero: number;
    fecha: string;
};

export default function getData() {
    const {
        partidas: { data: initialData },
        numero,
        fecha,
    } = usePage<PageProps>().props;
    const [data, setData] = useState<Partida[]>(initialData);

    useEffect(() => {
        setData(initialData);
    }, []);

    return data;
}
