import { useState, useEffect, createContext, useMemo } from "react";
import ecom_AP from "../data/dados_AP_Ecom.json";
import storesList from "../data/stores_AP_Ecom.json";
import corteSubst_AP from "../data/corteSubst";
import lastUpdate from "../data/lastUpdate.json";

// eslint-disable-next-line react-refresh/only-export-components
export const GlobalContext = createContext();

export function GlobalContextProvider({ children }) {
  // BOTÃO TROCA DE RELATORIO ALTERA O ESTADO DOS COMPONENTES ABAIXO
  // --------------------------------------------------------------------------
  const [typeBusiness, setTypeBusiness] = useState("Ecom");
  // Controle de exibição das respostas
  const [data, setData] = useState(ecom_AP);

  // base com os dados de cortexsubstituicao
  const [reportCortSub, setReportCortSub] = useState(corteSubst_AP);
  const [storeCortSub, setStoreCortSub] = useState({ name: "Todas as lojas" });

  const filterCortSub = useMemo(
    () =>
      ["Todas as lojas", ...new Set(reportCortSub.map((e) => e.loja))].map(
        (loja) => ({ name: loja }),
      ),
    [reportCortSub],
  );

  // Lista de lojas
  // controle lista de lojas e loja selecionada
  const [stores, setStores] = useState(storesList);
  // -------------------------------------------------------------------------

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

  // filtros
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

  const [page, setPage] = useState({
    inicio: 0,
    fim: 10,
    total: 0,
  });

  return (
    <GlobalContext.Provider
      value={{
        data,
        setData,
        typeBusiness,
        setTypeBusiness,
        reportCortSub,
        setReportCortSub,
        date,
        setDate,
        stores,
        setStores,
        selectedStore,
        setSelectedStore,
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
        filterCortSub,
        storeCortSub,
        setStoreCortSub,
        page,
        setPage,
      }}>
      {children}
    </GlobalContext.Provider>
  );
}
