import React, { useState,useEffect } from "react";
import { TextField } from "@mui/material";
import { isEditingState } from "recoil/state/CommonState";
import { useRecoilState } from "recoil";
const Address = (props) => {
  const [ isEditing,setIsEditing] = useRecoilState(isEditingState)
  useEffect(()=>{
    setIsEditing(false)
  },[])
  return (
    <TextField
    disabled={!isEditing}
      required
      id="outlined-required"
      label="Address :"
      multiline
      rows={2}
      error={props.error}
      helperText={props.helperText}
      value={props.value}
      onChange={props.onChange}
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
      // ไว้ปรับตัวอักษรในกรอบ
      // InputProps={{
      //   sx: {
      //     fontSize: "14px", // Adjust the input text size
      //   },
      // }}
      sx={{
        "& .MuiInputLabel-asterisk": {
          color: "red",
        },
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: props.borderColor,
          },
          borderRadius: "8px",
          backgroundColor: "#FFF",
          width: "434px",
          height: "62px",
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

        marginTop: "12px",
      }}
    />
  );
};

export default Address;

