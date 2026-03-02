import React, { useState,useEffect } from "react";
import { TextField } from "@mui/material";
import { isEditingState } from "recoil/state/CommonState";
import { useRecoilState } from "recoil";
const Website = (props) => {
  const [ isEditing,setIsEditing] = useRecoilState(isEditingState)
  useEffect(()=>{
    setIsEditing(false)
  },[])
  return (
    <TextField
      id="outlined-required"
      disabled={!isEditing}
      value={props.value}
      defaultValue={props.value}
      onChange={props.onChange}
      label="Website :"
      InputLabelProps={{
        shrink: true,
        sx: {
          color: "var(--Text-Field, #666)",
          fontFamily: "Calibri",
          fontSize: "18px",
          fontStyle: "normal",
          fontWeight: 400,
          letterSpacing: "0.024px",
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
        marginLeft: "24px",
        marginRight: "24px",
      }}
    />
  );
};

export default Website;



