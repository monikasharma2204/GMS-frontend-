import React, { useState, useEffect } from "react";
import {
  Box, Typography, Modal, IconButton, TextField, InputAdornment,
  Button, CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from "@mui/material";
import moment from "moment";
import apiRequest from "../../../helpers/apiHelper";
import { formatNumberWithCommas } from "../../../helpers/numberHelper";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "1360px",
  height: "862px",
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  outline: "none",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden"
};

const TransferModalDayBook = ({ open, onClose, onSelect }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Corrected API endpoint for Transfer Daybook
      const result = await apiRequest("GET", "/transfers");
      setData(Array.isArray(result) ? result : (result?.data || []));
    } catch (error) {
      console.error("Error fetching daybook data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchData();
      setSelectedIds([]);
    }
  }, [open]);

  const filteredData = data.filter(item =>
    item.invoice_no?.toLowerCase().includes(search.toLowerCase()) ||
    item.ref_1?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleConfirm = () => {
    if (selectedIds.length === 1) {
      onSelect(selectedIds[0]);
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose} hideBackdrop={true}>
      <Box sx={style}>
        {/* Header */}
        <Box sx={{ bgcolor: "#05595B", px: "24px", height: "56px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography sx={{ color: "#FFF", fontSize: "20px", fontWeight: 700, fontFamily: "Calibri" }}>
            Transfer Daybook
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: "#FFF" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 6L18 18" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </IconButton>
        </Box>

        {/* Body */}
        <Box sx={{ p: "32px 32px 0px 32px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "24px", paddingBottom: "24px" }}>
            <Typography sx={{ fontSize: "18px", fontWeight: 700, fontFamily: "Calibri", color: "#343434" }}>Daybook List</Typography>
            <Box sx={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <TextField
                placeholder="Search List..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.5 17.5005L13.8833 13.8838" stroke="#666666" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z" stroke="#666666" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </InputAdornment>
                  ),
                  sx: { color: "#9A9A9A", fontFamily: "Segoe UI", fontSize: "15px" }
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    backgroundColor: "#FFF",
                    width: "354px",
                    height: "32px"
                  }
                }}
              />
            </Box>
          </Box>

          <TableContainer component={Paper} sx={{ border: "1px solid #EDEDED", borderRadius: "4px", flexGrow: 1, boxShadow: "none" }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow sx={{ "& th": { bgcolor: "#F2F2F2", fontWeight: 700, fontFamily: "Calibri", fontSize: "14px", color: "#343434", border: "1px solid #EDEDED" } }}>
                  <TableCell align="center" sx={{ width: "40px" }}></TableCell>
                  <TableCell align="center" sx={{ width: "40px" }}>#</TableCell>
                  <TableCell align="center" sx={{ width: "100px" }}>Status</TableCell>
                  <TableCell>TranDate</TableCell>
                  <TableCell>Doc Date</TableCell>
                  <TableCell>Voucher No.</TableCell>
                  <TableCell>Ref 1</TableCell>
                  <TableCell align="right">Pcs</TableCell>
                  <TableCell align="right">Weight</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Remark</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={11} align="center" sx={{ py: 4 }}><CircularProgress size={32} /></TableCell></TableRow>
                ) : filteredData.length === 0 ? (
                  <TableRow><TableCell colSpan={11} align="center" sx={{ py: 8, color: "#999", fontFamily: "Calibri" }}>No records found</TableCell></TableRow>
                ) : (
                  filteredData.map((item, idx) => {
                    const targetItems = item.target_items || [];
                    const totalPcs = targetItems.reduce((sum, s) => sum + (Number(s.pcs) || 0), 0);
                    const totalWeight = targetItems.reduce((sum, s) => sum + (Number(s.weight) || 0), 0);
                    const totalAmount = targetItems.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);
                    
                    return (
                      <TableRow
                        key={item._id}
                        hover
                        onClick={() => handleSelect(item._id)}
                        sx={{ cursor: "pointer", "& td": { fontFamily: "Calibri", fontSize: "16px", color: "#666666", borderBottom: "1px solid #EDEDED", borderRight: "1px solid #EDEDED" } }}
                      >
                        <TableCell align="center" sx={{ width: "40px", padding: 0 }}>
                          <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect x="0.5" y="0.5" width="19" height="19" rx="3.5" fill={selectedIds.includes(item._id) ? "#086E71" : "white"} stroke={selectedIds.includes(item._id) ? "#086E71" : "#BFBFBF"} />
                              {selectedIds.includes(item._id) && (
                                <path d="M5 10L8.5 13.5L15 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              )}
                            </svg>
                          </Box>
                        </TableCell>
                        <TableCell align="center" sx={{ width: "40px" }}>{idx + 1}</TableCell>
                        <TableCell align="center" sx={{ width: "100px" }}>
                          <Box sx={{
                            width: "82px",
                            height: "27px",
                            display: "flex",
                            borderRadius: "5px",
                            justifyContent: "center",
                            bgcolor: item.status?.toLowerCase() === "approved" ? "#00AA3A33" : "#F4EEE1",
                            color: item.status?.toLowerCase() === "approved" ? "#00AA3A" : "#C6A969",
                            fontSize: "14px", alignItems: "center", mx: "auto"
                          }}>
                            {item.status || "Unapproved"}
                          </Box>
                        </TableCell >
                        <TableCell sx={{ padding: "5px 16px" }} >{moment(item.createdAt).format("DD/MM/YYYY")}</TableCell>
                        <TableCell sx={{ padding: "5px 16px" }}>{moment(item.doc_date).format("DD/MM/YYYY")}</TableCell>
                        <TableCell sx={{ padding: "5px 16px" }}>{item.invoice_no}</TableCell>
                        <TableCell sx={{ padding: "5px 16px" }}>{item.ref_1 || "-"}</TableCell>
                        <TableCell sx={{ padding: "5px 16px" }} align="right">{totalPcs}</TableCell>
                        <TableCell sx={{ padding: "5px 16px" }} align="right">{totalWeight.toFixed(4)}</TableCell>
                        <TableCell sx={{ padding: "5px 16px" }} align="right">{formatNumberWithCommas(totalAmount.toFixed(2))}</TableCell>
                        <TableCell sx={{ padding: "5px 16px" }}>{item.note || "-"}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: "flex", justifyContent: "flex-end", height: "56px", alignItems: "center" }}>
            <Button
              variant="contained"
              onClick={handleConfirm}
              disabled={selectedIds.length !== 1}
              sx={{ width: "96px ", height: "32px", bgcolor: "#086E71", textTransform: "none", borderRadius: "4px", fontSize: "14px", fontWeight: 700, fontFamily: "Calibri", "&:hover": { bgcolor: "#044a4c" } }}
            >
              OK
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default TransferModalDayBook;
