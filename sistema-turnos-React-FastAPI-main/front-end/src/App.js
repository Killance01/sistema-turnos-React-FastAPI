import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import ClientePage from "./pages/ClientePage";
import TrabajadorPage from "./pages/TrabajadorPage";
import AdminPage from "./pages/AdminPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/cliente" element={<ClientePage />} />
        <Route path="/trabajador" element={<TrabajadorPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;

