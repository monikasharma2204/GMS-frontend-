import React from "react";
import { TextField } from "@mui/material";
import { enableEditState } from "recoil/state/VendorState";
import {  useRecoilValue } from "recoil";

const TaxID = ({ value, onChange, error, helperText }) => {
  const editStatus = useRecoilValue(enableEditState)

  return (
    <TextField
    
    
    disabled={editStatus?false:true}
    classes={editStatus?"taxid" : "taxid disabled_input"}
      required
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      id="outlined-required"
      label="Tax ID :"
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
    />
  );
};

export default TaxID;
