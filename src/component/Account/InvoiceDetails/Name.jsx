import { TextField } from "@mui/material";
import { useRecoilState } from "recoil";
import { vendorAccountInfomationState,vendorInvoiceDetailState } from "recoil/state/VendorState";

const Name = (props) => {
  return (
    <TextField
      required
      value={props.value}
      onChange={props.onChange}
      id="outlined-required"
      label="Name :"
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

export default Name;
