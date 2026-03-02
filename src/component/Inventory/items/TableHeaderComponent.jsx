import React from "react";
import { TableHead, TableRow, TableCell, Typography } from "@mui/material";

const TableHeaderComponent = ({ headers }) => {
  return (
    <TableHead>
      <TableRow
        sx={{
          height: "42px",
          bgcolor: "#EDEDED",
          position: "sticky",
          top: 0,
          zIndex: 99,
        }}
      >
        {headers.map((header, index) => (
          <TableCell
            key={index}
            sx={{
              width: header.width,
              textAlign: "center",
              padding: "8px",
              bgcolor: "#EDEDED",
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
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default TableHeaderComponent;