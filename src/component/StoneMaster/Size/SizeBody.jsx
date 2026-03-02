import React from "react";
import { Box, Typography } from "@mui/material";
import IOSSwitch from "../../SwitchIOSStyle";
import MMSize from "../TextField/Disable/MMSize";
import CaratSize from "../TextField/Disable/CaratSize";
// import Shapes from "../TextField/Disable/Shapes";

const SizeBody = ({
  selectedData,
  isEditing,
  onCodeChange,
  onCaratSizeChange,
  onStatusChange,
  onShapeChange,
}) => {
  const handleStatusChange = (event) => {
    onStatusChange(event.target.checked);
  };
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
            width: "1372px",
            height: "655px",
            backgroundColor: "var(--BG-Paper, #F8F8F8)",
            borderTopLeftRadius: "5px",
            marginTop: "24px",
            marginLeft: "24px",
            padding: "32px 24px",
          }}
        >
          <MMSize
            selectedData={selectedData}
            isEditing={isEditing}
            onCodeChange={onCodeChange}
          />
          <Box sx={{ marginTop: "24px" }}>
            <CaratSize
              selectedData={selectedData}
              isEditing={isEditing}
              onCaratSizeChange={onCaratSizeChange}
            />
          </Box>
          {/* <Box sx={{ marginTop: "24px" }}>
            <Shapes
              selectedData={selectedData}
              isEditing={isEditing}
              onShapeChange={onShapeChange}
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
              checked={selectedData?.master_status === "active"}
              onChange={handleStatusChange}
              disabled={!isEditing}
              label="Active"
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default SizeBody;
