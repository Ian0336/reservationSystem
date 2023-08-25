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
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";

import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import NativeSelect from "@mui/material/NativeSelect";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";
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
  const [open, setOpen] = React.useState(false);
  return (
    <React.Fragment>
      <CssBaseline />
      <HideOnScroll>
        <AppBar>
          <Toolbar>
            <Typography variant="h6" component="div" className="font-1">
              竹崎玉旨慈后宮
            </Typography>
            {/* put the button on the right side
             */}
            <Button
              variant="contained"
              endIcon={<AddIcon />}
              style={{ marginLeft: "auto" }}
              onClick={() => setOpen(true)}
            >
              增加
            </Button>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
      <Container>
        <Box sx={{ my: 2 }}>{"請大家慢慢選擇，謝謝"}</Box>
      </Container>
      <AddModal open={open} setOpen={setOpen} />
    </React.Fragment>
  );
};

const styleFadeIn = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  maxWidth: 900,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const inputFieldStyle = {
  width: "100%",
  marginBottom: "10px",
};

const ariaLabel = { "aria-label": "description" };
const AddModal = ({ open, setOpen }) => {
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={() => setOpen(false)}
      closeAfterTransition
      /* slots={{ backdrop: Backdrop }} */
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={styleFadeIn}>
          <div>
            {/* date input */}
            <InputLabel htmlFor="input-with-icon-adornment">
              開始時間
            </InputLabel>

            <Input
              inputProps={ariaLabel}
              type="datetime-local"
              style={inputFieldStyle}
              defaultValue={new Date().toISOString().slice(0, 16)}
            />

            <InputLabel id="demo-simple-select-label">
              {" "}
              持續時間(小時)
            </InputLabel>
            <NativeSelect
              defaultValue={30}
              inputProps={{
                name: "age",
                id: "uncontrolled-native",
              }}
              style={inputFieldStyle}
            >
              {/* option from 1 to 6 */}
              {[...Array(6)].map((_, idx) => (
                <option value={idx + 1}>{idx + 1}</option>
              ))}
            </NativeSelect>
            <InputLabel id="demo-simple-select-label"> 人數限制</InputLabel>
            <NativeSelect
              defaultValue={30}
              inputProps={{
                name: "age",
                id: "uncontrolled-native",
              }}
              style={inputFieldStyle}
            >
              {/* option from 1 to 6 */}
              {[...Array(30)].map((_, idx) => (
                <option value={idx + 1}>{idx + 1}</option>
              ))}
            </NativeSelect>

            <Stack direction="row" spacing={2}>
              <Button variant="contained" startIcon={<AddIcon />}>
                確認
              </Button>
              {/* put closeItem end of the line */}
              <Button
                variant="outlined"
                startIcon={<CloseIcon />}
                style={{ marginLeft: "auto" }}
                onClick={() => setOpen(false)}
              >
                取消
              </Button>
            </Stack>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};
export default Header;
