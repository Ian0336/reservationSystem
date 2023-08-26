import logo from "./logo.svg";
import * as React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ReservePage from "./pages/ReservePage";
import Backend from "./pages/Backend";
import { auth, db } from "./firebase/firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import Login from "./pages/Login";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { yellow } from "@mui/material/colors";
const theme = createTheme({
  palette: {
    primary: {
      main: yellow[600],
      light: yellow[300],
      dark: yellow[900],
      contrastText: "#0",
    },
  },
});

function App() {
  const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ReservePage />} />
          <Route
            path="/back"
            element={user ? <Backend /> : <Navigate to="/login" />}
          />
          <Route path="/login" element={<Login />} />
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
    </ThemeProvider>
  );
}

export default App;
