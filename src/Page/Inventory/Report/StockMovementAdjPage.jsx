import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Box, Typography, Button, Dialog } from "@mui/material";
import NavBar from "../../../component/NavBar/NavBar.jsx";
import Header from "../../../component/Layout/Header.jsx";
import ConsignmentCheckHeader from "../../../component/Inventory/Report/StockAdj/ConsignmentCheckHeader.jsx";
import ConsignmentCheckBody from "../../../component/Inventory/Report/StockAdj/ConsignmentCheckBody.jsx";
import FooterVendor from "../../../component/Layout/FooterVendor.jsx";
import StockCheckListModal from "../../../component/Inventory/Report/StockAdj/StockCheckListModal.jsx";
import dayjs from "dayjs";
import apiRequest from "helpers/apiHelper.js";
import PopupDialog from "../../../component/Validation/PopupDialog.jsx";
import StockAdjModalDayBook from "../../../component/Inventory/Report/StockAdj/StockAdjModalDayBook.jsx";
import ConfirmCancelDialog from "../../../component/Commons/ConfirmCancelDialog.jsx";

const StockMovementAdjPage = () => {
    const [exportTrigger, setExportTrigger] = React.useState(0);

    // Elevated State
    const [docDate, setDocDate] = useState(dayjs());
    const [ref1, setRef1] = useState("");
    const [ref2, setRef2] = useState("");
    const [note, setNote] = useState("");
    const [items, setItems] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [displayInvoiceNo, setDisplayInvoiceNo] = useState("");
    const [currentId, setCurrentId] = useState(null);
    const [fsmState, setFsmState] = useState("initial"); // initial, dirty, saved, editing
    const [isEditMode, setIsEditMode] = useState(false);
    const [isOpenSuccessModal, setIsOpenSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [isDayBookOpen, setIsDayBookOpen] = useState(false);
    const [isApproved, setIsApproved] = useState(false);
    const [isOpenAdjustModal, setIsOpenAdjustModal] = useState(false);
    const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
    const [originalData, setOriginalData] = useState(null);

    const fetchNextInvoiceNo = useCallback(async () => {
        try {
            const response = await apiRequest("GET", "/stock-adj/next-invoice-no");
            if (response && response.invoice_no) {
                setDisplayInvoiceNo(response.invoice_no);
            }
        } catch (error) {
            console.error("Error fetching next invoice no:", error);
        }
    }, []);

    useEffect(() => {
        if (!currentId) {
            fetchNextInvoiceNo();
        }
    }, [fetchNextInvoiceNo, currentId]);

    useEffect(() => {
        if (items.length > 0 && fsmState === "initial") {
            setFsmState("dirty");
        }
    }, [items, fsmState]);

    useEffect(() => {
        if (isOpenSuccessModal) {
            const timer = setTimeout(() => {
                setIsOpenSuccessModal(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isOpenSuccessModal]);

    const handleExportExcel = () => {
        setExportTrigger(prev => prev + 1);
    };

    const handleSelectItems = (selectedRows) => {
        const newItems = selectedRows.map(row => ({
            _id: row._id,
            stone_code: row.stone_code,
            stock_pcs: row.pcs || 0,
            stock_cts: row.weight || 0,
            physical_pcs: 0,
            physical_cts: 0,
            diff_pcs: -(row.pcs || 0),
            diff_cts: -(row.weight || 0),
            price: row.price || 0,
            unit: "cts",
            remark: ""
        }));
        setItems(prev => [...prev, ...newItems]);
        if (fsmState === "saved") {
            setFsmState("editing");
            setIsEditMode(true);
        } else if (fsmState === "initial") {
            setFsmState("dirty");
        }
    };

    const handleSave = async () => {
        if (!selectedLocation) {
            alert("Please select a location");
            return;
        }
        if (items.length === 0) {
            alert("Please add at least one item");
            return;
        }

        const payload = {
            location: selectedLocation,
            doc_date: docDate.toISOString(),
            ref_1: ref1,
            ref_2: ref2,
            note: note,
            stockadj_items: items.map(item => ({
                _id: item._id,
                stone_code: item.stone_code,
                stock_pcs: item.stock_pcs,
                stock_cts: item.stock_cts,
                physical_pcs: item.physical_pcs,
                physical_cts: item.physical_cts,
                price: item.price,
                unit: item.unit,
                diff_pcs: item.diff_pcs,
                diff_cts: item.diff_cts,
                remark: item.remark
            }))
        };

        try {
            let response;
            if (currentId) {
                response = await apiRequest("PUT", `/stock-adj/${currentId}`, payload);
            } else {
                response = await apiRequest("POST", "/stock-adj", payload);
            }

            if (response) {
                setSuccessMessage("Stock Adjustment saved successfully!");
                setIsOpenSuccessModal(true);
                setFsmState("saved");
                setIsEditMode(false);
                if (response._id) {
                    setCurrentId(response._id);
                }
                if (response.invoice_no) {
                    setDisplayInvoiceNo(response.invoice_no);
                }
                setOriginalData({
                    docDate, selectedLocation, ref1, ref2, note, items: [...items]
                });
            }
        } catch (error) {
            alert(error.message || "Failed to save Stock Adjustment");
        }
    };

    const handleConfirmAdjust = async () => {
        setIsOpenAdjustModal(false);
        const payload = {
            location: selectedLocation,
            doc_date: docDate.toISOString(),
            ref_1: ref1,
            ref_2: ref2,
            note: note,
            stockadj_items: items.map(item => ({
                _id: item._id,
                stone_code: item.stone_code,
                stock_pcs: item.stock_pcs,
                stock_cts: item.stock_cts,
                physical_pcs: item.physical_pcs,
                physical_cts: item.physical_cts,
                price: item.price,
                unit: item.unit,
                diff_pcs: item.diff_pcs,
                diff_cts: item.diff_cts,
                remark: item.remark
            }))
        };

        try {
            const response = await apiRequest("PUT", `/stock-adj/${currentId}/adjust`, payload);
            if (response) {
                setSuccessMessage("Stock Adjustment adjusted successfully!");
                setIsOpenSuccessModal(true);
                setIsApproved(true);
                setFsmState("saved");
                setIsEditMode(false);
                setOriginalData({
                    docDate, selectedLocation, ref1, ref2, note, items: [...items]
                });
            }
        } catch (error) {
            console.error("Error adjusting stock adjustment:", error);
            alert(error.message || "Failed to adjust Stock Adjustment");
        }
    };

    const handleEditToggle = () => {
        if (isApproved) return;
        if (isEditMode) {
            // Cancel edit
            if (originalData) {
                setDocDate(originalData.docDate);
                setSelectedLocation(originalData.selectedLocation);
                setRef1(originalData.ref1);
                setRef2(originalData.ref2);
                setNote(originalData.note);
                setItems(originalData.items);
            }
            setIsEditMode(false);
            setFsmState("saved");
        } else {
            setOriginalData({
                docDate, selectedLocation, ref1, ref2, note, items: [...items]
            });
            setIsEditMode(true);
            setFsmState("editing");
        }
    };

    const handleCancelEdit = () => {
        if (fsmState === "dirty" || fsmState === "editing") {
            setIsCancelDialogOpen(true);
        }
    };

    const handleConfirmCancel = (confirmed) => {
        setIsCancelDialogOpen(false);
        if (confirmed) {
            if (fsmState === "editing" && originalData) {
                setDocDate(originalData.docDate);
                setSelectedLocation(originalData.selectedLocation);
                setRef1(originalData.ref1);
                setRef2(originalData.ref2);
                setNote(originalData.note);
                setItems(originalData.items);
                setIsEditMode(false);
                setFsmState("saved");
            } else {
                window.location.reload();
            }
        }
    };

    const handleDayBookSelect = (selectedLoads) => {
        if (selectedLoads && selectedLoads.length > 0) {
            const data = selectedLoads[0];
            setCurrentId(data._id);
            setDisplayInvoiceNo(data.invoice_no);
            setSelectedLocation(data.location || "");
            setDocDate(dayjs(data.doc_date));
            setRef1(data.ref_1 || "");
            setRef2(data.ref_2 || "");
            setNote(data.note || "");

            const mappedItems = (data.stockadj_items || []).map(item => ({
                _id: item._id,
                stone_code: item.stone_code,
                stock_pcs: item.stock_pcs || 0,
                stock_cts: item.stock_cts || 0,
                physical_pcs: item.physical_pcs || 0,
                physical_cts: item.physical_cts || 0,
                diff_pcs: item.diff_pcs || 0,
                diff_cts: item.diff_cts || 0,
                price: item.price || 0,
                unit: item.unit || "cts",
                remark: item.remark || ""
            }));
            setItems(mappedItems);
            setFsmState("saved");
            setIsEditMode(false);
            setIsApproved(data.status?.toLowerCase() === "adjust");
            setOriginalData({
                docDate: dayjs(data.doc_date),
                selectedLocation: data.location || "",
                ref1: data.ref_1 || "",
                ref2: data.ref_2 || "",
                note: data.note || "",
                items: mappedItems
            });
        }
    };

    const handleAddClick = () => {
        setIsModalOpen(true);
    };

    return (
        <Box sx={{ display: "flex" }}>
            <NavBar />
            <Box sx={{ marginLeft: "222px", minHeight: "100vh", width: "100%" }}>
                <Header />
                <Box sx={{ display: "flex" }}>
                    <Box sx={{ width: "100%" }}>
                        <ConsignmentCheckHeader
                            onExportExcel={handleExportExcel}
                            onAdjust={() => setIsOpenAdjustModal(true)}
                            onSelectStock={handleAddClick}
                            onDayBook={() => setIsDayBookOpen(true)}
                            isEditMode={isEditMode}
                            isApproved={isApproved}
                            fsmState={fsmState}
                            currentId={currentId}
                            displayInvoiceNo={displayInvoiceNo}
                        />
                        <ConsignmentCheckBody
                            items={items}
                            setItems={setItems}
                            selectedLocation={selectedLocation}
                            setSelectedLocation={setSelectedLocation}
                            docDate={docDate}
                            setDocDate={setDocDate}
                            ref1={ref1}
                            setRef1={setRef1}
                            ref2={ref2}
                            setRef2={setRef2}
                            note={note}
                            setNote={setNote}
                            displayInvoiceNo={displayInvoiceNo}
                            exportTrigger={exportTrigger}
                            onSelectStock={handleAddClick}
                            fsmState={fsmState}
                            isEditMode={isEditMode}
                            isApproved={isApproved}
                        />
                    </Box>
                </Box>
                <FooterVendor
                    type="load"
                    fsmState={fsmState}
                    isEditMode={isEditMode}
                    onSaveClick={handleSave}
                    onAddClick={() => window.location.reload()}
                    onEditToggle={handleEditToggle}
                    onCancelEdit={handleCancelEdit}
                    onExportExcel={handleExportExcel}
                    formData={{ _id: currentId }}
                    selectedData={{ _id: currentId }}
                    isApproved={isApproved}
                />
            </Box>
            <StockCheckListModal
                open={isModalOpen}
                handleClose={() => setIsModalOpen(false)}
                onSelect={handleSelectItems}
                locationType={selectedLocation}
            />
            <Dialog
                open={isOpenAdjustModal}
                onClose={() => setIsOpenAdjustModal(false)}
                PaperProps={{
                    sx: {
                        borderRadius: "15px",
                        width: "590px",
                        height: "361px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    },
                }}
            >
                <Box
                    onClick={() => setIsOpenAdjustModal(false)}
                    sx={{
                        position: "absolute",
                        top: "16px",
                        right: "16px",
                        cursor: "pointer"
                    }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="#343434" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </Box>
                <Box sx={{ marginBottom: "24px" }}>
                    <svg width="112" height="112" viewBox="0 0 112 112" fill="none">
                        <circle cx="56" cy="56" r="56" fill="#0072EC" fillOpacity="0.1" />
                        <path d="M56 36V60M56 76H56.01" stroke="#0072EC" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </Box>
                <Typography
                    sx={{
                        marginBottom: "24px",
                        color: "#343434",
                        textAlign: "center",
                        fontFamily: "Calibri",
                        fontSize: "24px",
                        fontWeight: 700,
                    }}
                >
                    Would you like to adjust?
                </Typography>
                <Box sx={{ display: "flex", gap: "14px" }}>
                    <Button
                        onClick={() => setIsOpenAdjustModal(false)}
                        sx={{
                            height: "44px",
                            padding: "12px 40px",
                            borderRadius: "4px",
                            backgroundColor: "#FFF",
                            border: "2px solid #E6E6E6",
                            "&:hover": { backgroundColor: "#F5F5F5" },
                        }}
                    >
                        <Typography sx={{ textTransform: "none", color: "#10002E", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>
                            No
                        </Typography>
                    </Button>
                    <Button
                        onClick={handleConfirmAdjust}
                        sx={{
                            height: "44px",
                            padding: "12px 40px",
                            borderRadius: "4px",
                            backgroundColor: "#05595B",
                            "&:hover": { backgroundColor: "#044849" },
                        }}
                    >
                        <Typography sx={{ textTransform: "none", color: "#FFF", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>
                            Yes
                        </Typography>
                    </Button>
                </Box>
            </Dialog>
            <StockAdjModalDayBook
                open={isDayBookOpen}
                setOpen={setIsDayBookOpen}
                onLoadSelect={handleDayBookSelect}
            />
            <ConfirmCancelDialog
                open={isCancelDialogOpen}
                onClose={handleConfirmCancel}
                message="You have unsaved changes. Do you want to discard them?"
            />
            <PopupDialog
                open={isOpenSuccessModal}
                onClose={() => setIsOpenSuccessModal(false)}
                type="success"
                title="Success"
                message={successMessage}
            />
        </Box>
    );
};

export default StockMovementAdjPage;
