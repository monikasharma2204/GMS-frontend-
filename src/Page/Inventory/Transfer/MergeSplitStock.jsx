import React, { useState, useEffect, useCallback } from "react";
import { Box } from "@mui/material";
import NavBar from "../../../component/NavBar/NavBar";
import Header from "../../../component/Layout/Header";
import FooterVendor from "../../../component/Layout/FooterVendor";
import MergeSplitHeader from "../../../component/Inventory/Transfer/MergeSplitHeader";
import MergeSplitBody from "../../../component/Inventory/Transfer/MergeSplitBody";
import StockSelectionModal from "../../../component/Inventory/Transfer/StockSelectionModal";
import SuccessModal from "../../../component/Commons/SuccessModal";
import ErrorModal from "../../../component/Commons/ErrorModal";
import CustomConfirmDialog from "../../../component/Commons/CustomConfirmDialog";
import ValidationWarningBanner from "../../../component/Commons/ValidationWarningBanner";
import dayjs from "dayjs";
import apiRequest from "../../../helpers/apiHelper";
import { useDropdownOptions } from "../../../component/Inventory/hooks/useDropdownOptions";
import DaybookDrawer from "../../../component/Inventory/Transfer/DaybookDrawer";
import MergeSplitModalDayBook from "../../../component/Inventory/Transfer/MergeSplitModalDayBook";
import ApprovalModal from "../../../component/Commons/ApprovalModal";

const MergeSplitStock = () => {
  const [docDate, setDocDate] = useState(dayjs());
  const [ref1, setRef1] = useState("");
  const [ref2, setRef2] = useState("");
  const [sourceRows, setSourceRows] = useState([]);
  const [targetRows, setTargetRows] = useState([]);
  const [invoiceNo, setInvoiceNo] = useState("");
  const [note, setNote] = useState("");
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [currentMergeSplitId, setCurrentMergeSplitId] = useState(null);
  const [fsmState, setFsmState] = useState("initial");
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalData, setOriginalData] = useState(null);
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

  const normalizeSourceRow = useCallback((s) => ({
    id: s._id || s.id || Date.now(),
    db_id: s._id || s.id || null,
    image: s.image || "",
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
  }), []);

  const normalizeTargetRow = useCallback((item, index) => ({
    id: item._id || item.id || `${Date.now()}-${index}`,
    db_id: item._id || null,
    image: item.image || "",
    stock_id: item.stock_id || "",
    location: item.location || "",
    location_id: item.location || item.location_id || "",
    lot: item.lot_no || item.lot || "",
    stone_code: item.stone_code || "",
    stone: item.stone || "",
    shape: item.shape || "",
    size: item.size || "",
    color: item.color || "",
    cutting: item.cutting || "",
    quality: item.quality || "",
    clarity: item.clarity || "",
    cer_type: item.cer_type || "",
    cer_no: item.cer_no || "",
    pcs: Number(item.pcs) || 0,
    weight: Number(item.weight) || 0,
    price: Number(item.price) || 0,
    unit: item.unit || "pcs",
    amount: Number(item.amount) || 0,
    remark: item.remark || "",
  }), []);

  const genInvoiceNo = useCallback(async () => {
    try {
      const data = await apiRequest("GET", "/mergeandsplit/next-invoice-no");
      setInvoiceNo(data?.invoice_no || data?.next_invoice_no || "");
    } catch (e) {
      setInvoiceNo("");
    }
  }, []);

  useEffect(() => {
    genInvoiceNo();
  }, [genInvoiceNo]);

  const handleAddTargetRow = () => {
    if (isViewMode) return;
    const firstSource = sourceRows[0] || {};
    const newRow = {
      id: Date.now(),
      image: firstSource.image || "",
      stock_id: "",
      location: "",
      lot: "",
      stone_code: firstSource.stone_code || "",
      stone: firstSource.stone || "",
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
      price: 0,
      unit: firstSource.unit || "pcs",
      amount: 0,
      remark: ""
    };
    setTargetRows([...targetRows, newRow]);
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
        if (field === "pcs") {
          const val = Number(value) || 0;
          if (val > row.availablePcs) {
            showWarning(`PCS cannot exceed available stock (Max: ${row.availablePcs})`);
            return row;
          }
        }
        if (["pcs", "weight", "price", "unit"].includes(field)) {
          updatedRow.amount = calculateRowAmount(updatedRow);
        }
        return updatedRow;
      }
      return row;
    }));
  };

  const handleUpdateTargetRow = (id, field, value) => {
    if (isViewMode) return;
    setTargetRows(targetRows.map(row => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };
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
        return updatedRow;
      }
      return row;
    }));
  };

  const handleRemoveTargetRow = (id) => {
    if (isViewMode) return;
    setTargetRows(targetRows.filter(row => row.id !== id));
  };

  const handleRemoveSourceRow = (id) => {
    if (isViewMode) return;
    setSourceRows(sourceRows.filter(row => row.id !== id));
  };

  const handleSelectStocks = (selectedStocks) => {
    if (isViewMode) return;
    if (selectedStocks.length === 0) {
      setSourceRows([]);
      return;
    }

    setIsBodyLoading(true);
    setTimeout(() => {
      setIsBodyLoading(false);
    }, 9000);

    const first = selectedStocks[0];
    const formattedStocks = selectedStocks.map(s => ({
      ...normalizeSourceRow(s),
    }));
    setSourceRows(formattedStocks);

    // Auto-add first row to target if empty
    if (targetRows.length === 0) {
      const initialTargetRow = {
        id: Date.now(),
        image: first.image,
        stock_id: "",
        location: "",
        lot: "",
        stone_code: first.stone_code,
        stone: first.stone,
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
        price: 0,
        unit: first.unit || "pcs",
        amount: 0,
        remark: ""
      };
      setTargetRows([initialTargetRow]);
    }
  };

  const buildPayload = useCallback(() => {
    const stock_items = sourceRows.map((row) => ({
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

    const merge_and_split_items = targetRows.map((row) => ({
      ...(row.db_id ? { _id: row.db_id } : {}),
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

    return {
      doc_date: docDate ? dayjs(docDate).toISOString() : null,
      ref_1: ref1 || "",
      ref_2: ref2 || "",
      note: note || "",
      stock_items,
      merge_and_split_items,
    };
  }, [docDate, note, ref1, ref2, sourceRows, targetRows]);

  const handleSave = useCallback(async () => {
    try {
      const payload = buildPayload();
      const result = currentMergeSplitId
        ? await apiRequest("PUT", `/mergeandsplit/${currentMergeSplitId}`, payload)
        : await apiRequest("POST", "/mergeandsplit", payload);

      const saved = result?.mergeAndSplit || result;
      const savedId = saved?._id || saved?.id || currentMergeSplitId;
      const savedInvoiceNo = saved?.invoice_no || invoiceNo;
      const savedStatus = saved?.status;

      if (savedId) setCurrentMergeSplitId(savedId);
      if (savedInvoiceNo) setInvoiceNo(savedInvoiceNo);
      if (savedStatus) setIsApproved(String(savedStatus).toLowerCase() === "approved");

      if (Array.isArray(saved?.stock_items)) {
        setSourceRows(saved.stock_items.map((row) => normalizeSourceRow(row)));
      }
      if (Array.isArray(saved?.merge_and_split_items)) {
        setTargetRows(saved.merge_and_split_items.map((row, index) => normalizeTargetRow(row, index)));
      }

      const snapshot = {
        docDate,
        ref1,
        ref2,
        note,
        sourceRows: Array.isArray(saved?.stock_items) ? saved.stock_items.map((row) => normalizeSourceRow(row)) : sourceRows,
        targetRows: Array.isArray(saved?.merge_and_split_items) ? saved.merge_and_split_items.map((row, index) => normalizeTargetRow(row, index)) : targetRows,
      };
      setOriginalData(snapshot);
      setFsmState("saved");
      setIsEditMode(false);
      setOpenSuccessModal(true);
    } catch (error) {
      setErrorMessage(error?.response?.data?.error || error?.message || "Unsuccessfully!");
      setOpenErrorModal(true);
    }
  }, [buildPayload, currentMergeSplitId, docDate, invoiceNo, normalizeSourceRow, normalizeTargetRow, note, ref1, ref2, sourceRows, targetRows]);

  const showWarning = useCallback((message) => {
    setWarningMessage(message || "Please complete all required fields.");
    setShowWarningBanner(true);
    setTimeout(() => {
      setShowWarningBanner(false);
    }, 1800);
  }, []);

  const validateBeforeSave = useCallback(() => {
    if (!sourceRows.length) return "Please select stock item(s) first.";
    if (!targetRows.length) return "Please add merge/split row(s) first.";
    const hasInvalidTarget = targetRows.some((row) => !row.location || Number(row.pcs) <= 0 || Number(row.weight) <= 0 || Number(row.price) <= 0 || !row.unit);
    if (hasInvalidTarget) return "Please fill all required fields in Merge/Split rows.";

    const sourceTotalPcs = sourceRows.reduce((sum, row) => sum + (Number(row.pcs) || 0), 0);
    const targetTotalPcs = targetRows.reduce((sum, row) => sum + (Number(row.pcs) || 0), 0);
    if (sourceTotalPcs !== targetTotalPcs) {
      return `Total must be ${sourceTotalPcs} pcs (current: ${targetTotalPcs})`;
    }



    return "";
  }, [sourceRows, targetRows]);

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
    return sourceRows.length > 0 || targetRows.length > 0 || !!ref1 || !!ref2 || !!note;
  }, [note, ref1, ref2, sourceRows.length, targetRows.length]);

  const handleEditToggle = useCallback(() => {
    if (fsmState !== "saved" || isApproved) return;
    setOriginalData({
      docDate,
      ref1,
      ref2,
      note,
      sourceRows: [...sourceRows],
      targetRows: [...targetRows],
    });
    setIsEditMode(true);
    setFsmState("editing");
  }, [docDate, fsmState, isApproved, note, ref1, ref2, sourceRows, targetRows]);

  const handleCancelEdit = useCallback(() => {
    if (fsmState === "editing" && originalData) {
      setDocDate(originalData.docDate || dayjs());
      setRef1(originalData.ref1 || "");
      setRef2(originalData.ref2 || "");
      setNote(originalData.note || "");
      setSourceRows(originalData.sourceRows || []);
      setTargetRows(originalData.targetRows || []);
      setIsEditMode(false);
      setFsmState("saved");
      return;
    }
    if (fsmState === "dirty") {
      if (currentMergeSplitId) {
        setFsmState("saved");
      } else {
        setSourceRows([]);
        setTargetRows([]);
        setRef1("");
        setRef2("");
        setNote("");
        setDocDate(dayjs());
        setFsmState("initial");
      }
    }
  }, [currentMergeSplitId, fsmState, originalData]);

  const handleAddClick = useCallback(() => {
    setCurrentMergeSplitId(null);
    setSourceRows([]);
    setTargetRows([]);
    setRef1("");
    setRef2("");
    setNote("");
    setDocDate(dayjs());
    setShowErrors(false);
    setIsEditMode(false);
    setFsmState("initial");
    setOriginalData(null);
    setIsApproved(false);
    genInvoiceNo();
  }, [genInvoiceNo]);

  useEffect(() => {
    if (fsmState === "saved" && !isEditMode) return;
    if (hasUnsavedData()) setFsmState((prev) => (prev === "initial" || prev === "saved" ? "dirty" : prev));
  }, [docDate, ref1, ref2, note, sourceRows, targetRows, hasUnsavedData, fsmState, isEditMode]);

  const handleApprove = useCallback(() => {
    if (!currentMergeSplitId || isApproved) return;
    setOpenApproveConfirm(true);
  }, [currentMergeSplitId, isApproved]);

  const onConfirmApprove = useCallback(async (confirmed) => {
    setOpenApproveConfirm(false);
    if (!confirmed) return;

    try {
      await apiRequest("PUT", `/mergeandsplit/${currentMergeSplitId}/approve`, {});
      setIsApproved(true);
      setIsEditMode(false);
      setFsmState("saved");
      setOpenSuccessModal(true);
    } catch (error) {
      setErrorMessage(error?.response?.data?.error || error?.message || "Unsuccessfully!");
      setOpenErrorModal(true);
    }
  }, [currentMergeSplitId]);

  const fetchMergeSplitRecord = useCallback(async (id) => {
    try {
      const data = await apiRequest("GET", `/mergeandsplit/${id}`);
      const record = data?.mergeAndSplit || data;
      if (record) {
        setCurrentMergeSplitId(record._id);
        setInvoiceNo(record.invoice_no);
        setDocDate(dayjs(record.doc_date));
        setRef1(record.ref_1 || "");
        setRef2(record.ref_2 || "");
        setNote(record.note || "");
        setIsApproved(record.status?.toLowerCase() === "approved");

        if (Array.isArray(record.stock_items)) {
          setSourceRows(record.stock_items.map(normalizeSourceRow));
        }
        if (Array.isArray(record.merge_and_split_items)) {
          setTargetRows(record.merge_and_split_items.map((it, idx) => normalizeTargetRow(it, idx)));
        }

        setFsmState("saved");
        setIsEditMode(false);
      }
    } catch (error) {
      console.error("Error fetching record:", error);
      setErrorMessage("Failed to load record.");
      setOpenErrorModal(true);
    }
  }, [normalizeSourceRow, normalizeTargetRow]);

  const handleDayBook = () => {
    setIsDaybookModalOpen(true);
  };

  return (
    <Box sx={{ display: "flex", backgroundColor: "#F4F7F7", minHeight: "100vh" }}>
      <NavBar />
      <Box sx={{ marginLeft: "220px", flexGrow: 1, display: "flex", flexDirection: "column", paddingBottom: "60px" }}>
        <Header />
        <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
          <MergeSplitHeader
            invoiceNo={invoiceNo}
            onApprove={handleApprove}
            onDayBook={handleDayBook}
            disableApprove={!currentMergeSplitId || isApproved || fsmState === "editing" || fsmState === "dirty"}
            isApproved={isApproved}
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
          />
        </Box>
      </Box>
      <FooterVendor
        type="load"
        fsmState={fsmState}
        formData={currentMergeSplitId ? { _id: currentMergeSplitId, invoice_no: invoiceNo } : null}
        selectedData={currentMergeSplitId ? { _id: currentMergeSplitId, invoice_no: invoiceNo } : null}
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
      <DaybookDrawer
        open={isDaybookDrawerOpen}
        onClose={() => setIsDaybookDrawerOpen(false)}
        onSelect={(id) => {
          fetchMergeSplitRecord(id);
        }}
      />
      <MergeSplitModalDayBook
        open={isDaybookModalOpen}
        onClose={() => setIsDaybookModalOpen(false)}
        onSelect={(id) => {
          fetchMergeSplitRecord(id);
        }}
      />
    </Box>
  );
};

export default MergeSplitStock;
