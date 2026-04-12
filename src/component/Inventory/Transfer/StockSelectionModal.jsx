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
  IconButton
} from "@mui/material";
import apiRequest from "../../../helpers/apiHelper";
import { API_URL } from "../../../config/config.js";

const StockSelectionModal = ({ open, onClose, onSelect }) => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    if (open) {
      fetchStocks();
    }
  }, [open]);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      const data = await apiRequest("GET", "/stocks");
      setStocks(data);
    } catch (error) {
      console.error("Failed to fetch stocks:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStocks = useMemo(() => {
    if (!searchTerm) return stocks;
    const lowerSearch = searchTerm.toLowerCase();
    return stocks.filter(stock =>
      stock.stock_id?.toLowerCase().includes(lowerSearch) ||
      stock.stone_code?.toLowerCase().includes(lowerSearch) ||
      stock.stone?.toLowerCase().includes(lowerSearch)
    );
  }, [stocks, searchTerm]);

  const handleToggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedIds(filteredStocks.map(s => s._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleConfirm = () => {
    const selectedStocks = stocks.filter(s => selectedIds.includes(s._id));
    onSelect(selectedStocks);
    onClose();
  };
  const firstSelectedStone = useMemo(() => {
    if (selectedIds.length === 0) return null;
    const firstSelected = stocks.find(s => s._id === selectedIds[0]);
    return firstSelected ? firstSelected.stone : null;
  }, [selectedIds, stocks]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',

        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: "1360px",
        width: "100%",
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 0,
        borderRadius: "8px",
        overflow: "auto",

      }}>
        <Box sx={{ bgcolor: "#05595B", p: "0px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", height: "56px" }}>
          <Typography sx={{ color: "#FFF", fontSize: "18px", fontWeight: 700, fontFamily: "Calibri" }}>Merge/Split Stock</Typography>
          <IconButton onClick={onClose} sx={{ color: "#FFF" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </IconButton>
        </Box>


        <Box sx={{ p: "0px 24px" }}>


          <Box sx={{ p: "24px " }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "24px", paddingBottom: "24px" }}>
              <Typography sx={{ fontSize: "16px", fontWeight: 600, fontFamily: "Calibri" }}>Merge/Split Stock List</Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: "12px",
                  flexDirection: { xs: "column", sm: "row" },
                  justifyContent: "end",
                  alignItems: "center ",
                  textAlign: "center",
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "12px",
                    width: { xs: "100%", sm: "auto" },
                  }}
                >
                  <Box>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.75 3V5.25M17.25 3V5.25M3 18.75V7.5C3 6.90326 3.23705 6.33097 3.65901 5.90901C4.08097 5.48705 4.65326 5.25 5.25 5.25H18.75C19.3467 5.25 19.919 5.48705 20.341 5.90901C20.7629 6.33097 21 6.90326 21 7.5V18.75M3 18.75C3 19.3467 3.23705 19.919 3.65901 20.341C4.08097 20.7629 4.65326 21 5.25 21H18.75C19.3467 21 19.919 20.7629 20.341 20.341C20.7629 19.919 21 19.3467 21 18.75M3 18.75V11.25C3 10.6533 3.23705 10.081 3.65901 9.65901C4.08097 9.23705 4.65326 9 5.25 9H18.75C19.3467 9 19.919 9.23705 20.341 9.65901C20.7629 10.081 21 10.6533 21 11.25V18.75M12 12.75H12.008V12.758H12V12.75ZM12 15H12.008V15.008H12V15ZM12 17.25H12.008V17.258H12V17.25ZM9.75 15H9.758V15.008H9.75V15ZM9.75 17.25H9.758V17.258H9.75V17.25ZM7.5 15H7.508V15.008H7.5V15ZM7.5 17.25H7.508V17.258H7.5V17.25ZM14.25 12.75H14.258V12.758H14.25V12.75ZM14.25 15H14.258V15.008H14.25V15ZM14.25 17.25H14.258V17.258H14.25V17.25ZM16.5 12.75H16.508V12.758H16.5V12.75ZM16.5 15H16.508V15.008H16.5V15Z"
                        stroke="#666666"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Box>

                  <Box sx={{ flexGrow: 1 }}>
                    <TextField
                      placeholder="Search List..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M17.5 17.5005L13.8833 13.8838"
                                stroke="#666666"
                                strokeWidth="1.25"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z"
                                stroke="#666666"
                                strokeWidth="1.25"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
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
                        "& .MuiInputLabel-asterisk": {
                          color: "#B41E38",
                        },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "#EDEDED" },
                          borderRadius: "8px",
                          backgroundColor: "#FFF",
                          width: { xs: "100%", sm: "354px" },
                          height: "32px",
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#EDEDED",
                          },
                          "&:hover": {
                            backgroundColor: "#F5F8FF",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#E0E2E4",
                          },
                        },
                        paddingLeft: "8px",
                        paddingRight: "8px",
                        gap: "8px",
                      }}
                    />
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: "12px",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      borderRadius: "8px",
                      border: "1px solid #EDEDED",
                      paddingLeft: "16px",
                      paddingRight: "16px",
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.75 5.83301H16.25M5.83333 9.99967H14.1667M8.33333 14.1663H11.6667"
                        stroke="#343434"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <Typography
                      sx={{
                        color: "#343434",
                        fontFamily: "Calibri",
                        fontSize: "16px",
                        fontStyle: "normal",
                        fontWeight: 400,
                      }}
                    >
                      Filter
                    </Typography>
                  </Box>

                  <Box sx={{ paddingLeft: "4px", paddingRight: "8px" }}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.4582 6.45833H12.7082C12.4872 6.45833 12.2752 6.37054 12.1189 6.21426C11.9626 6.05798 11.8748 5.84601 11.8748 5.625V1.875M16.4582 6.45833V17.2917C16.4582 17.5127 16.3704 17.7246 16.2141 17.8809C16.0578 18.0372 15.8459 18.125 15.6248 18.125H4.37484C4.15382 18.125 3.94186 18.0372 3.78558 17.8809C3.6293 17.7246 3.5415 17.5127 3.5415 17.2917V2.70833C3.5415 2.48732 3.6293 2.27536 3.78558 2.11908C3.94186 1.9628 4.15382 1.875 4.37484 1.875H11.8748M16.4582 6.45833L11.8748 1.875"
                        stroke="#666666"
                        strokeWidth="1.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14.3463 10.2226H12.4746V13.958M12.4746 12.0901H13.6959M5.65423 13.9509V10.2151H6.91131C7.24382 10.215 7.56276 10.347 7.79797 10.582C8.03317 10.8171 8.16536 11.1359 8.16548 11.4684C8.16559 11.8009 8.0336 12.1199 7.79855 12.3551C7.56351 12.5903 7.24466 12.7225 6.91214 12.7226H5.65381M9.06423 13.958V10.208H9.70006C10.1973 10.208 10.6743 10.4056 11.0259 10.7572C11.3775 11.1088 11.5751 11.5857 11.5751 12.083C11.5751 12.5803 11.3775 13.0572 11.0259 13.4088C10.6743 13.7605 10.1973 13.958 9.70006 13.958H9.06423Z"
                        stroke="#666666"
                        strokeWidth="0.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Box>

                  <Box sx={{ paddingLeft: "8px", paddingRight: "8px" }} >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M17.9881 2.75359H11.6569V1.26172L1.25 2.86797V16.9473L11.6569 18.7398V16.5286H17.9881C18.1799 16.5383 18.3677 16.4717 18.5104 16.3433C18.6532 16.215 18.7393 16.0353 18.75 15.8436V3.43797C18.7392 3.24638 18.653 3.06686 18.5102 2.93863C18.3675 2.8104 18.1798 2.74388 17.9881 2.75359ZM18.0881 15.9573H11.6356L11.625 14.7767H13.1794V13.4017H11.6131L11.6056 12.5892H13.1794V11.2142H11.5937L11.5863 10.4017H13.1794V9.02672H11.5813V8.21422H13.1794V6.83922H11.5813V6.02672H13.1794V4.65172H11.5813V3.40172H18.0881V15.9573Z"
                        fill="#666666"
                      />
                      <path
                        d="M16.7561 4.64941H14.0542V6.02441H16.7561V4.64941Z"
                        fill="#666666"
                      />
                      <path
                        d="M16.7561 6.83789H14.0542V8.21289H16.7561V6.83789Z"
                        fill="#666666"
                      />
                      <path
                        d="M16.7561 9.02539H14.0542V10.4004H16.7561V9.02539Z"
                        fill="#666666"
                      />
                      <path
                        d="M16.7561 11.2139H14.0542V12.5889H16.7561V11.2139Z"
                        fill="#666666"
                      />
                      <path
                        d="M16.7561 13.4023H14.0542V14.7773H16.7561V13.4023Z"
                        fill="#666666"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3.96705 6.67027L5.3083 6.5934L6.15143 8.91152L7.14768 6.49777L8.48893 6.4209L6.86018 9.71215L8.48893 13.0115L7.0708 12.9159L6.1133 10.4009L5.15518 12.8203L3.85205 12.7053L5.3658 9.7909L3.96705 6.67027Z"
                        fill="white"
                      />
                    </svg>
                  </Box>

                </Box>
              </Box>

            </Box>

            <TableContainer component={Paper} sx={{
              boxShadow: "none", maxHeight: "564px",
              minHeight: "564px"
            }}>
              <Table stickyHeader size="small" sx={{
                border: "1px solid #EDEDED",

                "& th, & td": {
                  border: "1px solid #EDEDED",
                  whiteSpace: "nowrap",
                },


                "& th": {
                  whiteSpace: "nowrap",
                  padding: "7px 12px",
                  lineHeight: "normal",
                  color: "#343434"
                },
                "& td": {
                  whiteSpace: "nowrap",
                  padding: "12px",
                  color: "#666666",
                  // borderRight: "1px solid #EDEDED",

                },


              }}>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox" sx={{ bgcolor: "#F5F5F5" }}>
                      <Checkbox
                        indeterminate={selectedIds.length > 0 && selectedIds.length < filteredStocks.length}
                        checked={filteredStocks.length > 0 && selectedIds.length === filteredStocks.length}
                        onChange={handleSelectAll}
                        disabled={!!firstSelectedStone}
                      />
                    </TableCell>
                    {["#", "Stock ID", "Doc Date", "Lot", "Stone Code", "Stone", "Shape", "Size", "Color", "Cutting", "Quality", "Clarity", "Cer Type", "Cer No.", "Pcs", "Weight", "Price", "Unit", "Amount"].map(h => (
                      <TableCell key={h} sx={{ bgcolor: "#F5F5F5", fontWeight: 700, fontFamily: "Calibri", borderRight: (h === "Lot" || h === "Weight") ? "1px solid #C6C6C8" : "none" }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={20} align="center">Loading...</TableCell></TableRow>
                  ) : filteredStocks.length === 0 ? (
                    <TableRow><TableCell colSpan={20} align="center">No stocks found</TableCell></TableRow>
                  ) : filteredStocks.map((stock, idx) => {
                    const isSelected = selectedIds.includes(stock._id);
                    const isDisabled = firstSelectedStone && stock.stone !== firstSelectedStone;
                    return (
                      <TableRow
                        key={stock._id}
                        hover={!isDisabled}
                        onClick={() => !isDisabled && handleToggleSelect(stock._id)}
                        sx={{
                          cursor: isDisabled ? "default" : "pointer",
                          opacity: isDisabled ? 0.6 : 1
                        }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isSelected} disabled={isDisabled} />
                        </TableCell>
                        <TableCell sx={{ fontFamily: "Calibri", color: isDisabled ? "#AAA" : "inherit" }}>{idx + 1}</TableCell>

                        <TableCell sx={{ fontFamily: "Calibri", color: isDisabled ? "#AAA" : "inherit" }}>{stock.stock_id}</TableCell>
                        <TableCell sx={{ fontFamily: "Calibri", color: isDisabled ? "#AAA" : "inherit" }}>{stock.doc_date ? new Date(stock.doc_date).toLocaleDateString() : "-"}</TableCell>
                        <TableCell sx={{ fontFamily: "Calibri", borderRight: "1px solid #C6C6C8", color: isDisabled ? "#AAA" : "inherit" }}>{stock.lot_no || "-"}</TableCell>
                        <TableCell
                          sx={{
                            fontFamily: "Calibri", borderRight: "1px solid #C6C6C8",
                            color: isDisabled ? "#AAA" : "inherit",
                            fontWeight: 400
                          }}
                        >
                          {stock.stone_code}
                        </TableCell>
                        <TableCell sx={{ fontFamily: "Calibri", color: isDisabled ? "#AAA" : "inherit" }}>{stock.stone}</TableCell>
                        <TableCell sx={{ fontFamily: "Calibri", color: isDisabled ? "#AAA" : "inherit" }}>{stock.shape || "-"}</TableCell>
                        <TableCell sx={{ fontFamily: "Calibri", color: isDisabled ? "#AAA" : "inherit" }}>{stock.size || "-"}</TableCell>
                        <TableCell sx={{ fontFamily: "Calibri", color: isDisabled ? "#AAA" : "inherit" }}>{stock.color || "-"}</TableCell>
                        <TableCell sx={{ fontFamily: "Calibri", color: isDisabled ? "#AAA" : "inherit" }}>{stock.cutting || "-"}</TableCell>
                        <TableCell sx={{ fontFamily: "Calibri", color: isDisabled ? "#AAA" : "inherit" }}>{stock.quality || "-"}</TableCell>
                        <TableCell sx={{ fontFamily: "Calibri", color: isDisabled ? "#AAA" : "inherit" }}>{stock.clarity || "-"}</TableCell>
                        <TableCell sx={{ fontFamily: "Calibri", color: isDisabled ? "#AAA" : "inherit" }}>{stock.cer_type || "-"}</TableCell>
                        <TableCell sx={{ fontFamily: "Calibri", color: isDisabled ? "#AAA" : "inherit" }}>{stock.cer_no || "-"}</TableCell>
                        <TableCell sx={{ fontFamily: "Calibri", color: isDisabled ? "#AAA" : "inherit" }}>{stock.pcs || 0}</TableCell>
                        <TableCell sx={{ fontFamily: "Calibri", borderRight: "1px solid #C6C6C8", color: isDisabled ? "#AAA" : "inherit" }}>{stock.weight?.toFixed(3) || "0.000"}</TableCell>
                        <TableCell sx={{ fontFamily: "Calibri", color: isDisabled ? "#AAA" : "inherit" }}>{stock.price?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}</TableCell>
                        <TableCell sx={{ fontFamily: "Calibri", color: isDisabled ? "#AAA" : "inherit" }}>{stock.unit || "-"}</TableCell>
                        <TableCell sx={{ fontFamily: "Calibri", color: isDisabled ? "#AAA" : "inherit" }}>{stock.amount?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

          </Box>
        </Box>


        <Box sx={{ borderTop: "1px solid #C6C6C8  ", alignItems: "center", display: "flex", justifyContent: "flex-end", paddingleft: "32px", paddingRight: "32px", height: "56px" }}>
          <Button
            variant="contained"
            onClick={handleConfirm}
            disabled={selectedIds.length === 0}
            sx={{
              bgcolor: "#05595B",
              color: "#FFF",
              textTransform: "none",
              height: "32px",
              width: "100px",
              "&:hover": { bgcolor: "#044a4c" }
            }}
          >
            OK
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default StockSelectionModal;
