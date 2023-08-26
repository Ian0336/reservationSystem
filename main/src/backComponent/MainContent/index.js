import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";
import LoadingButton from "@mui/lab/LoadingButton";
import AddIcon from "@mui/icons-material/Add";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import NativeSelect from "@mui/material/NativeSelect";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Switch from "@mui/material/Switch";
import { ref, onValue, remove, update, get, set } from "firebase/database";
import { db } from "../../firebase/firebase";
import { render } from "@testing-library/react";

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
      {/* show the events by AccordionItem */}
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
  const [deletOpen, setDeletOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
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
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel${idx}bh-content`}
        id={`panel${idx}bh-header`}
      >
        <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
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

          <Typography color="text.secondary" style={{ marginRight: "auto" }}>
            {data.people ? data.people.length : 0}/{data.limitNum}
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          {/* show the data.people */}
          {data.people
            ? data.people.map((person) => <span>{person} </span>)
            : null}
        </Typography>
        <Typography>
          {/* Stack margin*/}
          <Stack direction="row" spacing={2} style={{ marginTop: "10px" }}>
            <LoadingButton
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => setEditOpen(true)}
            >
              編輯
            </LoadingButton>
            {/* put closeItem end of the line */}
            <LoadingButton
              variant="outlined"
              color="error"
              startIcon={<CloseIcon />}
              style={{ marginLeft: "auto" }}
              onClick={() => setDeletOpen(true)}
            >
              刪除
            </LoadingButton>
          </Stack>
        </Typography>
      </AccordionDetails>
      <DeleteModel open={deletOpen} setOpen={setDeletOpen} data={data} />
      <EditModel open={editOpen} setOpen={setEditOpen} data={data} />
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
const DeleteModel = ({ open, setOpen, data }) => {
  const [loading, setLoading] = React.useState(false);

  const handleDeleteEvent = async () => {
    setLoading(true);

    const eventRef = ref(db, `events/${data.key}`);

    // 刪除事件
    await remove(eventRef)
      .then(() => {
        console.log("Event deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting event: ", error);
      });
    setLoading(false);
    setOpen(false);
  };
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
            確定要刪除
            {data.startTime.split("T")[0] + " " + data.startTime.split("T")[1]}?
          </div>
          <Stack
            direction="row"
            spacing={2}
            style={{ marginTop: "20px", marginBottom: "0px" }}
          >
            <LoadingButton
              variant="contained"
              loadingPosition="start"
              loading={loading}
              onClick={handleDeleteEvent}
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
        </Box>
      </Fade>
    </Modal>
  );
};

const EditModel = ({ open, setOpen, data }) => {
  const [startTime, setStartTime] = React.useState("");
  const [duringHour, setDuringHour] = React.useState(0);
  const [limitNum, setLimitNum] = React.useState(0);
  const [people, setPeople] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    if (data) {
      setStartTime(data.startTime);
      setDuringHour(data.duringHour);
      setLimitNum(data.limitNum);
      if (data.people) {
        const peopleArray = data.people.map((person) => ({
          name: person,
          able: true,
        }));
        setPeople(peopleArray);
      }
    }
    return () => {};
  }, [data]);

  const handleEditEvent = async () => {
    setLoading(true);
    /* people in newEvent include those people are able */
    const newEvent = {
      startTime: startTime,
      duringHour: duringHour,
      limitNum: limitNum,
      people: people
        .filter((person) => person.able)
        .map((person) => person.name),
    };

    const eventsRef = ref(db, "events/" + data.key + "/");
    await update(eventsRef, newEvent)
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
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box
          sx={styleFadeIn}
          style={{
            maxHeight: "90%",
            overflowY: "auto",
          }}
        >
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

            <List>
              {people.map((person, idx) => (
                <ListItem>
                  <ListItemText
                    id="switch-list-label-bluetooth"
                    primary={person.name}
                  />
                  <Switch
                    edge="end"
                    onChange={() => {
                      const peopleArray = [...people];
                      peopleArray[idx].able = !peopleArray[idx].able;
                      setPeople(peopleArray);
                    }}
                    checked={person.able}
                    inputProps={{
                      "aria-labelledby": "switch-list-label-bluetooth",
                    }}
                  />
                </ListItem>
              ))}
            </List>
            <Stack direction="row" spacing={2}>
              <LoadingButton
                variant="contained"
                startIcon={<AddIcon />}
                loadingPosition="start"
                loading={loading}
                onClick={handleEditEvent}
              >
                更改
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
