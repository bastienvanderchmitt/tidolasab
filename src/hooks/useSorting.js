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

        // Vérifier si les valeurs peuvent être converties en nombres
        const aNum = parseFloat(aValue);
        const bNum = parseFloat(bValue);

        if (
          !isNaN(aNum) &&
          !isNaN(bNum) &&
          sortConfig.key !== "date_paiement" &&
          sortConfig.key !== "date_arrivee" &&
          sortConfig.key !== "date_depart"
        ) {
          // Si les deux valeurs sont des nombres (ou des chaînes qui peuvent être converties en nombres)
          comparison = aNum - bNum;
          // } else if (sortConfig.key === "date_paiement") {
          //   // Pour les dates, convertir en timestamp
          //   comparison = new Date(aValue) - new Date(bValue);
        } else {
          // Si ce sont des chaînes de caractères
          comparison = aValue?.localeCompare(bValue);
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
