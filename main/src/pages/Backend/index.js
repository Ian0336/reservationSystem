import * as React from "react";
import Stack from "@mui/material/Stack";

import MainContent from "../../backComponent/MainContent";
import Header from "../../backComponent/Header";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../../firebase/firebase.js";
const Backend = () => {
  React.useEffect(() => {
    return () => {
      /* sign out */
      /* signOut(auth); */
    };
  }, []);
  return (
    <Stack sx={{ width: "97%", maxWidth: "900px", margin: "auto" }}>
      <Header />
      <MainContent />
    </Stack>
  );
};

export default Backend;
