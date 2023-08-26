import * as React from "react";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Stack from "@mui/material/Stack";
import LoadingButton from "@mui/lab/LoadingButton";
import AddBoxIcon from "@mui/icons-material/AddBox";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import { ref, onValue, update, set } from "firebase/database";
import { db } from "../../firebase/firebase";

import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
const MainContent = () => {
  const [expanded, setExpanded] = React.useState(false);
  const [events, setEvents] = React.useState([]);
  const [loadDate, setLoadDate] = React.useState(false);

  React.useEffect(() => {
    // 使用 Firebase 來讀取 "events" 路徑的資料
    const eventsRef = ref(db, "events");
    setLoadDate(true);
    const unsubscribe = onValue(eventsRef, (snapshot) => {
      // 將讀取到的資料轉換為陣列並設定到狀態中

      const eventData = snapshot.val();

      const eventArray = eventData
        ? Object.entries(eventData).map(([key, value]) => ({ key, ...value }))
        : [];
      eventArray.sort((a, b) => {
        return new Date(a.startTime) - new Date(b.startTime);
      });
      /* 將eventArray * 10 */
      /* const eventArrayTenTimes = [];
      for (let i = 0; i < 10; i++) {
        eventArrayTenTimes.push(...eventArray);
      } */
      setEvents(eventArray);
      setLoadDate(false);
    });

    // 記得在組件解除掛載時解除事件監聽
    return () => {
      unsubscribe();
    };
  }, []);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <>
      {/* show the events ten times by AccordionItem */}

      {events.map((event, idx) => (
        <AccordionItem
          expanded={expanded}
          handleChange={handleChange}
          idx={idx}
          data={event}
        />
      ))}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadDate}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

const AccordionItem = ({ expanded, handleChange, idx, data }) => {
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState({ startTime: "", endTime: "" });

  const [joinOpen, setJoinOpen] = React.useState(false);
  React.useEffect(() => {
    /*  set the date */
    setDate(data.startTime.split("T")[0]);
    /*  set the date */

    /* set the time */

    const originalStartTime = new Date(data.startTime);
    const startTime = originalStartTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const newEndTime = new Date(
      originalStartTime.getTime() + data.duringHour * 60 * 60 * 1000
    );

    const endTime = newEndTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    setTime({ startTime, endTime });
    /* set the time */

    return () => {};
  }, [data]);
  return (
    <Accordion
      expanded={expanded === `panel${idx}`}
      onChange={handleChange(`panel${idx}`)}
      style={{
        marginBottom: "6px",
        backgroundColor: "rgba(255, 255, 255, 0.6)",
      }}
      /* date of the event before now  then disable*/
      disabled={new Date(data.startTime) < new Date()}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel${idx}bh-content`}
        id={`panel${idx}bh-header`}
      >
        <Stack direction="row" spacing={2}>
          <Typography sx={{ flexShrink: 0 }}>
            {/*show date(data.startTime is 2011-11-11T11:00:00) , slice the string before "T*/}
            {date}
            <KeyboardDoubleArrowRightIcon
              fontSize="small"
              style={{
                position: "relative",
                top: "5px",
              }}
            />
            {time.startTime}~{time.endTime}
          </Typography>

          <Typography color="text.secondary">
            {data.people ? data.people.length : 0}/{data.limitNum}
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          {/* show the data.people and every name's 2rd need to be "*" */}
          {data.people
            ? data.people.map((person) => (
                <>
                  <span>{person.replace(/.(?=.{1})/g, "*")}</span>
                  <span
                    style={{
                      fontSize: "20px",
                      color: "gray",
                      marginLeft: "5px",
                    }}
                  >
                    |
                  </span>
                </>
              ))
            : null}
        </Typography>
        <Typography>
          {/* Stack margin*/}
          <Stack direction="row" spacing={2} style={{ marginTop: "10px" }}>
            <LoadingButton
              variant="contained"
              startIcon={<AddBoxIcon />}
              onClick={() => setJoinOpen(true)}
              disabled={
                data.people ? data.people.length >= data.limitNum : false
              }
            >
              報名收驚
            </LoadingButton>
          </Stack>
        </Typography>
      </AccordionDetails>
      <JoinModel open={joinOpen} setOpen={setJoinOpen} data={data} />
    </Accordion>
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
const JoinModel = ({ open, setOpen, data }) => {
  const [name, setName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const handleJoin = async () => {
    setLoading(true);
    /* update the array of people in events/data.key */
    const peopleRef = ref(db, "events/" + data.key);
    const newPeople = data.people ? [...data.people, name] : [name];
    const peopleSnapshot = await update(peopleRef, {
      people: newPeople,
    });
    setOpen(false);
    setName("");
    setLoading(false);
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
      onClose={() => {
        if (!loading) {
          setOpen(false);
        }
      }}
    >
      <Fade in={open}>
        <Box sx={styleFadeIn}>
          <div>
            {/* date input */}
            {/* <InputLabel htmlFor="input-with-icon-adornment">
              輸入姓名
            </InputLabel>

            <Input inputProps={ariaLabel} type="text" style={inputFieldStyle} /> */}
            <TextField
              id="outlined-basic"
              label="輸入姓名"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ my: 2 }}
              style={inputFieldStyle}
              inputProps={ariaLabel}
            />
            <Stack direction="row" spacing={2}>
              <LoadingButton
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleJoin}
                loadingPosition="start"
                loading={loading}
              >
                報名
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
export default MainContent;
