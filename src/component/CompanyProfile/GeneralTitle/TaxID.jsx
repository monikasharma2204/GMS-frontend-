import React, { useState,useEffect } from "react";
import { TextField } from "@mui/material";
import { isEditingState } from "recoil/state/CommonState";
import { useRecoilState } from "recoil";
const TaxID = (props) => {
  const [taxID, setTaxID] = useState("");
  const [ isEditing,setIsEditing] = useRecoilState(isEditingState)
  useEffect(()=>{
    setIsEditing(false)
  },[])


  return (
    <TextField
    disabled={!isEditing}
    value={props.value}
    defaultValue={props.value}
      required
      id="outlined-required"
      label="Tax ID :"
      error={props.error}
      helperText={props.helperText}
      onChange={props.onChange}
      inputProps={{
        maxLength: 18,
      }}
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
        marginTop: "24px",
        marginLeft: "24px",
      }}
    />
  );
};

export default TaxID;



