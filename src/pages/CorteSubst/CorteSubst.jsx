import { useLocation } from "react-router-dom";
import BottomBar from "../../components/BottomBar/BottomBar";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Header from "../../components/Header/Header";
import Title from "../../components/Title/Title";
import SelectFilter from "../../components/SelectFilter/SelectFilter";
import { Operation } from "../../components/Charts/NPSReviews";
import { useGlobal } from "../../hooks/useGlobal";
import { useY2Y, useCorteSubst } from "../../hooks/useNPS";

const CorteSubst = () => {
  const { reportCortSub, filterCortSub, storeCortSub, setStoreCortSub } =
    useGlobal();

  // hook year to year para gráfico geral
  const { currentYear } = useY2Y();
  const { baseCurYear, storesCutReplace } = useCorteSubst(
    reportCortSub,
    storeCortSub,
  );
  return (
    <>
      <Header />
      <BottomBar />
      {/* corte x substituicao */}
      <div className="contentBlock" style={{ paddingBottom: "0" }}>
        <Breadcrumb pathname={useLocation().pathname} />
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
        <div className="contentColChart contentColCorteSubst">
          <div className="filterRow">
            <div className="slotStoreFilter">
              <p className="textDefault">Filtrar por loja:</p>
              <SelectFilter
                options={filterCortSub}
                valueCurr={storeCortSub || "Todas as lojas"}
                changeValue={(event) => setStoreCortSub(event)}
              />
            </div>
          </div>
          <Operation
            primaryData={baseCurYear}
            typeChart="Y2Y"
            year={currentYear}
          />
        </div>
      </div>
    </>
  );
};

export default CorteSubst;
