import React from "react";
import { Box, Typography } from "@mui/material";

const StockMovementReportHeader = ({ onExportExcel }) => {
  return (
    <>
      <Box
        sx={{
          // width: "1697px",
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
            Stock Movement Report
          </Typography>
        </Box>


      </Box>
    </>
  );
};

export default StockMovementReportHeader;
