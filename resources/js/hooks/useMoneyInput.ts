import { useState } from "react";

export function useMoneyInput(initial: string = "", max?: number) {
  const [value, setValue] = useState(initial);

  const handleChange = (v: string) => {
    // Solo permite números y coma decimal
    if (/^\d*(,\d*)?$/.test(v)) {
      setValue(v);
    }
  };

  const handleBlur = () => {
    if (!value || value === "," || value === "") {
      setValue("");
      return;
    }

    let str = value;

    // Si termina en coma, quitamos coma
    if (str.endsWith(",")) str = str.slice(0, -1);

    // Convertir a número
    let num = Number(str.replace(".", "").replace(",", "."));

    if (isNaN(num)) {
      setValue("");
      return;
    }

    // Aplicar máximo (si lo envían)
    if (max !== undefined && num > max) {
      num = max;
    }

    // Reconstruir con coma
    setValue(num.toFixed(2).replace(".", ","));
  };

  const numericValue = Number(value.replace(".", "").replace(",", ".")) || 0;

  return { value, setValue, numericValue, handleChange, handleBlur };
}
