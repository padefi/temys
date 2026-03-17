import { useTypedPage } from "@/hooks/useTypedPage";
import { PartidaPageProps } from "@/types/Contabilidad/Asientos";

export function usePartidasData() {
    const {
        partidas: { data },
    } = useTypedPage<PartidaPageProps>().props;

    return { partidas: data };
}
