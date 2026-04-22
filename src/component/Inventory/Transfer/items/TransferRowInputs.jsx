import React from "react";
import { TextField, Autocomplete } from "@mui/material";
import CustomTextField from "../../items2/CustomTextField";

export const FIELD_WIDTH = 131;

export const TransferSelectInput = React.memo(
  ({ value, onChange, options = [], disabled = false, hasError = false }) => {
    const defaultOption = {
      label: value || "",
      value: value || "",
    };

    const selectedOption =
      options.find((option) => option?.value === value) || defaultOption;

    return (
      <Autocomplete
        value={selectedOption}
        onChange={(_, newValue) => {
          onChange(newValue ? newValue.value : "");
        }}
        disabled={disabled}
        disableClearable
        options={options}
        getOptionLabel={(option) => option?.label || ""}
        isOptionEqualToValue={(option, currentValue) =>
          option.value === currentValue.value
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            sx={{
              "& .MuiInputBase-input": {
                color: "black",
                fontFamily: "Calibri",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
              },
              "& .MuiOutlinedInput-root": {
                width: `${FIELD_WIDTH}px`,
                height: "34px",
                borderRadius: "4px",
              },
              "& .MuiOutlinedInput-root.Mui-error > fieldset": {
                borderColor: "#E00410 !important",
                borderWidth: "2px",
              },
              "& .MuiOutlinedInput-root.Mui-error.Mui-focused > fieldset": {
                borderColor: "#E00410 !important",
              },
              "& .MuiOutlinedInput-root.Mui-error:hover > fieldset": {
                borderColor: "#E00410 !important",
              },
              "& .MuiInputBase-root.Mui-disabled": {
                "& > fieldset": {
                  borderColor: "#E6E6E6",
                },
                bgcolor: "#F0F0F0",
                borderRadius: "4px",
              },
            }}
            error={hasError}
          />
        )}
        renderOption={(props, option) => (
          <li
            {...props}
            style={{
              fontFamily: "Calibri",
              fontSize: "16px",
              fontWeight: 400,
              color: "#343434",
            }}
          >
            {option?.label || ""}
          </li>
        )}
        sx={{
          width: `${FIELD_WIDTH}px`,
          "& .MuiAutocomplete-endAdornment": {
            right: "4px",
          },
        }}
      />
    );
  }
);

export const TransferReadonlyField = ({
  value,
  alignLeft = false,
  hasError = false,
}) => (
  <TextField
    value={value}
    variant="outlined"
    fullWidth
    disabled
    error={hasError}
    sx={{
      "& .MuiOutlinedInput-root": {
        width: `${FIELD_WIDTH}px`,
        height: "34px",
        borderRadius: "4px",
      },
      "& .MuiOutlinedInput-root.Mui-error > fieldset": {
        borderColor: "#E00410 !important",
        borderWidth: "2px",
      },
      "& .MuiInputBase-root.Mui-disabled": {
        "& > fieldset": {
          borderColor: "#E6E6E6",
        },
        bgcolor: "#F0F0F0",
        borderRadius: "4px",
      },
    }}
    inputProps={{
      sx: {
        textAlign: alignLeft ? "left" : "right",
        color: "black",
        fontFamily: "Calibri",
        fontSize: "16px",
        fontStyle: "normal",
        fontWeight: 400,
      },
    }}
  />
);

export { CustomTextField };
