import { PageProps as InertiaPageProps } from "@inertiajs/core";
import { Partida } from "./Partida";

export type PartidaPageProps = InertiaPageProps & {
    partidas: {
        data: Partida[];
    };
    numero: number;
    fecha: string;
};
