import React from "react";
import { useRecoilValue } from "recoil";
import { isEditingState } from "recoil/state/CommonState";
import {
  Box,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";

const RadioOAGroup = (props) => {
  const isEditing = useRecoilValue(isEditingState); 

  return (
    <RadioGroup row value={props.value} onChange={props.onChange}>
      <FormControlLabel
        disabled={!isEditing}
        value="head_office"
        control={<Radio sx={{ color: "#E6E6E6" }} />}
        label="Head Office"
        sx={{
          "& .MuiFormControlLabel-label": {
            color: "#343434",
            fontFamily: "Calibri",
            fontSize: "20px",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "normal",
          },
        }}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginLeft: "32px",
        }}
      >
        <FormControlLabel
          disabled={!isEditing}
          value="branch"
          control={<Radio sx={{ color: "#E6E6E6" }} />}
          label="Branch"
          sx={{
            "& .MuiFormControlLabel-label": {
              color: "#343434",
              fontFamily: "Calibri",
              fontSize: "20px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
            },
          }}
        />
        {props.value === "branch" && (
          <TextField
            disabled={!isEditing}
            variant="outlined"
            placeholder="Branch Code"
            value={props.branchCode}
            onChange={props.onChangeBranchCode}
            error={!!props.error}
            helperText={props.helperText}
            inputProps={{
              maxLength: 5,
            }}
            sx={{
              // "&:hover .MuiOutlinedInput-notchedOutline": {
              //   borderColor: "#8BB4FF",
              // },
              // "&:hover": {
              //   backgroundColor: "#F5F8FF",
              // },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#8BB4FF",
              },
              "& .MuiOutlinedInput-root": {
                backgroundColor: "#FFF",
                borderRadius: "4px",
                width: "160px",
                height: "30px",
              },
              "& .MuiOutlinedInput-input::placeholder": {
                color: "var(--Text-Dis-Field, #9A9A9A)",
                fontFamily: "Calibri",
                fontSize: "16px",
                fontStyle: "normal",
                fontWeight: 400,
                lineHeight: "normal",
              },
              marginLeft: "8px",
            }}
          />
        )}
      </Box>
    </RadioGroup>
  );
};

export default RadioOAGroup;

