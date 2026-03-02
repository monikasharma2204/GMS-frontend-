import React, { useState } from "react";
import { TextField, Autocomplete } from "@mui/material";

const cities = [
  { value: "bangkok", label: "Bangkok" },
  { value: "tokyo", label: "Tokyo" },
  { value: "newyork", label: "New York" },
];

const City = () => {
  const [SelectCity, setSelectCity] = useState(null);

  return (
    <Autocomplete
    disabled
      id="searchable-select"
      options={cities}
      getOptionLabel={(option) => option.label}
      value={SelectCity}
      onChange={(event, newValue) => setSelectCity(newValue)}
      renderInput={(params) => (
        <TextField
        disabled
          {...params}
          label="City"
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

export default City;
