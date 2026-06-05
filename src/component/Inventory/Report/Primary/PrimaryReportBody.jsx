import React, { useState, useEffect, useMemo, useRef } from "react";
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
  Alert,
  Checkbox,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useNavigate } from "react-router-dom";
import apiRequest from "../../../../helpers/apiHelper";
import { exportTransactionToExcel } from "../../../../helpers/excelHelper";
import FooterReport from "../../../Layout/FooterReport.jsx";
import useTableSort from "../../../../hooks/useTableSort";
import SortIcon from "../../../Commons/SortIcon/SortIcon";
import ColumnFilterPopover from "../../../Commons/ColumnFilterPopover/ColumnFilterPopover";
import { useColumnFilters } from "../../../Commons/ColumnFilterPopover/useColumnFilters";

const PRIMARY_REPORT_FILTER_KEYS = {
  location: "location_name",
  type: "type",
 
 
  docdate: "doc_date",
  account: "account",

  stonecode: "stone_code",
  stockid: "stock_id",

  stone: "stone",
  shape: "shape",
  size: "size",
  color: "color",
  cutting: "cutting",
  quality: "quality",
  clarity: "clarity",
  certype: "cer_type",


  currency: "currency_code",
  
};

const normalizeHeaderLabel = (label) => label.toLowerCase().replace(/[^a-z0-9]/g, "");

const PrimaryReportBody = ({ exportTrigger }) => {
  const navigate = useNavigate();
  const [rowPP, setRowPP] = React.useState("");
  const [stocksData, setStocksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [selectedStoneGroup, setSelectedStoneGroup] = useState("");

  const lastExportTrigger = useRef(exportTrigger);

  const stoneGroups = useMemo(() => {
    const groups = new Set();
    stocksData.forEach((stock) => {
      if (stock.master_stone_group_name) {
        groups.add(stock.master_stone_group_name);
      }
    });
    return Array.from(groups).sort();
  }, [stocksData]);

  const handleExportExcel = () => {
    try {
      if (sortedStocksData.length === 0) {
        alert("No data to export");
        return;
      }

      const itemHeaders = [
        "#", "Location", "Type", "Purchase No.", "Load No.", "Doc Date", "Account", "Ref.", "Stone Code", "Stock ID",
        "Lot", "Stone", "Shape", "Size", "Color", "Cutting", "Quality", "Clarity", "Cer Type", "CerNo.",
        "Pcs", "Weight", "Price", "Unit", "Amount", "Currency", "Remark"
      ];

      const itemRows = sortedStocksData.map((stock, index) => [
        index + 1,
        stock.location?.location_name || "N/A",
        stock.type || "N/A",
        stock.Pu_no || "N/A",
        stock.load_no || "N/A",
        formatDate(stock.doc_date),
        stock.account || "N/A",
        stock.ref || "N/A",
        stock.stone_code || "N/A",
        stock.stock_id || "N/A",
        stock.lot_no || "N/A",
        stock.stone || "N/A",
        stock.shape || "N/A",
        stock.size || "N/A",
        stock.color || "N/A",
        stock.cutting || "N/A",
        stock.quality || "N/A",
        stock.clarity || "N/A",
        stock.cer_type || "N/A",
        stock.cer_no || "N/A",
        Number(stock.pcs || 0),
        formatWeight(stock.weight),
            Number(stock.price || 0),
        Number(stock.sale_price || 0),
        stock.unit || "N/A",
        Number(stock.amount || 0),
        "THB",
        stock.remark || ""
      ]);

      exportTransactionToExcel({
        filename: "Primary Report List",
        sheetName: "Primary Report",
        summaryHeaders: ["Total Items"],
        summaryValues: [stocksData.length],
        itemHeaders,
        itemRows
      });

    } catch (err) {
      console.error(err);
      alert("Failed to export Excel");
    }
  };

  useEffect(() => {
    if (exportTrigger > lastExportTrigger.current) {
      handleExportExcel();
    }
    lastExportTrigger.current = exportTrigger;
  }, [exportTrigger]);

  const handleChange = (event) => {
    setRowPP(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const tableStocksData = useMemo(
    () =>
      stocksData.map((stock) => ({
        ...stock,
        location_name: stock.location?.location_name || "",
        currency_code: stock.currency?.code || "THB",
      })),
    [stocksData]
  );

  const stoneGroupFilteredStocksData = useMemo(() => {
    if (!selectedStoneGroup) {
      return tableStocksData;
    }
    return tableStocksData.filter(
      (stock) => stock.master_stone_group_name === selectedStoneGroup
    );
  }, [tableStocksData, selectedStoneGroup]);

  const dateFilteredStocksData = useMemo(() => {
    if (!fromDate && !toDate) {
      return stoneGroupFilteredStocksData;
    }

    return stoneGroupFilteredStocksData.filter((stock) => {
      const docDate = dayjs(stock.doc_date);
      if (!docDate.isValid()) return false;

      const isAfterFrom = !fromDate || docDate.isSame(fromDate, "day") || docDate.isAfter(fromDate, "day");
      const isBeforeTo = !toDate || docDate.isSame(toDate, "day") || docDate.isBefore(toDate, "day");

      return isAfterFrom && isBeforeTo;
    });
  }, [stoneGroupFilteredStocksData, fromDate, toDate]);

  // Filter stocks data based on search term (Ref, Stone code, Stock ID, Lot)
  const filteredStocksData = useMemo(() => {
    if (!searchTerm.trim()) {
      return dateFilteredStocksData;
    }
    const searchLower = searchTerm.toLowerCase().trim();
    return dateFilteredStocksData.filter((stock) => {
      const ref = (stock.ref || "").toLowerCase();
      const stoneCode = (stock.stone_code || "").toLowerCase();
      const stockId = (stock.stock_id || "").toLowerCase();
      const lotNo = (stock.lot_no || "").toLowerCase();

      return (
        ref.includes(searchLower) ||
        stoneCode.includes(searchLower) ||
        stockId.includes(searchLower) ||
        lotNo.includes(searchLower)
      );
    });
  }, [dateFilteredStocksData, searchTerm]);

  const {
    filteredData: columnFilteredStocksData,
    handleFilterClick,
    popoverProps,
  } = useColumnFilters(filteredStocksData, false);
  const { sortedData: sortedStocksData, requestSort, sortConfig, setSortConfig } = useTableSort(
    columnFilteredStocksData,
    { key: "doc_date", direction: "desc" }
  );
  const [selectedItemIds, setSelectedItemIds] = useState([]);

  const getStockRowId = (stock, index) =>
    String(stock._id || stock.id || stock.stock_id || `${stock.lot_no || stock.stone_code || "row"}-${index}`);

  const visibleStockIds = sortedStocksData.map((stock, index) => getStockRowId(stock, index));

  const isAllSelected =
    visibleStockIds.length > 0 && visibleStockIds.every((id) => selectedItemIds.includes(id));

  const handleSelectAll = () => {
    setSelectedItemIds((prev) => {
      if (isAllSelected) {
        return prev.filter((id) => !visibleStockIds.includes(id));
      }

      return Array.from(new Set([...prev, ...visibleStockIds]));
    });
  };

  const handleCheckboxSelection = (rowId) => {
    setSelectedItemIds((prev) =>
      prev.includes(rowId) ? prev.filter((id) => id !== rowId) : [...prev, rowId]
    );
  };

  const handleLoadNoClick = (loadNo) => {
    if (!loadNo) return;
    navigate("/inventory/load", {
      state: {
        openLoadNo: loadNo,
      },
    });
  };

  const handleHeaderClick = (event) => {
    let columnEl = event.target;
    while (columnEl && columnEl.parentElement !== event.currentTarget) {
      columnEl = columnEl.parentElement;
    }
    if (!columnEl) return;

    const columnKey = PRIMARY_REPORT_FILTER_KEYS[normalizeHeaderLabel(columnEl.textContent || "")];
    if (columnKey) {
      if (columnKey === "doc_date") {
        requestSort(columnKey);
        return;
      }
      handleFilterClick({ currentTarget: columnEl }, columnKey);
    }
  };

  // Fetch stocks data from API
  useEffect(() => {
    const fetchStocksData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiRequest("GET", "/stocks");
        setStocksData(response);
      } catch (err) {
        console.error("Error fetching stocks data:", err);
        setError("Failed to fetch stocks data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchStocksData();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return dayjs(dateString).format("DD/MM/YYYY");
  };

  // Format currency for display
  const formatCurrency = (amount) => {
    if (!amount) return "0.00";
    return parseFloat(amount).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatWeight = (weight) => {
    const value = Number(weight);
    return Number.isFinite(value) ? value.toFixed(3) : "0.000";
  };
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
              <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
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
                  Primary Report List
                </Typography>
                <FormControl sx={{ minWidth: "150px" }}>
                  <Select
                    value={selectedStoneGroup}
                    onChange={(e) => setSelectedStoneGroup(e.target.value)}
                    displayEmpty
                    renderValue={(value) => {
                      if (value === "") {
                        return "Select Stone Groups";
                      }
                      return value;
                    }}
                    sx={{
                      borderRadius: "8px",
                      height: "34px",
                      backgroundColor: "#FFF",
                      fontFamily: "Calibri",
                      fontSize: "14px",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#C6C6C8",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#8BB4FF",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#8BB4FF",
                      },
                    }}
                  >
                    <MenuItem value="" sx={{ fontFamily: "Calibri", fontSize: "14px" }}>
                      All
                    </MenuItem>
                    {stoneGroups.map((group) => (
                      <MenuItem key={group} value={group} sx={{ fontFamily: "Calibri", fontSize: "14px" }}>
                        {group}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                    value={fromDate}
                    onChange={setFromDate}
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
                    value={toDate}
                    onChange={setToDate}
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
                  onChange={handleSearchChange}
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
                <Typography sx={{ color: "#343434", fontFamily: "Calibri", fontSize: "16px", fontWeight: 400 }}>Rows per page</Typography>
                <FormControl sx={{ borderRadius: "8px", height: "34px", width: "69px", marginLeft: "8px" }}>
                  <Select sx={{ padding: "0px", borderRadius: "8px", height: "34px", width: "69px", backgroundColor: "#FFF", fontFamily: "Calibri" }} value={rowPP} onChange={handleChange}>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={30}>30</MenuItem>
                  </Select>
                </FormControl>
              </Box>
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
                  bgcolor: "#FFF"
                }}
              >
                <Box>
                  <Box
                    onClick={handleHeaderClick}
                    sx={{
                      height: "42px",
                      gap: "4px",
                      bgcolor: "#EDEDED",
                      borderBottom: "1px solid #C6C6C8",
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <Checkbox
                      checked={isAllSelected}
                      onClick={(event) => event.stopPropagation()}
                      onChange={handleSelectAll}
                    />

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
                        width: "140px",
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
                        Location
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
                        width: "140px",
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
                        Type
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
                    <Box sx={{  padding: "12px 8px",
                        width: "140px",
                        display: "flex",
                        alignItems: "center",cursor: "default" }}>
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
                        Purchase No.
                      </Typography>
                        
                    </Box>
                    <Box sx={{ padding: "12px 8px", width: "140px"  , cursor: "default"}}>
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
                        Load No.
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "140px",
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
                        Doc Date
                      </Typography>
                      <SortIcon sortConfig={sortConfig} columnKey="doc_date" />
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "140px",
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
                        Account
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
                        width: "140px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center", cursor: "default"
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
                        Ref.
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "200px",
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
                        width: "140px",
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
                        Stock ID
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
                        justifyContent: "center",
                        alignItems: "center",
                        borderRight: "1px solid #C6C6C8", cursor: "default"
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
                        width: "140px",
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
                        padding: "12px 8px",
                        width: "140px",
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
                        width: "140px",
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
                        Cer Type
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
                        width: "140px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center", cursor: "default"
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
                        CerNo.
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "60px",
                        display: "flex",
                        justifyContent: "right",
                        alignItems: "center", cursor: "default"
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
                        Pcs
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "120px",
                        display: "flex",
                        justifyContent: "right",
                        alignItems: "center", cursor: "default"
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
                        Weight
                      </Typography>
                    </Box>
                   

                      
                     <Box
                      sx={{
                        padding: "12px 8px",
                        width: "120px",
                        display: "flex",
                        justifyContent: "right",
                        alignItems: "center", cursor: "default",
                        
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
                         Price
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "90px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center", cursor: "default"

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
                        Unit
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "120px",
                        display: "flex",
                        justifyContent: "right",
                        alignItems: "center", cursor: "default"
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
                        Amount
                      </Typography>
                    </Box>

                     <Box
                      sx={{
                        padding: "12px 8px",
                        width: "120px",
                        display: "flex",
                        justifyContent: "right",
                        alignItems: "center", cursor: "default",
                        borderLeft: "1px solid #C6C6C8"
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
                         Sale Price
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        padding: "12px 8px",
                        width: "90px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderLeft: "1px solid #C6C6C8",
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
                        Currency
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
                        width: "286px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center", cursor: "default"
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
                        Remark
                      </Typography>
                    </Box>
                  </Box>
                  {/* Loading State */}
                  {loading && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "200px",
                      }}
                    >
                      <CircularProgress />
                    </Box>
                  )}

                  {/* Error State */}
                  {error && (
                    <Box sx={{ padding: "20px" }}>
                      <Alert severity="error">{error}</Alert>
                    </Box>
                  )}

                  {/* Dynamic Table Data */}
                  {!loading && !error && sortedStocksData.map((stock, index) => {
                    const rowId = getStockRowId(stock, index);

                    return (
                    <Box
                      key={rowId}
                      sx={{
                        height: "42px",
                        gap: "4px",
                        bgcolor: "#FFF",
                        borderBottom: "1px solid #C6C6C8",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Checkbox
                        checked={selectedItemIds.includes(rowId)}
                        onChange={() => handleCheckboxSelection(rowId)}
                      />
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
                          width: "140px",
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
                          {stock.location?.location_name || "N/A"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          padding: "12px 8px",
                          width: "140px",
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
                          {stock.type || "N/A"}
                        </Typography>
                      </Box>
                      <Box sx={{ padding: "12px 8px", width: "140px" }}>
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
                          {stock.Pu_no || "N/A"}
                        </Typography>
                      </Box>
                      <Box
                        onClick={() => handleLoadNoClick(stock.load_no)}
                        sx={{
                          padding: "12px 8px",
                          width: "140px",
                          cursor: stock.load_no ? "pointer" : "default",
                          "&:hover .load-no-text": {
                            textDecoration: stock.load_no ? "underline" : "none",
                          },
                        }}
                      >
                        <Typography
                          className="load-no-text"
                          sx={{
                            color: stock.load_no ? "#05595B" : "#343434",
                            fontFamily: "Calibri",
                            fontSize: "16px",
                            fontStyle: "normal",
                            fontWeight: stock.load_no ? 700 : 400,
                            lineHeight: "normal",
                            textDecoration: "none",
                          }}
                        >
                          {stock.load_no || "N/A"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          padding: "12px 8px",
                          width: "140px",
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
                          {formatDate(stock.doc_date)}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          padding: "12px 8px",
                          width: "140px",
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
                          {stock.account || "N/A"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          padding: "12px",
                          width: "140px",
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
                          {stock.ref || "N/A"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          padding: "12px 8px",
                          width: "200px",
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
                          {stock.stone_code || "N/A"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          padding: "12px 8px",
                          width: "140px",
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
                          {stock.stock_id || "N/A"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          padding: "12px 8px",
                          width: "60px",
                          display: "flex",
                          justifyContent: "center",
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
                          {stock.lot_no || "N/A"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          padding: "12px 8px",
                          width: "140px",
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
                          {stock.stone || "N/A"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          padding: "12px 8px",
                          width: "100px",
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
                          {stock.shape || "N/A"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          padding: "12px 8px",
                          width: "100px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
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
                          {stock.size || "N/A"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          padding: "12px 8px",
                          width: "140px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
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
                          {stock.color || "N/A"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          padding: "12px 8px",
                          width: "100px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
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
                          {stock.cutting || "N/A"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          padding: "12px 8px",
                          width: "100px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
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
                          {stock.quality || "N/A"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          padding: "12px 8px",
                          width: "100px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
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
                          {stock.clarity || "N/A"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          padding: "12px 8px",
                          width: "140px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
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
                          {stock.cer_type || "N/A"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          padding: "12px 8px",
                          width: "140px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
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
                          {stock.cer_no || "N/A"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          padding: "12px 8px",
                          width: "60px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "right"
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
                          {stock.pcs || "0"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          padding: "12px 8px",
                          width: "120px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "right"
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
                          {formatWeight(stock.weight)}
                        </Typography>
                      </Box>

                    

                      <Box
                        sx={{
                          padding: "12px 8px",
                          width: "120px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "right",
                          borderLeft: "1px solid #C6C6C8"
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
                          {formatCurrency(stock.sale_price)}
                        </Typography>
                      </Box>

                          <Box
                        sx={{
                          padding: "12px 8px",
                          width: "120px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "right",
                      
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
                          {formatCurrency(stock.price)}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          padding: "12px 8px",
                          width: "90px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
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
                          {stock.unit || "N/A"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          padding: "12px 8px",
                          width: "120px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "right"
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
                          {formatCurrency(stock.amount)}
                        </Typography>
                      </Box>

                      
                      <Box
                        sx={{
                          padding: "12px 8px",
                          width: "120px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "right",
                          borderLeft: "1px solid #C6C6C8"
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
                          {formatCurrency(stock.sale_price)}
                        </Typography>
                      </Box>

                      
                      <Box
                        sx={{
                          padding: "12px 8px",
                          width: "90px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
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
                          THB
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: "295px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          variant="outlined"
                          fullWidth
                          disabled
                          value={stock.remark || ""}
                          inputProps={{
                            shrink: true,
                            sx: {
                              textAlign: "right",
                              color: "black",
                              fontFamily: "Calibri",
                              fontSize: "16px",
                              fontStyle: "normal",
                              fontWeight: 400,
                            },
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              width: "295px",
                              height: "34px",
                              borderRadius: "4px",
                            },
                            "& .MuiInputBase-root.Mui-disabled": {
                              "& > fieldset": {
                                borderColor: "#E6E6E6",
                              },
                              bgcolor: "#F0F0F0",
                              borderRadius: "4px",
                            },
                          }}
                        />
                      </Box>
                    </Box>
                    );
                  })}

                  {/* No Data State */}
                  {!loading && !error && sortedStocksData.length === 0 && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "200px",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#666666",
                          fontFamily: "Calibri",
                          fontSize: "16px",
                          fontStyle: "normal",
                          fontWeight: 400,
                        }}
                      >
                        No stocks data available
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <ColumnFilterPopover {...popoverProps} sortConfig={sortConfig} setSortConfig={setSortConfig} />
        <FooterReport onExcel={handleExportExcel} />
      </Box>
    </>
  );
};

export default PrimaryReportBody;
