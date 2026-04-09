import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import NavBar from "../../../component/NavBar/NavBar";
import Header from "../../../component/Layout/Header";
import FooterVendor from "../../../component/Layout/FooterVendor";
import MergeSplitHeader from "../../../component/Inventory/Transfer/MergeSplitHeader";
import MergeSplitBody from "../../../component/Inventory/Transfer/MergeSplitBody";
import StockSelectionModal from "../../../component/Inventory/Transfer/StockSelectionModal";
import dayjs from "dayjs";
import apiRequest from "../../../helpers/apiHelper";

const MergeSplitStock = () => {
  const [docDate, setDocDate] = useState(dayjs());
  const [ref1, setRef1] = useState("");
  const [ref2, setRef2] = useState("");
  const [sourceRows, setSourceRows] = useState([]);
  const [targetRows, setTargetRows] = useState([]);
  const [invoiceNo, setInvoiceNo] = useState("MST251106022");
  const [note, setNote] = useState("");
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);

  const handleAddTargetRow = () => {
    const newRow = {
      id: Date.now(),
      stock_id: "",
      location: "",
      lot: "",
      stone_code: "",
      stone: "",
      shape: "",
      size: "",
      color: "",
      cutting: "",
      quality: "",
      cer_type: "",
      cer_no: "",
      pcs: 0,
    };
    setTargetRows([...targetRows, newRow]);
  };

  const handleUpdateTargetRow = (id, field, value) => {
    setTargetRows(targetRows.map(row => (row.id === id ? { ...row, [field]: value } : row)));
  };

  const handleRemoveTargetRow = (id) => {
    setTargetRows(targetRows.filter(row => row.id !== id));
  };

  const handleRemoveSourceRow = (id) => {
    setSourceRows(sourceRows.filter(row => row.id !== id));
  };

  const handleSelectStocks = (selectedStocks) => {
    const formattedStocks = selectedStocks.map(s => ({
      id: s._id || s.id,
      image: s.image,
      stock_id: s.stock_id,
      location: s.location?.location_name || "",
      lot: s.lot_no,
      stone_code: s.stone_code,
      stone: s.stone,
      shape: s.shape,
      size: s.size,
      color: s.color,
      cutting: s.cutting,
      quality: s.quality,
      clarity: s.clarity,
      cer_type: s.cer_type,
      cer_no: s.cer_no,
      pcs: Number(s.pcs) || 0,
      weight: Number(s.weight) || 0,
      price: Number(s.price) || 0,
      unit: s.unit || "pcs",
      amount: Number(s.amount) || 0,
      remark: s.remark || ""
    }));
    setSourceRows(formattedStocks);
  };

  const handleApprove = () => {
    console.log("Approving...");
  };

  const handleDayBook = () => {
    console.log("Opening Day Book...");
  };

  return (
    <Box sx={{ display: "flex", backgroundColor: "#F4F7F7", minHeight: "100vh" }}>
      <NavBar />
      <Box sx={{ marginLeft: "220px", flexGrow: 1, display: "flex", flexDirection: "column", paddingBottom: "130px" }}>
        <Header />
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <MergeSplitHeader 
            invoiceNo={invoiceNo} 
            onApprove={handleApprove} 
            onDayBook={handleDayBook} 
          />
          <MergeSplitBody 
            docDate={docDate}
            setDocDate={setDocDate}
            ref1={ref1}
            setRef1={setRef1}
            ref2={ref2}
            setRef2={setRef2}
            invoiceNo={invoiceNo}
            sourceRows={sourceRows}
            targetRows={targetRows}
            onAddTargetRow={handleAddTargetRow}
            onUpdateTargetRow={handleUpdateTargetRow}
            note={note}
            setNote={setNote}
            onStockClick={() => setIsStockModalOpen(true)}
            onRemoveSourceRow={handleRemoveSourceRow}
            onRemoveTargetRow={handleRemoveTargetRow}
          />
        </Box>
      </Box>
      <FooterVendor />
      <StockSelectionModal 
        open={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        onSelect={handleSelectStocks}
      />
    </Box>
  );
};

export default MergeSplitStock;
