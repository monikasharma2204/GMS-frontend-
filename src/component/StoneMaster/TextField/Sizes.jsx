import React, { useState, useEffect } from "react";
import { Box, FormControlLabel, Typography, Checkbox } from "@mui/material";
import axios from "axios";
import {API_URL} from "config/config.js";

const Sizes = ({ value = [], onChange, selectedData, isEditing }) => {
  const [items, setItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  // Fetch items on component mount
  useEffect(() => {
    axios.get(API_URL+"/master?master_type=master_stone_size")
      .then(response => {
        const activeItems = response.data.filter(item => item.master_status === "active");
        setItems(activeItems);
      })
      .catch(error => {
        console.error("Error fetching shape data:", error);
      });
  }, []);

  // Update selectedItems whenever selectedData or value changes
  useEffect(() => {
    if (selectedData?.master_info?.size_ids?.length > 0) {
      setSelectedItems(selectedData.master_info.size_ids);
    } else if (Array.isArray(value) && value.length > 0) {
      setSelectedItems(value);
    } else {
      setSelectedItems([]);
    }
  }, [selectedData, value]);

  useEffect(() => {
    if (selectedItems.length === items.length && items.length > 0) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedItems, items.length]);

  const handleCheckboxChange = (id) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = prevSelectedItems.includes(id)
        ? prevSelectedItems.filter((item) => item !== id)
        : [...prevSelectedItems, id];
      
      // Call onChange with the updated value
      onChange({ target: { value: updatedSelectedItems } });
      return updatedSelectedItems;
    });
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedItems([]);
      onChange({ target: { value: [] } });
    } else {
      const allItemIds = items.map(item => item._id);
      setSelectedItems(allItemIds);
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
            Sizes
          </Typography>
        </Box>
        <Box>
          <FormControlLabel
            control={
              <>
                <Checkbox 
                  disabled={!isEditing}
                  checked={selectAll} 
                  onChange={handleSelectAllChange} 
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
                    disabled={!isEditing}
                    checked={selectedItems.includes(item._id)}
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

export default Sizes;
