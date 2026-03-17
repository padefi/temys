import { Option } from "@/Components/SingleSelectSearchable";
import { Cuenta } from "@/types/Contabilidad/PlanCuentas";

export const cuentaToOption = (cuentas: Cuenta[]): Option[] => {
    return cuentas.map((c) => ({
        id: c.id,
        label: `${c.codigo} - ${c.descripcion}`,
        keywords: [c.codigo, c.descripcion],
    }));
};
