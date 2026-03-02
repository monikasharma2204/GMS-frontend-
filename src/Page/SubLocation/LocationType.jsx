import React, { useEffect, useState, useMemo } from "react";
import { TextField, Autocomplete } from "@mui/material";
import apiRequest from "helpers/apiHelper";
import { mainLocationDropdownList } from "recoil/sublocation";
import { useRecoilState } from "recoil";

const LocationType = ({ value, onChange, disabled, isEditing }) => {
  const [mainLocationList, setMainLocationList] = useRecoilState(
    mainLocationDropdownList
  );

  
  const selectedOption = useMemo(() => {
    if (!value) return null;
    
    const foundOption = mainLocationList.find((option) => 
      option.code === value.code || option.label === value.label
    );
    
   
    return foundOption || value;
  }, [value, mainLocationList]);

  return (
    <Autocomplete
      disabled={disabled}
      options={mainLocationList}
      getOptionLabel={(option) => option?.label || ""}
      isOptionEqualToValue={(option, val) => {
        if (!val || !option) return false;
        return option.code === val.code || option.label === val.label;
      }}
      value={selectedOption}
      onChange={(event, newValue) => {
        onChange(newValue);
      }}
      disableClearable
      id="state-province-select"
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          required
          fullWidth
          disabled={disabled}
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
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              fontSize: "16px", // updated font size
              fontWeight: 400,
              fontFamily: "Calibri",
              color: isEditing ? '#000000' : '#9A9A9A',
              textIndent: "6px",

              backgroundColor: "#FFF",
              width: "334px",
              height: "46px",
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#8BB4FF",
              },
              "&:hover": {
                backgroundColor: "#F5F8FF",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#8BB4FF",
              },
              "&.Mui-disabled": {
                backgroundColor: "rgb(240, 240, 240)",
              },
              "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgb(220, 220, 220)", // optional: muted border
              },
            },
          }}
        />
      )}
      // renderInput={(params) => (
      //   <TextField
      //     {...params}
      //     required
      //     label="Location Type:"
      //     InputLabelProps={{
      //       shrink: true,
      //       sx: {
      //         color: "var(--Text-Field, #666)",
      //         fontFamily: "Calibri",
      //         fontSize: "18px",
      //         fontStyle: "normal",
      //         fontWeight: 400,
      //       },
      //     }}
      //     sx={{
      //       "& .MuiInputLabel-asterisk": {
      //         color: "red",
      //       },
      //       "& .MuiOutlinedInput-root": {
      //         borderRadius: "8px",
      //         backgroundColor: "#FFF",
      //         width: "434px",
      //         height: "42px",
      //         "&:hover .MuiOutlinedInput-notchedOutline": {
      //           borderColor: "#8BB4FF",
      //         },
      //         "&:hover": {
      //           backgroundColor: "#F5F8FF",
      //         },
      //         "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      //           borderColor: "#8BB4FF",
      //         },
      //       },
      //       marginTop: "24px",
      //     }}
      //   />
      // )}
    />
  );
};

export default LocationType;
