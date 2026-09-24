import BottomBar from "../../components/BottomBar/BottomBar";
import { NPSReviews, Operation } from "../../components/Charts/NPSReviews";
import Filters from "../../components/Filters/Filters";
import Header from "../../components/Header/Header";
import { TableNPS } from "../../components/TableNPS/TableNPS";
import Title from "../../components/Title/Title";
import { useGlobal } from "../../hooks/useGlobal";
import { useCalcNps, useY2Y, useCorteSubst } from "../../hooks/useNPS";
import SelectFilter from "../../components/SelectFilter/SelectFilter";

const Dashboard = () => {
  // hooks data definida pelo usuário
  const {
    date,
    reportCortSub,
    setReportCortSub,
    filterCortSub,
    storeCortSub,
    setStoreCortSub,
  } = useGlobal();

  // hook year to year para gráfico geral
  const { currentYear, currYear, prevYear } = useY2Y();
  const { baseCurYear, storesCutReplace } = useCorteSubst(
    reportCortSub,
    storeCortSub,
  );

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
            date={date}
          />
        </div>
        <div className="contentColChart">
          <NPSReviews
            primaryData={currYear}
            secondaryData={prevYear}
            typeChart="Y2Y"
            summary=""
            year={currentYear}
            date={date}
          />
        </div>
      </div>
      <TableNPS dados={storesTableNPS} />
      {/* corte x substituicao */}
      <div
        id="operation"
        className="contentBlock"
        style={{ paddingBottom: "0" }}>
        <Title
          text="Operação"
          style={{ fontSize: "var(--title-default)", width: "100%" }}
        />
      </div>
      <div className="contentRowChart">
        <div className="contentColChart">
          <Operation
            primaryData={storesCutReplace}
            typeChart="stores"
            year={currentYear}
          />
        </div>
      </div>
      <div className="contentRowChart">
        <div className="contentColChart">
          <Operation
            primaryData={baseCurYear}
            typeChart="Y2Y"
            year={currentYear}
          />
          <div className="filterRow">
            <div>
              <p className="textDefault">Filtrar por loja:</p>
              <SelectFilter
                options={filterCortSub}
                valueCurr={storeCortSub || "Todas as lojas"}
                changeValue={(event) => setStoreCortSub(event)}
              />
            </div>
            {storeCortSub.name !== "Todas as lojas" && (
              <p className="filterFeedback textSmall">
                Dados filtrados pela loja: <b>{storeCortSub.name}</b>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
