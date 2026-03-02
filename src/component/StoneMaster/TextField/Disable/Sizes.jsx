import React, { useState, useEffect } from "react";
import { Box, FormControlLabel, Typography, Checkbox } from "@mui/material";
import axios from "axios";
import {API_URL} from "config/config.js";

const Sizes = ({ selectedData, isEditing, onSizeChange }) => {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Fetch items on component mount
  useEffect(() => {
    axios
      .get(API_URL+"/master?master_type=master_stone_size")
      .then((response) => {
        const activeItems = response.data.filter(
          (item) => item.master_status === "active"
        );
        setItems(activeItems);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Update selectedItems whenever selectedData changes
  useEffect(() => {
    // console.log("Sizes component - selectedData changed:", selectedData);
    // console.log("Sizes component - selectedData._id:", selectedData?._id);
    // console.log("Sizes component - size_ids:", selectedData?.master_info?.size_ids);
    // console.log("Sizes component - master_info:", selectedData?.master_info);
    
    // Check if size_ids exists and is an array
    const sizeIds = selectedData?.master_info?.size_ids;
    // console.log("Sizes component - sizeIds type:", typeof sizeIds);
    // console.log("Sizes component - sizeIds is array:", Array.isArray(sizeIds));
    
    if (sizeIds && Array.isArray(sizeIds) && sizeIds.length > 0) {
      console.log("Setting selectedItems to:", sizeIds);
      setSelectedItems(sizeIds);
    } else {
      console.log("Clearing selectedItems - no valid size_ids found");
      setSelectedItems([]);
    }
  }, [selectedData]);

  const handleCheckboxChange = (id) => {
    // console.log("Disable/Sizes - handleCheckboxChange called with id:", id);
    // console.log("Disable/Sizes - current selectedItems:", selectedItems);
    
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = prevSelectedItems.includes(id)
        ? prevSelectedItems.filter((item) => item !== id)
        : [...prevSelectedItems, id];
  
      // console.log("Disable/Sizes - updatedSelectedItems:", updatedSelectedItems);
      // console.log("Disable/Sizes - calling onSizeChange with:", updatedSelectedItems);
      
      // ส่งค่าที่อัพเดตไปยัง prop onSizeChange
      onSizeChange(updatedSelectedItems);
      return updatedSelectedItems;
    });
  };;  

  const handleSelectAllChange = () => {
    console.log("Disable/Sizes - handleSelectAllChange called, current selectAll:", selectAll);
    
    if (selectAll) {
      console.log("Disable/Sizes - clearing all selections");
      setSelectedItems([]);
      onSizeChange([]); // ส่งค่าที่ว่างไปยัง prop onSizeChange
    } else {
      const allItemIds = items.map((item) => item._id);
      // console.log("Disable/Sizes - selecting all items:", allItemIds);
      setSelectedItems(allItemIds);
      onSizeChange(allItemIds); // ส่งค่าที่เลือกทั้งหมดไปยัง prop onSizeChange
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    if (selectedItems.length === items.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedItems, items.length]);

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
                <Checkbox
                  disabled={!isEditing}
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                />
                <Typography
                  sx={{
                    marginRight: "30px",
                    color: "#343434",
                    fontFamily: "Calibri",
                    fontSize: "16px",
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
                      color: "#343434",
                      fontFamily: "Calibri",
                      fontSize: "16px",
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
