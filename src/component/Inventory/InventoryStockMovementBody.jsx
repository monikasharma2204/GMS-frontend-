import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { getStockMovements } from "../../services/stockMovementService.js";
import InventoryStockMovementInSide from "./InventoryStockMovementInSide.jsx";

const InventoryStockMovementBody = ({ }) => {
  const [rowPP, setRowPP] = React.useState("");
  const [stockMovements, setStockMovements] = useState([]);
  const [filteredStockMovements, setFilteredStockMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [selectedItem, setSelectedItem] = useState(null);

  // Fetch stock movement data
  const fetchStockMovements = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getStockMovements();
      setStockMovements(result.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch stock movements');
      console.error('Error fetching stock movements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockMovements();
  }, []);

  // Filter stock movements based on search term and dates
  useEffect(() => {
    let filtered = stockMovements;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.stone_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.lot_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.stone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.shape?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.color?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.cutting?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.quality?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.clarity?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredStockMovements(filtered);
  }, [stockMovements, searchTerm]);

  const handleChange = (event) => {
    setRowPP(event.target.value);
  };

  const handleRowClick = (item) => {
    setSelectedItem(item);
  };

  const handleBackClick = () => {
    setSelectedItem(null);
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  // Show detail component if item is selected
  if (selectedItem) {
    return (
      <InventoryStockMovementInSide
        selectedItem={selectedItem}
        onBack={handleBackClick}
      />
    );
  }

  return (
    <>
      <Box
        sx={{
          padding: "24px 24px 32px 24px",
        }}
      >
        <Box
          sx={{
            padding: "32px 32px 0px 32px",
            bgcolor: "#F8F8F8",
            minHeight: "687px",
          }}
        >
          <Box>
            <Box
              sx={{
                height: "38px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  sx={{
                    color: "#343434",
                    fontFamily: "Calibri",
                    fontSize: "20px",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "normal",
                  }}
                >
                  Stock Movement List
                </Typography>
                <Typography
                  sx={{
                    color: "#666666",
                    fontFamily: "Calibri",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    marginLeft: "16px",
                  }}
                >
                  (Click any row to view details)
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                  sx={{
                    color: "#343434",
                    fontFamily: "Calibri",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "normal",
                  }}
                >
                  Date :
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    format="DD/MM/YYYY"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: "#FFF",
                        width: "150px",
                        height: "34px",
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#8BB4FF",
                        },
                        "&:hover": {
                          backgroundColor: "#F5F8FF",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#8BB4FF",
                        },
                        "& .MuiInputBase-input": {
                          fontSize: "16px",
                          fontFamily: "Calibri",
                        },
                      },
                      marginRight: "8px",
                      marginLeft: "8px",
                    }}
                  />
                </LocalizationProvider>
                <Typography
                  sx={{
                    color: "#343434",
                    fontFamily: "Calibri",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "normal",
                  }}
                >
                  To
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    format="DD/MM/YYYY"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                        backgroundColor: "#FFF",
                        width: "150px",
                        height: "34px",
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#8BB4FF",
                        },
                        "&:hover": {
                          backgroundColor: "#F5F8FF",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#8BB4FF",
                        },
                        "& .MuiInputBase-input": {
                          fontSize: "16px",
                          fontFamily: "Calibri",
                        },
                      },
                      marginRight: "24px",
                      marginLeft: "8px",
                    }}
                  />
                </LocalizationProvider>
                <TextField
                  placeholder="Search List ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M10.4993 2C9.14387 2.00012 7.80814 2.32436 6.60353 2.94569C5.39893 3.56702 4.36037 4.46742 3.57451 5.57175C2.78866 6.67609 2.27829 7.95235 2.08599 9.29404C1.89368 10.6357 2.02503 12.004 2.46906 13.2846C2.91308 14.5652 3.65692 15.7211 4.63851 16.6557C5.6201 17.5904 6.81098 18.2768 8.11179 18.6576C9.4126 19.0384 10.7856 19.1026 12.1163 18.8449C13.447 18.5872 14.6967 18.015 15.7613 17.176L19.4133 20.828C19.6019 21.0102 19.8545 21.111 20.1167 21.1087C20.3789 21.1064 20.6297 21.0012 20.8151 20.8158C21.0005 20.6304 21.1057 20.3796 21.108 20.1174C21.1102 19.8552 21.0094 19.6026 20.8273 19.414L17.1753 15.762C18.1633 14.5086 18.7784 13.0024 18.9504 11.4157C19.1223 9.82905 18.8441 8.22602 18.1475 6.79009C17.4509 5.35417 16.3642 4.14336 15.0116 3.29623C13.659 2.44911 12.0952 1.99989 10.4993 2ZM3.99928 10.5C3.99928 8.77609 4.6841 7.12279 5.90308 5.90381C7.12207 4.68482 8.77537 4 10.4993 4C12.2232 4 13.8765 4.68482 15.0955 5.90381C16.3145 7.12279 16.9993 8.77609 16.9993 10.5C16.9993 12.2239 16.3145 13.8772 15.0955 15.0962C13.8765 16.3152 12.2232 17 10.4993 17C8.77537 17 7.12207 16.3152 5.90308 15.0962C4.6841 13.8772 3.99928 12.2239 3.99928 10.5Z"
                            fill="#57646F"
                          />
                        </svg>
                      </InputAdornment>
                    ),
                    sx: {
                      color: "#9A9A9A",
                      fontFamily: "Calibri",
                      fontSize: "16px",
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
                      borderRadius: "10px",
                      backgroundColor: "#FFF",
                      width: "330px",
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
                    marginRight: "24px",
                  }}
                />
                <Typography
                  sx={{
                    color: "#343434",
                    fontFamily: "Calibri",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "normal",
                  }}
                >
                  Rows per page
                </Typography>
                <FormControl
                  defaultValue="10"
                  sx={{
                    height: "40px",
                    width: "69px",
                    marginLeft: "8px",
                  }}
                >
                  <Select
                    sx={{
                      height: "40px",
                      width: "69px",
                      backgroundColor: "#FFF",
                      color: "var(--Main-Text, #343434)",
                      fontFamily: "Calibri",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 400,
                    }}
                    value={rowPP}
                    onChange={handleChange}
                  >
                    <MenuItem
                      value={10}
                      sx={{
                        color: "var(--Main-Text, #343434)",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 400,
                      }}
                    >
                      10
                    </MenuItem>
                    <MenuItem
                      value={20}
                      sx={{
                        color: "var(--Main-Text, #343434)",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 400,
                      }}
                    >
                      20
                    </MenuItem>
                    <MenuItem
                      value={30}
                      sx={{
                        color: "var(--Main-Text, #343434)",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 400,
                      }}
                    >
                      30
                    </MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            {/* Summary Information */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "16px",
                marginBottom: "8px",
              }}
            >
              <Typography
                sx={{
                  color: "#666666",
                  fontFamily: "Calibri",
                  fontSize: "14px",
                  fontStyle: "normal",
                  fontWeight: 400,
                }}
              >
                Total Items: {stockMovements.length} | Showing: {filteredStockMovements.length}
              </Typography>
            </Box>

            <Box
              sx={{
                maxWidth: "1580px",
                borderRadius: "5px",
                border: "1px solid #C6C6C8",
                marginTop: "24px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  height: "600px",
                  overflow: "scroll",
                  "&::-webkit-scrollbar": {
                    height: "10px",
                    width: "5px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "#FFF",
                    borderRadius: "5px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#919191",
                    borderRadius: "5px",
                  },
                  bgcolor: "#FFF",
                }}
              >
                <Box>
                  <Box
                    sx={{
                      height: "42px",
                      gap: "4px",
                      bgcolor: "#EDEDED",
                      borderBottom: "1px solid #C6C6C8",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >

                    <Box sx={{ padding: "12px 8px" }}>
                      <Typography
                        sx={{
                          color: "#343434",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 700,
                          lineHeight: "normal",
                        }}
                      >
                        #
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "185px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#343434",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 700,
                          lineHeight: "normal",
                        }}
                      >
                        Stone Code
                      </Typography>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="14"
                        viewBox="0 0 15 14"
                        fill="none"
                      >
                        <path
                          d="M2.83333 1.75H12.1667C12.3214 1.75 12.4697 1.81146 12.5791 1.92085C12.6885 2.03025 12.75 2.17862 12.75 2.33333V3.2585C12.75 3.4132 12.6885 3.56155 12.5791 3.67092L8.83758 7.41242C8.72818 7.52179 8.6667 7.67014 8.66667 7.82483V11.5028C8.66666 11.5914 8.64645 11.6789 8.60755 11.7586C8.56866 11.8383 8.51211 11.9081 8.44221 11.9626C8.3723 12.0172 8.29088 12.0551 8.20414 12.0734C8.11739 12.0918 8.0276 12.0901 7.94158 12.0686L6.77492 11.7769C6.64877 11.7453 6.53681 11.6725 6.4568 11.57C6.37679 11.4674 6.33334 11.3411 6.33333 11.2111V7.82483C6.3333 7.67014 6.27182 7.52179 6.16242 7.41242L2.42092 3.67092C2.31151 3.56155 2.25003 3.4132 2.25 3.2585V2.33333C2.25 2.17862 2.31146 2.03025 2.42085 1.92085C2.53025 1.81146 2.67862 1.75 2.83333 1.75Z"
                          stroke="#666666"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "60px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#343434",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 700,
                          lineHeight: "normal",
                        }}
                      >
                        Lot
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "120px",
                        display: "flex",
                        alignItems: "center",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#343434",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 700,
                          lineHeight: "normal",
                        }}
                      >
                        Stone
                      </Typography>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="14"
                        viewBox="0 0 15 14"
                        fill="none"
                      >
                        <path
                          d="M2.83333 1.75H12.1667C12.3214 1.75 12.4697 1.81146 12.5791 1.92085C12.6885 2.03025 12.75 2.17862 12.75 2.33333V3.2585C12.75 3.4132 12.6885 3.56155 12.5791 3.67092L8.83758 7.41242C8.72818 7.52179 8.6667 7.67014 8.66667 7.82483V11.5028C8.66666 11.5914 8.64645 11.6789 8.60755 11.7586C8.56866 11.8383 8.51211 11.9081 8.44221 11.9626C8.3723 12.0172 8.29088 12.0551 8.20414 12.0734C8.11739 12.0918 8.0276 12.0901 7.94158 12.0686L6.77492 11.7769C6.64877 11.7453 6.53681 11.6725 6.4568 11.57C6.37679 11.4674 6.33334 11.3411 6.33333 11.2111V7.82483C6.3333 7.67014 6.27182 7.52179 6.16242 7.41242L2.42092 3.67092C2.31151 3.56155 2.25003 3.4132 2.25 3.2585V2.33333C2.25 2.17862 2.31146 2.03025 2.42085 1.92085C2.53025 1.81146 2.67862 1.75 2.83333 1.75Z"
                          stroke="#666666"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "100px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#343434",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 700,
                          lineHeight: "normal",
                        }}
                      >
                        Shape
                      </Typography>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="14"
                        viewBox="0 0 15 14"
                        fill="none"
                      >
                        <path
                          d="M2.83333 1.75H12.1667C12.3214 1.75 12.4697 1.81146 12.5791 1.92085C12.6885 2.03025 12.75 2.17862 12.75 2.33333V3.2585C12.75 3.4132 12.6885 3.56155 12.5791 3.67092L8.83758 7.41242C8.72818 7.52179 8.6667 7.67014 8.66667 7.82483V11.5028C8.66666 11.5914 8.64645 11.6789 8.60755 11.7586C8.56866 11.8383 8.51211 11.9081 8.44221 11.9626C8.3723 12.0172 8.29088 12.0551 8.20414 12.0734C8.11739 12.0918 8.0276 12.0901 7.94158 12.0686L6.77492 11.7769C6.64877 11.7453 6.53681 11.6725 6.4568 11.57C6.37679 11.4674 6.33334 11.3411 6.33333 11.2111V7.82483C6.3333 7.67014 6.27182 7.52179 6.16242 7.41242L2.42092 3.67092C2.31151 3.56155 2.25003 3.4132 2.25 3.2585V2.33333C2.25 2.17862 2.31146 2.03025 2.42085 1.92085C2.53025 1.81146 2.67862 1.75 2.83333 1.75Z"
                          stroke="#666666"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "100px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#343434",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 700,
                          lineHeight: "normal",
                        }}
                      >
                        Size
                      </Typography>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="14"
                        viewBox="0 0 15 14"
                        fill="none"
                      >
                        <path
                          d="M2.83333 1.75H12.1667C12.3214 1.75 12.4697 1.81146 12.5791 1.92085C12.6885 2.03025 12.75 2.17862 12.75 2.33333V3.2585C12.75 3.4132 12.6885 3.56155 12.5791 3.67092L8.83758 7.41242C8.72818 7.52179 8.6667 7.67014 8.66667 7.82483V11.5028C8.66666 11.5914 8.64645 11.6789 8.60755 11.7586C8.56866 11.8383 8.51211 11.9081 8.44221 11.9626C8.3723 12.0172 8.29088 12.0551 8.20414 12.0734C8.11739 12.0918 8.0276 12.0901 7.94158 12.0686L6.77492 11.7769C6.64877 11.7453 6.53681 11.6725 6.4568 11.57C6.37679 11.4674 6.33334 11.3411 6.33333 11.2111V7.82483C6.3333 7.67014 6.27182 7.52179 6.16242 7.41242L2.42092 3.67092C2.31151 3.56155 2.25003 3.4132 2.25 3.2585V2.33333C2.25 2.17862 2.31146 2.03025 2.42085 1.92085C2.53025 1.81146 2.67862 1.75 2.83333 1.75Z"
                          stroke="#666666"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px",
                        width: "110px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#343434",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 700,
                          lineHeight: "normal",
                        }}
                      >
                        Color
                      </Typography>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="14"
                        viewBox="0 0 15 14"
                        fill="none"
                      >
                        <path
                          d="M2.83333 1.75H12.1667C12.3214 1.75 12.4697 1.81146 12.5791 1.92085C12.6885 2.03025 12.75 2.17862 12.75 2.33333V3.2585C12.75 3.4132 12.6885 3.56155 12.5791 3.67092L8.83758 7.41242C8.72818 7.52179 8.6667 7.67014 8.66667 7.82483V11.5028C8.66666 11.5914 8.64645 11.6789 8.60755 11.7586C8.56866 11.8383 8.51211 11.9081 8.44221 11.9626C8.3723 12.0172 8.29088 12.0551 8.20414 12.0734C8.11739 12.0918 8.0276 12.0901 7.94158 12.0686L6.77492 11.7769C6.64877 11.7453 6.53681 11.6725 6.4568 11.57C6.37679 11.4674 6.33334 11.3411 6.33333 11.2111V7.82483C6.3333 7.67014 6.27182 7.52179 6.16242 7.41242L2.42092 3.67092C2.31151 3.56155 2.25003 3.4132 2.25 3.2585V2.33333C2.25 2.17862 2.31146 2.03025 2.42085 1.92085C2.53025 1.81146 2.67862 1.75 2.83333 1.75Z"
                          stroke="#666666"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "100px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#343434",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 700,
                          lineHeight: "normal",
                        }}
                      >
                        Cutting
                      </Typography>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="14"
                        viewBox="0 0 15 14"
                        fill="none"
                      >
                        <path
                          d="M2.83333 1.75H12.1667C12.3214 1.75 12.4697 1.81146 12.5791 1.92085C12.6885 2.03025 12.75 2.17862 12.75 2.33333V3.2585C12.75 3.4132 12.6885 3.56155 12.5791 3.67092L8.83758 7.41242C8.72818 7.52179 8.6667 7.67014 8.66667 7.82483V11.5028C8.66666 11.5914 8.64645 11.6789 8.60755 11.7586C8.56866 11.8383 8.51211 11.9081 8.44221 11.9626C8.3723 12.0172 8.29088 12.0551 8.20414 12.0734C8.11739 12.0918 8.0276 12.0901 7.94158 12.0686L6.77492 11.7769C6.64877 11.7453 6.53681 11.6725 6.4568 11.57C6.37679 11.4674 6.33334 11.3411 6.33333 11.2111V7.82483C6.3333 7.67014 6.27182 7.52179 6.16242 7.41242L2.42092 3.67092C2.31151 3.56155 2.25003 3.4132 2.25 3.2585V2.33333C2.25 2.17862 2.31146 2.03025 2.42085 1.92085C2.53025 1.81146 2.67862 1.75 2.83333 1.75Z"
                          stroke="#666666"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "85px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#343434",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 700,
                          lineHeight: "normal",
                        }}
                      >
                        Quality
                      </Typography>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="14"
                        viewBox="0 0 15 14"
                        fill="none"
                      >
                        <path
                          d="M2.83333 1.75H12.1667C12.3214 1.75 12.4697 1.81146 12.5791 1.92085C12.6885 2.03025 12.75 2.17862 12.75 2.33333V3.2585C12.75 3.4132 12.6885 3.56155 12.5791 3.67092L8.83758 7.41242C8.72818 7.52179 8.6667 7.67014 8.66667 7.82483V11.5028C8.66666 11.5914 8.64645 11.6789 8.60755 11.7586C8.56866 11.8383 8.51211 11.9081 8.44221 11.9626C8.3723 12.0172 8.29088 12.0551 8.20414 12.0734C8.11739 12.0918 8.0276 12.0901 7.94158 12.0686L6.77492 11.7769C6.64877 11.7453 6.53681 11.6725 6.4568 11.57C6.37679 11.4674 6.33334 11.3411 6.33333 11.2111V7.82483C6.3333 7.67014 6.27182 7.52179 6.16242 7.41242L2.42092 3.67092C2.31151 3.56155 2.25003 3.4132 2.25 3.2585V2.33333C2.25 2.17862 2.31146 2.03025 2.42085 1.92085C2.53025 1.81146 2.67862 1.75 2.83333 1.75Z"
                          stroke="#666666"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "100px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#343434",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 700,
                          lineHeight: "normal",
                        }}
                      >
                        Clarity
                      </Typography>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="14"
                        viewBox="0 0 15 14"
                        fill="none"
                      >
                        <path
                          d="M2.83333 1.75H12.1667C12.3214 1.75 12.4697 1.81146 12.5791 1.92085C12.6885 2.03025 12.75 2.17862 12.75 2.33333V3.2585C12.75 3.4132 12.6885 3.56155 12.5791 3.67092L8.83758 7.41242C8.72818 7.52179 8.6667 7.67014 8.66667 7.82483V11.5028C8.66666 11.5914 8.64645 11.6789 8.60755 11.7586C8.56866 11.8383 8.51211 11.9081 8.44221 11.9626C8.3723 12.0172 8.29088 12.0551 8.20414 12.0734C8.11739 12.0918 8.0276 12.0901 7.94158 12.0686L6.77492 11.7769C6.64877 11.7453 6.53681 11.6725 6.4568 11.57C6.37679 11.4674 6.33334 11.3411 6.33333 11.2111V7.82483C6.3333 7.67014 6.27182 7.52179 6.16242 7.41242L2.42092 3.67092C2.31151 3.56155 2.25003 3.4132 2.25 3.2585V2.33333C2.25 2.17862 2.31146 2.03025 2.42085 1.92085C2.53025 1.81146 2.67862 1.75 2.83333 1.75Z"
                          stroke="#666666"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </Box>

                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "283px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        bgcolor: "rgba(5, 89, 91, 0.40)",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#343434",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 700,
                          lineHeight: "normal",
                        }}
                      >
                        In
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "284px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        bgcolor: "rgba(224, 4, 16, 0.40)",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#343434",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 700,
                          lineHeight: "normal",
                        }}
                      >
                        Out
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "285px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        bgcolor: "rgba(139, 180, 255, 0.40)",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#343434",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 700,
                          lineHeight: "normal",
                        }}
                      >
                        Balance
                      </Typography>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      height: "20px",
                      gap: "4px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ marginLeft: "1172px" }} />

                    <Box
                      sx={{
                        width: "148px",
                        display: "flex",
                        alignItems: "center",
                        bgcolor: "rgba(5, 89, 91, 0.20)",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#343434",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 700,
                          lineHeight: "normal",
                          marginLeft: "12px",
                        }}
                      >
                        Cts
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: "148px",
                        display: "flex",
                        alignItems: "center",
                        bgcolor: "rgba(5, 89, 91, 0.20)",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#343434",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 700,
                          lineHeight: "normal",
                          marginLeft: "12px",
                        }}
                      >
                        Pcs
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: "148px",
                        display: "flex",
                        alignItems: "center",
                        bgcolor: "rgba(224, 4, 16, 0.20)",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#343434",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 700,
                          lineHeight: "normal",
                          marginLeft: "12px",
                        }}
                      >
                        Cts
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: "148px",
                        display: "flex",
                        alignItems: "center",
                        bgcolor: "rgba(224, 4, 16, 0.20)",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#343434",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 700,
                          lineHeight: "normal",
                          marginLeft: "12px",
                        }}
                      >
                        Pcs
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: "148px",
                        display: "flex",
                        alignItems: "center",
                        bgcolor: "rgba(139, 180, 255, 0.20)",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#343434",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 700,
                          lineHeight: "normal",
                          marginLeft: "12px",
                        }}
                      >
                        Cts
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        width: "148px",
                        display: "flex",
                        alignItems: "center",
                        bgcolor: "rgba(139, 180, 255, 0.20)",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#343434",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 700,
                          lineHeight: "normal",
                          marginLeft: "12px",
                        }}
                      >
                        Pcs
                      </Typography>
                    </Box>
                  </Box>
                  {filteredStockMovements.length > 0 ? (
                    filteredStockMovements.map((item, index) => (
                      <Box
                        key={index}
                        onClick={() => handleRowClick(item)}
                        sx={{
                          height: "42px",
                          gap: "4px",
                          borderBottom: "1px solid #C6C6C8",
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                          "&:hover": {
                            backgroundColor: "#F5F8FF",
                          },
                        }}
                      >
                        <Box sx={{ padding: "12px 8px" }}>
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 400,
                              lineHeight: "normal",
                            }}
                          >
                            {index + 1}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "185px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 400,
                              lineHeight: "normal",
                            }}
                          >
                            {item.stone_code}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "60px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 400,
                              lineHeight: "normal",
                            }}
                          >
                            {item.lot_no}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "120px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 400,
                              lineHeight: "normal",
                            }}
                          >
                            {item.stone}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "100px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 400,
                              lineHeight: "normal",
                            }}
                          >
                            {item.shape}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "100px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 400,
                              lineHeight: "normal",
                            }}
                          >
                            {item.size}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            padding: "12px",
                            width: "110px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "left",

                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 400,
                              lineHeight: "normal",
                            }}
                          >
                            {item.color}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "100px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 400,
                              lineHeight: "normal",
                            }}
                          >
                            {item.cutting}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "100px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 400,
                              lineHeight: "normal",
                            }}
                          >
                            {item.quality}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "85px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 400,
                              lineHeight: "normal",
                            }}
                          >
                            {item.clarity}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "130px",
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            borderRight: "1px solid #C6C6C8",
                            borderLeft: "1px solid #C6C6C8",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 400,
                              lineHeight: "normal",
                            }}
                          >
                            {item.in_weight}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "131px",
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            borderRight: "1px solid #C6C6C8",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 400,
                              lineHeight: "normal",
                            }}
                          >
                            {item.in_pcs}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "131px",
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            borderRight: "1px solid #C6C6C8",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 400,
                              lineHeight: "normal",
                            }}
                          >
                            {item.out_weight}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "131px",
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            borderRight: "1px solid #C6C6C8",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 400,
                              lineHeight: "normal",
                            }}
                          >
                            {item.out_pcs}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "131px",
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            borderRight: "1px solid #C6C6C8",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 400,
                              lineHeight: "normal",
                            }}
                          >
                            {item.balance_weight}
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            padding: "12px 8px",
                            width: "131px",
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            borderRight: "1px solid #C6C6C8",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#343434",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 400,
                              lineHeight: "normal",
                            }}
                          >
                            {item.balance_pcs}
                          </Typography>
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <Box
                      sx={{
                        height: "100px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderBottom: "1px solid #C6C6C8",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#9A9A9A",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 400,
                        }}
                      >
                        {stockMovements.length === 0 ? "No stock movements found" : "No results match your search"}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default InventoryStockMovementBody;
