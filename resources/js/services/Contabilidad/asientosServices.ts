import { Asiento } from "@/types/Contabilidad/Asientos";
import axios from "axios";

export const asientosService = {
    save: async (asiento: Asiento) => {
        const isUpdate = !!asiento.id;
        const url = isUpdate
            ? `/contabilidad/asiento/${asiento.id}`
            : "/contabilidad/asientos";

        const response = await axios({
            method: isUpdate ? "put" : "post",
            url: url,
            data: asiento,
        });

        return response.data;
    },
};
