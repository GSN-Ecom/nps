import { useLocation } from 'react-router-dom';
import BottomBar from '../../components/BottomBar/BottomBar';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Header from '../../components/Header/Header';
import Title from '../../components/Title/Title';
import { TableDetractorsYear } from '../../components/TableNPS/TableDetractorsYear';
import { useGlobal } from '../../hooks/useGlobal';

const DetratoresYear = () => {
  const { typeBusiness } = useGlobal();
  return (
    <>
      <Header />
      <BottomBar />
      <div className="contentBlock">
        <Breadcrumb pathname={useLocation().pathname} />
        <Title
          text={`${typeBusiness === 'Ecom' ? 'Detratores Ecom' : 'Detratores Loja física'}`}
          style={{ fontSize: 'var(--title-default)', width: '100%' }}
        />
        <TableDetractorsYear />
      </div>
    </>
  );
};

export default DetratoresYear;
