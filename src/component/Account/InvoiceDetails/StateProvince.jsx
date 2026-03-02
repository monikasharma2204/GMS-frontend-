import React from "react";
import { TextField, Autocomplete } from "@mui/material";
import {  useRecoilValue } from "recoil";

import { enableEditState } from "recoil/state/VendorState";



const StateProvince = ({ options, value, onChange, error, helperText }) => {
  const editStatus = useRecoilValue(enableEditState)

  return (
    <Autocomplete
    
    disabled={editStatus?false:true}
    classes={editStatus?"state_input" : "state_input disabled_input"}
      id="state-province-select"
      options={options}
      getOptionLabel={(option) => option.label}
      value={value || null}
      onChange={(event, newValue) => onChange(newValue)}
      renderInput={(params) => (
        <TextField
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
              backgroundColor: "#FFF",
              width: "434px",
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
            marginTop: "24px",
          }}
          error={error}
          helperText={helperText}
        />
      )}
    />
  );
};

export default StateProvince;
