// prime react
import { BrowserRouter, Route, Routes } from "react-router-dom";

// páginas
import Verbalizacoes from "./pages/Verbalizacoes/Verbalizacoes.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop.jsx";

function App() {
  return (
    <BrowserRouter basename="/nps">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/respostas" element={<Verbalizacoes />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
