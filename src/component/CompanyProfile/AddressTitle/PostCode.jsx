import React, { useState,useEffect } from "react";
import { TextField } from "@mui/material";
import { isEditingState } from "recoil/state/CommonState";
import { useRecoilState } from "recoil";

const PostCode = (props) => {
  const [ isEditing,setIsEditing] = useRecoilState(isEditingState)
  useEffect(()=>{
    setIsEditing(false)
  },[])

  return (
    <TextField
      required
      disabled={!isEditing}
      error={props.error}
      helperText={props.helperText}
      id="outlined-required"
      label="Postcode :"
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
          zIndex: 1,
        },
      }}
      inputProps={{
        maxLength: 10,
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
    />
  );
};

export default PostCode;


