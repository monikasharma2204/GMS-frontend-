import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import {  useRecoilValue } from "recoil";

import { enableEditState } from "recoil/state/VendorState";

const PostCode = ({ value, onChange, borderColor, error, helperText }) => {
  const [postCode, setPostCode] = useState(value || "");
  const editStatus = useRecoilValue(enableEditState)

  useEffect(() => {
    setPostCode(value);
  }, [value]);

  const handlePostCodeChange = (event) => {
    const newValue = event.target.value;
    if (/^\d*$/.test(newValue) && newValue.length <= 10) {
      setPostCode(newValue);
      onChange(event);
    }
  };

  return (
    <TextField
    
    disabled={editStatus?false:true}
    classes={editStatus?"postcode" : "postcode disabled_input"}
      required
      id="outlined-required"
      label="Postcode :"
      value={postCode}
      onChange={handlePostCodeChange}
      error={error}
      helperText={helperText}
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
          "& fieldset": {
            borderColor: borderColor,
          },
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

export default PostCode;
