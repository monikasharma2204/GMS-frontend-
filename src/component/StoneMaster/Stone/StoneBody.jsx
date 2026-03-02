import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Name from "../TextField/Disable/Name";
import Code from "../TextField/Disable/Code";
import IOSSwitch from "../../SwitchIOSStyle";
import StoneGroupField from "../TextField/Disable/StoneGroupField";
import HNS from "../TextField/Disable/HNS";

const StoneBody = ({ selectedData, isEditing, onCodeChange, onNameChange, onStatusChange, onHSNChange, onStoneGroupChange , defaultGroupValue}) => {
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
          <Code selectedData={selectedData} isEditing={isEditing} onCodeChange={onCodeChange} />
          <Box sx={{ marginTop: "24px" }}>
            <Name selectedData={selectedData} isEditing={isEditing} onNameChange={onNameChange} />
          </Box>
          <Box sx={{ marginTop: "24px" }}>
            <StoneGroupField selectedData={selectedData}  isEditing={isEditing} onStoneGroupChange={onStoneGroupChange} defaultValue={defaultGroupValue}/>
          </Box>
          <Box sx={{ marginTop: "24px" }}>
            <HNS selectedData={selectedData} isEditing={isEditing} onHSNChange={onHSNChange} />
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

export default StoneBody;
