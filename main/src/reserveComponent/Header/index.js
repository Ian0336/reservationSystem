import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Slide from "@mui/material/Slide";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Logo from "../../img/logo.png";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase.js";
function HideOnScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};
const Header = () => {
  const navigate = useNavigate();
  return (
    <React.Fragment>
      <CssBaseline />
      <HideOnScroll>
        <AppBar style={{ backgroundColor: "rgba(255, 235, 59, 0.7)" }}>
          <Toolbar>
            <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
              <img
                src={Logo}
                alt={"竹崎玉旨慈后宮"}
                loading="lazy"
                style={{
                  maxWidth: "80%",
                  height: "100%",
                  margin: "auto",
                  maxHeight: "60px",
                }}
                onClick={() => {
                  signOut(auth);
                  navigate("/login");
                }}
              />
              {/* put the button on the right side
               */}
            </Stack>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
      <Container>
        {/* <Typography variant="h4" component="h4" sx={{ my: 2 }}>
          {"收驚時間及報名"}
        </Typography> */}
        <Divider sx={{ my: 2 }}>收驚時間</Divider>
      </Container>
    </React.Fragment>
  );
};

export default Header;
