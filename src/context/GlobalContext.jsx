import { useState, useEffect, createContext } from "react";
import storesList from "../data/stores_AP_Ecom.json";
import lastUpdate from "../data/lastUpdate.json";

// eslint-disable-next-line react-refresh/only-export-components
export const GlobalContext = createContext();

export function GlobalContextProvider({ children }) {
  // tipo de relatorio: loja fisica ou ecom
  const [report, setReport] = useState("ecom");

  // data e ano referencia para relatorios
  const [date, setDate] = useState(() => {
    const savedDate = localStorage.getItem("dateRange");

    if (savedDate) {
      const datas = JSON.parse(savedDate);

      return {
        inicio: datas.inicio ? new Date(datas.inicio) : null,
        fim: datas.fim ? new Date(datas.fim) : null,
        ano: datas.ano,
      };
    }

    return {
      inicio: lastUpdate.inicio ? new Date(lastUpdate.inicio) : null,

      fim: lastUpdate.fim ? new Date(lastUpdate.fim) : null,

      ano: lastUpdate.ano,
    };
  });

  useEffect(() => {
    localStorage.setItem("dateRange", JSON.stringify(date));
  }, [date]);

  // controle lista de lojas e loja selecionada
  const [stores, setStores] = useState(storesList);
  const [selectedStore, setSelectedStore] = useState({
    nroempresa: true,
    name: "Todas as lojas",
  });

  // controle filtro modalidade de entrega
  const [selectedDelivery, setSelectedDelivery] = useState({
    name: "Todas",
  });

  // controle filtro por tipo de avaliação (detrator, neutro, promotor)
  const [selectedRating, setSelectedRating] = useState({
    name: "Todas",
  });

  // controle detratores macro
  const [detrList, setDetrList] = useState([]);
  const [selectedDetr, setSelectedDetr] = useState("Todas");

  const [filter, setFilter] = useState({
    lojas: [],
    reviews: ["Promotor", "Neutro", "Detrator"],
    entrega: [],
  });

  return (
    <GlobalContext.Provider
      value={{
        date,
        setDate,
        stores,
        setStores,
        selectedStore,
        setSelectedStore,
        report,
        setReport,
        lastUpdate,
        filter,
        setFilter,
        selectedDelivery,
        setSelectedDelivery,
        selectedRating,
        setSelectedRating,
        detrList,
        setDetrList,
        selectedDetr,
        setSelectedDetr,
      }}>
      {children}
    </GlobalContext.Provider>
  );
}
