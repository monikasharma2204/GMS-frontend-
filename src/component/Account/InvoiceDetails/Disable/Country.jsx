import React, { useState } from "react";
import { TextField, Autocomplete } from "@mui/material";

const countries = [
  { code: "TH", label: "Thailand" },
  { code: "US", label: "USA" },
  { code: "UK", label: "United Kingdom" },
  { code: "AU", label: "Australia" },
];

const Country = ({ value, onChange, borderColor }) => {
  const [SelectCountry, setSelectCountry] = useState("");

  const handleChangeCountry = (event, newValue) => {
    setSelectCountry(newValue?.label || "");
    console.log(newValue?.label || "");
    onChange(event);
  };  
  
  return (
    <Autocomplete disabled
      id="searchable-select"
      options={countries}
      getOptionLabel={(option) => option.label}
      value={countries.find((option) => option.label === SelectCountry) || null}
      onChange={handleChangeCountry}
      renderInput={(params) => (
        <TextField
        disabled
          {...params}
          label="Country"
          InputLabelProps={{
            shrink: true,
            sx: {
              color: "var(--Text-Field, #666)",
              fontFamily: "Calibri",
              fontSize: "18px",
              fontStyle: "normal",
              fontWeight: 400,
            },
          }}
          sx={{
            "& .MuiInputLabel-asterisk": {
              color: "red",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: borderColor,
              },
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
          required
        />
      )}
    />
  );
};

export default Country;

