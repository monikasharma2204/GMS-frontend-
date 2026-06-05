import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const DocDate = ({ value, onChange, disabled, width = "140px" }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Doc Date"
        value={value ? dayjs(value) : null}
        onChange={onChange}
        disabled={disabled}
        format="DD/MM/YY"
        slotProps={{
          textField: {
            required: true,
            InputLabelProps: { shrink: true },
          },
        }}
        sx={{
          width: width,
          "& .MuiInputLabel-asterisk": { color: "red" },
          "& .MuiOutlinedInput-root": {
            height: "42px",
            borderRadius: "8px",
            backgroundColor: "#FFF",
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#8BB4FF" },
            "&:hover": { backgroundColor: "#F5F8FF" },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#8BB4FF" },
          },
          "& .MuiInputBase-input": { fontSize: "14px" },
        }}
      />
    </LocalizationProvider>
  );
};

export default DocDate;
