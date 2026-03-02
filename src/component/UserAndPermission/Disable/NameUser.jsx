import { TextField } from "@mui/material";

const NameUser = () => {
  return (
    <TextField
      disabled
      required
      id="outlined-required"
      label="Name :"
      // placeholder="First name-Last name"
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
          borderRadius: "8px",
          backgroundColor: "#F0F0F0",
          width: "434px",
          height: "42px",
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#8BB4FF",
          },
        },
        "& .MuiOutlinedInput-input::placeholder": {
          color:
            "var(--gbreadcrumbs-and-other-parts-text, var(--Text-Dis-Field, #9A9A9A))",
          fontFamily: "Calibri",
          fontSize: "16px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "normal",
        },
        marginTop: "24px",
      }}
    />
  );
};

export default NameUser;
