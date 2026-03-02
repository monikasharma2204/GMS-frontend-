import React, { useState } from "react";
import { TextField } from "@mui/material";

const PostCode = () => {
  const [postCode, setPostCode] = useState("");

  const handlePostCodeChange = (event) => {
    const { value } = event.target;
    if (/^\d*$/.test(value) && value.length <= 10) {
      setPostCode(value);
    }
  };

  return (
    <TextField
      required
      disabled
      id="outlined-required"
      label="Postcode :"
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
          backgroundColor: "#F0F0F0",
          width: "434px",
          height: "42px",
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
