import BottomBar from "../../components/BottomBar/BottomBar";
import NPSReviews from "../../components/Charts/NPSReviews";
import Filters from "../../components/Filters/Filters";
import Header from "../../components/Header/Header";
import { TableNPS } from "../../components/TableNPS/TableNPS";
import { useGlobal } from "../../hooks/useGlobal";
import { useCalcNps, useY2Y } from "../../hooks/useNPS";

const Dashboard = () => {
  // hook year to year para gráfico geral
  const { currentYear, currYear, compYear } = useY2Y(new Date().getFullYear());

  // hooks data definida pelo usuário
  const { date } = useGlobal();

  // controle da criação da base exibida no dashboard
  const { notas, summary, notasComp, storesTableNPS } = useCalcNps(
    date.inicio,
    date.fim,
  );

  return (
    <>
      <Header />
      <BottomBar />
      <Filters />
      <div className="contentRowChart">
        <div className="contentColChart">
          <NPSReviews
            primaryData={notas}
            secondaryData={notasComp}
            typeChart="scale-nps"
            summary={summary}
          />
        </div>
        <div className="contentColChart">
          <NPSReviews
            primaryData={currYear}
            secondaryData={compYear}
            typeChart="Y2Y"
            summary=""
            year={currentYear}
          />
        </div>
      </div>
      <TableNPS dados={storesTableNPS} />
    </>
  );
};

export default Dashboard;
