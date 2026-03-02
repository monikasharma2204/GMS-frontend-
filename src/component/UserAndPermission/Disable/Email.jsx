import { TextField } from "@mui/material";

const Email = ({ value, onChange, borderColor }) => {
  return (
    <TextField
      disabled
      required
      id="outlined-required"
      label="Email :"
      value={value}
      onChange={onChange}
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
      sx={{
        "& .MuiInputLabel-asterisk": {
          color: "red",
        },
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            borderColor: borderColor,
          },
          borderRadius: "8px",
          backgroundColor: "#F0F0F0",
          width: "434px",
          height: "42px",
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#8BB4FF",
          },
        },
      }}
    />
  );
};

export default Email;
