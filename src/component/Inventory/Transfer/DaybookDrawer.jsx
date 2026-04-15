import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  CircularProgress
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
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

const DaybookDrawer = ({ open, onClose, onSelect }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("unapproved");
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await apiRequest("GET", "/mergeandsplits");
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
    const matchesFilter = filter === "approved"
      ? item.status?.toLowerCase() === "approved"
      : item.status?.toLowerCase() !== "approved";

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
      {/* Header */}
      <Box sx={{ borderBottom: "1px solid #EDEDED", p: "20px 16px 20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography sx={{ fontSize: "20px", fontWeight: 700, fontFamily: "Calibri", color: "#05595B" }}>
          Daybook Summary
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <IconButton onClick={() => setShowSearch(!showSearch)} sx={{ p: 0 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.9963 21.0002L16.6562 16.6602L20.9963 21.0002Z" fill="#666666" />
              <path d="M20.9963 21.0002L16.6562 16.6602" stroke="#666666" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#666666" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

          </IconButton>
          <IconButton onClick={onClose} sx={{ p: 0 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18" stroke="#666666" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M6 6L18 18" stroke="#666666" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

          </IconButton>
        </Box>
      </Box >

      {/* <Box sx={{ width: "100%", height: "1px", bgcolor: "#EDEDED" }} /> */}

      <Box sx={{ padding: "16px 16px 0px 16px", }}>
        {showSearch && (
          <TextField
            fullWidth
            size="small"
            placeholder="Search Document No..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              marginBottom: "16px",
              "& .MuiOutlinedInput-root": { fontFamily: "Calibri", fontSize: "16px" }
            }}
          />
        )}

        {/* Filter Selection Row */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: "8px", }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.75 3V5.25M17.25 3V5.25M3 18.75V7.5C3 6.90326 3.23705 6.33097 3.65901 5.90901C4.08097 5.48705 4.65326 5.25 5.25 5.25H18.75C19.3467 5.25 19.919 5.48705 20.341 5.90901C20.7629 6.33097 21 6.90326 21 7.5V18.75M3 18.75C3 19.3467 3.23705 19.919 3.65901 20.341C4.08097 20.7629 4.65326 21 5.25 21H18.75C19.3467 21 19.919 20.7629 20.341 20.341C20.7629 19.919 21 19.3467 21 18.75M3 18.75V11.25C3 10.6533 3.23705 10.081 3.65901 9.65901C4.08097 9.23705 4.65326 9 5.25 9H18.75C19.3467 9 19.919 9.23705 20.341 9.65901C20.7629 10.081 21 10.6533 21 11.25V18.75M12 12.75H12.008V12.758H12V12.75ZM12 15H12.008V15.008H12V15ZM12 17.25H12.008V17.258H12V17.25ZM9.75 15H9.758V15.008H9.75V15ZM9.75 17.25H9.758V17.258H9.75V17.25ZM7.5 15H7.508V15.008H7.5V15ZM7.5 17.25H7.508V17.258H7.5V17.25ZM14.25 12.75H14.258V12.758H14.25V12.75ZM14.25 15H14.258V15.008H14.25V15ZM14.25 17.25H14.258V17.258H14.25V17.25ZM16.5 12.75H16.508V12.758H16.5V12.75ZM16.5 15H16.508V15.008H16.5V15Z" stroke="#666666" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

          <Box sx={{ display: "flex", gap: "24px" }}>
            <Box
              onClick={() => setFilter("unapproved")}
              sx={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
            >
              <StatusIcon type="unapproved" />
              <Typography sx={{ fontSize: "14px", fontFamily: "Calibri", color: "#343434", fontWeight: 400 }}>
                Unapproved ({unapprovedCount})
              </Typography>
            </Box>

            <Box
              onClick={() => setFilter("approved")}
              sx={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}
            >
              <StatusIcon type="approved" />
              <Typography sx={{ fontSize: "14px", fontFamily: "Calibri", color: "#343434", fontWeight: 400 }}>
                Approved ({approvedCount})
              </Typography>
            </Box>
          </Box>
        </Box>


        <Box sx={{ borderRadius: "5px", marginTop: "8px" }}>
          {/* Table Headers */}
          <Box sx={{ display: "flex", height: "32px", }}>
            <Typography sx={{ width: "128px", paddingRight: "14px", paddingLeft: "14px", borderBottom: "1px solid #EDEDED", fontSize: "14px", fontWeight: 700, fontFamily: "Calibri", color: "#343434" }}>Document No.</Typography>
            <Typography sx={{ width: "80px", paddingRight: "14px", paddingLeft: "14px", borderBottom: "1px solid #EDEDED", fontSize: "14px", fontWeight: 700, fontFamily: "Calibri", color: "#343434", textAlign: "right" }}>Pcs</Typography>
            <Typography sx={{ width: "80px", paddingRight: "14px", paddingLeft: "14px", borderBottom: "1px solid #EDEDED", fontSize: "14px", fontWeight: 700, fontFamily: "Calibri", color: "#343434", textAlign: "right" }}>Weight</Typography>
            <Typography sx={{ width: "120px", paddingRight: "14px", paddingLeft: "14px", borderBottom: "1px solid #EDEDED", fontSize: "14px", fontWeight: 700, fontFamily: "Calibri", color: "#343434", textAlign: "right" }}>Amount</Typography>
            <Typography sx={{ width: "56x", paddingRight: "14px", paddingLeft: "14px", borderBottom: "1px solid #EDEDED", fontSize: "14px", fontWeight: 700, fontFamily: "Calibri", color: "#343434", textAlign: "right" }}>Status</Typography>
          </Box>




          {/* Table Body */}
          <Box sx={{ maxHeight: "calc(100vh - 200px)", overflow: "auto", mt: "8px" }}>
            {loading ? (
              <Box sx={{ py: 4, textAlign: "center" }}><CircularProgress size={24} /></Box>
            ) : filteredData.length === 0 ? (
              <Typography sx={{ py: 4, textAlign: "center", color: "#999", fontFamily: "Calibri" }}>No records found</Typography>
            ) : (
              filteredData.map((item) => {
                const totalPcs = (item.merge_and_split_items || []).reduce((sum, s) => sum + (Number(s.pcs) || 0), 0);
                const totalWeight = (item.merge_and_split_items || []).reduce((sum, s) => sum + (Number(s.weight) || 0), 0);
                const totalAmount = (item.merge_and_split_items || []).reduce((sum, s) => sum + (Number(s.amount) || 0), 0);

                return (
                  <Box
                    key={item._id}
                    sx={{
                      display: "flex",
                      cursor: "default",
                      "&:hover": { bgcolor: "#F9F9F9" },
                      alignItems: "center"
                    }}
                  >
                    <Typography sx={{ height: "38px", width: "128px", paddingLeft: "12px", paddingRight: "12px", fontSize: "14px", fontFamily: "Calibri", color: "#666" }}>{item.invoice_no}</Typography>
                    <Typography sx={{ height: "38px", width: "80px", paddingLeft: "12px", paddingRight: "12px", fontSize: "14px", fontFamily: "Calibri", color: "#666", textAlign: "left" }}>{totalPcs}</Typography>
                    <Typography sx={{ height: "38px", width: "80px", paddingLeft: "12px", paddingRight: "12px", fontSize: "14px", fontFamily: "Calibri", color: "#666", textAlign: "left" }}>{totalWeight.toFixed(4)}</Typography>
                    <Typography sx={{ height: "38px", width: "120px", paddingLeft: "12px", paddingRight: "12px", fontSize: "14px", fontFamily: "Calibri", color: "#666", textAlign: "left" }}>{formatNumberWithCommas(totalAmount.toFixed(2))}</Typography>
                    <Box sx={{ height: "38px", width: " 56px", paddingLeft: "12px", paddingRight: "12px", textAlign: "center" }}>
                      <StatusIcon type={item.status} />
                    </Box>
                  </Box>
                );
              })
            )}
          </Box>
        </Box>


      </Box>
    </Drawer >
  );
};

export default DaybookDrawer;
