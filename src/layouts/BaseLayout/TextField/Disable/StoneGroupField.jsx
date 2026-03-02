import React, { useState, useEffect } from "react";
import axios from "axios";
import { Select, MenuItem, Box, Typography, FormControl } from "@mui/material";
import {API_URL} from "config/config.js";

const StoneGroupField = ({ selectedData, isEditing, onStoneGroupChange , defaultValue }) => {
  const [options, setOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [change,setChange] = useState(false)

  const handleStoneGroupChange = (event) => {
    console.log(event.target)
    const newCodeValue = event.target.value;
    const selectedOption = options.find(option => option.value === newCodeValue);
    const newIdValue = selectedOption ? selectedOption._id : null;
    console.log(newCodeValue)
    console.log(newCodeValue)
    setSelectedValue(newCodeValue);
    setChange(true)
    onStoneGroupChange(newIdValue, newCodeValue, selectedOption ? selectedOption.label : "");
  };

  useEffect(() => {
    if(defaultValue){
      if(change===false){
                setSelectedValue(defaultValue)

      }

    }
    let isMounted = true;

    axios.get(`${API_URL}/master?master_type=master_stone_group`)
      .then(response => {
        if (isMounted) {
          const fetchedOptions = response.data.map(item => ({
            _id: item._id,
            value: item._id,
            label: item.name
          }));
          setOptions(fetchedOptions);
            const defaultItem = fetchedOptions.find(option => option._id === selectedData.stone_group_code);
console.log(selectedData)
          if (selectedData?.stone_group_code && !selectedValue) {
            const defaultItem = fetchedOptions.find(option => option._id === selectedData.stone_group_id);
            if (defaultItem) {
              setSelectedValue(defaultItem._id);
            }
          }
        }
      })
      .catch(error => {
        console.error("Error fetching options:", error);
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedData]);

  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
      <Box sx={{ display: "flex", marginRight: "23px" }}>
        <Typography
          sx={{
            color: "#343434",
            fontFamily: "Calibri",
            fontSize: "18px",
            fontStyle: "normal",
            fontWeight: 400,
          }}
        >
          Stone Group :
        </Typography>
        <Typography
          sx={{
            color: "var(--Red, #E00410)",
            fontFamily: "Calibri",
            fontSize: "16px",
            fontStyle: "normal",
            fontWeight: 400,
            marginLeft: "2px",
            marginTop: "2px"
          }}
        >
          *
        </Typography>
      </Box>
      <FormControl sx={{ width: "328px", backgroundColor: isEditing ? "#FFF" : "#F0F0F0", }}>
        <Select
          disabled={!isEditing}
          id="stone-group-select"
          labelId="stone-group-select-label"
          value={selectedValue}
          onChange={handleStoneGroupChange}
          sx={{
            borderRadius: "8px",
            height: "42px",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#8BB4FF",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#8BB4FF",
            },
          }}
        >
          {options.map((option) => (
            <MenuItem key={option._id} value={option._id}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default StoneGroupField;
