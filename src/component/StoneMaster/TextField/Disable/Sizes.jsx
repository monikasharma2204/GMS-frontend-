import React, { useState, useEffect } from "react";
import { Box, FormControlLabel, Typography, Checkbox } from "@mui/material";
import axios from "axios";
import { API_URL } from "config/config.js";

const Sizes = ({ selectedData, isEditing, onSizeChange }) => {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Fetch items on component mount
  useEffect(() => {
    axios
      .get(API_URL + "/master?master_type=master_stone_size")
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
    let masterInfo = selectedData?.master_info;


    if (typeof masterInfo === 'string') {
      try {
        masterInfo = JSON.parse(masterInfo);
      } catch (e) {
        console.error("Sizes component - error parsing master_info string:", e);
      }
    }


    const sizeIds = masterInfo?.size_ids || selectedData?.size_ids || [];

    if (Array.isArray(sizeIds)) {

      const validIds = sizeIds.map(id => {
        if (typeof id === 'object' && id !== null) {
          return (id._id || id.id || id).toString();
        }
        return id?.toString();
      }).filter(id => id);

      setSelectedItems(validIds);
    } else {
      setSelectedItems([]);
    }
  }, [selectedData]);

  const handleCheckboxChange = (id) => {
    const idStr = id.toString();
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = prevSelectedItems.includes(idStr)
        ? prevSelectedItems.filter((item) => item !== idStr)
        : [...prevSelectedItems, idStr];

      onSizeChange(updatedSelectedItems);
      return updatedSelectedItems;
    });
  };

  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedItems([]);
      onSizeChange([]);
    } else {
      const allItemIds = items.map((item) => (item._id || item.id)?.toString());
      setSelectedItems(allItemIds);
      onSizeChange(allItemIds);
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    if (items.length > 0 && selectedItems.length === items.length) {
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
            Sizes
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap" }}>
          <FormControlLabel
            control={
              <Checkbox
                disabled={!isEditing}
                checked={selectAll}
                onChange={handleSelectAllChange}
              />
            }
            label={
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
            }
          />
          {items.map((item) => {
            const itemId = (item._id || item.id)?.toString();
            return (
              <FormControlLabel
                key={itemId}
                control={
                  <Checkbox
                    disabled={!isEditing}
                    checked={selectedItems.includes(itemId)}
                    onChange={() => handleCheckboxChange(item._id || item.id)}
                  />
                }
                label={
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
                }
              />
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default Sizes;
