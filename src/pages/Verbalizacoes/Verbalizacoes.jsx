import Header from "../../components/Header/Header";
import { CustomerResp } from "../../components/TableNPS/TableNPS";
import { useCalcNps } from "../../hooks/useNPS";
import { useGlobal } from "../../hooks/useGlobal";
import BottomBar from "../../components/BottomBar/BottomBar";

const Verbalizacoes = () => {
  const { date } = useGlobal();
  const { baseVerb } = useCalcNps(date.inicio, date.fim);

  return (
    <>
      <Header />
      <BottomBar />
      <CustomerResp dados={baseVerb} />
    </>
  );
};

export default Verbalizacoes;
