import React, { useState, useEffect } from "react";
import { Box, FormControlLabel, Typography, Checkbox } from "@mui/material";
import axios from "axios";
import {API_URL} from "config/config.js";

const Shapes = ({ value, onChange }) => {
  const [items, setItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    // Fetch shape items
    axios.get(API_URL+'/master?master_type=master_stone_shape')
      .then(response => {
        const activeItems = response.data.filter(item => item.master_status === "active");
        setItems(activeItems);
      })
      .catch(error => {
        console.error("Error fetching shape data:", error);
      });
  }, []);

  useEffect(() => {
    if (value.length === items.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [value, items]);

  const handleCheckboxChange = (id) => {
    const updatedValue = value.includes(id)
      ? value.filter(item => item !== id)
      : [...value, id];
    
    onChange({ target: { value: updatedValue } });
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      onChange({ target: { value: [] } });
    } else {
      const allItemIds = items.map(item => item._id);
      onChange({ target: { value: allItemIds } });
    }
    setSelectAll(!selectAll);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            marginRight: "44px",
            width: "442px",
            height: "46.5px",
          }}
        >
          <Typography
            sx={{
              color: "#343434",
              fontFamily: "Calibri",
              fontSize: "18px",
              fontStyle: "normal",
              fontWeight: 700,
            }}
          >
            Shapes
          </Typography>
        </Box>
        <Box>
          <FormControlLabel
            control={
              <>
                <Checkbox checked={selectAll} onChange={handleSelectAllChange} />
                <Typography
                  sx={{
                    marginRight: "30px",
                    color: "var(--Muay-Black, #343434)",
                    fontFamily: "Calibri",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                  }}
                >
                  Select All
                </Typography>
              </>
            }
          />
          {items.map((item) => (
            <FormControlLabel
              key={item._id}
              control={
                <>
                  <Checkbox
                    checked={value.includes(item._id)}
                    onChange={() => handleCheckboxChange(item._id)}
                  />
                  <Typography
                    sx={{
                      marginRight: "30px",
                      color: "var(--Muay-Black, #343434)",
                      fontFamily: "Calibri",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 400,
                    }}
                  >
                    {item.name}
                  </Typography>
                </>
              }
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Shapes;
