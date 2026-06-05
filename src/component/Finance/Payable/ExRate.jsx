import React from "react";
import { TextField } from "@mui/material";

const ExRate = ({ value, onChange, disabled, width = "120px" }) => {
  return (
    <TextField
      label="Exchange Rate"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      InputLabelProps={{ shrink: true }}
      sx={{
        width: width,
        "& .MuiOutlinedInput-root": {
          height: "42px",
          borderRadius: "8px",
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#8BB4FF" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#8BB4FF" },
        },
        "& .MuiInputBase-input": { fontSize: "14px" },
      }}
    />
  );
};

export default ExRate;
