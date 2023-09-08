import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

const Footer = () => {
  return (
    <Container
      maxWidth="md"
      component="footer"
      sx={{
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        mt: 8,
        py: [3, 6],
      }}
    >
      <Grid container spacing={1} justifyContent="space-evenly">
        <Grid item xs={12} sm={12}>
          <Typography variant="h6" color="text.primary" gutterBottom>
            聯絡我們
          </Typography>

          <ul>
            Facebook:
            <Link
              href="https://www.facebook.com/profile.php?id=100093639774792"
              variant="subtitle1"
              color="blue"
              underline="none"
            >
              {" "}
              竹崎玉旨慈后宮
            </Link>
          </ul>
          <ul>
            地址: {"  "}
            <Link
              variant="subtitle1"
              color="blue"
              underline="none"
              component="button"
              onClick={() => {
                window.scrollTo({
                  top: document.documentElement.scrollHeight,
                  behavior: "smooth",
                });
              }}
            >
              {"  "}
              嘉義縣竹崎鄉和平村田寮95-1號
            </Link>
          </ul>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Footer;
