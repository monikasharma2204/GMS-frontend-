import React, { useRef, useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  Box,
  Typography,
  Checkbox,
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
import { getStockMovementByStoneCode } from "../../../../services/stockMovementService.js";
import { exportConsignmentToExcel } from "../../../../helpers/consignmentExcelHelper.js";
import FooterReport from "../../../Layout/FooterReport.jsx";


const formatProfitForExcel = (profit) => {
  const n = Number(profit);
  if (Number.isNaN(n)) return "-";
  const formatted = Math.abs(n).toLocaleString();
  if (n > 0) return `+${formatted}`;
  if (n < 0) return `-${formatted}`;
  return `+${formatted}`;
};

const StockMovementReportInSide = ({ selectedItem, onBack, exportTrigger }) => {
  const [rowPP, setRowPP] = React.useState("");
  const [movementDetails, setMovementDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const totals = React.useMemo(() => {
    if (!movementDetails || !movementDetails.movements) return null;
    const res = movementDetails.movements.reduce((acc, item) => {
      acc.in_pcs += Number(item.in_pcs || 0);
      acc.in_weight += Number(item.in_weight || 0);
      acc.in_amount += Number(item.in_amount || 0);
      acc.out_pcs += Number(item.out_pcs || 0);
      acc.out_weight += Number(item.out_weight || 0);
      acc.out_amount += Number(item.out_amount || 0);
      acc.profit += Number(item.profit || 0);
      return acc;
    }, { in_pcs: 0, in_weight: 0, in_amount: 0, out_pcs: 0, out_weight: 0, out_amount: 0, profit: 0 });

    // For balance, we take the last row's balance as it's a running total
    const lastMovement = movementDetails.movements[movementDetails.movements.length - 1];
    if (lastMovement) {
      res.balance_pcs = lastMovement.balance_pcs;
      res.balance_weight = lastMovement.balance_weight;
      res.stock_cost_amount = lastMovement.stock_cost_amount;
      res.stock_value_amount = lastMovement.stock_value_amount;
    }
    return res;
  }, [movementDetails]);

  const lastExportTrigger = React.useRef(exportTrigger);

  const handleExportExcel = () => {
    try {
      if (!movementDetails || !movementDetails.movements || movementDetails.movements.length === 0) {
        alert("No data to export");
        return;
      }

      const itemHeaders = [
        [
          "#", "Doc Date", "Ref", "Stock ID", "Account",
          "In", "In", "In", "In",
          "Out", "Out", "Out", "Out",
          "Balance", "Balance", "Balance", "Balance", "Balance", "Balance", "Balance"
        ],
        [
          "", "", "", "", "",
          "Pcs", "Weight", "Price / Unit", "Amount",
          "Pcs", "Weight", "Price / Unit", "Amount",
          "Pcs", "Weight", "Stock Cost", "Stock Cost", "Stock Value", "Stock Value", "Profit"
        ],
        [
          "", "", "", "", "",
          "", "", "", "",
          "", "", "", "",
          "", "", "Price / Unit", "Amount", "Price / Unit", "Amount", ""
        ]
      ];

      const itemRows = movementDetails.movements.map((movement, index) => [
        index + 1,
        new Date(movement.doc_date).toLocaleDateString('en-GB'),
        movement.ref || "",
        movement.stock_id || "",
        typeof movement.account === "object"
          ? (movement.account?.vendor_code_name || movement.account?.label || "")
          : (movement.account || ""),
        Number(movement.in_pcs || 0),
        Number(movement.in_weight || 0),
        Number(movement.in_price || 0),
        Number(movement.in_amount || 0),
        Number(movement.out_pcs || 0),
        Number(movement.out_weight || 0),
        Number(movement.out_price || 0),
        Number(movement.out_amount || 0),
        Number(movement.balance_pcs || 0),
        Number(movement.balance_weight || 0),
        Number(movement.stock_cost_price || 0),
        Number(movement.stock_cost_amount || 0),
        Number(movement.stock_value_price || 0),
        Number(movement.stock_value_amount || 0),
        formatProfitForExcel(movement.profit)
      ]);

      const merges = [
        { s: { r: 2, c: 0 }, e: { r: 4, c: 0 } }, // #
        { s: { r: 2, c: 1 }, e: { r: 4, c: 1 } }, // Doc Date
        { s: { r: 2, c: 2 }, e: { r: 4, c: 2 } }, // Ref
        { s: { r: 2, c: 3 }, e: { r: 4, c: 3 } }, // Stock ID
        { s: { r: 2, c: 4 }, e: { r: 4, c: 4 } }, // Account
        { s: { r: 2, c: 5 }, e: { r: 2, c: 8 } }, // In
        { s: { r: 2, c: 9 }, e: { r: 2, c: 12 } }, // Out
        { s: { r: 2, c: 13 }, e: { r: 2, c: 19 } }, // Balance
        { s: { r: 3, c: 5 }, e: { r: 4, c: 5 } }, // In Pcs
        { s: { r: 3, c: 6 }, e: { r: 4, c: 6 } }, // In Weight
        { s: { r: 3, c: 7 }, e: { r: 4, c: 7 } }, // In Price
        { s: { r: 3, c: 8 }, e: { r: 4, c: 8 } }, // In Amount
        { s: { r: 3, c: 9 }, e: { r: 4, c: 9 } }, // Out Pcs
        { s: { r: 3, c: 10 }, e: { r: 4, c: 10 } }, // Out Weight
        { s: { r: 3, c: 11 }, e: { r: 4, c: 11 } }, // Out Price
        { s: { r: 3, c: 12 }, e: { r: 4, c: 12 } }, // Out Amount
        { s: { r: 3, c: 13 }, e: { r: 4, c: 13 } }, // Bal Pcs
        { s: { r: 3, c: 14 }, e: { r: 4, c: 14 } }, // Bal Weight
        { s: { r: 3, c: 15 }, e: { r: 3, c: 16 } }, // Stock Cost
        { s: { r: 3, c: 17 }, e: { r: 3, c: 18 } }, // Stock Value
        { s: { r: 3, c: 19 }, e: { r: 4, c: 19 } } // Profit
      ];

      exportConsignmentToExcel({
        filename: `${selectedItem.stone_code}_Movement_Report`,
        sheetName: "Stock Movement Details",
        summaryHeaders: ["Total Movements"],
        summaryValues: [movementDetails.movements.length],
        itemHeaders,
        itemRows,
        merges
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


  // Fetch stock movement details when component mounts or selectedItem changes
  useEffect(() => {
    const fetchMovementDetails = async () => {
      if (!selectedItem?.stone_code) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const result = await getStockMovementByStoneCode(selectedItem.stone_code);
        const data = result?.data || result || { movements: [] };
        setMovementDetails(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching movement details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovementDetails();
  }, [selectedItem]);

  const container1Ref = useRef(null);
  const container2Ref = useRef(null);

  const syncScroll = (sourceRef, targetRef) => {
    if (targetRef.current) {
      targetRef.current.scrollTop = sourceRef.current.scrollTop;
      targetRef.current.scrollLeft = sourceRef.current.scrollLeft;
    }
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

  return (
    <Box sx={{ marginTop: "12px" }}>
      <Box sx={{ padding: "2px 32px 32px 32px", bgcolor: "#F8F8F8", minHeight: "687px" }}>
        {/* Header Controls */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 32px", borderRadius: "5px 5px 0px 0px" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box onClick={onBack} sx={{ cursor: "pointer", marginRight: "16px", display: "flex", alignItems: "center" }}>
              <svg width="31" height="30" viewBox="0 0 31 30" fill="none">
                <path d="M19.7188 6.5625L11.2812 15L19.7188 23.4375" stroke="#343434" strokeWidth="1.875" strokeMiterlimit="10" strokeLinecap="square" />
              </svg>
            </Box>
            <Typography sx={{
              color: "#343434",
              fontFamily: "Calibri",
              fontSize: "20px",
              fontWeight: 700,
              marginRight: "24px",
            }}>
              {selectedItem ? `${selectedItem.stone_code} - ${selectedItem.lot_no}` : null}
            </Typography>
            {/* {selectedItem && (
              <Typography sx={{ color: "#343434", fontFamily: "Calibri", fontSize: "16px", fontWeight: 400, opacity: 0.8 }}>
                {selectedItem.stone} | {selectedItem.shape} | {selectedItem.size} | {selectedItem.color} | {selectedItem.cutting} | {selectedItem.clarity}
              </Typography>
            )} */}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography sx={{ color: "#343434", fontFamily: "Calibri", fontSize: "16px", fontWeight: 400 }}>Date :</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker defaultValue={dayjs()} format="DD/MM/YYYY" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", backgroundColor: "#FFF", width: "150px", height: "34px", "& .MuiInputBase-input": { fontSize: "16px", fontFamily: "Calibri" } }, marginRight: "8px", marginLeft: "8px" }} />
            </LocalizationProvider>
            <Typography sx={{ color: "#343434", fontFamily: "Calibri", fontSize: "16px", fontWeight: 400 }}>To</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker defaultValue={dayjs()} format="DD/MM/YYYY" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px", backgroundColor: "#FFF", width: "150px", height: "34px", "& .MuiInputBase-input": { fontSize: "16px", fontFamily: "Calibri" } }, marginRight: "24px", marginLeft: "8px" }} />
            </LocalizationProvider>

          </Box>
        </Box>

        {/* Table Container */}
        <Box sx={{ maxWidth: "1600px", borderRadius: "5px", border: "1px solid #C6C6C8  ", overflow: "hidden" }}>
          <Box sx={{ display: "flex", height: "580px", overflow: "auto", "&::-webkit-scrollbar": { height: "10px", width: "5px" }, "&::-webkit-scrollbar-track": { background: "#FFF" }, "&::-webkit-scrollbar-thumb": { background: "#919191", borderRadius: "5px" }, bgcolor: "#FFF" }}>
            <Box sx={{ minWidth: "2388px" }}>
              {/* Table Header */}
              <Box sx={{ height: "96px", bgcolor: "#F2F2F2", borderBottom: "1px solid #EDEDED", display: "flex", width: "2387px" }}>
                <Box sx={{ maxWidth: "50px", minWidth: "50px", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid #EDEDED", boxSizing: "border-box" }}><Typography sx={{ fontWeight: 700, fontFamily: "Calibri" }}>#</Typography></Box>
                <Box sx={{ maxWidth: "120px", minWidth: "120px", display: "flex", justifyContent: "left", alignItems: "center", borderRight: "1px solid #EDEDED", boxSizing: "border-box", padding: "0 8px" }}><Typography sx={{ fontWeight: 700, fontFamily: "Calibri" }}>Date</Typography></Box>
                <Box sx={{ maxWidth: "120px", minWidth: "120px", display: "flex", justifyContent: "left", alignItems: "center", borderRight: "1px solid #EDEDED", boxSizing: "border-box", padding: "0 8px" }}><Typography sx={{ fontWeight: 700, fontFamily: "Calibri" }}>Ref</Typography></Box>
                <Box sx={{ maxWidth: "120px", minWidth: "120px", display: "flex", justifyContent: "left", alignItems: "center", borderRight: "1px solid #EDEDED", boxSizing: "border-box", padding: "0 8px" }}><Typography sx={{ fontWeight: 700, fontFamily: "Calibri" }}>Stock ID</Typography></Box>
                <Box sx={{ maxWidth: "120px", minWidth: "120px", display: "flex", justifyContent: "left", alignItems: "center", borderRight: "1px solid #EDEDED", boxSizing: "border-box", padding: "0 8px" }}><Typography sx={{ fontWeight: 700, fontFamily: "Calibri" }}>Account</Typography></Box>

                {/* In Section */}
                <Box sx={{ minWidth: "476px ", borderRight: "1px solid #EDEDED", boxSizing: "border-box" }}>
                  <Box sx={{ height: "32px", bgcolor: "rgba(5, 89, 91, 0.4)", display: "flex", justifyContent: "center", alignItems: "center", boxSizing: "border-box" }}><Typography sx={{ fontWeight: 700, fontFamily: "Calibri" }}>In</Typography></Box>
                  <Box sx={{ height: "64px", display: "flex" }}>
                    <Box sx={{ minWidth: "108px ", maxWidth: "108px ", flex: 1, display: "flex", justifyContent: "right", alignItems: "center", borderRight: "1px solid #EDEDED", bgcolor: "rgba(5, 89, 91, 0.1)", boxSizing: "border-box", padding: "0 8px" }}><Typography sx={{ fontWeight: 700, fontSize: "14px", fontFamily: "Calibri" }}>Pcs</Typography></Box>
                    <Box sx={{ minWidth: "108px ", maxWidth: "108px ", flex: 1, display: "flex", justifyContent: "right", alignItems: "center", borderRight: "1px solid #EDEDED", bgcolor: "rgba(5, 89, 91, 0.1)", boxSizing: "border-box", padding: "0 8px" }}><Typography sx={{ fontWeight: 700, fontSize: "14px", fontFamily: "Calibri" }}>Weight</Typography></Box>
                    <Box sx={{ minWidth: "140px ", maxWidth: "140px ", flex: 1, display: "flex", justifyContent: "right", alignItems: "center", borderRight: "1px solid #EDEDED", bgcolor: "rgba(5, 89, 91, 0.1)", boxSizing: "border-box", padding: "0 8px" }}><Typography sx={{ fontWeight: 700, fontSize: "14px", fontFamily: "Calibri" }}>Price/Unit</Typography></Box>
                    <Box sx={{ minWidth: "120px ", maxWidth: "120px ", flex: 1, display: "flex", justifyContent: "right", alignItems: "center", bgcolor: "rgba(5, 89, 91, 0.1)", boxSizing: "border-box", padding: "0 8px" }}><Typography sx={{ fontWeight: 700, fontSize: "14px", fontFamily: "Calibri" }}>Amount</Typography></Box>
                  </Box>
                </Box>


                {/* Out Section */}
                <Box sx={{ width: "477px", borderRight: "1px solid #EDEDED", boxSizing: "border-box" }}>
                  <Box sx={{ height: "32px", bgcolor: "rgba(224, 4, 16, 0.4)", display: "flex", justifyContent: "center", alignItems: "center", boxSizing: "border-box" }}><Typography sx={{ fontWeight: 700, fontFamily: "Calibri" }}>Out</Typography></Box>
                  <Box sx={{ height: "64px", display: "flex" }}>
                    <Box sx={{ minWidth: "108px ", maxWidth: "108px ", flex: 1, display: "flex", justifyContent: "right", alignItems: "center", borderRight: "1px solid #EDEDED", bgcolor: "rgba(224, 4, 16, 0.1)", boxSizing: "border-box", padding: "0 8px" }}><Typography sx={{ fontWeight: 700, fontSize: "14px", fontFamily: "Calibri" }}>Pcs</Typography></Box>
                    <Box sx={{ minWidth: "108px ", maxWidth: "108px ", flex: 1, display: "flex", justifyContent: "right", alignItems: "center", borderRight: "1px solid #EDEDED", bgcolor: "rgba(224, 4, 16, 0.1)", boxSizing: "border-box", padding: "0 8px" }}><Typography sx={{ fontWeight: 700, fontSize: "14px", fontFamily: "Calibri" }}>Weight</Typography></Box>
                    <Box sx={{ minWidth: "140px ", maxWidth: "140px ", flex: 1, display: "flex", justifyContent: "right", alignItems: "center", borderRight: "1px solid #EDEDED", bgcolor: "rgba(224, 4, 16, 0.1)", boxSizing: "border-box", padding: "0 8px" }}><Typography sx={{ fontWeight: 700, fontSize: "14px", fontFamily: "Calibri" }}>Price/Unit</Typography></Box>
                    <Box sx={{ minWidth: "120px ", maxWidth: "120px ", flex: 1, display: "flex", justifyContent: "right", alignItems: "center", bgcolor: "rgba(224, 4, 16, 0.1)", boxSizing: "border-box", padding: "0 8px" }}><Typography sx={{ fontWeight: 700, fontSize: "14px", fontFamily: "Calibri" }}>Amount</Typography></Box>
                  </Box>
                </Box>

                {/* Balance Section */}
                <Box sx={{ width: "987px", boxSizing: "border-box" }}>
                  <Box sx={{ height: "32px", bgcolor: "rgba(139, 180, 255, 0.4)", display: "flex", justifyContent: "center", alignItems: "center", boxSizing: "border-box" }}><
                    Typography sx={{ fontWeight: 700, fontFamily: "Calibri" }}>Balance</Typography></Box>
                  <Box sx={{ height: "64px", display: "flex" }}>
                    <Box sx={{ maxWidth: "108px", minWidth: "108px", display: "flex", justifyContent: "right", alignItems: "center", borderRight: "1px solid #EDEDED", bgcolor: "rgba(139, 180, 255, 0.1)", boxSizing: "border-box", padding: "0 8px" }}><Typography sx={{ fontWeight: 700, fontSize: "14px", fontFamily: "Calibri" }}>Pcs</Typography></Box>
                    <Box sx={{ maxWidth: "108px", minWidth: "108px", display: "flex", justifyContent: "right", alignItems: "center", borderRight: "1px solid #EDEDED", bgcolor: "rgba(139, 180, 255, 0.1)", boxSizing: "border-box", padding: "0 8px" }}><Typography sx={{ fontWeight: 700, fontSize: "14px", fontFamily: "Calibri" }}>Weight</Typography></Box>

                    <Box sx={{ maxWidth: "260px", minWidth: "260px", borderRight: "1px solid #EDEDED", bgcolor: "rgba(139, 180, 255, 0.1)", boxSizing: "border-box" }}>
                      <Box sx={{ height: "50%", display: "flex", justifyContent: "center", alignItems: "center", borderBottom: "1px solid #EDEDED", boxSizing: "border-box" }}>
                        <Typography sx={{ fontSize: "14px", fontWeight: 700, fontFamily: "Calibri" }}>Stock Cost</Typography></Box>

                      <Box sx={{ height: "50%", display: "flex" }}>
                        <Box sx={{ minWidth: "140px ", maxWidth: "140px ", flex: 1, display: "flex", justifyContent: "right", alignItems: "center", borderRight: "1px solid #EDEDED", boxSizing: "border-box", padding: "0 8px" }}>
                          <Typography sx={{ fontWeight: 700, fontSize: "14px", fontFamily: "Calibri" }}>Price/Unit</Typography></Box>
                        <Box sx={{ minWidth: "120px ", maxWidth: "120px ", flex: 1, display: "flex", justifyContent: "right", alignItems: "center", boxSizing: "border-box", padding: "0 8px" }}>
                          <Typography sx={{ fontWeight: 700, fontSize: "14px", fontFamily: "Calibri" }}>Amount</Typography></Box>

                      </Box>
                    </Box>

                    <Box sx={{ maxWidth: "260px", minWidth: "260px", borderRight: "1px solid #EDEDED", bgcolor: "rgba(139, 180, 255, 0.1)", boxSizing: "border-box" }}>
                      <Box sx={{ alignItems: "center", height: "50%", display: "flex", justifyContent: "center", borderBottom: "1px solid #EDEDED", boxSizing: "border-box" }}>
                        <Typography sx={{ fontSize: "14px", fontWeight: 700, fontFamily: "Calibri" }}>Stock Value</Typography></Box>

                      <Box sx={{ height: "50%", display: "flex" }}>
                        <Box sx={{ minWidth: "140px ", maxWidth: "140px ", flex: 1, display: "flex", justifyContent: "right", alignItems: "center", borderRight: "1px solid #EDEDED", boxSizing: "border-box", padding: "0 8px" }}>
                          <Typography sx={{ fontWeight: 700, fontSize: "14px", fontFamily: "Calibri" }}>Price/Unit</Typography></Box>
                        <Box sx={{ minWidth: "120px ", maxWidth: "120px ", flex: 1, display: "flex", justifyContent: "right", alignItems: "center", boxSizing: "border-box", padding: "0 8px" }}>
                          <Typography sx={{ fontWeight: 700, fontSize: "14px", fontFamily: "Calibri" }}>Amount</Typography></Box>
                      </Box>

                    </Box>

                    <Box sx={{ maxWidth: "167px", minWidth: "167px", display: "flex", justifyContent: "right", alignItems: "center", bgcolor: "rgba(139, 180, 255, 0.1)", boxSizing: "border-box", padding: "0 8px" }}>
                      <Typography sx={{ fontWeight: 700, fontSize: "14px", fontFamily: "Calibri" }}>Profit</Typography></Box>
                  </Box>
                </Box>
              </Box>

              {/* Table Body */}
              <Box>
                {movementDetails && Array.isArray(movementDetails.movements) ? (
                  movementDetails.movements.map((movement, index) => (
                    <Box key={index} sx={{ height: "42px", display: "flex", backgroundColor: "#FFF", borderBottom: "1px solid #EDEDED", "&:hover": { bgcolor: "#F5F8FF" } }}>
                      <Box sx={{ maxWidth: "50px", minWidth: "50px", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid #EDEDED", boxSizing: "border-box" }}><Typography sx={{ fontSize: "16px", fontFamily: "Calibri", fontWeight: 400 }}>{index + 1}</Typography></Box>
                      <Box sx={{ maxWidth: "120px", minWidth: "120px", display: "flex", justifyContent: "left", alignItems: "center", padding: "0 8px", borderRight: "1px solid #EDEDED", boxSizing: "border-box" }}><Typography sx={{ fontSize: "16px", fontFamily: "Calibri", fontWeight: 400, color: "#343434" }}>{new Date(movement.doc_date).toLocaleDateString('en-GB')}</Typography></Box>
                      <Box sx={{ maxWidth: "120px", minWidth: "120px", display: "flex", justifyContent: "left", alignItems: "center", padding: "0 8px", borderRight: "1px solid #EDEDED", boxSizing: "border-box" }}><Typography sx={{ fontSize: "16px", fontFamily: "Calibri", fontWeight: 400, color: "#343434" }}>{movement.ref || "---"}</Typography></Box>
                      <Box sx={{ maxWidth: "120px", minWidth: "120px", display: "flex", justifyContent: "left", alignItems: "center", padding: "0 8px", borderRight: "1px solid #EDEDED", boxSizing: "border-box" }}><Typography sx={{ fontSize: "16px", fontFamily: "Calibri", fontWeight: 400, color: "#343434" }}>{movement.stock_id || "---"}</Typography></Box>
                      <Box sx={{ maxWidth: "120px", minWidth: "120px", display: "flex", alignItems: "center", padding: "0 8px", borderRight: "1px solid #EDEDED", boxSizing: "border-box" }}><Typography sx={{ fontSize: "16px", fontFamily: "Calibri", fontWeight: 400 }}>{typeof movement.account === "object" ? (movement.account?.vendor_code_name || movement.account?.label || "") : (movement.account || "---")}</Typography></Box>

                      {/* In Section Data */}
                      <Box sx={{ maxWidth: "108px ", minWidth: "108px ", display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "0 8px", borderRight: "1px solid #EDEDED", boxSizing: "border-box" }}><Typography sx={{ fontSize: "16px", fontFamily: "Calibri", fontWeight: 400, color: "#343434" }}>{movement.in_pcs || 0}</Typography></Box>
                      <Box sx={{ maxWidth: "108px ", minWidth: "108px ", display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "0 8px", borderRight: "1px solid #EDEDED", boxSizing: "border-box" }}><Typography sx={{ fontSize: "16px", fontFamily: "Calibri", fontWeight: 400, color: "#343434" }}>{Number(movement.in_weight || 0).toFixed(3)}</Typography></Box>
                      <Box sx={{ minWidth: "140px ", maxWidth: "140px ", display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "0 8px", borderRight: "1px solid #EDEDED", boxSizing: "border-box", textAlign: "right" }}><Typography sx={{ fontSize: "16px", fontFamily: "Calibri", fontWeight: 400, color: "#343434" }}>{Number(movement.in_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / {movement.stock_unit}</Typography></Box>
                      <Box sx={{ maxWidth: "120px ", minWidth: "120px ", display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "0 8px", borderRight: "1px solid #EDEDED", boxSizing: "border-box" }}><Typography sx={{ fontSize: "16px", fontFamily: "Calibri", fontWeight: 400, color: "#343434" }}>{Number(movement.in_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography></Box>

                      {/* Out Section Data */}
                      <Box sx={{ maxWidth: "108px ", minWidth: "108px ", display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "0 8px", borderRight: "1px solid #EDEDED", boxSizing: "border-box" }}><Typography sx={{ fontSize: "16px", fontFamily: "Calibri", fontWeight: 400, color: "#343434" }}>{movement.out_pcs || 0}</Typography></Box>
                      <Box sx={{ maxWidth: "108px ", minWidth: "108px ", display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "0 8px", borderRight: "1px solid #EDEDED", boxSizing: "border-box" }}><Typography sx={{ fontSize: "16px", fontFamily: "Calibri", fontWeight: 400, color: "#343434" }}>{Number(movement.out_weight || 0).toFixed(3)}</Typography></Box>
                      <Box sx={{ minWidth: "140px ", maxWidth: "140px ", display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "0 8px", borderRight: "1px solid #EDEDED", boxSizing: "border-box", textAlign: "right" }}><Typography sx={{ fontSize: "16px", fontFamily: "Calibri", fontWeight: 400, color: "#343434" }}>{Number(movement.out_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / {movement.stock_unit}</Typography></Box>
                      <Box sx={{ maxWidth: "120px", minWidth: "120px", display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "0 8px", borderRight: "1px solid #EDEDED", boxSizing: "border-box" }}><Typography sx={{ fontSize: "16px", fontFamily: "Calibri", fontWeight: 400, color: "#343434" }}>{Number(movement.out_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography></Box>

                      {/* Balance Section Data */}
                      <Box sx={{ maxWidth: "108px", minWidth: "108px", display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "0 8px", borderRight: "1px solid #EDEDED", boxSizing: "border-box" }}><Typography sx={{ fontSize: "16px", fontFamily: "Calibri", fontWeight: 400, color: "#343434" }}>{movement.balance_pcs || 0}</Typography></Box>
                      <Box sx={{ maxWidth: "108px", minWidth: "108px", display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "0 8px", borderRight: "1px solid #EDEDED", boxSizing: "border-box" }}><Typography sx={{ fontSize: "16px", fontFamily: "Calibri", fontWeight: 400, color: "#343434" }}>{Number(movement.balance_weight || 0).toFixed(3)}</Typography></Box>
                      <Box sx={{ minWidth: "140px ", maxWidth: "140px ", display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "0 8px", borderRight: "1px solid #EDEDED", boxSizing: "border-box", textAlign: "right" }}><Typography sx={{ fontSize: "16px", fontFamily: "Calibri", fontWeight: 400, color: "#343434" }}>{Number(movement.stock_cost_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / {movement.stock_unit}</Typography></Box>
                      <Box sx={{ maxWidth: "120px", minWidth: "120px", display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "0 8px", borderRight: "1px solid #EDEDED", boxSizing: "border-box" }}><Typography sx={{ fontSize: "16px", fontFamily: "Calibri", fontWeight: 400, color: "#343434" }}>{Number(movement.stock_cost_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography></Box>
                      <Box sx={{ minWidth: "140px ", maxWidth: "140px ", display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "0 8px", borderRight: "1px solid #EDEDED", boxSizing: "border-box", textAlign: "right" }}><Typography sx={{ fontSize: "16px", fontFamily: "Calibri", fontWeight: 400, color: "#343434" }}>{Number(movement.stock_value_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / {movement.stock_unit}</Typography></Box>
                      <Box sx={{ maxWidth: "120px", minWidth: "120px", display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "0 8px", borderRight: "1px solid #EDEDED", boxSizing: "border-box" }}><Typography sx={{ fontSize: "16px", fontFamily: "Calibri", fontWeight: 400, color: "#343434" }}>{Number(movement.stock_value_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography></Box>
                      <Box sx={{ maxWidth: "160px", minWidth: "160px", display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "0 8px", boxSizing: "border-box" }}><Typography sx={{ fontSize: "16px", fontFamily: "Calibri", fontWeight: 700, color: movement.profit >= 0 ? "green" : "red" }}>{formatProfitForExcel(movement.profit)}</Typography></Box>
                    </Box>
                  ))
                ) : null}
              </Box>

              {/* Totals Footer Row */}
              {totals && movementDetails.movements.length > 0 && (
                <Box sx={{ height: "42px", backgroundColor: "#FFF", display: "flex", alignItems: "center", borderTop: "1px solid #EDEDED", borderBottom: "1px solid #EDEDED", position: "sticky", bottom: 0, zIndex: 999 }}>
                  <Box sx={{ maxWidth: "534px", minWidth: "534px", display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box", borderRight: "1px solid #EDEDED" }}>
                    <Typography sx={{ fontFamily: "Calibri", fontSize: "16px", fontWeight: 700, color: "#666666" }}></Typography>
                  </Box>

                  {/* In Totals */}
                  <Box sx={{ maxWidth: "110px", minWidth: "110px", padding: "0 8px", textAlign: "right", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}>
                    <Typography sx={{ color: "#666666", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>{totals.in_pcs}</Typography>
                  </Box>
                  <Box sx={{ maxWidth: "110px", minWidth: "110px", padding: "0 8px", textAlign: "right", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}>
                    <Typography sx={{ color: "#666666", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>{totals.in_weight.toFixed(3)}</Typography>
                  </Box>
                  <Box sx={{ maxWidth: "144px", minWidth: "144px", padding: "0 8px", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}></Box>
                  <Box sx={{ maxWidth: "110px", minWidth: "110px", padding: "0 8px", textAlign: "right", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}>
                    <Typography sx={{ color: "#666666", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>{Number(totals.in_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                  </Box>

                  {/* Out Totals */}
                  <Box sx={{ maxWidth: "110px", minWidth: "110px", padding: "0 8px", textAlign: "right", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}>
                    <Typography sx={{ color: "#666666", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>{totals.out_pcs}</Typography>
                  </Box>
                  <Box sx={{ maxWidth: "110px", minWidth: "110px", padding: "0 8px", textAlign: "right", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}>
                    <Typography sx={{ color: "#666666", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>{totals.out_weight.toFixed(3)}</Typography>
                  </Box>
                  <Box sx={{ maxWidth: "146px", minWidth: "146px", padding: "0 8px", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}></Box>
                  <Box sx={{ maxWidth: "110px", minWidth: "110px", padding: "0 8px", textAlign: "right", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}>
                    <Typography sx={{ color: "#666666", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>{Number(totals.out_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                  </Box>

                  {/* Balance (showing current balance from last row) */}
                  <Box sx={{ borderBottom: "1px solid #EDEDED", maxWidth: "110px", minWidth: "110px", padding: "0 8px", textAlign: "right", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}>
                    <Typography sx={{ color: "#666666", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>{totals.balance_pcs || 0}</Typography>
                  </Box>
                  <Box sx={{ borderBottom: "1px solid #EDEDED", maxWidth: "110px", minWidth: "110px", padding: "0 8px", textAlign: "right", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}>
                    <Typography sx={{ color: "#666666", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>{Number(totals.balance_weight || 0).toFixed(3)}</Typography>
                  </Box>
                  <Box sx={{ borderBottom: "1px solid #EDEDED", maxWidth: "143px", minWidth: "143px", padding: "0 8px", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}></Box>
                  <Box sx={{ borderBottom: "1px solid #EDEDED", maxWidth: "120px", minWidth: "120px", padding: "0 8px", textAlign: "right", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}>
                    <Typography sx={{ color: "#666666", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>{Number(totals.stock_cost_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                  </Box>
                  <Box sx={{ borderBottom: "1px solid #EDEDED", maxWidth: "137px", minWidth: "137px", padding: "0 8px", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}></Box>
                  <Box sx={{ borderBottom: "1px solid #EDEDED", maxWidth: "120px", minWidth: "120px", padding: "0 8px", textAlign: "right", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}>
                    <Typography sx={{ color: "#666666", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>{Number(totals.stock_value_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                  </Box>
                  <Box sx={{ borderBottom: "1px solid #EDEDED", maxWidth: "160px", minWidth: "160px", padding: "0 8px", textAlign: "right", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}>
                    <Typography sx={{ color: "#666666", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700, color: totals.profit >= 0 ? "green" : "red" }}>{formatProfitForExcel(totals.profit)}</Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
      <FooterReport onExcel={handleExportExcel} />
    </Box>
  );
};

export default StockMovementReportInSide;
