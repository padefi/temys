import { useMemo, useState } from "react";

type FilterFunction<T> = (item: T) => boolean;

export const useFilter = <T>(data: T[], filterFn: FilterFunction<T>): T[] => {
  const [filteredData, setFilteredData] = useState<T[]>(data);

  // Recalculate filtered data only when 'data' or 'filterFn' changes
  useMemo(() => {
    if (filterFn) {
      setFilteredData(data.filter(filterFn));
    } else {
      setFilteredData(data); // If no filter function, return original data
    }
  }, [data, filterFn]);

  return filteredData;
}