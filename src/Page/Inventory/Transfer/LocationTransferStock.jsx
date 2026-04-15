import React, { useState, useEffect, useCallback } from "react";
import { Box } from "@mui/material";
import NavBar from "../../../component/NavBar/NavBar";
import Header from "../../../component/Layout/Header";
import FooterVendor from "../../../component/Layout/FooterVendor";
import LocationTransferHeader from "../../../component/Inventory/Transfer/LocationTransferHeader";
import LocationTransferBody from "../../../component/Inventory/Transfer/LocationTransferBody";
import StockSelectionModal from "../../../component/Inventory/Transfer/StockSelectionModal";
import SuccessModal from "../../../component/Commons/SuccessModal";
import ErrorModal from "../../../component/Commons/ErrorModal";
import CustomConfirmDialog from "../../../component/Commons/CustomConfirmDialog";
import ValidationWarningBanner from "../../../component/Commons/ValidationWarningBanner";
import dayjs from "dayjs";
import apiRequest from "../../../helpers/apiHelper";
import { useDropdownOptions } from "../../../component/Inventory/hooks/useDropdownOptions";
import TransferDaybookDrawer from "../../../component/Inventory/Transfer/TransferDaybookDrawer";
import TransferModalDayBook from "../../../component/Inventory/Transfer/TransferModalDayBook";
import ApprovalModal from "../../../component/Commons/ApprovalModal";

const LocationTransferStock = () => {
  const [docDate, setDocDate] = useState(dayjs());
  const [ref1, setRef1] = useState("");
  const [ref2, setRef2] = useState("");
  const [sourceRows, setSourceRows] = useState([]);
  
  // Changed to 2D array: targetRows[batchIndex] = [rows...]
  const [targetRows, setTargetRows] = useState([]); 
  const [activeBatchIndex, setActiveBatchIndex] = useState(0);

  const [invoiceNo, setInvoiceNo] = useState("");
  const [note, setNote] = useState("");
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [currentTransferId, setCurrentTransferId] = useState(null);
  const [fsmState, setFsmState] = useState("initial");
  const [isEditMode, setIsEditMode] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Unsuccessfully!");
  const [openSaveConfirm, setOpenSaveConfirm] = useState(false);
  const [showWarningBanner, setShowWarningBanner] = useState(false);
  const [warningMessage, setWarningMessage] = useState("Please complete all required fields.");
  const [isDaybookDrawerOpen, setIsDaybookDrawerOpen] = useState(false);
  const [isDaybookModalOpen, setIsDaybookModalOpen] = useState(false);
  const [openApproveConfirm, setOpenApproveConfirm] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [isBodyLoading, setIsBodyLoading] = useState(false);
  const { dropdownOptions } = useDropdownOptions();
  const isViewMode = (fsmState === "saved" && !isEditMode) || isApproved;

  const getLocationValue = (row) => row.location_id || row.location || null;

  const normalizeRow = useCallback((s) => ({
    id: s._id || s.id || `${Date.now()}-${Math.random()}`,
    db_id: s._id || s.id || null,
    image: s.image ? (s.image.startsWith("data:") || s.image.startsWith("http") ? s.image : (s.image.startsWith("/") ? s.image : `/${s.image}`)) : "",
    stock_id: s.stock_id || "",
    location: s.location?.location_name || s.location_name || "",
    location_id: s.location?._id || s.location || s.location_id || "",
    lot: s.lot_no || s.lot || "",
    stone_code: s.stone_code || "",
    stone: s.stone || "",
    shape: s.shape || "",
    size: s.size || "",
    color: s.color || "",
    cutting: s.cutting || "",
    quality: s.quality || "",
    clarity: s.clarity || "",
    cer_type: s.cer_type || "",
    cer_no: s.cer_no || "",
    pcs: Number(s.pcs) || 0,
    availablePcs: Number(s.pcs) || 0,
    weight: Number(s.weight) || 0,
    price: Number(s.price) || 0,
    unit: s.unit || "pcs",
    amount: Number(s.amount) || 0,
    remark: s.remark || "",
    stone_master: s.stone_master,
    shape_master: s.shape_master,
    size_master: s.size_master,
    color_master: s.color_master,
    quality_master: s.quality_master,
    clarity_master: s.clarity_master,
  }), []);

  const genInvoiceNo = useCallback(async () => {
    try {
      const data = await apiRequest("GET", "/transfers/next-invoice-no");
      setInvoiceNo(data?.invoice_no || data?.next_invoice_no || "");
    } catch (e) {
      setInvoiceNo("");
    }
  }, []);

  useEffect(() => {
    genInvoiceNo();
  }, [genInvoiceNo]);

  const handleAddTargetRow = (batchIndex) => {
    if (isViewMode) return;
    const source = sourceRows[batchIndex];
    const newRow = {
      id: Date.now(),
      image: source?.image || "",
      stock_id: "",
      location: "",
      lot: "",
      stone_code: source?.stone_code || "",
      stone: source?.stone || "",
      shape: "",
      size: "",
      color: "",
      cutting: "",
      quality: "",
      clarity: "",
      cer_type: "",
      cer_no: "",
      pcs: 0,
      weight: 0,
      price: source?.price || 0,
      unit: source?.unit || "pcs",
      amount: 0,
      remark: ""
    };

    setTargetRows(prev => {
        const updated = [...prev];
        updated[batchIndex] = [...(updated[batchIndex] || []), newRow];
        return updated;
    });
  };

  const calculateRowAmount = (row) => {
    const pcs = Number(row.pcs) || 0;
    const weight = Number(row.weight) || 0;
    const price = Number(row.price) || 0;
    const unit = (row.unit || "pcs").toLowerCase();

    const amount = (unit === "pcs" ? pcs : weight) * price;
    return parseFloat(amount.toFixed(2));
  };

  const handleUpdateSourceRow = (id, field, value) => {
    if (isViewMode) return;
    setSourceRows(sourceRows.map(row => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };
        if (["pcs", "weight", "price", "unit"].includes(field)) {
          updatedRow.amount = calculateRowAmount(updatedRow);
        }
        return updatedRow;
      }
      return row;
    }));
  };

  const handleUpdateTargetRow = (batchIndex, id, field, value) => {
    if (isViewMode) return;
    setTargetRows(prev => {
        const updated = [...prev];
        const rows = [...updated[batchIndex]];
        const rowIndex = rows.findIndex(r => r.id === id);
        if (rowIndex === -1) return prev;

        const updatedRow = { ...rows[rowIndex], [field]: value };
        if (field === "location") {
          const matchedLocation = (dropdownOptions.location || []).find(opt => opt.value === value);
          updatedRow.location = value;
          updatedRow.location_id = value;
          if (matchedLocation?.label) {
            updatedRow.location_name = matchedLocation.label;
          }
        }
        if (["pcs", "weight", "price", "unit"].includes(field)) {
          updatedRow.amount = calculateRowAmount(updatedRow);
        }
        rows[rowIndex] = updatedRow;
        updated[batchIndex] = rows;
        return updated;
    });
  };

  const handleRemoveTargetRow = (batchIndex, id) => {
    if (isViewMode) return;
    setTargetRows(prev => {
        const updated = [...prev];
        updated[batchIndex] = (updated[batchIndex] || []).filter(row => row.id !== id);
        return updated;
    });
  };

  const handleRemoveSourceRow = (id) => {
    if (isViewMode) return;
    const indexToRemove = sourceRows.findIndex(r => r.id === id);
    if (indexToRemove === -1) return;

    setSourceRows(sourceRows.filter(row => row.id !== id));
    setTargetRows(prev => {
        const updated = [...prev];
        updated.splice(indexToRemove, 1);
        return updated;
    });
    if (activeBatchIndex >= sourceRows.length - 1) {
        setActiveBatchIndex(Math.max(0, sourceRows.length - 2));
    }
  };

  const handleSelectStocks = (selectedStocks) => {
    if (isViewMode) return;
    if (selectedStocks.length === 0) {
      setSourceRows([]);
      setTargetRows([]);
      return;
    }

    setIsBodyLoading(true);
    setTimeout(() => {
      setIsBodyLoading(false);
    }, 1500);

    const formattedSource = selectedStocks.map(s => normalizeRow(s));
    setSourceRows(formattedSource);

    // Initialize targetRows with 2D structure
    const initialTargetRows = formattedSource.map(sourceRow => {
        return [{
            ...sourceRow,
            id: `target-${sourceRow.id}-${Math.random()}`,
            db_id: null,
            location: "",
            location_id: "",
            remark: "",
            pcs: 0, 
            weight: 0,
            amount: 0
        }];
    });
    setTargetRows(initialTargetRows);
    setActiveBatchIndex(0);
  };

  const buildPayload = useCallback(() => {
    const source_items = sourceRows.map((row) => ({
      _id: row.db_id || row.id,
      stock_id: row.stock_id || "",
      location: getLocationValue(row),
      lot_no: row.lot || "",
      stone_code: row.stone_code || "",
      stone: row.stone || "",
      shape: row.shape || "",
      size: row.size || "",
      color: row.color || "",
      cutting: row.cutting || "",
      quality: row.quality || "",
      clarity: row.clarity || "",
      cer_type: row.cer_type || "",
      cer_no: row.cer_no || "",
      pcs: Number(row.pcs) || 0,
      weight: Number(row.weight) || 0,
      price: Number(row.price) || 0,
      unit: row.unit || "pcs",
      amount: Number(row.amount) || 0,
      image: row.image || null,
    }));

    const target_items = targetRows.flatMap((batch, index) => {
        const source = sourceRows[index];
        return batch.map(row => ({
          ...(row.db_id ? { _id: row.db_id } : {}),
          source_stock_id: source?.stock_id || "", 
          stock_id: row.stock_id || "",
          location: getLocationValue(row),
          lot_no: row.lot || "",
          stone_code: row.stone_code || "",
          stone: row.stone || "",
          shape: row.shape || "",
          size: row.size || "",
          color: row.color || "",
          cutting: row.cutting || "",
          quality: row.quality || "",
          clarity: row.clarity || "",
          cer_type: row.cer_type || "",
          cer_no: row.cer_no || "",
          pcs: Number(row.pcs) || 0,
          weight: Number(row.weight) || 0,
          price: Number(row.price) || 0,
          unit: row.unit || "pcs",
          amount: Number(row.amount) || 0,
          remark: row.remark || "",
          image: row.image || null,
        }));
    });

    return {
      doc_date: docDate ? dayjs(docDate).toISOString() : null,
      ref_1: ref1 || "",
      ref_2: ref2 || "",
      note: note || "",
      source_items,
      target_items,
    };
  }, [docDate, note, ref1, ref2, sourceRows, targetRows]);

  const handleSave = useCallback(async () => {
    try {
      const payload = buildPayload();
      const result = currentTransferId
        ? await apiRequest("PUT", `/transfers/${currentTransferId}`, payload)
        : await apiRequest("POST", "/transfers", payload);

      const saved = result?.transfer || result?.locationTransfer || result;
      const savedId = saved?._id || saved?.id || currentTransferId;
      const savedInvoiceNo = saved?.invoice_no || invoiceNo;
      const savedStatus = saved?.status;

      if (savedId) setCurrentTransferId(savedId);
      if (savedInvoiceNo) setInvoiceNo(savedInvoiceNo);
      if (savedStatus) setIsApproved(String(savedStatus).toLowerCase() === "approved");

      setFsmState("saved");
      setIsEditMode(false);
      setOpenSuccessModal(true);
    } catch (error) {
      setErrorMessage(error?.response?.data?.error || error?.message || "Unsuccessfully!");
      setOpenErrorModal(true);
    }
  }, [buildPayload, currentTransferId, invoiceNo]);

  const showWarning = useCallback((message) => {
    setWarningMessage(message || "Please complete all required fields.");
    setShowWarningBanner(true);
    setTimeout(() => {
      setShowWarningBanner(false);
    }, 1800);
  }, []);
  const validateBeforeSave = useCallback(() => {
    if (!sourceRows.length) return "Please select stock item(s) first.";
    
    for (let i = 0; i < sourceRows.length; i++) {
        const batch = targetRows[i] || [];
        const source = sourceRows[i];
        
        const sourcePcs = Number(source.pcs);
        const targetPcs = batch.reduce((sum, r) => sum + (Number(r.pcs) || 0), 0);
        
        if (targetPcs !== sourcePcs) {
            return `Batch ${i + 1}: Total PCS must be ${sourcePcs} (current: ${targetPcs})`;
        }

        if (batch.some(r => !r.location)) {
            return `Batch ${i + 1}: Please select location for all rows.`;
        }
    }

    return "";
  }, [sourceRows, targetRows]);

  const onConfirmApprove = useCallback(async (confirmed) => {
    setOpenApproveConfirm(false);
    if (!confirmed) return;

    try {
      await apiRequest("PUT", `/transfers/${currentTransferId}/approve`, {});
      setIsApproved(true);
      setIsEditMode(false);
      setFsmState("saved");
      setOpenSuccessModal(true);
    } catch (error) {
      setErrorMessage(error?.response?.data?.error || error?.message || "Unsuccessfully!");
      setOpenErrorModal(true);
    }
  }, [currentTransferId]);

  const onConfirmApproveSync = (confirmed) => {
    onConfirmApprove(confirmed);
  };


  const onRequestSave = useCallback(() => {
    const validationMessage = validateBeforeSave();
    if (validationMessage) {
      showWarning(validationMessage);
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    setOpenSaveConfirm(true);
  }, [showWarning, validateBeforeSave]);

  const onConfirmSave = useCallback(async (confirmed) => {
    setOpenSaveConfirm(false);
    if (!confirmed) return;
    await handleSave();
  }, [handleSave]);

  const hasUnsavedData = useCallback(() => {
    if (fsmState === "saved" && !isEditMode) return false;
    return sourceRows.length > 0 || !!ref1 || !!ref2 || !!note;
  }, [fsmState, isEditMode, note, ref1, ref2, sourceRows.length]);

  const handleEditToggle = useCallback(() => {
    if (fsmState !== "saved" || isApproved) return;
    setIsEditMode(true);
    setFsmState("editing");
  }, [fsmState, isApproved]);

  const handleCancelEdit = useCallback(() => {
    if (fsmState === "editing") {
      setIsEditMode(false);
      setFsmState("saved");
      return;
    }
    if (fsmState === "dirty") {
        window.location.reload();
    }
  }, [fsmState]);

  const handleAddClick = useCallback(() => {
    window.location.reload();
  }, []);

  const handleApprove = useCallback(() => {
    if (!currentTransferId || isApproved) return;
    setOpenApproveConfirm(true);
  }, [currentTransferId, isApproved]);

  useEffect(() => {
    if (fsmState === "saved" && !isEditMode) return;
    if (hasUnsavedData()) {
      setFsmState((prev) => (prev === "initial" || prev === "saved" ? "dirty" : prev));
    }
  }, [docDate, ref1, ref2, note, sourceRows, targetRows, hasUnsavedData, fsmState, isEditMode]);

  const fetchTransferRecord = useCallback(async (id) => {
    try {
      const data = await apiRequest("GET", `/transfers/${id}`);
      const record = data?.transfer || data?.locationTransfer || data;
      if (record) {
        setCurrentTransferId(record._id);
        setInvoiceNo(record.invoice_no);
        setDocDate(dayjs(record.doc_date));
        setRef1(record.ref_1 || "");
        setRef2(record.ref_2 || "");
        setNote(record.note || "");
        setIsApproved(record.status?.toLowerCase() === "approved");

        if (Array.isArray(record.source_items)) {
          setSourceRows(record.source_items.map(normalizeRow));
        }
        
        if (Array.isArray(record.target_items)) {
            // Placeholder: grouping by source index if available or 1:1
            setTargetRows(record.target_items.map(r => [normalizeRow(r)]));
        }

        setFsmState("saved");
        setIsEditMode(false);
      }
    } catch (error) {
      console.error("Error fetching record:", error);
    }
  }, [normalizeRow]);

  const handleDayBook = () => {
    setIsDaybookModalOpen(true);
  };

  return (
    <Box sx={{ display: "flex", backgroundColor: "#F4F7F7", minHeight: "100vh" }}>
      <NavBar />
      <Box sx={{ marginLeft: "220px", flexGrow: 1, display: "flex", flexDirection: "column", paddingBottom: "60px" }}>
        <Header />
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <LocationTransferHeader
            invoiceNo={invoiceNo}
            onApprove={handleApprove}
            onDayBook={handleDayBook}
            disableApprove={!currentTransferId || isApproved || fsmState === "editing" || fsmState === "dirty"}
            isApproved={isApproved}
          />
          <LocationTransferBody
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
            onStockClick={() => !isViewMode && setIsStockModalOpen(true)}
            onRemoveSourceRow={handleRemoveSourceRow}
            onUpdateSourceRow={handleUpdateSourceRow}
            onRemoveTargetRow={handleRemoveTargetRow}
            dropdownOptions={dropdownOptions}
            disabled={isViewMode}
            onDaybookIconClick={() => setIsDaybookDrawerOpen(true)}
            showWarning={showWarning}
            showErrors={showErrors}
            isLoading={isBodyLoading}
            activeBatchIndex={activeBatchIndex}
            setActiveBatchIndex={setActiveBatchIndex}
          />
        </Box>
      </Box>
      <FooterVendor
        type="load"
        fsmState={fsmState}
        formData={currentTransferId ? { _id: currentTransferId, invoice_no: invoiceNo } : null}
        selectedData={currentTransferId ? { _id: currentTransferId, invoice_no: invoiceNo } : null}
        useCustomSaveConfirm
        onSaveClick={onRequestSave}
        onEditToggle={handleEditToggle}
        onCancelEdit={handleCancelEdit}
        onAddClick={handleAddClick}
        hasUnsavedData={hasUnsavedData}
        isApproved={isApproved}
        isEditMode={isEditMode}
      />
      <StockSelectionModal
        open={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        onSelect={handleSelectStocks}
        mode="transfer"
      />
      <SuccessModal
        open={openSuccessModal}
        onClose={() => setOpenSuccessModal(false)}
      />
      <ErrorModal
        open={openErrorModal}
        onClose={() => setOpenErrorModal(false)}
        message={errorMessage}
      />
      <CustomConfirmDialog
        open={openSaveConfirm}
        onClose={(confirmed) => onConfirmSave(!!confirmed)}
        onConfirm={onConfirmSave}
        title="Confirm save"
      />
      <ApprovalModal
        open={openApproveConfirm}
        onConfirm={onConfirmApprove}
        onClose={() => setOpenApproveConfirm(false)}
        title="Approve Confirmation"
      />
      <ValidationWarningBanner
        show={showWarningBanner}
        message={warningMessage}
        sx={{ position: "fixed", top: "100px", right: "25px", zIndex: 99999 }}
      />
      <TransferDaybookDrawer
        open={isDaybookDrawerOpen}
        onClose={() => setIsDaybookDrawerOpen(false)}
        onSelect={(id) => fetchTransferRecord(id)}
      />
      <TransferModalDayBook
        open={isDaybookModalOpen}
        onClose={() => setIsDaybookModalOpen(false)}
        onSelect={(id) => fetchTransferRecord(id)}
      />
    </Box>
  );
};

export default LocationTransferStock;
