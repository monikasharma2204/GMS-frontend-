import React, { useState } from "react";
import { TextField, Autocomplete } from "@mui/material";

const stateProvinces = [
  { code: "CA", label: "California" },
  { code: "TX", label: "Texas" },
  { code: "NY", label: "New York" },
  { code: "FL", label: "Florida" },
  { code: "IL", label: "Illinois" },
];

const StateProcince = () => {
  const [SelectstateProvince, setSelectstateProvince] = useState(null);

  return (
    <Autocomplete disabled
      id="state-province-select"
      options={stateProvinces}
      getOptionLabel={(option) => option.label}
      value={SelectstateProvince}
      onChange={(event, newValue) => setSelectstateProvince(newValue)}
      renderInput={(params) => (
        <TextField
        disabled
          {...params}
          required
          label="State/Province :"
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
        />
      )}
    />
  );
};

export default StateProcince;
