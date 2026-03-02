import React from "react";
import { Box } from "@mui/material";
import Name from "../TextField/Name";
import Code from "../TextField/Code";
import IOSSwitch from "../../SwitchIOSStyle";

const ClarityBodyAdd = ({name,
  setName,
  code,
  setCode,
  status,
  setStatus,}) => {

 
  return (
    <>
      <Box
        sx={{
          width: "1395px",
          height: "720px",
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            width: "1322px",
            height: "655px",
            backgroundColor: "var(--BG-Paper, #F8F8F8)",
            borderTopLeftRadius: "5px",
            marginTop: "24px",
            marginLeft: "24px",
            padding: "32px 24px"
          }}
        >
          <Code value={code} onChange={(e) => setCode(e.target.value)}/>
          <Box sx={{ marginTop: "24px" }}>
            <Name value={name} onChange={(e) => setName(e.target.value)}/>
          </Box>
          
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              marginTop: "24px",
            }}
          >
            <IOSSwitch
              checked={status}
              onChange={(e) => setStatus(e.target.checked)}
              label="Active"
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ClarityBodyAdd;
