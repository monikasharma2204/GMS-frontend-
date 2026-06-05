import React from "react";
import { TextField } from "@mui/material";

const Ref2 = ({ value, onChange, disabled, width = "342px" }) => {
  return (
    <TextField
      label="Ref 2 "
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      InputLabelProps={{ shrink: true }}
      sx={{
        width: width,
        "& .MuiOutlinedInput-root": {
          height: "42px",
          borderRadius: "8px",
          backgroundColor: "#FFF",
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#8BB4FF" },
          "&:hover": { backgroundColor: "#F5F8FF" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#8BB4FF" },
        },
        "& .MuiInputBase-input": { fontSize: "14px" },
      }}
    />
  );
};

export default Ref2;
