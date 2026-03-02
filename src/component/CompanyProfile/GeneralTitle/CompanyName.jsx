import { TextField } from "@mui/material";
import { isEditingState } from "recoil/state/CommonState";
import { useRecoilState } from "recoil";
import { useEffect } from "react";
const CompanyName = (props) => {
  const [isEditing, setIsEditing] = useRecoilState(isEditingState);
  useEffect(() => {
    setIsEditing(false);
  }, []);
  return (
    <TextField
      disabled={!isEditing}
      className={props.className ? props.className : "company_name_input"}
      required
      error={props.error}
      helperText={props.helperText}
      defaultValue={props.value}
      id="outlined-required"
      label="Company Name :"
      value={props.value}
      onChange={props.onChange}
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
          width: "693px",
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
      }}
    />
  );
};

export default CompanyName;



