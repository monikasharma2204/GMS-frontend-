import React from "react";
import { TextField, Autocomplete } from "@mui/material";

const Account = ({ value, onChange, options, disabled, width = "342px" }) => {
  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.label || option.vendor_code_name || ""}
      value={
        typeof value === "string"
          ? options.find((opt) => 
              opt.vendor_code === value || 
              opt._id === value || 
              opt.label?.startsWith(value)
            ) || null
          : value
      }
      onChange={onChange}
      disabled={disabled}
      isOptionEqualToValue={(option, value) => {
        if (typeof value === "string") {
          return option.vendor_code === value || option._id === value || option.label?.startsWith(value);
        }
        return option._id === value?._id;
      }}
      sx={{ width: width }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Account"
          required
          InputLabelProps={{ shrink: true }}
          sx={{
            "& .MuiInputLabel-asterisk": { color: "red" },
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
      )}
    />
  );
};

export default Account;
