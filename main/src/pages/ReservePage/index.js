import * as React from "react";
import Stack from "@mui/material/Stack";

import MainContent from "../../reserveComponent/MainContent";
import Header from "../../reserveComponent/Header";

const ReservePage = () => {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    // 將stack致中
    <Stack sx={{ width: "97%", maxWidth: "900px", margin: "auto" }}>
      <Header />
      <MainContent />
    </Stack>
  );
};

export default ReservePage;
