import React from "react";
import { TextField, Autocomplete } from "@mui/material";
import { useRecoilValue } from "recoil";
import { isEditingState } from "recoil/state/CommonState";

const StateProvince = ({ options, value, onChange, error, helperText }) => {
  const isEditing = useRecoilValue(isEditingState);

  return (
    <Autocomplete
      id="state-province-select"
      disabled={!isEditing || options.length === 0}
      options={options}
      getOptionLabel={(option) => option.label}
      value={value || null}
      onChange={(event, newValue) => onChange(newValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="State/Province"
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
              // "&:hover .MuiOutlinedInput-notchedOutline": {
              //   borderColor: "#8BB4FF",
              // },
              // "&:hover": {
              //   backgroundColor: "#F5F8FF",
              // },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#8BB4FF",
              },
            },
            marginTop: "24px",
          }}
          required
          error={error}
          helperText={helperText}
        />
      )}
    />
  );
};

export default StateProvince;
