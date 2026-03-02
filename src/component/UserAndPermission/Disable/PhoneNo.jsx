import React, { useState } from "react";
import { MuiTelInput } from "mui-tel-input";

const PhoneNo = () => {
  const [value, setValue] = useState("");

  const handleChange = (value) => {
    setValue(value);
  };

  return (
    <MuiTelInput
      disabled
      value={value}
      onChange={handleChange}
      defaultCountry="TH"
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
      }}
      label="Phone No. :"
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
      required
    />
  );
};

export default PhoneNo;
