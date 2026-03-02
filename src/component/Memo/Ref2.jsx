import { TextField } from "@mui/material";

const Ref2 = ({ onRef2Change }) => {
  return (
    <TextField
      id="outlined-required"
      label="Ref. 2 :"
      onChange={(e) => onRef2Change(e.target.value)}
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
          backgroundColor: "#FFF",
          width: "420px",
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
        "& .MuiOutlinedInput-input::placeholder": {
          color:
            "var(--gbreadcrumbs-and-other-parts-text, var(--Text-Dis-Field, #9A9A9A))",
          fontFamily: "Calibri",
          fontSize: "16px",
          fontStyle: "normal",
          fontWeight: 400,
          lineHeight: "normal",
        },
        marginLeft: "35px"
      }}
    />
  );
};

export default Ref2;





