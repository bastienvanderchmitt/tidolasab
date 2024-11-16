import { useMemo, useState } from "react";
import {
  faSort,
  faSortUp,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";

const useSorting = (initialData) => {
  const [sortConfig, setSortConfig] = useState(null);

  const sortedData = useMemo(() => {
    let sortableData = initialData ? [...initialData] : initialData;
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        // Convertir les valeurs pour le tri
        let comparison = 0;
        if (
          typeof aValue === "string" &&
          typeof bValue === "string" &&
          sortConfig.key !== "montant_paiement"
        ) {
          comparison = aValue.localeCompare(bValue);
        } else if (
          (typeof aValue === "number" && typeof bValue === "number") ||
          sortConfig.key === "montant_paiement"
        ) {
          comparison = aValue - bValue;
        } else if (sortConfig.key === "date_paiement") {
          // Pour les dates, convertir en timestamp
          comparison = new Date(aValue) - new Date(bValue);
        }

        return sortConfig.direction === "ascending" ? comparison : -comparison;
      });
    }
    return sortableData;
  }, [initialData, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig?.key === key && sortConfig?.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig?.key === key) {
      return sortConfig.direction === "ascending" ? faSortUp : faSortDown;
    }
    return faSort;
  };

  return {
    sortedData,
    requestSort,
    getSortIcon,
  };
};

export default useSorting;
