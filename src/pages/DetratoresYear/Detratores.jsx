import { useLocation } from "react-router-dom";
import BottomBar from "../../components/BottomBar/BottomBar";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Header from "../../components/Header/Header";
import TableDetratores from "../../components/TableNPS/TableDetratores";
import Title from "../../components/Title/Title";

const DetratoresYear = () => {
  return (
    <>
      <Header />
      <BottomBar />
      <div className="contentBlock">
        <Breadcrumb pathname={useLocation().pathname} />
        <Title
          text="Detratores"
          style={{ fontSize: "var(--title-default)", width: "100%" }}
        />
        <TableDetratores />
      </div>
    </>
  );
};

export default DetratoresYear;
