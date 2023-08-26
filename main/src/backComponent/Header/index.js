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
import LoadingButton from "@mui/lab/LoadingButton";
import RecyclingIcon from "@mui/icons-material/Recycling";
import Divider from "@mui/material/Divider";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import {
  ref,
  onValue,
  push,
  set,
  get,
  update,
  remove,
} from "firebase/database";
import { db } from "../../firebase/firebase";
import Logo from "../../img/logo.png";
import { useNavigate } from "react-router-dom";
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
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const handleClear = async () => {
    /* delete the event in db which startTime date is less than now */
    const now = new Date();
    setLoading(true);
    /* get events */
    const eventsRef = ref(db, "events");
    const eventsSnapshot = await get(eventsRef);
    const eventsData = eventsSnapshot.val();
    const events = eventsData
      ? Object.entries(eventsData).map(([key, value]) => ({ key, ...value }))
      : [];

    events.forEach(async (event) => {
      const eventDate = new Date(event.startTime);
      setLoading(true);
      if (eventDate < now) {
        const historyRef = ref(
          db,
          `history/${event.startTime.split("-")[0]}-${
            event.startTime.split("-")[1]
          }`
        );

        const historySnapshot = await get(historyRef);
        if (event.people) {
          if (historySnapshot.exists()) {
            const historyData = historySnapshot.val();
            const length = historyData.num ? historyData.num : 0;
            await update(historyRef, { num: length + event.people.length });
          } else {
            await set(historyRef, { num: event.people.length });
          }
        }

        const eventsRef = ref(db, "events/" + event.key + "/");
        await remove(eventsRef);
      }
      setLoading(false);
    });
    setLoading(false);
  };
  return (
    <React.Fragment>
      <CssBaseline />
      <HideOnScroll>
        <AppBar>
          <Toolbar>
            <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
              <img
                src={Logo}
                alt={"竹崎玉旨慈后宮"}
                loading="lazy"
                style={{
                  maxWidth: "65%",
                  height: "100%",
                  marginRight: "auto",
                  marginTop: "auto",
                  marginBottom: "auto",
                  maxHeight: "60px",
                }}
              />
              {/* put the button on the right side
               */}
              <Button
                variant="contained"
                endIcon={<AddIcon />}
                style={{
                  marginLeft: "auto",
                  height: "100%",
                  marginTop: "auto",
                  marginBottom: "auto",
                }}
                onClick={() => setOpen(true)}
              >
                增加
              </Button>
            </Stack>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar />

      <Container>
        {/* <Typography variant="h4" component="h4" sx={{ my: 2 }}>
          {"收驚時間及報名"}
        </Typography> */}
        <Stack spacing={2} sx={{ my: 2 }}>
          <Button
            sx={{ my: 2 }}
            variant="outlined"
            endIcon={<RecyclingIcon />}
            color="error"
            onClick={handleClear}
          >
            除去已過日期
          </Button>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <Divider sx={{ my: 1 }}>收驚時間</Divider>
        </Stack>
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
  boxShadow: 24,
  p: 4,
};
const inputFieldStyle = {
  width: "100%",
  marginBottom: "10px",
};

const ariaLabel = { "aria-label": "description" };
const AddModal = ({ open, setOpen }) => {
  const [events, setEvents] = React.useState([]);
  const [startTime, setStartTime] = React.useState("");
  const [duringHour, setDuringHour] = React.useState(0);
  const [limitNum, setLimitNum] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    // 使用 Firebase 來讀取 "events" 路徑的資料
    const eventsRef = ref(db, "events");

    const unsubscribe = onValue(eventsRef, (snapshot) => {
      // 將讀取到的資料轉換為陣列並設定到狀態中
      const eventData = snapshot.val();
      const eventArray = eventData ? Object.values(eventData) : [];
      eventArray.sort((a, b) => {
        return new Date(a.startTime) - new Date(b.startTime);
      });
      setEvents(eventArray);
      if (eventArray.length > 0) {
        /* set the last events */
        setStartTime(eventArray[eventArray.length - 1].startTime);
        setDuringHour(eventArray[eventArray.length - 1].duringHour);
        setLimitNum(eventArray[eventArray.length - 1].limitNum);
      } else {
        setStartTime(new Date().toISOString().slice(0, 16));
        setDuringHour(2);
        setLimitNum(10);
      }
    });

    // 記得在組件解除掛載時解除事件監聽
    return () => {
      unsubscribe();
    };
  }, []);

  const handleAddEvent = async () => {
    setLoading(true);
    const newEvent = {
      startTime: startTime,
      duringHour: duringHour,
      limitNum: limitNum,
      people: [],
    };
    const eventsRef = ref(db, "events");
    await push(eventsRef, newEvent)
      .then(() => {
        console.log("Event added successfully");
      })
      .catch((error) => {
        console.error("Error adding event: ", error);
      });
    setLoading(false);
    setOpen(false);
  };
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
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
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />

            <InputLabel id="demo-simple-select-label">
              {" "}
              持續時間(小時)
            </InputLabel>
            <NativeSelect
              inputProps={{
                name: "age",
                id: "uncontrolled-native",
              }}
              style={inputFieldStyle}
              value={duringHour}
              onChange={(e) => setDuringHour(e.target.value)}
            >
              {/* option from 1 to 6 */}
              {[...Array(6)].map((_, idx) => (
                <option value={idx + 1}>{idx + 1}</option>
              ))}
            </NativeSelect>
            <InputLabel id="demo-simple-select-label"> 人數限制</InputLabel>
            <NativeSelect
              value={limitNum}
              onChange={(e) => setLimitNum(e.target.value)}
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
              <LoadingButton
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddEvent}
                loadingPosition="start"
                loading={loading}
              >
                確認
              </LoadingButton>
              {/* put closeItem end of the line */}
              <LoadingButton
                variant="outlined"
                startIcon={<CloseIcon />}
                style={{ marginLeft: "auto" }}
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                取消
              </LoadingButton>
            </Stack>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};
export default Header;
