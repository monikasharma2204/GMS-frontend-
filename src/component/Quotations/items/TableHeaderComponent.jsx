import React from "react";
import { Box, Typography } from "@mui/material";

const TableHeaderComponent = ({ headers }) => {
  return (
    <Box
      sx={{
        height: "42px",
        bgcolor: "var(--Head-Table, #EDEDED)",
        border: "0px solid var(--Line-Table, #C6C6C8)",
        display: "flex",
        position: "sticky",
    top: 0,
      zIndex : 99
      }}
    >
      {headers.map((header, index) => (
        <Box
          key={index}
           className={header.className || ""}
          sx={{
            width: header.width,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              color: "var(--Main-Text, #343434)",
              fontFamily: "Calibri",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "normal",
            }}
          >
            {header.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default TableHeaderComponent;