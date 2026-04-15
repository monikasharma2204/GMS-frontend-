import React, { useState, useEffect } from "react";
import {
  Box, Typography, Modal, IconButton, TextField, InputAdornment,
  Button, CircularProgress, Checkbox,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import PrintIcon from "@mui/icons-material/Print";
import DescriptionIcon from "@mui/icons-material/Description";
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

const MergeSplitModalDayBook = ({ open, onClose, onSelect }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await apiRequest("GET", "/mergeandsplits");
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
            Daybook
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
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
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


          <TableContainer component={Paper} sx={{ border: "1px solid #EDEDED", borderRadius: "4px", flexGrow: 1, boxShadow: "none" }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow sx={{ "& th": { bgcolor: "#F2F2F2", fontWeight: 700, fontFamily: "Calibri", fontSize: "14px", color: "#343434", border: "1px solid #EDEDED", } }}>
                  <TableCell align="center" sx={{ width: "40px", minWidth: "40px", maxWidth: "40px", height: "37px", padding: 0 }}></TableCell>
                  <TableCell align="center" sx={{ width: "40px", minWidth: "40px", maxWidth: "40px", height: "37px", padding: 0 }}>#</TableCell>
                  <TableCell align="center" sx={{ width: "100px", minWidth: "100px", maxWidth: "100px", height: "37px !important", padding: 0 }}>Status</TableCell>
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
                  <TableRow><TableCell colSpan={11} align="center" sx={{ padding: "12px" }}><CircularProgress size={32} /></TableCell></TableRow>
                ) : filteredData.length === 0 ? (
                  <TableRow><TableCell colSpan={11} align="center" sx={{ py: 8, color: "#999", fontFamily: "Calibri" }}>No records found</TableCell></TableRow>
                ) : (
                  filteredData.map((item, idx) => (
                    <TableRow
                      key={item._id}
                      hover
                      onClick={() => handleSelect(item._id)}
                      sx={{ cursor: "pointer", "& td": { fontFamily: "Calibri", fontSize: "16px", color: "#666666", borderBottom: "1px solid #EDEDED", borderRight: "1px solid #EDEDED", fontWeight: 400 } }}
                    >
                      <TableCell align="center" sx={{ width: "40px", minWidth: "40px", maxWidth: "40px", height: "37px", padding: 0 }}>
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.5" y="0.5" width="19" height="19" rx="3.5" fill={selectedIds.includes(item._id) ? "#086E71" : "white"} stroke={selectedIds.includes(item._id) ? "#086E71" : "#BFBFBF"} />
                            {selectedIds.includes(item._id) && (
                              <path d="M5 10L8.5 13.5L15 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            )}
                          </svg>
                        </Box>
                      </TableCell>
                      <TableCell align="center" sx={{ width: "40px", minWidth: "40px", maxWidth: "40px", height: "37px !important", padding: 0 }}>{idx + 1}</TableCell>
                      <TableCell align="center" sx={{ width: "100px", minWidth: "100px", maxWidth: "100px", height: "37px !important", padding: 0 }}>
                        <Box sx={{
                          width: "82px",
                          height: "27px",
                          display: "flex",
                          borderRadius: "5px",
                          justifyContent: "center",
                          mx: "auto",
                          bgcolor: item.status?.toLowerCase() === "approved" ? "#00AA3A33" : "#F4EEE1",
                          color: item.status?.toLowerCase() === "approved" ? "#00AA3A" : "#C6A969",
                          fontSize: "14px", fontWeight: 400, textAlign: "center", alignItems: "center"
                        }}>
                          {item.status || "Unapproved"}
                        </Box>
                      </TableCell >
                      <TableCell sx={{ padding: "5px 16px" }} >{moment(item.createdAt).format("DD/MM/YYYY")}</TableCell>
                      <TableCell sx={{ padding: "5px 16px" }}>{moment(item.doc_date).format("DD/MM/YYYY")}</TableCell>
                      <TableCell sx={{ padding: "5px 16px" }}>{item.invoice_no}</TableCell>
                      <TableCell sx={{ padding: "5px 16px" }}>{item.ref_1 || "-"}</TableCell>
                      <TableCell sx={{ padding: "5px 16px" }} align="right">{(item.merge_and_split_items || []).reduce((sum, s) => sum + (Number(s.pcs) || 0), 0)}</TableCell>
                      <TableCell sx={{ padding: "5px 16px" }} align="right">{(item.merge_and_split_items || []).reduce((sum, s) => sum + (Number(s.weight) || 0), 0).toFixed(4)}</TableCell>
                      <TableCell sx={{ padding: "5px 16px" }} align="right">{formatNumberWithCommas((item.merge_and_split_items || []).reduce((sum, s) => sum + (Number(s.amount) || 0), 0).toFixed(2))}</TableCell>
                      <TableCell sx={{ padding: "5px 16px" }}>{item.note || "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: "flex", justifyContent: "flex-end", height: "56px", alignItems: "center", textAlign: "center ", }}>
            <Button
              variant="contained"
              onClick={handleConfirm}
              disabled={selectedIds.length !== 1}
              sx={{ width: "96px ", height: "32px", bgcolor: "#086E71", paddingLeft: "16px", paddingRight: "16px", textTransform: "none", borderRadius: "4px", fontSize: "14px", fontWeight: 700, fontFamily: "Calibri", "&:hover": { bgcolor: "#044a4c" }, "&.Mui-disabled": { bgcolor: "#E0E0E0", color: "#FFFFFF" } }}
            >
              OK
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default MergeSplitModalDayBook;
