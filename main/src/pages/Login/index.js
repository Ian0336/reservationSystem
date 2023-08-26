import * as React from "react";
import Stack from "@mui/material/Stack";
import PropTypes from "prop-types";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import TextField from "@mui/material/TextField";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Slide from "@mui/material/Slide";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";

import Modal from "@mui/material/Modal";
import InputLabel from "@mui/material/InputLabel";
import img from "../../img/BgImg.jpg";
import { set } from "firebase/database";
import { auth } from "../../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { LoadingButton } from "@mui/lab";
import { useNavigate } from "react-router-dom";
import Logo from "../../img/logo.png";
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
const Login = () => {
  return (
    <Stack sx={{ width: "97%", maxWidth: "900px", margin: "auto" }}>
      <Header />
    </Stack>
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
  boxShadow: 24,
  p: 4,
};
const inputFieldStyle = {
  width: "100%",
  marginBottom: "10px",
};

const ariaLabel = { "aria-label": "description" };
const Header = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [submitLoading, setSubmitLoading] = React.useState(false);
  const [errorPrompt, setErrorPrompt] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    setSubmitLoading(true);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )
      .then((userCredential) => {
        // 用戶登入成功
        setEmail("");
        setPassword("");
        setSubmitLoading(false);
        navigate("/back");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setErrorMsg(error.message);
        setErrorPrompt(true);
        setSubmitLoading(false);
        if (
          error.code === "auth/invalid-email" ||
          error.code === "auth/user-not-found"
        ) {
          setEmail("");
        }

        // 如果密碼有問題，清空 password 狀態
        if (error.code === "auth/wrong-password") {
          setPassword("");
        }
        // 處理錯誤
      });
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <HideOnScroll>
        <AppBar>
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
                  navigate("/");
                }}
              />
              {/* put the button on the right side
               */}
            </Stack>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />
      <Stack>
        <Divider sx={{ my: 2 }}>登入</Divider>

        <Card sx={{ maxWidth: 700, margin: "auto", width: "95%", my: 3 }}>
          <CardMedia
            sx={{ height: 140, opacity: 0.7 }}
            image={img}
            title="bgImg"
          />
          <CardContent>
            <Stack spacing={2}>
              {/* date input */}

              <TextField
                id="outlined-basic"
                label="帳號"
                variant="outlined"
                inputProps={ariaLabel}
                type="text"
                style={inputFieldStyle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <FormControl
                sx={{ m: 1, width: "25ch" }}
                variant="outlined"
                style={inputFieldStyle}
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  密碼
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  label="密碼"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        onMouseDown={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <LoadingButton
                variant="outlined"
                sx={{ fontSize: "20px" }}
                onClick={handleLogin}
                loading={submitLoading}
              >
                登入
              </LoadingButton>
            </Stack>
          </CardContent>
          <CardActions></CardActions>
        </Card>

        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={errorPrompt}
          onClose={() => {
            setErrorPrompt(false);
          }}
          closeAfterTransition
          /* slots={{ backdrop: Backdrop }} */
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={errorPrompt}>
            <Box sx={styleFadeIn}>
              <div>{errorMsg}</div>
              <Stack
                direction="row"
                style={{ marginTop: "20px", marginBottom: "0px" }}
              >
                <LoadingButton
                  variant="contained"
                  loadingPosition="start"
                  onClick={() => {
                    setErrorMsg("");
                    setErrorPrompt(false);
                  }}
                  sx={{ marginLeft: "auto" }}
                >
                  確認
                </LoadingButton>
              </Stack>
            </Box>
          </Fade>
        </Modal>
      </Stack>
    </React.Fragment>
  );
};
export default Login;
