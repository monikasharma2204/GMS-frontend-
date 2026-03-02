import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, InputAdornment, Box, Typography } from "@mui/material";
import {API_URL} from "config/config.js";

const SearchBarQuality = ({ onDataSelect, selectedData, isEditing = false }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get(API_URL+"/master?master_type=master_stone_quality")
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  // Sync selectedItemId with parent's selectedData
  useEffect(() => {
    if (selectedData === null) {
      setSelectedItemId(null);
    } else if (selectedData?._id) {
      setSelectedItemId(selectedData._id);
    }
  }, [selectedData]);

  const handleButtonClick = (item) => {
    if (selectedItemId === item._id) {
      setSelectedItemId(null);
      onDataSelect(null);
    } else {
      setSelectedItemId(item._id);
      onDataSelect(item);
    }
  };

  return (
    <>
      <Box sx={{ width: "285px", height: "810px", backgroundColor: "#FFF" }}>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <TextField
            placeholder="Search ..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 19"
                    fill="none"
                  >
                    <path
                      d="M17.2233 18.5L10.3436 11.6208C9.79431 12.0888 9.1626 12.4509 8.44849 12.7073C7.73438 12.9636 7.0166 13.0918 6.29517 13.0918C4.53589 13.0918 3.04688 12.4828 1.82813 11.2648C0.609375 10.0469 0 8.55835 0 6.79918C0 5.04001 0.608642 3.55072 1.82593 2.33131C3.04321 1.1119 4.5315 0.501467 6.29077 0.500003C8.05005 0.498538 9.5398 1.10788 10.76 2.32802C11.9802 3.54816 12.5907 5.03744 12.5914 6.79588C12.5914 7.55902 12.4563 8.29762 12.186 9.01169C11.9158 9.72576 11.5605 10.3366 11.1204 10.8441L18 17.7222L17.2233 18.5ZM6.29517 11.9921C7.75269 11.9921 8.98352 11.4904 9.98767 10.4871C10.9918 9.48371 11.4935 8.25295 11.4928 6.79478C11.4921 5.33662 10.9904 4.10623 9.98767 3.1036C8.98499 2.10098 7.75452 1.5993 6.29626 1.59857C4.83801 1.59784 3.60718 2.09951 2.60376 3.1036C1.60034 4.10769 1.09863 5.33809 1.09863 6.79478C1.09863 8.25148 1.60034 9.48188 2.60376 10.486C3.60718 11.4901 4.83765 11.9928 6.29517 11.9921Z"
                      fill="#4F4A3E"
                    />
                  </svg>
                </InputAdornment>
              ),
              sx: {
                color: "#C0C0C0",
                fontFamily: "Segoe UI",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 400,
              },
            }}
            sx={{
              "& .MuiInputLabel-asterisk": {
                color: "red",
              },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {},
                borderRadius: "20px",
                backgroundColor: "#FFF",
                width: "235px",
                height: "35px",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#8BB4FF",
                },
                "&:hover": {
                  backgroundColor: "#F5F8FF",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#8BB4FF",
                },
              },

              marginTop: "24px",
            }}
          />
        </Box>

        <Box
          sx={{
            marginTop: "24px",
            overflow: "auto",
            "::-webkit-scrollbar": {
              display: "none",
            },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            maxHeight: "723px",
          }}
        >
          {data.length > 0 &&
            data.map((item) => (
              <Box
                key={item._id}
                bgcolor={selectedItemId === item._id ? "#EFEFEF" : "#FFF"}
                onClick={() => isEditing ? "" : handleButtonClick(item)}
                sx={{
                  width: "285px",
                  height: "61px",
                  borderTop: "0.5px solid var(--Line-Table, #C6C6C8)",
                  display: "flex",
                  alignItems: "center",
                  cursor: isEditing ? "" : "pointer",
                }}
              >
                <Typography
                  sx={{
                    marginLeft: "16px",
                    fontFamily: "Calibri",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    color:
                      selectedItemId === item._id
                        ? "#000000"
                        : isEditing
                        ? "#ababab"
                        : item.master_status === "inactive" ? "#BFBFBF" : "#000000",
                  }}
                >
                  {item.code}
                </Typography>
              </Box>
            ))}
        </Box>
      </Box>
    </>
  );
};

export default SearchBarQuality;
