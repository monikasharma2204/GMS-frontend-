import React, { useState, useEffect } from "react";
import { MuiTelInput } from "mui-tel-input";
import { FormControl, FormHelperText } from "@mui/material";
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
  };

  return (

     <FormControl error={props.error}>
    <MuiTelInput
      disabled={!isEditing}
      error={props.error}
      // helperText={props.helperText}
      value={props.value}
      onChange={props.onChange}
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

            MenuProps={{
        PaperProps: {
          style: {
            maxHeight: 300, 
            maxWidth : 300,// reduce max height of dropdown
          },
        },
        MenuListProps: {
          style: {
            paddingTop: 0,
            paddingBottom: 0,
          },
        },
        sx: {
          '& .MuiMenuItem-root': {
            minHeight: 30, // reduce height of each item
            paddingTop: 1,
            paddingBottom: 1,
          },
        },
      }}
      
      required
    />

      {props.helperText && (
        <FormHelperText>{props.helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

export default PhoneNo;

