import * as React from "react";
import Stack from "@mui/material/Stack";

import MainContent from "../../reserveComponent/MainContent";
import Header from "../../reserveComponent/Header";
import "./index.css";
import Footer from "../../reserveComponent/Footer";
const ReservePage = () => {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    // 將stack致中
    <div>
      <div
        className="bgImg"
        style={{
          backgroundOpacity: "0.5",
          position: "fixed",
          width: "100%",
          height: "100%",
          zIndex: "-1",
        }}
      >
        <div
          /* make the background will fix with it */
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            height: "100vh",
          }}
        ></div>
      </div>

      <Stack
        sx={{
          width: "97%",
          maxWidth: "900px",
          margin: "auto",
        }}
      >
        <Header />
        <MainContent />
        <Footer />
      </Stack>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d228.65148415202802!2d120.54848476120588!3d23.517256884736668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346ec0182f1bf0c1%3A0xc62858936f1795de!2z5bCP56u55bSO54mb5o6SKOWYiee4o-erueW0juW6lyk!5e0!3m2!1szh-TW!2stw!4v1693041674258!5m2!1szh-TW!2stw"
        style={{
          border: "0",
          width: "100%",
          height: "450px",
          frameborder: "0",
        }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default ReservePage;
