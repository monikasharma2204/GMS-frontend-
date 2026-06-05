import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Modal,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Button,
  Paper,
} from "@mui/material";

import apiRequest from "../../../helpers/apiHelper";
import useTableSort from "../../../hooks/useTableSort";
import ColumnFilterPopover from "../../Commons/ColumnFilterPopover/ColumnFilterPopover";
import { useColumnFilters } from "../../Commons/ColumnFilterPopover/useColumnFilters";
import SortIcon from "../../Commons/SortIcon/SortIcon";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1360,
  height: 842,
  bgcolor: "background.paper",
  borderRadius: "8px",
};

const headerText = {
  color: "var(--Main-Text, #343434)",
  fontFamily: "Calibri",
  fontSize: "16px",
  fontStyle: "normal",
  fontWeight: 700,
};

const bodyText = {
  color: "var(--Main-Text, #343434)",
  fontFamily: "Calibri",
  fontSize: "16px",
  fontStyle: "normal",
  fontWeight: 400,
};

const columns = [
  { key: "stock_id", label: "Stock ID", width: 120 },
  { key: "doc_date", label: "Doc Date", width: 120 },
  { key: "lot_no", label: "Lot", width: 100 },
  { key: "stone_code", label: "Stone Code", width: 160 },
  { key: "stone", label: "Stone", width: 140 },
  { key: "shape", label: "Shape", width: 120 },
  { key: "size", label: "Size", width: 120 },
  { key: "color", label: "Color", width: 120 },
  { key: "cutting", label: "Cutting", width: 120 },
  { key: "quality", label: "Quality", width: 120 },
  { key: "clarity", label: "Clarity", width: 120 },
  { key: "cer_type", label: "Cer Type", width: 140 },
  { key: "cer_no", label: "CerNo.", width: 140 },
  { key: "pcs", label: "Pcs", width: 80, align: "right" },
  { key: "weight", label: "Weight", width: 120, align: "right" },
  { key: "price", label: "Price", width: 120, align: "right" },
  { key: "unit", label: "Unit", width: 80 },
  { key: "amount", label: "Amount", width: 120, align: "right" },
  { key: "remark", label: "Remark", width: 220 },
];

const filterableColumnKeys = new Set([
  "stock_id",
 
  "stone_code",
  "stone",
  "shape",
  "size",
  "color",
  "cutting",
  "quality",
  "clarity",
  "cer_type",
]);

const formatCellValue = (stock, key) => {
  if (key === "doc_date") {
    return stock.doc_date ? new Date(stock.doc_date).toLocaleDateString() : "-";
  }
  if (key === "weight") {
    return stock.weight?.toFixed(3) || "0.000";
  }
  if (key === "price" || key === "amount") {
    return stock[key]?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00";
  }
  if (key === "pcs") {
    return stock.pcs || 0;
  }
  return stock[key] || "-";
};

const StockSelectionModal = ({ open, onClose, onSelect, mode = "merge" }) => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    if (open) {
      fetchStocks();
    } else {
      setSelectedIds([]);
    }
  }, [open]);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const data = await apiRequest("GET", "/stocks");
      setStocks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch stocks:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStocks = useMemo(() => {
    if (!searchTerm) return stocks;
    const lowerSearch = searchTerm.toLowerCase();
    return stocks.filter(
      (stock) =>
        stock.stock_id?.toLowerCase().includes(lowerSearch) ||
        stock.stone_code?.toLowerCase().includes(lowerSearch) ||
        stock.stone?.toLowerCase().includes(lowerSearch)
    );
  }, [stocks, searchTerm]);

  const {
    filteredData: columnFilteredStocks,
    handleFilterClick,
    popoverProps,
    isFilterActive,
  } = useColumnFilters(filteredStocks, open);

  const { sortedData: sortedStocks, requestSort, sortConfig } = useTableSort(
    columnFilteredStocks,
    { key: "doc_date", direction: "desc" }
  );

  const renderFilterIcon = (columnKey) => {
    const active = isFilterActive(columnKey) || (popoverProps.open && popoverProps.activeColumnKey === columnKey);

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        style={{ marginLeft: "4px", flexShrink: 0 }}
      >
        <path
          d="M2 1.5H10C10.1326 1.5 10.2598 1.55268 10.3536 1.64645C10.4473 1.74021 10.5 1.86739 10.5 2V2.793C10.5 2.9256 10.4473 3.05275 10.3535 3.1465L7.1465 6.3535C7.05273 6.44725 7.00003 6.5744 7 6.707V9.8595C7 9.9355 6.98267 10.0105 6.94933 10.0788C6.91599 10.1471 6.86752 10.2069 6.80761 10.2537C6.74769 10.3004 6.6779 10.3329 6.60355 10.3486C6.52919 10.3644 6.45222 10.363 6.3785 10.3445L5.3785 10.0945C5.27038 10.0674 5.1744 10.005 5.10583 9.9171C5.03725 9.82923 5 9.72096 5 9.6095V6.707C4.99997 6.5744 4.94727 6.44725 4.8535 6.3535L1.6465 3.1465C1.55273 3.05275 1.50003 2.9256 1.5 2.793V2C1.5 1.86739 1.55268 1.74021 1.64645 1.64645C1.74021 1.55268 1.86739 1.5 2 1.5Z"
          stroke={active ? "#17C653" : "#343434"}
          fill="none"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  const firstSelectedStone = useMemo(() => {
    if (selectedIds.length === 0) return null;
    const firstSelected = stocks.find((s) => s._id === selectedIds[0]);
    return firstSelected ? firstSelected.stone : null;
  }, [selectedIds, stocks]);

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      if (sortedStocks.length === 0) return;

      let stoneToMatch = firstSelectedStone;
      if (!stoneToMatch && mode !== "transfer") {
        stoneToMatch = sortedStocks[0].stone;
      }

      const validIds =
        mode === "transfer"
          ? sortedStocks.map((s) => s._id)
          : sortedStocks
            .filter((s) => s.stone === stoneToMatch)
            .map((s) => s._id);

      setSelectedIds(validIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleConfirm = () => {
    const selectedStocks = stocks.filter((s) => selectedIds.includes(s._id));
    onSelect(selectedStocks);
    onClose();
  };

  const selectableCount =
    mode === "transfer"
      ? sortedStocks.length
      : sortedStocks.filter(
        (s) => s.stone === (firstSelectedStone || sortedStocks[0]?.stone)
      ).length;

  const visibleSelectedCount =
    mode === "transfer"
      ? sortedStocks.filter((s) => selectedIds.includes(s._id)).length
      : sortedStocks.filter(
        (s) =>
          selectedIds.includes(s._id) &&
          s.stone === (firstSelectedStone || sortedStocks[0]?.stone)
      ).length;

  const handleHeaderClick = (event, columnKey) => {
    if (columnKey === "doc_date") {
      requestSort(columnKey);
      return;
    }

    if (!filterableColumnKeys.has(columnKey)) {
      return;
    }

    handleFilterClick(event, columnKey);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Box
          sx={{
            width: "100%",
            height: "56px",
            backgroundColor: "var(--HeadPage, #05595B)",
            borderTopLeftRadius: "8px",
            borderTopRightRadius: "8px",
            justifyContent: "space-between",
            display: "flex",
          }}
        >
          <Typography
            sx={{
              color: "#FFF",
              fontFamily: "Calibri",
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 700,
              marginLeft: "32px",
              marginTop: "10px",
            }}
          >
            Merge/Split Stock
          </Typography>
          <Box
            sx={{
              marginTop: "16px",
              marginRight: "16px",
              cursor: "pointer",
            }}
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M14.1535 12.0008L19.5352 6.61748C19.6806 6.47704 19.7966 6.30905 19.8764 6.12331C19.9562 5.93757 19.9982 5.7378 19.9999 5.53565C20.0017 5.3335 19.9632 5.13303 19.8866 4.94593C19.8101 4.75883 19.697 4.58885 19.5541 4.44591C19.4111 4.30296 19.2412 4.18992 19.0541 4.11337C18.867 4.03682 18.6665 3.9983 18.4644 4.00006C18.2622 4.00181 18.0624 4.04381 17.8767 4.1236C17.691 4.20339 17.523 4.31937 17.3825 4.46478L11.9992 9.84654L6.61748 4.46478C6.47704 4.31937 6.30905 4.20339 6.12331 4.1236C5.93757 4.04381 5.7378 4.00181 5.53565 4.00006C5.3335 3.9983 5.13303 4.03682 4.94593 4.11337C4.75883 4.18992 4.58885 4.30296 4.44591 4.44591C4.30296 4.58885 4.18992 4.75883 4.11337 4.94593C4.03682 5.13303 3.9983 5.3335 4.00006 5.53565C4.00181 5.7378 4.04381 5.93757 4.1236 6.12331C4.20339 6.30905 4.31937 6.47704 4.46478 6.61748L9.84654 11.9992L4.46478 17.3825C4.31937 17.523 4.20339 17.691 4.1236 17.8767C4.04381 18.0624 4.00181 18.2622 4.00006 18.4644C3.9983 18.6665 4.03682 18.867 4.11337 19.0541C4.18992 19.2412 4.30296 19.4111 4.44591 19.5541C4.58885 19.697 4.75883 19.8101 4.94593 19.8866C5.13303 19.9632 5.3335 20.0017 5.53565 19.9999C5.7378 19.9982 5.93757 19.9562 6.12331 19.8764C6.30905 19.7966 6.47704 19.6806 6.61748 19.5352L11.9992 14.1535L17.3825 19.5352C17.523 19.6806 17.691 19.7966 17.8767 19.8764C18.0624 19.9562 18.2622 19.9982 18.4644 19.9999C18.6665 20.0017 18.867 19.9632 19.0541 19.8866C19.2412 19.8101 19.4111 19.697 19.5541 19.5541C19.697 19.4111 19.8101 19.2412 19.8866 19.0541C19.9632 18.867 20.0017 18.6665 19.9999 18.4644C19.9982 18.2622 19.9562 18.0624 19.8764 17.8767C19.7966 17.691 19.6806 17.523 19.5352 17.3825L14.1535 12.0008Z"
                fill="white"
              />
            </svg>
          </Box>
        </Box>

        <Box
          sx={{
            backgroundColor: "#F8F8F8",
       

           
    
            padding: "64px 64px 0px  64px",
          }}
        >
          <Box
            sx={{
            
              height: "40px",
            
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
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
              Merge/Split Stock List
            </Typography>

            <Box sx={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <TextField
                placeholder="Search List..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.5 17.5005L13.8833 13.8838" stroke="#666666" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z" stroke="#666666" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </InputAdornment>
                  ),
                  sx: {
                    color: "#9A9A9A",
                    fontFamily: "Segoe UI",
                    fontSize: "15px",
                    fontStyle: "normal",
                    fontWeight: 400,
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#EDEDED" },
                    borderRadius: "8px",
                    backgroundColor: "#FFF",
                    width: "354px",
                    height: "32px",
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#EDEDED",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#E0E2E4",
                    },
                  },
                }}
              />
            </Box>
          </Box>

          <Box
            sx={{
             
              maxHeight: "578px",
              marginTop: "24px",
           
              borderRadius: "5px",
              border: "1px solid var(--Line-Table, #C6C6C8)",
              overflowX: "auto",
              "&::-webkit-scrollbar": {
                height: "5px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#F8F8F8",
                borderRadius: "5px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#919191",
                borderRadius: "5px",
              },
            }}
          >
            <TableContainer component={Paper} sx={{       overflowX: "visible",  boxShadow: "none", borderRadius: 0, overflow: "visible" , minHeight : "557px"}}>
              <Table
                stickyHeader
                size="small"
                sx={{
                  width: "fit-content",
                  minWidth: "100%",
                  "& th, & td": {
                    whiteSpace: "nowrap",
                    borderBottom: "1px solid #C6C6C8",
                  },
                  "& th": {
                    backgroundColor: "#EDEDED",
                    padding: "8px 8px",
                  },
                  "& td": {
                    padding: "8px 8px",
                    backgroundColor: "#FFF",
                  },
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "60px", minWidth: "60px" }}>
                      <Checkbox
                        disabled={sortedStocks.length === 0}
                        sx={{ p: 0 }}
                        indeterminate={visibleSelectedCount > 0 && visibleSelectedCount < selectableCount}
                        checked={sortedStocks.length > 0 && selectableCount > 0 && visibleSelectedCount === selectableCount}
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    {columns.map((column) => {
                      const isSortable = column.key === "doc_date";
                      const isFilterable = filterableColumnKeys.has(column.key);

                      return (
                        <TableCell
                          key={column.key}
                          onClick={(event) => handleHeaderClick(event, column.key)}
                          sx={{
                            width: `${column.width}px`,
                            minWidth: `${column.width}px`,
                            textAlign: column.align || "left",
                            cursor: isSortable || isFilterable ? "pointer" : "default",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: column.align === "right" ? "flex-end" : "flex-start",
                            }}
                          >
                            <Typography sx={headerText}>{column.label}</Typography>
                            {isSortable && <SortIcon sortConfig={sortConfig} columnKey="doc_date" />}
                            {isFilterable && renderFilterIcon(column.key)}
                          </Box>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={columns.length + 1} align="center" sx={{ height: "200px", backgroundColor: "#FFF" }}>
                        <Typography sx={bodyText}>Loading...</Typography>
                      </TableCell>
                    </TableRow>
                  ) : sortedStocks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={columns.length + 1} align="center" sx={{ height: "200px", backgroundColor: "#FFF" }}>
                        <Typography sx={bodyText}>No data available</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedStocks.map((stock, index) => {
                      const isSelected = selectedIds.includes(stock._id);
                      const isDisabled =
                        mode !== "transfer" &&
                        firstSelectedStone &&
                        stock.stone !== firstSelectedStone;

                      return (
                        <TableRow
                          key={stock._id}
                          hover={!isDisabled}
                          onClick={() => !isDisabled && handleToggleSelect(stock._id)}
                          sx={{
                            cursor: isDisabled ? "default" : "pointer",
                            opacity: isDisabled ? 0.6 : 1,
                          }}
                        >
                          <TableCell sx={{ width: "60px", minWidth: "60px" }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <Checkbox
                                checked={isSelected}
                                disabled={isDisabled}
                                sx={{ p: 0 }}
                              />
                              <Typography sx={bodyText}>{index + 1}</Typography>
                            </Box>
                          </TableCell>
                          {columns.map((column) => (
                            <TableCell
                              key={column.key}
                              sx={{
                                width: `${column.width}px`,
                                minWidth: `${column.width}px`,
                                textAlign: column.align || "left",
                              }}
                            >
                              <Typography sx={bodyText}>{formatCellValue(stock, column.key)}</Typography>
                            </TableCell>
                          ))}
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
        <ColumnFilterPopover {...popoverProps} hideSort />

        <Box
          sx={{
            display: "flex",
            padding: "24px 24px",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <Button
            onClick={onClose}
            sx={{
              width: "79px",
              height: "35px",
              padding: "12px 24px",
              borderRadius: "4px",
              border: "1px solid #BFBFBF",
              bgcolor: "#FFF",
              textTransform: "none",
            }}
          >
            <Typography
              sx={{
                color: "#343434",
                fontSize: "16px",
                fontFamily: "Calibri",
                fontStyle: "normal",
                fontWeight: 700,
              }}
            >
              Cancel
            </Typography>
          </Button>

          <Button
            onClick={handleConfirm}
            disabled={selectedIds.length === 0}
            sx={{
              width: "79px",
              height: "35px",
              padding: "12px 24px",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              flexShrink: 0,
              borderRadius: "4px",
              border: "1px solid #BFBFBF",
              bgcolor: "#17C653",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#17C653",
              },
            }}
          >
            <Typography
              sx={{
                color: "#FFF",
                fontSize: "16px",
                fontFamily: "Calibri",
                fontStyle: "normal",
                fontWeight: 700,
              }}
            >
              Ok
            </Typography>
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default StockSelectionModal;
