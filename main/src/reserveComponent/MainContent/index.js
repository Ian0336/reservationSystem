import * as React from "react";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Fab from "@mui/material/Fab";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
const MainContent = () => {
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <>
      {[...Array(30)].map((_, idx) => (
        <AccordionItem
          expanded={expanded}
          handleChange={handleChange}
          idx={idx}
        />
      ))}
    </>
  );
};
const AccordionItem = ({ expanded, handleChange, idx }) => {
  return (
    <Accordion
      expanded={expanded === `panel${idx}`}
      onChange={handleChange(`panel${idx}`)}
      disabled={idx === 0 ? true : false}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`panel${idx}bh-content`}
        id={`panel${idx}bh-header`}
      >
        <Typography sx={{ width: "70%", flexShrink: 0 }}>
          {/* let KeyboardDoubleArrowRightIcon move down a little bit */}
          2011-03-04{" "}
          <KeyboardDoubleArrowRightIcon
            fontSize="small"
            style={{
              position: "relative",
              top: "5px",
            }}
          />
          11:00~12:00
        </Typography>
        <Typography color="text.secondary">11/32</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit
          amet egestas eros, vitae egestas augue. Duis vel est augue.
        </Typography>
        <Typography>
          {/* 把Fab放在右下角 */}
          <Fab
            variant="extended"
            size="medium"
            color="primary"
            style={{ marginTop: "10px" }}
            disabled={idx % 2 === 0 ? true : false}
          >
            {idx % 2 === 0 ? "名額已滿" : "報名收驚"}
          </Fab>
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};
export default MainContent;
