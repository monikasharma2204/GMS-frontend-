import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";

const ExRate = ({ selectedCurrency, onExchangeRateChange }) => {
  const [exchangeRate, setExchangeRate] = useState("");

  useEffect(() => {
    if (selectedCurrency === "THB") {
      setExchangeRate("");
    }
  }, [selectedCurrency]);

  const handleChange = (e) => {
    setExchangeRate(e.target.value);
    onExchangeRateChange(e.target.value)
  };

  return (
    <TextField
      disabled={selectedCurrency === "THB"}
      id="outlined-required"
      label="Exchange Rate :"
      value={exchangeRate}
      onChange={handleChange}
      InputLabelProps={{
        shrink: true,
        sx: {
          color: "var(--Text-Field, #666666)",
          fontFamily: "Calibri",
          fontSize: "18px",
          fontStyle: "normal",
          fontWeight: 500,
        },
      }}
      sx={{
        "& .MuiInputLabel-asterisk": {
          color: "red",
        },
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
          backgroundColor: selectedCurrency === "THB" ? "#F0F0F0" : "#FFF",
          width: "200px",
          height: "42px",
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#8BB4FF",
          },
          "&:hover": {
            backgroundColor: "#F5F8FF",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#8BB4FF",
          },
        },
        "& .MuiOutlinedInput-input::placeholder": {
          color: "var(--Text-Field, #666)",
          fontFamily: "Calibri",
          fontSize: "18px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "normal",
        },
        marginLeft: "24px",
      }}
    />
  );
};

export default ExRate;
