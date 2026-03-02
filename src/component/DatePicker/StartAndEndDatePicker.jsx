import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function StartAndEndDatePicker () {
    return (
        <>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Doc Date "
                    // onChange={(newValue) => {
                    //   onDocDateChange(newValue);
                    // }}
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: {
                        required: true,
                        InputLabelProps: {
                          shrink: true,
                        },
                      },
                    }}
                    sx={{
                      "& .MuiInputLabel-asterisk": {
                        color: "red",
                      },
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: "#FFF",
                        width: "220px",
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
                      marginRight: "24px",
                    }}
                  />
                </LocalizationProvider>
                
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Due Date "
                    // onChange={(newValue) => {
                    //   onDueDateChange(newValue);
                    // }}
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: {
                        required: true,
                        InputLabelProps: {
                          shrink: true,
                        },
                      },
                    }}
                    sx={{
                      "& .MuiInputLabel-asterisk": {
                        color: "red",
                      },
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: "#FFF",
                        width: "220px",
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
                    }}
                  />
                </LocalizationProvider>
        </>
    )
}