import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  CircularProgress
} from "@mui/material";
import apiRequest from "../../../helpers/apiHelper";
import { formatNumberWithCommas } from "../../../helpers/numberHelper";

const StatusIcon = ({ type, active = true }) => {
  const isApproved = type?.toLowerCase() === "approved";
  const fill = isApproved ? "#CCEED8" : "#F4EEE1";
  const stroke = isApproved ? "#00AA3A" : "#C6A969";

  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity: active ? 1 : 0.4 }}
    >
      <circle cx="6" cy="6" r="5.5" fill={fill} stroke={stroke} />
    </svg>
  );
};

const TransferDaybookDrawer = ({ open, onClose, onSelect }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("unapproved");
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Corrected API for Transfer Daybook
      const result = await apiRequest("GET", "/transfers");
      setData(Array.isArray(result) ? result : (result?.data || []));
    } catch (error) {
      console.error("Error fetching daybook data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const filteredData = data.filter(item => {
    const isApproved = item.status?.toLowerCase() === "approved";
    const matchesFilter = filter === "approved" ? isApproved : !isApproved;

    const searchTerm = search.toLowerCase();
    const matchesSearch =
      item.invoice_no?.toLowerCase().includes(searchTerm) ||
      item.ref_1?.toLowerCase().includes(searchTerm) ||
      item.ref_2?.toLowerCase().includes(searchTerm);

    return matchesFilter && matchesSearch;
  });

  const approvedCount = data.filter(item => item.status?.toLowerCase() === "approved").length;
  const unapprovedCount = data.filter(item => item.status?.toLowerCase() !== "approved").length;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      hideBackdrop={true}
      PaperProps={{
        sx: { width: "100%", maxWidth: "492px", padding: 0, top: "128px", bottom: "0px" }
      }}
    >
      <Box sx={{ borderBottom: "1px solid #EDEDED", p: "20px 16px 20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography sx={{ fontSize: "20px", fontWeight: 700, fontFamily: "Calibri", color: "#05595B" }}>
          Transfer Daybook Summary
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <IconButton onClick={() => setShowSearch(!showSearch)} sx={{ p: 0 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#666666" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 21L16.65 16.65" stroke="#666666" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </IconButton>
          <IconButton onClick={onClose} sx={{ p: 0 }}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="#666666" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 6L18 18" stroke="#666666" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ padding: "16px" }}>
        {showSearch && (
          <TextField
            fullWidth
            size="small"
            placeholder="Search Document No..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ marginBottom: "16px" }}
          />
        )}

        <Box sx={{ display: "flex", gap: "24px", mb: 2 }}>
          <Box onClick={() => setFilter("unapproved")} sx={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <StatusIcon type="unapproved" />
            <Typography sx={{ fontSize: "14px", fontFamily: "Calibri" }}>Unapproved ({unapprovedCount})</Typography>
          </Box>
          <Box onClick={() => setFilter("approved")} sx={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
            <StatusIcon type="approved" />
            <Typography sx={{ fontSize: "14px", fontFamily: "Calibri" }}>Approved ({approvedCount})</Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", height: "32px", borderBottom: "1px solid #EDEDED", mb: 1 }}>
          <Typography sx={{ width: "128px", fontWeight: 700, fontFamily: "Calibri", fontSize: "14px" }}>Doc No.</Typography>
          <Typography sx={{ width: "80px", fontWeight: 700, fontFamily: "Calibri", fontSize: "14px", textAlign: "right" }}>Pcs</Typography>
          <Typography sx={{ width: "80px", fontWeight: 700, fontFamily: "Calibri", fontSize: "14px", textAlign: "right" }}>Weight</Typography>
          <Typography sx={{ width: "120px", fontWeight: 700, fontFamily: "Calibri", fontSize: "14px", textAlign: "right" }}>Amount</Typography>
        </Box>

        <Box sx={{ maxHeight: "calc(100vh - 250px)", overflow: "auto" }}>
          {loading ? (
            <Box sx={{ py: 4, textAlign: "center" }}><CircularProgress size={24} /></Box>
          ) : filteredData.length === 0 ? (
            <Typography sx={{ py: 4, textAlign: "center", color: "#999", fontFamily: "Calibri" }}>No records found</Typography>
          ) : (
            filteredData.map((item) => {
              const targetItems = item.target_items || [];
              const totalPcs = targetItems.reduce((sum, s) => sum + (Number(s.pcs) || 0), 0);
              const totalWeight = targetItems.reduce((sum, s) => sum + (Number(s.weight) || 0), 0);
              const totalAmount = targetItems.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);

              return (
                <Box key={item._id} sx={{ display: "flex", py: 1, "&:hover": { bgcolor: "#F9F9F9" }, alignItems: "center" }}>
                  <Typography sx={{ width: "128px", fontSize: "14px", fontFamily: "Calibri" }}>{item.invoice_no}</Typography>
                  <Typography sx={{ width: "80px", fontSize: "14px", fontFamily: "Calibri", textAlign: "right" }}>{totalPcs}</Typography>
                  <Typography sx={{ width: "80px", fontSize: "14px", fontFamily: "Calibri", textAlign: "right" }}>{totalWeight.toFixed(3)}</Typography>
                  <Typography sx={{ width: "120px", fontSize: "14px", fontFamily: "Calibri", textAlign: "right" }}>{formatNumberWithCommas(totalAmount.toFixed(2))}</Typography>
                </Box>
              );
            })
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default TransferDaybookDrawer;
