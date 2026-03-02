import React from "react";
import { Box } from "@mui/material";
import BankName from "./TextField/BankName";
import BranchName from "./TextField/BranchName";
import AccountName from "./TextField/AccountName";
import AccountNumber from "./TextField/AccountNumber";
import SwiftCode from "./TextField/SwiftCode";

import IOSSwitch from "../../SwitchIOSStyle";

const BankBody = ({
  selectedData, isEditing, onCodeChange, onNameChange, onStatusChange, onHSNChange, onStoneGroupChange , defaultGroupValue
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
          <BankName
            selectedData={selectedData}
            isEditing={isEditing}
            onCodeChange={onCodeChange}
          />
          <Box sx={{ marginTop: "24px" }}>
            <BranchName
              selectedData={selectedData}
              isEditing={isEditing}
              onNameChange={onNameChange}
            />
          </Box>
          <Box sx={{ marginTop: "24px" }}>
            <AccountName
              selectedData={selectedData}
              isEditing={isEditing}
              onNameChange={onNameChange}
            />
          </Box>
          <Box sx={{ marginTop: "24px" }}>
            <AccountNumber
              selectedData={selectedData}
              isEditing={isEditing}
              onNameChange={onNameChange}
            />
          </Box>
          <Box sx={{ marginTop: "24px" }}>
            <SwiftCode
              selectedData={selectedData}
              isEditing={isEditing}
              onNameChange={onNameChange}
            />
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
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default BankBody;
