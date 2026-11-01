// components
import Header from '../../components/Header/Header';
import Filters from '../../components/Filters/Filters';
import BottomBar from '../../components/BottomBar/BottomBar';
// context
import { useGlobal } from '../../hooks/useGlobal';
import TableNpsStore from '../../components/TableNPS/TableStoreNps';
import ChartNps from '../../components/Charts/ChartNps';
import ChartYearNps from '../../components/Charts/ChartYearNps';
import FloatButton from '../../components/FloatButton/FloatButton';

const Dashboard = () => {
  // hooks data definida pelo usuário
  const { date } = useGlobal();

  return (
    <>
      <Header />
      <BottomBar />
      <Filters />
      <div className="contentRowChart">
        <div className="contentColChart">
          <ChartNps typeChart="NPS Geral" date={date} />
        </div>
        <div className="contentColChart">
          <ChartYearNps typeChart="NPS Y2Y" year={new Date().getFullYear()} />
        </div>
      </div>
      <TableNpsStore dados={date} />
      <FloatButton onClick={() => window.print()} />
    </>
  );
};

export default Dashboard;
