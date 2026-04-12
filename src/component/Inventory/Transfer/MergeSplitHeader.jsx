import React from "react";
import { Box, Typography, Button } from "@mui/material";

const MergeSplitHeader = ({ onApprove, onDayBook, invoiceNo, disableApprove = false }) => {
  return (
    <Box
      sx={{
        width: "calc(100% - 64px)", 
        height: "56px",
        padding : "0px 32px",
        flexShrink: 0,
        backgroundColor: "#FFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0px 8px 8px -4px rgba(24, 39, 75, 0.08)",
      }}
    >
      <Box sx={{ }}>
        <Typography
          sx={{
            color: "#05595B",
            fontFamily: "Calibri",
            lineHeight : "normal",
            fontSize: "24px",
            fontWeight: 700,
          }}
        >
          Merge/Split Stock
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Button
          onClick={onApprove}
          disabled={disableApprove}
          sx={{
            textTransform: "none",
            height: "32px",
            width: "96px",
            borderRadius: "4px",
            backgroundColor: "#E6E6E6",
            border: "1px solid #BFBFBF",
            color: "#57646E",
            fontFamily: "Calibri",
            fontSize: "14px",
            fontWeight: 700,
            "&:hover": {
              backgroundColor: "#D0D0D0",
            },
            "&:disabled": {
              backgroundColor: "#E6E6E6",
              border: "1px solid #BFBFBF",
              color: "#57646E",
            },
          }}
        >
          Approve
        </Button>
        <Button
          onClick={onDayBook}
          sx={{
            textTransform: "none",
            paddingLeft : "16px",
            paddingRight : "16px",
        
            height: "32px",
            width: "96px",
            borderRadius: "4px",
            backgroundColor: "#C6A969",
            color: "white",
            fontFamily: "Calibri",
            fontSize: "14px",
            fontWeight: 700,
            "&:hover": {
              backgroundColor: "#B0955B",
            }
          }}
        >
          Day Book
        </Button>
      </Box>
    </Box>
  );
};

export default MergeSplitHeader;
