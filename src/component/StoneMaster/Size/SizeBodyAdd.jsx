import React from "react";
import { Box } from "@mui/material";
import IOSSwitch from "../../SwitchIOSStyle";
import MMSize from "../TextField/MMSize";
import CaratSize from "../TextField/CaratSize";
// import Shapes from "../TextField/Shapes";

const SizeBodyAdd = ({
  name,
  setName,
  code,
  setCode,
  status,
  setStatus,
  caratSize,
  setCaratSize,
  masterShapes,
  setMasterShapes,
}) => {
  const handleMMSizeChange = (value) => {
    setCode(value);
    setName(value);
  };

  return (
    <Box sx={{ width: "1395px", height: "720px", flexShrink: 0 }}>
      <Box
        sx={{
          width: "1322px",
          height: "655px",
          backgroundColor: "var(--BG-Paper, #F8F8F8)",
          borderTopLeftRadius: "5px",
          marginTop: "24px",
          marginLeft: "24px",
          padding: "32px 24px",
        }}
      >
        <MMSize
          value={code}
          onChange={(e) => handleMMSizeChange(e.target.value)}
        />
        <Box sx={{ marginTop: "24px" }}>
          <CaratSize
            value={caratSize}
            onChange={(e) => setCaratSize(e.target.value)}
          />
        </Box>
        {/* <Box sx={{ marginTop: "24px" }}>
          <Shapes
            value={masterShapes}
            onChange={(e) => setMasterShapes(e.target.value)}
          />
        </Box> */}
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
  );
};

export default SizeBodyAdd;
