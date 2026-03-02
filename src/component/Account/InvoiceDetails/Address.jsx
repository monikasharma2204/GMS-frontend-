import { TextField } from "@mui/material";
import {  useRecoilValue } from "recoil";

import { enableEditState } from "recoil/state/VendorState";

const Address = ({ value, onChange, error, helperText }) => {
  const editStatus = useRecoilValue(enableEditState)

  return (
    <TextField
    
    disabled={editStatus?false:true}
    className={editStatus?"address" : "address disabled_input"}
      required
      value={value}
     onChange={onChange}
      error={error}
      helperText={helperText}
      id="outlined-required"
      label="Address :"
      multiline
      rows={2}
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
          borderRadius: "8px",
          backgroundColor: "#FFF",
          width: "434px",
          height: "62px",
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

export default Address;
