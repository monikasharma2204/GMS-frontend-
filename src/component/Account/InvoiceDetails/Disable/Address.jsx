import { TextField } from "@mui/material";

const Address = () => {
  return (
    <TextField
    disabled
      required
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
          backgroundColor: "#F0F0F0",
          width: "434px",
          height: "62px",
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
