import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ReservePage from "./pages/ReservePage";
import Backend from "./pages/Backend";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ReservePage />} />
        <Route path="/back" element={<Backend />} />
        {/* <Route
          path="/back"
          element={user ? <Backend /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/website" element={<Website />} />
        <Route
          path="/home"
          element={
            user ? (
              <Home user={user} data={data} name={name} />
            ) : (
              <Navigate to="/login" />
            )
          }
        /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
