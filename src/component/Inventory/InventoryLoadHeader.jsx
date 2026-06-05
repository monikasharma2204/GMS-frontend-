import React, { useEffect, useReducer, useState } from "react";
import { Box, Button, Typography, Grid } from "@mui/material";
import LoadModalDayBook from "./LoadModalDayBook";
import apiRequest from "../../helpers/apiHelper.js";



const InventoryLoadHeader = ({
  onLoadSelect,
  handleEdit,
  currentLoadId,
  isApproved,
  onApprove,
  memoInfo,
  isEditMode,
  onEditToggle,
}) => {
  // Debug logging for approve state
  React.useEffect(() => {
  }, [isApproved, currentLoadId]);
  const [isLoadDayBookOpen, setIsLoadDayBookOpen] = useState(false);

  const handleLoadSelect = (selectedLoads) => {
    if (onLoadSelect) {
      onLoadSelect(selectedLoads);
    }
    setIsLoadDayBookOpen(false);
  };

  return (


    <>
      <Box
        sx={{
          width: "1683px",
          height: "64px",
          flexShrink: 0,
          backgroundColor: "#FFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0px 8px 8px -4px rgba(24, 39, 75, 0.08)",
        }}
      >
        <Box
          sx={{
            width: "388px",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              color: "#05595B",
              fontFamily: "Calibri",
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "normal",
              marginLeft: "32px",
            }}
          >
            Load
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ marginRight: "12px" }}>
            <Button
              disabled={isApproved || !currentLoadId || isEditMode}
              onClick={onApprove}
              sx={{
                textTransform: "none",
                height: "35px",
                width: "100px",
                padding: "12px",
                borderRadius: "4px",
                gap: "8px",
                backgroundColor: !currentLoadId
                  ? "#E6E6E6"
                  : isApproved
                    ? "#00AA3A33"
                    : "#C6A96933",
                border: !currentLoadId
                  ? "1px solid #BFBFBF"
                  : isApproved
                    ? "1px solid #00AA3A80"
                    : "1px solid #C6A96980",
                color: !currentLoadId
                  ? "#57646E"
                  : isApproved
                    ? "#00AA3A"
                    : "#C6A969",
                fontFamily: "Calibri",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "normal",
                letterSpacing: "1px",
                "&:hover": {
                  backgroundColor: !currentLoadId
                    ? "#E6E6E6"
                    : isApproved
                      ? "#00AA3A33"
                      : "#C6A96933",
                },
                "&.Mui-disabled": {
                  backgroundColor: isEditMode || !currentLoadId
                    ? "#E6E6E6"
                    : isApproved
                      ? "#00AA3A33"
                      : "#E6E6E6",
                  color: isEditMode || !currentLoadId
                    ? "#57646E"
                    : isApproved
                      ? "#00AA3A"
                      : "#57646E",
                  border: isEditMode || !currentLoadId
                    ? "1px solid #BFBFBF"
                    : isApproved
                      ? "1px solid #00AA3A80"
                      : "1px solid #BFBFBF",
                },
              }}
            >
              {isApproved ? "Approved" : "Approve"}
            </Button>
          </Box>


          <Box>
            <LoadModalDayBook
              open={isLoadDayBookOpen}
              setOpen={setIsLoadDayBookOpen}
              onLoadSelect={handleLoadSelect}
              handleEdit={handleEdit}
            />
          </Box>




        </Box>
      </Box>
    </>
  );
};

export default InventoryLoadHeader;
