import React, { useState } from "react";
import { TextField } from "@mui/material";

const TaxID = () => {
  const [taxID, setTaxID] = useState("");

  const handleTaxIDChange = (event) => {
    const { value } = event.target;
    if (/^\d*$/.test(value) && value.length <= 18) {
      setTaxID(value);
    }
  };  

  return (
    <TextField
    disabled
      required
      id="outlined-required"
      label="Tax ID :"
      inputProps={{
        maxLength: 18,
      }}
      InputLabelProps={{
        shrink: true,
        sx: {
          color: "var(--Text-Field, #666)",
          fontFamily: "Calibri",
          fontSize: "18px",
          fontStyle: "normal",
          fontWeight: 400,
          letterSpacing: "0.024px",
        },
      }}
      sx={{
        "& .MuiInputLabel-asterisk": {
          color: "red",
        },
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
          backgroundColor: "#F0F0F0",
          width: "434px",
          height: "42px",
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#8BB4FF",
          },
        },
        marginTop: "24px",
      }}
    />
  );
};

export default TaxID;
