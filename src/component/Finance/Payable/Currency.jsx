import React from "react";
import { TextField } from "@mui/material";

const Currency = ({ value, onChange, disabled, width = "145px" }) => {
  return (
    <TextField

      label="Currency"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      InputLabelProps={{
        shrink: true,
        sx: {
          color: "#666",
          fontFamily: "Calibri",
          fontSize: "18px",
        }
      }}
      sx={{
        width: width,
        "& .MuiInputLabel-asterisk": { color: "red" },
        "& .MuiOutlinedInput-root": {
          height: "42px",
          borderRadius: "8px",
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#8BB4FF" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#8BB4FF" },
        },
        "& .MuiInputBase-input": { fontSize: "14px", fontFamily: "Calibri" },
      }}
    />
  );
};

export default Currency;
