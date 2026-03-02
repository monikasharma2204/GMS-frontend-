import React, { useState, useEffect } from "react";
import { Box, FormControlLabel, Typography, Checkbox } from "@mui/material";
import axios from "axios";
import {API_URL} from "config/config.js";
const Shapes = ({ selectedData, isEditing, onShapeChange }) => {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    // Fetch shape items and filter for active status
    axios
      .get(API_URL + "/master?master_type=master_stone_shape")
      .then((response) => {
        const activeItems = response.data.filter(
          (item) => item.master_status === "active"
        );
        setItems(activeItems);
        // Initialize selectedItems based on selectedData
        if (selectedData?.master_info?.master_shapes?.length > 0) {
          setSelectedItems(selectedData.master_info.master_shapes);
        } else {
          setSelectedItems([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [selectedData]);

  const handleCheckboxChange = (id) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = prevSelectedItems.includes(id)
        ? prevSelectedItems.filter((item) => item !== id)
        : [...prevSelectedItems, id];
  
      // ส่งค่าที่อัพเดตไปยัง prop onShapeChange
      onShapeChange(updatedSelectedItems);
      return updatedSelectedItems;
    });
  };;  

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedItems([]);
      onShapeChange([]); // ส่งค่าที่ว่างไปยัง prop onShapeChange
    } else {
      const allItemIds = items.map((item) => item._id);
      setSelectedItems(allItemIds);
      onShapeChange(allItemIds); // ส่งค่าที่เลือกทั้งหมดไปยัง prop onShapeChange
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

export default Shapes;
