import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Select,
  MenuItem,
  Box,
  Typography,
  FormControl,
  InputLabel,
} from "@mui/material";
import {API_URL} from "config/config.js";

const StoneGroupField = ({ selectedData, value, onChange }) => {
  const [options, setOptions] = useState([]);
  const [defaultValue, setDefaultValue] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Fetch options for Select
    axios.get(`${API_URL}/master?master_type=master_stone_group`)
      .then((response) => {
        if (isMounted) {
          const fetchedOptions = response.data.map((item) => ({
            value: item._id,
            label: item.code,
          }));
          setOptions(fetchedOptions);

          if (selectedData?.code) {
            const defaultItem = fetchedOptions.find(
              (option) => option.value === selectedData.stone_group_id
            );
            setDefaultValue(defaultItem ? defaultItem.value : "");
          }
        }
      })
      .catch((error) => {
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
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
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
            marginTop: "2px",
          }}
        >
          *
        </Typography>
      </Box>
      <FormControl sx={{ width: "328px", backgroundColor: "#FFF" }}>
        <Select
          value={value}
          onChange={(event) => {
            const selectedValue = event.target.value;
            console.log("Selected value:", selectedValue);
            onChange(event);
          }}
          id="stone-group-select"
          labelId="stone-group-select-label"
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
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default StoneGroupField;
