import React from "react";
import { Box, Typography, Button } from "@mui/material";

const MergeSplitHeader = ({ onApprove, onDayBook, invoiceNo }) => {
  return (
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
      <Box sx={{ marginLeft: "32px" }}>
        <Typography
          sx={{
            color: "#05595B",
            fontFamily: "Calibri",
            fontSize: "24px",
            fontWeight: 700,
          }}
        >
          Merge/Split Stock
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", marginRight: "32px", gap: "12px" }}>
        <Button
          onClick={onApprove}
          sx={{
            textTransform: "none",
            height: "35px",
            width: "100px",
            borderRadius: "4px",
            backgroundColor: "#E6E6E6",
            border: "1px solid #BFBFBF",
            color: "#57646E",
            fontFamily: "Calibri",
            fontSize: "16px",
            fontWeight: 700,
            "&:hover": {
              backgroundColor: "#D0D0D0",
            }
          }}
        >
          Approve
        </Button>
        <Button
          onClick={onDayBook}
          sx={{
            textTransform: "none",
            height: "35px",
            width: "100px",
            borderRadius: "4px",
            backgroundColor: "#C6A969",
            color: "white",
            fontFamily: "Calibri",
            fontSize: "16px",
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
