import React, { useState, useEffect } from "react";
import { MuiTelInput } from "mui-tel-input";
import { isEditingState } from "recoil/state/CommonState";
import { useRecoilState } from "recoil";
const PhoneNo = (props) => {
  const [value, setValue] = useState("");
  const [isEditing, setIsEditing] = useRecoilState(isEditingState);
  useEffect(() => {
    setIsEditing(false);
  }, []);
  const handleChange = (value) => {
    setValue(value);
    if (props.onChange) props.onChange();
  };

  return (
    <MuiTelInput
    
      error={props.error}
      helperText={props.helperText}
      value={value}
      onChange={handleChange}
      defaultCountry="TH"
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

