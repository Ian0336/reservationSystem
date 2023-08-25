import * as React from "react";
import Stack from "@mui/material/Stack";

import MainContent from "../../backComponent/MainContent";
import Header from "../../backComponent/Header";

const Backend = () => {
  return (
    <Stack sx={{ width: "97%", maxWidth: "900px", margin: "auto" }}>
      <Header />
      <MainContent />
    </Stack>
  );
};

export default Backend;
