import React, { useRef, useState, useEffect } from "react";
import dayjs from "dayjs";
import {
    Box,
    Typography,
    CircularProgress,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { getConsignmentMovementByInvoiceNo } from "../../../../services/consignmentMovementService.js";
import { exportConsignmentToExcel } from "../../../../helpers/consignmentExcelHelper.js";
import FooterReport from "../../../Layout/FooterReport.jsx";

const ConsignmentMovementReportInSide = ({ selectedItem, onBack, exportTrigger }) => {
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
            return acc;
        }, { in_pcs: 0, in_weight: 0, in_amount: 0, out_pcs: 0, out_weight: 0, out_amount: 0 });

        const lastMovement = movementDetails.movements[movementDetails.movements.length - 1];
        if (lastMovement) {
            res.balance_pcs = lastMovement.balance_pcs;
            res.balance_weight = lastMovement.balance_weight;
            res.stock_cost_amount = lastMovement.stock_cost_amount;
        }
        return res;
    }, [movementDetails]);

    const handleExportExcel = () => {
        try {
            if (!movementDetails || !movementDetails.movements || movementDetails.movements.length === 0) {
                alert("No data to export");
                return;
            }

            const itemHeaders = [
                ["#", "Doc Date", "VC. Type", "Ref", "In", "In", "In", "In", "Out", "Out", "Out", "Out", "Balance", "Balance", "Balance", "Balance"],
                ["", "", "", "", "Pcs", "Weight", "Price / Unit", "Amount", "Pcs", "Weight", "Price / Unit", "Amount", "Pcs", "Weight", "Cost Price", "Cost Amount"]
            ];

            const itemRows = movementDetails.movements.map((item, index) => [
                index + 1,
                item.doc_date ? new Date(item.doc_date).toLocaleDateString('en-GB') : "",
                item.v_type || item.type || "",
                item.ref || "",
                Number(item.in_pcs || 0),
                Number(item.in_weight || 0),
                Number(item.in_price || 0),
                Number(item.in_amount || 0),
                Number(item.out_pcs || 0),
                Number(item.out_weight || 0),
                Number(item.out_price || 0),
                Number(item.out_amount || 0),
                Number(item.balance_pcs || 0),
                Number(item.balance_weight || 0),
                Number(item.stock_cost_price || 0),
                Number(item.stock_cost_amount || 0)
            ]);

            exportConsignmentToExcel({
                filename: `Consignment Movement Report - ${selectedItem.stone_code}`,
                sheetName: "Movement Report Details",
                summaryHeaders: [],
                summaryValues: [],
                itemHeaders,
                itemRows,
                merges: [
                    { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }, // #
                    { s: { r: 0, c: 1 }, e: { r: 1, c: 1 } }, // Doc Date
                    { s: { r: 0, c: 2 }, e: { r: 1, c: 2 } }, // VC. Type
                    { s: { r: 0, c: 3 }, e: { r: 1, c: 3 } }, // Ref
                    { s: { r: 0, c: 4 }, e: { r: 0, c: 7 } }, // In
                    { s: { r: 0, c: 8 }, e: { r: 0, c: 11 } }, // Out
                    { s: { r: 0, c: 12 }, e: { r: 0, c: 15 } }, // Balance
                ]
            });

        } catch (err) {
            console.error(err);
            alert("Failed to export Excel");
        }
    };

    const lastExportTrigger = useRef(exportTrigger);

    useEffect(() => {
        if (exportTrigger > lastExportTrigger.current) {
            handleExportExcel();
        }
        lastExportTrigger.current = exportTrigger;
    }, [exportTrigger]);


    useEffect(() => {
        const fetchMovementDetails = async () => {
            const identifier = selectedItem?.invoice_no || selectedItem?.stone_code;
            if (!identifier) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const data = await getConsignmentMovementByInvoiceNo(identifier);
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

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Typography color="error">Error: {error}</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Box
                sx={{
                    padding: "2px 32px 0px 32px",
                    bgcolor: "#F8F8F8",
                    minHeight: "687px",
                }}
            >
                <Box>
                    {/* Header Section */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "24px 32px",

                            borderRadius: "5px 5px 0px 0px",
                        }}
                    >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Box
                                onClick={onBack}
                                sx={{ cursor: "pointer", marginRight: "16px" }}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="31"
                                    height="30"
                                    viewBox="0 0 31 30"
                                    fill="none"
                                >
                                    <path
                                        d="M19.7188 6.5625L11.2812 15L19.7188 23.4375"
                                        stroke="#343434"
                                        strokeWidth="1.875"
                                        strokeMiterlimit="10"
                                        strokeLinecap="square"
                                    />
                                </svg>
                            </Box>
                            <Typography
                                sx={{
                                    color: "#343434",
                                    fontFamily: "Calibri",
                                    fontSize: "20px",
                                    fontWeight: 700,
                                    marginRight: "24px",
                                }}
                            >
                                {selectedItem ? `${selectedItem.stone} - ${selectedItem.lot_no} Report` : 'Movement Report Details'}
                            </Typography>
                            {selectedItem && (
                                <Typography
                                    sx={{
                                        color: "#343434",
                                        fontFamily: "Calibri",
                                        fontSize: "16px",
                                        fontWeight: 400,
                                        opacity: 0.8
                                    }}
                                >
                                    {selectedItem.stone} | {selectedItem.shape} | {selectedItem.size} | {selectedItem.color} | {selectedItem.cutting} | {selectedItem.clarity}
                                </Typography>
                            )}
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Typography
                                sx={{
                                    color: "#343434",
                                    fontFamily: "Calibri",
                                    fontSize: "16px",
                                    fontWeight: 400,
                                }}
                            >
                                Date :
                            </Typography>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    defaultValue={dayjs()}
                                    format="DD/MM/YYYY"
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "8px",
                                            backgroundColor: "#FFF",
                                            width: "150px",
                                            height: "34px",
                                            "& .MuiInputBase-input": { fontSize: "16px", fontFamily: "Calibri" },
                                        },
                                        marginRight: "8px",
                                        marginLeft: "8px",
                                    }}
                                />
                            </LocalizationProvider>
                            <Typography
                                sx={{
                                    color: "#343434",
                                    fontFamily: "Calibri",
                                    fontSize: "16px",
                                    fontWeight: 400,
                                }}
                            >
                                To
                            </Typography>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    defaultValue={dayjs()}
                                    format="DD/MM/YYYY"
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "8px",
                                            backgroundColor: "#FFF",
                                            width: "150px",
                                            height: "34px",
                                            "& .MuiInputBase-input": { fontSize: "16px", fontFamily: "Calibri" },
                                        },
                                        marginLeft: "8px",
                                    }}
                                />
                            </LocalizationProvider>
                        </Box>
                    </Box>

                    {/* Main Table Section */}
                    {movementDetails && movementDetails.movements ? (
                        <Box
                            sx={{
                                maxWidth: "1597px",
                                borderRadius: "5px",
                                border: "1px solid #C6C6C8",


                            }}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    height: "582px",
                                    overflow: "auto",

                                    "&::-webkit-scrollbar": { height: "0px", width: "5px" },
                                    "&::-webkit-scrollbar-track": { background: "#FFF" },
                                    "&::-webkit-scrollbar-thumb": { background: "#919191", borderRadius: "5px" },
                                    bgcolor: "#FFF",
                                }}
                            >
                                <Box sx={{
                                    maxWidth: "1595px", overflow: "auto"
                                }}>
                                    {/* Table Header styled like Stock ADJ */}
                                    <Box
                                        sx={{
                                            height: "64px",
                                            bgcolor: "#F2F2F2",
                                            borderBottom: "1px solid #EDEDED",
                                            display: "flex",
                                            alignItems: "center",
                                            textAlign: "center",
                                            width: "1824px",
                                        }}
                                    >
                                        <Box sx={{ minWidth: "50px ", maxWidth: "50px ", borderRight: "1px solid #EDEDED", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", boxSizing: "border-box" }}><Typography sx={{ color: "#343434", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>#</Typography></Box>
                                        <Box sx={{ minWidth: "115px", maxWidth: "115px", borderRight: "1px solid #EDEDED", height: "100%", display: "flex", justifyContent: "left", alignItems: "center", boxSizing: "border-box", padding: "0 8px" }}>
                                            <Typography sx={{ color: "#343434", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>Doc Date</Typography>
                                        </Box>

                                        <Box sx={{ minWidth: "119px", maxWidth: "119px", borderRight: "1px solid #EDEDED", height: "100%", display: "flex", justifyContent: "left", alignItems: "center", boxSizing: "border-box", padding: "0 8px" }}>
                                            <Typography sx={{ color: "#343434", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>VC. Type</Typography>
                                        </Box>
                                        <Box sx={{ minWidth: "111px", maxWidth: "111px", borderRight: "1px solid #EDEDED", height: "100%", display: "flex", justifyContent: "left", alignItems: "center", boxSizing: "border-box", padding: "0 8px" }}>
                                            <Typography sx={{ color: "#343434", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>Ref</Typography>
                                        </Box>

                                        {/* In Section */}
                                        <Box sx={{ height: "100%", minWidth: "476", boxSizing: "border-box" }}>
                                            <Box sx={{ height: "50%", bgcolor: "rgba(5, 89, 91, 0.40)", borderRight: "1px solid #EDEDED", display: "flex", justifyContent: "center", alignItems: "center", width: "476px", boxSizing: "border-box" }}>
                                                <Typography sx={{ color: "#343434", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>In</Typography>
                                            </Box>
                                            <Box sx={{ height: "50%", display: "flex", width: "400px", boxSizing: "border-box" }}>
                                                <Box sx={{ minWidth: "108px ", maxWidth: "108px ", display: "flex", justifyContent: "right", alignItems: "center", borderRight: "1px solid #EDEDED", bgcolor: "rgba(5, 89, 91, 0.20)", boxSizing: "border-box", padding: "0 8px" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "14px", fontWeight: 700 }}>Pcs</Typography></Box>
                                                <Box sx={{ minWidth: "108px ", maxWidth: "108px ", display: "flex", justifyContent: "right", alignItems: "center", borderRight: "1px solid #EDEDED", bgcolor: "rgba(5, 89, 91, 0.20)", boxSizing: "border-box", padding: "0 8px" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "14px", fontWeight: 700 }}>Weight</Typography></Box>
                                                <Box sx={{ minWidth: "140px ", maxWidth: "140px ", display: "flex", justifyContent: "right", alignItems: "center", borderRight: "1px solid #EDEDED", bgcolor: "rgba(5, 89, 91, 0.20)", boxSizing: "border-box", padding: "0 8px" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "14px", fontWeight: 700 }}>Price</Typography></Box>
                                                <Box sx={{ minWidth: "120px ", maxWidth: "120px ", display: "flex", justifyContent: "right", alignItems: "center", borderRight: "1px solid #EDEDED", bgcolor: "rgba(5, 89, 91, 0.20)", boxSizing: "border-box", padding: "0 8px" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "14px", fontWeight: 700 }}>Amount</Typography></Box>
                                            </Box>
                                        </Box>

                                        {/* Out Section */}
                                        <Box sx={{ height: "100%", minWidth: "476px", boxSizing: "border-box" }}>
                                            <Box sx={{ height: "50%", bgcolor: "rgba(224, 4, 16, 0.40)", borderRight: "1px solid #EDEDED", display: "flex", justifyContent: "center", alignItems: "center", width: "476px", boxSizing: "border-box" }}>
                                                <Typography sx={{ color: "#343434", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>Out</Typography>
                                            </Box>
                                            <Box sx={{ height: "50%", display: "flex", width: "400px", boxSizing: "border-box" }}>
                                                <Box sx={{ minWidth: "108px ", maxWidth: "108px ", display: "flex", justifyContent: "right", alignItems: "center", borderRight: "1px solid #EDEDED", bgcolor: "rgba(224, 4, 16, 0.20)", boxSizing: "border-box", padding: "0 8px" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "14px", fontWeight: 700 }}>Pcs</Typography></Box>
                                                <Box sx={{ minWidth: "108px ", maxWidth: "108px ", display: "flex", justifyContent: "right", alignItems: "center", borderRight: "1px solid #EDEDED", bgcolor: "rgba(224, 4, 16, 0.20)", boxSizing: "border-box", padding: "0 8px" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "14px", fontWeight: 700 }}>Weight</Typography></Box>
                                                <Box sx={{ minWidth: "140px ", maxWidth: "140px ", display: "flex", justifyContent: "right", alignItems: "center", borderRight: "1px solid #EDEDED", bgcolor: "rgba(224, 4, 16, 0.20)", boxSizing: "border-box", padding: "0 8px" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "14px", fontWeight: 700 }}>Price</Typography></Box>
                                                <Box sx={{ minWidth: "120px ", maxWidth: "120px ", display: "flex", justifyContent: "right", alignItems: "center", borderRight: "1px solid #EDEDED", bgcolor: "rgba(224, 4, 16, 0.20)", boxSizing: "border-box", padding: "0 8px" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "14px", fontWeight: 700 }}>Amount</Typography></Box>
                                            </Box>
                                        </Box>

                                        {/* Balance Section */}
                                        <Box sx={{ height: "100%", minWidth: "478px", boxSizing: "border-box" }}>
                                            <Box sx={{ height: "50%", bgcolor: "rgba(139, 180, 255, 0.40)", borderBottom: "1px solid #EDEDED", display: "flex", justifyContent: "center", alignItems: "center", width: "477px", boxSizing: "border-box" }}>
                                                <Typography sx={{ color: "#343434", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>Balance</Typography>
                                            </Box>
                                            <Box sx={{ height: "50%", display: "flex", width: "400px", boxSizing: "border-box" }}>
                                                <Box sx={{ minWidth: "108px ", maxWidth: "108px ", display: "flex", justifyContent: "right", alignItems: "center", borderRight: "1px solid #EDEDED", bgcolor: "rgba(139, 180, 255, 0.20)", boxSizing: "border-box", padding: "0 8px" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "14px", fontWeight: 700 }}>Pcs</Typography></Box>
                                                <Box sx={{ minWidth: "108px ", maxWidth: "108px ", display: "flex", justifyContent: "right", alignItems: "center", borderRight: "1px solid #EDEDED", bgcolor: "rgba(139, 180, 255, 0.20)", boxSizing: "border-box", padding: "0 8px" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "14px", fontWeight: 700 }}>Weight</Typography></Box>
                                                <Box sx={{ minWidth: "140px ", maxWidth: "140px ", display: "flex", justifyContent: "right", alignItems: "center", borderRight: "1px solid #EDEDED", bgcolor: "rgba(139, 180, 255, 0.20)", boxSizing: "border-box", padding: "0 8px" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "14px", fontWeight: 700 }}>Cost Price</Typography></Box>
                                                <Box sx={{ minWidth: "120px ", maxWidth: "120px ", display: "flex", justifyContent: "right", alignItems: "center", bgcolor: "rgba(139, 180, 255, 0.20)", boxSizing: "border-box", padding: "0 8px" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "14px", fontWeight: 700 }}>Cost Amount</Typography></Box>
                                            </Box>
                                        </Box>
                                    </Box>

                                    {/* Table Content */}
                                    <Box sx={{ width: "1824px" }}>
                                        {movementDetails.movements.map((row, idx) => (
                                            <Box key={idx} sx={{ display: "flex", height: "42px", borderBottom: "1px solid #EDEDED", alignItems: "center", width: "1824px" }}>
                                                <Box sx={{ minWidth: "50px", maxWidth: "50px", textAlign: "center", borderRight: "1px solid #EDEDED", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "16px", fontWeight: 400, color: "#343434" }}>{idx + 1}</Typography></Box>
                                                <Box sx={{ minWidth: "115px", maxWidth: "115px", padding: "0 8px", borderRight: "1px solid #EDEDED", height: "100%", display: "flex", alignItems: "center", justifyContent: "left", boxSizing: "border-box" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "16px", fontWeight: 400, color: "#343434" }}>{row.doc_date ? dayjs(row.doc_date).format('DD/MM/YYYY') : ""}</Typography></Box>

                                                <Box sx={{ minWidth: "119px", maxWidth: "119px", padding: "0 8px", borderRight: "1px solid #EDEDED", height: "100%", display: "flex", alignItems: "center", justifyContent: "left", boxSizing: "border-box" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "16px", fontWeight: 400, color: "#343434" }}>{row.VCtype}</Typography></Box>
                                                <Box sx={{ minWidth: "111px", maxWidth: "111px", padding: "0 8px", borderRight: "1px solid #EDEDED", height: "100%", display: "flex", alignItems: "center", justifyContent: "left", boxSizing: "border-box" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "16px", fontWeight: 400, color: "#343434" }}>{row.ref}</Typography></Box>

                                                {/* In Data */}
                                                <Box sx={{ minWidth: "108px ", maxWidth: "108px ", textAlign: "right", padding: "0 8px", borderRight: "1px solid #EDEDED", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "16px", fontWeight: 400, color: "#343434" }}>{row.in_pcs || 0}</Typography></Box>
                                                <Box sx={{ minWidth: "108px ", maxWidth: "108px ", textAlign: "right", padding: "0 8px", borderRight: "1px solid #EDEDED", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "16px", fontWeight: 400, color: "#343434" }}>{Number(row.in_weight || 0).toFixed(3)}</Typography></Box>
                                                <Box sx={{ minWidth: "140px ", maxWidth: "140px ", textAlign: "right", padding: "0 8px", borderRight: "1px solid #EDEDED", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "16px", fontWeight: 400, color: "#343434" }}>{Number(row.in_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / {row.unit}</Typography></Box>
                                                <Box sx={{ minWidth: "120px ", maxWidth: "120px ", textAlign: "right", padding: "0 8px", borderRight: "1px solid #EDEDED", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "16px", fontWeight: 400, color: "#343434" }}>{Number(row.in_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography></Box>

                                                {/* Out Data */}
                                                <Box sx={{ minWidth: "108px ", maxWidth: "108px ", textAlign: "right", padding: "0 8px", borderRight: "1px solid #EDEDED", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "16px", fontWeight: 400, color: "#343434" }}>{row.out_pcs || 0}</Typography></Box>
                                                <Box sx={{ minWidth: "108px ", maxWidth: "108px ", textAlign: "right", padding: "0 8px", borderRight: "1px solid #EDEDED", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "16px", fontWeight: 400, color: "#343434" }}>{Number(row.out_weight || 0).toFixed(3)}</Typography></Box>
                                                <Box sx={{ minWidth: "140px ", maxWidth: "140px ", textAlign: "right", padding: "0 8px", borderRight: "1px solid #EDEDED", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "16px", fontWeight: 400, color: "#343434" }}>{Number(row.out_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / {row.unit}</Typography></Box>
                                                <Box sx={{ minWidth: "120px ", maxWidth: "120px ", textAlign: "right", padding: "0 8px", borderRight: "1px solid #EDEDED", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "16px", fontWeight: 400, color: "#343434" }}>{Number(row.out_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography></Box>

                                                {/* Balance Data */}
                                                <Box sx={{ minWidth: "108px ", maxWidth: "108px ", textAlign: "right", padding: "0 8px", borderRight: "1px solid #EDEDED", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "16px", fontWeight: 400, color: "#343434" }}>{row.balance_pcs || 0}</Typography></Box>
                                                <Box sx={{ minWidth: "108px ", maxWidth: "108px ", textAlign: "right", padding: "0 8px", borderRight: "1px solid #EDEDED", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "16px", fontWeight: 400, color: "#343434" }}>{Number(row.balance_weight || 0).toFixed(3)}</Typography></Box>
                                                <Box sx={{ minWidth: "140px ", maxWidth: "140px ", textAlign: "right", padding: "0 8px", borderRight: "1px solid #EDEDED", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "16px", fontWeight: 400, color: "#343434" }}>{Number(row.stock_cost_price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / {row.unit}</Typography></Box>
                                                <Box sx={{ minWidth: "120px ", maxWidth: "120px ", textAlign: "right", padding: "0 8px", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "16px", fontWeight: 400, color: "#343434" }}>{Number(row.stock_cost_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography></Box>
                                            </Box>
                                        ))}
                                    </Box>

                                    {/* Totals Footer Row */}
                                    {totals && movementDetails.movements.length > 0 && (
                                        <Box sx={{ height: "42px", display: "flex", alignItems: "center", borderBottom: "1px solid #EDEDED", borderTop: "1px solid #EDEDED", position: "sticky", bottom: 0, width: "1824px", zIndex: 1, bgcolor: "#FFF" }}>
                                            <Box sx={{ minWidth: "396px", maxWidth: "396px", display: "flex", alignItems: "center", boxSizing: "border-box", height: "100%", padding: "0 8px" }}>

                                                <Typography sx={{ fontFamily: "Calibri", fontSize: "16px", fontWeight: 700, color: "#343434" }}></Typography>
                                            </Box>

                                            {/* In Totals */}
                                            <Box sx={{ minWidth: "108px ", maxWidth: "108px ", padding: "0 8px", textAlign: "right", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}>
                                                <Typography sx={{ color: "#666666", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>{totals.in_pcs}</Typography>
                                            </Box>
                                            <Box sx={{ minWidth: "108px ", maxWidth: "108px ", padding: "0 8px", textAlign: "right", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}>
                                                <Typography sx={{ color: "#666666", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>{totals.in_weight.toFixed(3)}</Typography>
                                            </Box>
                                            <Box sx={{ minWidth: "140px ", maxWidth: "140px ", padding: "0 8px", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}></Box>
                                            <Box sx={{ minWidth: "120px ", maxWidth: "120px ", padding: "0 8px", textAlign: "right", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}>
                                                <Typography sx={{ color: "#666666", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>{Number(totals.in_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                                            </Box>

                                            {/* Out Totals */}
                                            <Box sx={{ minWidth: "108px ", maxWidth: "108px ", padding: "0 8px", textAlign: "right", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}>
                                                <Typography sx={{ color: "#666666", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>{totals.out_pcs}</Typography>
                                            </Box>
                                            <Box sx={{ minWidth: "108px ", maxWidth: "108px ", padding: "0 8px", textAlign: "right", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}>
                                                <Typography sx={{ color: "#666666", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>{totals.out_weight.toFixed(3)}</Typography>
                                            </Box>
                                            <Box sx={{ minWidth: "140px ", maxWidth: "140px ", padding: "0 8px", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}></Box>
                                            <Box sx={{ minWidth: "120px ", maxWidth: "120px ", padding: "0 8px", textAlign: "right", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}>
                                                <Typography sx={{ color: "#666666", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>{Number(totals.out_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                                            </Box>

                                            {/* Balance */}
                                            <Box sx={{ minWidth: "108px ", maxWidth: "108px ", padding: "0 8px", textAlign: "right", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}>
                                                <Typography sx={{ color: "#666666", fontFamily: "Calibri", fontSize: "14px", fontWeight: 700 }}>{totals.balance_pcs || 0}</Typography>
                                            </Box>
                                            <Box sx={{ minWidth: "108px ", maxWidth: "108px ", padding: "0 8px", textAlign: "right", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}>
                                                <Typography sx={{ color: "#666666", fontFamily: "Calibri", fontSize: "14px", fontWeight: 700 }}>{Number(totals.balance_weight || 0).toFixed(3)}</Typography>
                                            </Box>
                                            <Box sx={{ minWidth: "140px ", maxWidth: "140px ", padding: "0 8px", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}></Box>
                                            <Box sx={{ minWidth: "120px ", maxWidth: "120px ", padding: "0 8px", textAlign: "right", height: "100%", display: "flex", alignItems: "center", justifyContent: "flex-end", boxSizing: "border-box" }}>
                                                <Typography sx={{ color: "#666666", fontFamily: "Calibri", fontSize: "14px", fontWeight: 700 }}>{Number(totals.stock_cost_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                                            </Box>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    ) : (
                        <Box sx={{ padding: "40px", textAlign: "center" }}>
                            <Typography>No movement details found for this item.</Typography>
                        </Box>
                    )}
                </Box>
            </Box>
            <FooterReport onExcel={handleExportExcel} onPrint={() => window.print()} />
        </Box>
    );
};

export default ConsignmentMovementReportInSide;
