import { Home, Login, DashboardPage, AnimalsPage, PageNotFound, HealthPage } from "./pages/index";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/auth/login' element={<Login />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/animals" element={<AnimalsPage />} />
          <Route path="/dashboard/health" element={<HealthPage />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;