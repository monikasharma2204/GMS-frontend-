import React, { useState, useMemo, useEffect } from "react";
import {
    Box,
    Typography,
    TextField,
    MenuItem,
    Select,
    Button,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Ref1 from "../../Ref1";
import Ref2 from "../../Ref2";
import apiRequest from "helpers/apiHelper.js";
import { formatNumberWithCommas } from "helpers/numberHelper";

const ConsignmentCheckBody = ({
    items,
    setItems,
    selectedLocation,
    setSelectedLocation,
    docDate,
    setDocDate,
    ref1,
    setRef1,
    ref2,
    setRef2,
    note,
    setNote,
    displayInvoiceNo,
    onSelectStock,
    fsmState,
    isEditMode,
    isApproved
}) => {
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await apiRequest("GET", "/locations/active");
                const locData = Array.isArray(response) ? response : (response?.data || []);
                setLocations(locData);
            } catch (error) {
                console.error("Error fetching locations:", error);
                setLocations([]);
            }
        };
        fetchLocations();
    }, []);

    const handleCellChange = (index, field, value) => {
        setItems(prev => {
            const updated = [...prev];
            const item = { ...updated[index] };

            if (field === "physical_pcs" || field === "price") {
                item[field] = value === "" ? "" : parseInt(value);
            } else if (field === "physical_cts") {
                item[field] = value === "" ? "" : parseFloat(value);
            } else {
                item[field] = value;
            }

            // Only recalculate differences if Physical Pcs or Cts are being changed
            if (field === "physical_pcs" || field === "physical_cts") {
                const physPcs = item.physical_pcs === "" ? 0 : item.physical_pcs;
                const physCts = item.physical_cts === "" ? 0 : item.physical_cts;
                const stockPcs = item.stock_pcs || 0;
                const stockCts = item.stock_cts || 0;

                item.diff_pcs = physPcs - stockPcs;
                item.diff_cts = parseFloat((physCts - stockCts).toFixed(3));
            }

            updated[index] = item;
            return updated;
        });
    };

    const handleRemoveItem = (index) => {
        setItems(prev => prev.filter((_, i) => i !== index));
    };

    const totals = useMemo(() => {
        return items.reduce((acc, item) => {
            acc.stock_cts += parseFloat(item.stock_cts || 0);
            acc.stock_pcs += parseInt(item.stock_pcs || 0);
            acc.physical_cts += parseFloat(item.physical_cts || 0);
            acc.physical_pcs += parseInt(item.physical_pcs || 0);
            acc.diff_cts += parseFloat(item.diff_cts || 0);
            acc.diff_pcs += parseInt(item.diff_pcs || 0);
            return acc;
        }, { stock_cts: 0, stock_pcs: 0, physical_cts: 0, physical_pcs: 0, diff_cts: 0, diff_pcs: 0 });
    }, [items]);

    return (
        <Box
            sx={{
                width: "1600px",
                padding: "9px 24px 32px 24px",
            }}
        >
            <Box sx={{ width: "1600px" }}>
                {/* Meta Info */}
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Typography
                        sx={{
                            fontFamily: "Calibri",
                            fontSize: "12px",
                            fontWeight: 400,
                            color: "#838383",
                            marginRight: "16px",
                        }}
                    >
                        Transaction Date : {dayjs().format("DD/MM/YYYY")} By : Super Admin
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: "Calibri",
                            fontSize: "12px",
                            fontWeight: 400,
                            color: "#838383",
                        }}
                    >
                        Last Update : {dayjs().format("DD/MM/YYYY")} By : Super Admin
                    </Typography>
                </Box>

                {/* Header Inputs */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: "16px",
                        padding: "24px 32px",
                        bgcolor: "#FFF",
                        borderRadius: "5px 5px 0px 0px",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", width: "100%", height: "49px" }}>
                        <Box
                            sx={{
                                width: "175px",
                                height: "49px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                marginRight: "24px",
                            }}
                        >
                            <Typography
                                sx={{
                                    color: "#666",
                                    fontFamily: "Calibri",
                                    fontSize: "16px",
                                    fontWeight: 400,
                                    lineHeight: "1",
                                    marginBottom: "2px",
                                }}
                            >
                                Stock ADJ :
                            </Typography>
                            <Typography
                                sx={{
                                    color: "#05595B",
                                    fontFamily: "Calibri",
                                    fontSize: "28px",
                                    fontWeight: 400,
                                    lineHeight: "1",
                                    width: "170px",
                                }}
                            >
                                {displayInvoiceNo}
                            </Typography>
                        </Box>



                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Doc Date :"
                                value={docDate}
                                onChange={(newValue) => setDocDate(newValue)}
                                disabled={fsmState === "saved" && !isEditMode}
                                slotProps={{
                                    textField: {
                                        required: true,
                                    },
                                }}
                                sx={{
                                    "& .MuiInputLabel-asterisk": {
                                        color: "red",
                                    },
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "8px",
                                        backgroundColor: "#FFF",
                                        width: "220px",
                                        height: "42px",
                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#8BB4FF",
                                        },
                                        "&:hover": {
                                            backgroundColor: "#F5F8FF",
                                        },
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                            borderColor: "#8BB4FF",
                                        },
                                    },
                                    marginRight: "24px",
                                    marginLeft: "24px",
                                }}
                            />
                        </LocalizationProvider>

                        <TextField
                            label="Main Location"
                            select
                            required
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            disabled={fsmState === "saved" && !isEditMode}
                            InputLabelProps={{ shrink: true }}
                            sx={{
                                "& .MuiInputLabel-asterisk": {
                                    color: "red",
                                },

                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px",
                                    backgroundColor: (fsmState === "saved" && !isEditMode) ? "#F5F5F5" : "#FFF",
                                    width: "400px",
                                    height: "42px",
                                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#8BB4FF" },
                                    "&:hover": { backgroundColor: (fsmState === "saved" && !isEditMode) ? "#F5F5F5" : "#F5F8FF" },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#8BB4FF" },
                                },
                                marginRight: "24px",
                            }}
                        >
                            {locations.map((loc) => (
                                <MenuItem key={loc._id} value={loc.location_name}>
                                    {loc.location_name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <Ref1 width="320px" ref1={ref1} onRef1Change={setRef1} disabled={fsmState === "saved" && !isEditMode} />
                        <Ref2 width="320px" ref2={ref2} onRef2Change={setRef2} disabled={fsmState === "saved" && !isEditMode} />
                    </Box>
                </Box>

                {/* Main Content Area */}
                <Box
                    sx={{
                        width: "1584px",
                        padding: "0px 32px 32px 32px",
                        borderTop: "1px solid #C6C6C8",
                        borderLeft: "1px solid #C6C6C8",
                        borderRight: "1px solid #C6C6C8",
                        bgcolor: "#F8F8F8",
                        marginTop: "24px"
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", marginTop: "24px" }}>
                        <Box sx={{ display: "flex", gap: "12px", alignItems: "center" }}>
                            <Typography sx={{ color: "#05595B", fontFamily: "Calibri", fontSize: "20px", fontWeight: 700 }}>Item</Typography>
                            <Button
                                variant="contained"
                                disabled={!selectedLocation || isApproved || (fsmState === "saved" && !isEditMode)}
                                onClick={() => onSelectStock && onSelectStock()}
                                sx={{
                                    textTransform: "none",
                                    height: "25px",
                                    width: "80px",

                                    padding: "6px 12px",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderRadius: "4px",
                                    bgcolor: !selectedLocation ? "#E6E6E6" : "#000000",
                                    color: !selectedLocation ? "#57646E" : "#FFFFFF",
                                    "&:hover": {
                                        bgcolor: !selectedLocation ? "#E6E6E6" : "#333333",
                                    },
                                    "&:disabled": {
                                        bgcolor: "#E6E6E6",
                                        color: "#57646E",
                                    }
                                }}
                            >
                                <Typography
                                    sx={{
                                        color: !selectedLocation ? "#57646E" : "#FFFFFF",
                                        fontSize: "14px",
                                        fontFamily: "Calibri",
                                        fontStyle: "normal",
                                        fontWeight: 500,
                                    }}
                                >
                                    Stock
                                </Typography>
                            </Button>
                        </Box>
                    </Box>



                    {/* Table Area */}
                    <Box>

                        <Box sx={{ maxHeight: "400px", overflowY: "auto", minHeight: "400px" }}>
                            <Box
                                sx={{
                                    maxWidth: "1584px",
                                    borderRadius: "5px",
                                    border: "1px solid #C6C6C8",
                                    marginTop: "24px",
                                    overflow: "hidden",
                                    bgcolor: "#FFF",
                                    position: "relative"
                                }}
                            >
                                <Box sx={{ overflowX: "auto" }}>
                                    {/* Header Labels */}
                                    <Box sx={{ textAlign: "center", display: "flex", height: "64px", alignItems: "center", bgcolor: "#F2F2F2", borderBottom: "1px solid #EDEDED", minWidth: "max-content" }}>
                                        <Box sx={{ width: "36px", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", borderRight: "1px solid #EDEDED" }} />
                                        <Box sx={{ borderRight: "1px solid #EDEDED", width: "50px", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center" }}><Typography sx={{ color: "#343434", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>#</Typography></Box>


                                        <Box sx={{ borderRight: "1px solid #EDEDED", width: "212px", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center" }}><Typography sx={{ color: "#343434", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>Stone Code</Typography></Box>
                                        <Box sx={{ height: "100%" }}>

                                            <Box sx={{
                                                height: " 50%",
                                                borderRight: "1px solid #C6C6C8",
                                                borderBottom: "1px solid #C6C6C8", width: "231px", display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "rgba(5, 89, 91, 0.40)"
                                            }}><Typography sx={{ color: "#343434", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>Stock</Typography></Box>

                                            <Box sx={{ display: "flex", height: " 50%" }}>

                                                <Box sx={{ justifyContent: "center", width: "112px", height: "100%", display: "flex", alignItems: "center", bgcolor: "rgba(5, 89, 91, 0.20)", borderRight: "1px solid #EDEDED" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "14px", fontWeight: 700 }}>Pcs</Typography></Box>
                                                <Box sx={{ justifyContent: "center", width: "118px", height: "100%", display: "flex", alignItems: "center", bgcolor: "rgba(5, 89, 91, 0.20)", borderRight: "1px solid #EDEDED" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "14px", fontWeight: 700 }}>Cts</Typography></Box>
                                            </Box>

                                        </Box>
                                        <Box sx={{ height: "100%" }}>
                                            <Box sx={{
                                                height: " 50%",
                                                borderRight: "1px solid #C6C6C8",
                                                borderBottom: "1px solid #C6C6C8", width: "496px", display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "rgba(224, 4, 16, 0.40)"
                                            }}><Typography sx={{ color: "#343434", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>Physical</Typography></Box>
                                            <Box sx={{ display: "flex", height: " 50%", }}>
                                                <Box sx={{ borderRight: "1px solid #EDEDED", justifyContent: "center", width: "121px", height: "100%", display: "flex", alignItems: "center", bgcolor: "rgba(224, 4, 16, 0.20)", borderRight: "1px solid #EDEDED" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "14px", fontWeight: 700 }}>Pcs</Typography></Box>
                                                <Box sx={{ justifyContent: "center", width: "121px", height: "100%", display: "flex", alignItems: "center", bgcolor: "rgba(224, 4, 16, 0.20)", borderRight: "1px solid #EDEDED" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "14px", fontWeight: 700 }}>Cts</Typography></Box>
                                                <Box sx={{ justifyContent: "center", width: "122px", height: "100%", display: "flex", alignItems: "center", bgcolor: "rgba(224, 4, 16, 0.20)", borderRight: "1px solid #EDEDED" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "14px", fontWeight: 700 }}>Price</Typography></Box>
                                                <Box sx={{ justifyContent: "center", width: "130px", height: "100%", display: "flex", alignItems: "center", bgcolor: "rgba(224, 4, 16, 0.20)", borderRight: "1px solid #EDEDED" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "14px", fontWeight: 700 }}>Unit</Typography></Box>
                                            </Box>

                                        </Box>

                                        <Box sx={{ height: "100%" }}>
                                            <Box sx={{
                                                height: " 50%",
                                                borderRight: "1px solid #EDEDED",
                                                borderBottom: "1px solid #EDEDED", width: "255px", display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "rgba(139, 180, 255, 0.40)"
                                            }}><Typography sx={{ color: "#343434", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>Diff</Typography></Box>
                                            <Box sx={{ display: "flex", height: " 50%", }}>
                                                <Box sx={{ justifyContent: "center", width: "129px", height: "100%", display: "flex", alignItems: "center", bgcolor: "rgba(139, 180, 255, 0.20)", borderRight: "1px solid #EDEDED" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "14px", fontWeight: 700 }}>Pcs</Typography></Box>
                                                <Box sx={{ justifyContent: "center", width: "125px", height: "100%", display: "flex", alignItems: "center", bgcolor: "rgba(139, 180, 255, 0.20)" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "14px", fontWeight: 700 }}>Cts</Typography></Box>
                                            </Box>

                                        </Box>




                                        <Box sx={{

                                            width: "185px", padding: "12px 8px"
                                        }}><Typography sx={{ color: "#343434", fontFamily: "Calibri", fontSize: "16px", fontWeight: 700 }}>Remark</Typography></Box>
                                    </Box>



                                    {/* Body Rows */}
                                    <Box sx={{ minWidth: "max-content", }}>
                                        {items.length > 0 ? (
                                            items.map((item, index) => (
                                                <Box key={index} sx={{ display: "flex", height: "42px", borderBottom: "1px solid #EDEDED", "&:hover": { bgcolor: "#F5F8FF" }, cursor: "pointer", alignItems: "center", }}>
                                                    <Box
                                                        onClick={() => {
                                                            if (!isApproved && !(fsmState === "saved" && !isEditMode)) {
                                                                handleRemoveItem(index);
                                                            }
                                                        }}
                                                        sx={{
                                                            padding: "12px 8px",
                                                            width: "20px",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            borderRight: "1px solid #EDEDED",
                                                            cursor: (isApproved || (fsmState === "saved" && !isEditMode)) ? "default" : "pointer",
                                                            opacity: (isApproved || (fsmState === "saved" && !isEditMode)) ? 0.5 : 1,
                                                            "&:hover": {
                                                                bgcolor: (isApproved || (fsmState === "saved" && !isEditMode)) ? "transparent" : "rgba(224, 4, 16, 0.1)"
                                                            }
                                                        }}
                                                    >
                                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M6.1875 8.4375H11.8125C11.9617 8.4375 12.1048 8.49676 12.2102 8.60225C12.3157 8.70774 12.375 8.85082 12.375 9C12.375 9.14918 12.3157 9.29226 12.2102 9.39775C12.1048 9.50324 11.9617 9.5625 11.8125 9.5625H6.1875C6.03832 9.5625 5.89524 9.50324 5.78975 9.39775C5.68426 9.29226 5.625 9.14918 5.625 9C5.625 8.85082 5.68426 8.70774 5.78975 8.60225C5.89524 8.49676 6.03832 8.4375 6.1875 8.4375Z" fill="#E00410" /><path d="M9 15.75C9.88642 15.75 10.7642 15.5754 11.5831 15.2362C12.4021 14.897 13.1462 14.3998 13.773 13.773C14.3998 13.1462 14.897 12.4021 15.2362 11.5831C15.5754 10.7642 15.75 9.88642 15.75 9C15.75 8.11358 15.5754 7.23583 15.2362 6.41689C14.897 5.59794 14.3998 4.85382 13.773 4.22703C13.1462 3.60023 12.4021 3.10303 11.5831 2.76381C10.7642 2.42459 9.88642 2.25 9 2.25C7.20979 2.25 5.4929 2.96116 4.22703 4.22703C2.96116 5.4929 2.25 7.20979 2.25 9C2.25 10.7902 2.96116 12.5071 4.22703 13.773C5.4929 15.0388 7.20979 15.75 9 15.75ZM9 16.875C6.91142 16.875 4.90838 16.0453 3.43153 14.5685C1.95469 13.0916 1.125 11.0886 1.125 9C1.125 6.91142 1.95469 4.90838 3.43153 3.43153C4.90838 1.95469 6.91142 1.125 9 1.125C11.0886 1.125 13.0916 1.95469 14.5685 3.43153C16.0453 4.90838 16.875 6.91142 16.875 9C16.875 11.0886 16.0453 13.0916 14.5685 14.5685C13.0916 16.0453 11.0886 16.875 9 16.875Z" fill="#E00410" /></svg>
                                                    </Box>
                                                    <Box sx={{ width: "50px", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", borderRight: "1px solid #EDEDED" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "16px", fontWeight: 400, color: "#666666" }}>{index + 1}</Typography></Box>
                                                    <Box sx={{ width: "182px", height: "100%", display: "flex", alignItems: "center", padding: "0 16px", borderRight: "1px solid #EDEDED" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "16px", fontWeight: 400, color: "#666666" }}>{item.stone_code || "---"}</Typography></Box>
                                                    <Box sx={{ justifyContent: "center", width: "93px", height: "100%", display: "flex", alignItems: "center", padding: "0 8px", borderRight: "1px solid #EDEDED" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "16px", fontWeight: 400, color: "#666666" }}>{item.stock_pcs || 0}</Typography></Box>
                                                    <Box sx={{ justifyContent: "center", width: "102px", height: "100%", display: "flex", alignItems: "center", padding: "0 8px", borderRight: "1px solid #EDEDED" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "16px", fontWeight: 400, color: "#666666" }}>{item.stock_cts || 0}</Typography></Box>

                                                    <Box sx={{ justifyContent: "center", width: "121px", height: "100%", display: "flex", alignItems: "center", borderRight: "1px solid #EDEDED", bgcolor: (fsmState === "saved" && !isEditMode) ? "#F5F5F5" : "transparent" }}>
                                                        <TextField disabled={fsmState === "saved" && !isEditMode} value={item.physical_pcs} onChange={(e) => handleCellChange(index, "physical_pcs", e.target.value)} type="number" size="small" variant="standard" InputProps={{ disableUnderline: true }} sx={{ "& .MuiInputBase-input": { textAlign: "center", fontFamily: "Calibri", fontSize: "16px", fontWeight: 400, color: "#666666" } }} />
                                                    </Box>

                                                    <Box sx={{ justifyContent: "center", width: "121px", height: "100%", display: "flex", alignItems: "center", borderRight: "1px solid #EDEDED", bgcolor: (fsmState === "saved" && !isEditMode) ? "#F5F5F5" : "transparent" }}>
                                                        <TextField disabled={fsmState === "saved" && !isEditMode} value={item.physical_cts} onChange={(e) => handleCellChange(index, "physical_cts", e.target.value)} type="number" size="small" variant="standard" InputProps={{ disableUnderline: true }} sx={{ "& .MuiInputBase-input": { textAlign: "center", fontFamily: "Calibri", fontSize: "16px", fontWeight: 400, color: "#666666" } }} />
                                                    </Box>

                                                    <Box sx={{ justifyContent: "center", width: "122px", height: "100%", display: "flex", alignItems: "center", borderRight: "1px solid #EDEDED", bgcolor: (fsmState === "saved" && !isEditMode) ? "#F5F5F5" : "transparent" }}>
                                                        <TextField disabled={fsmState === "saved" && !isEditMode} value={item.price} onChange={(e) => handleCellChange(index, "price", e.target.value)} type="number" size="small" variant="standard" InputProps={{ disableUnderline: true }} sx={{ "& .MuiInputBase-input": { textAlign: "center", fontFamily: "Calibri", fontSize: "16px", fontWeight: 400, color: "#666666" } }} />
                                                    </Box>

                                                    <Box sx={{ justifyContent: "center", width: "129px", height: "100%", display: "flex", alignItems: "center", borderRight: "1px solid #EDEDED", bgcolor: (fsmState === "saved" && !isEditMode) ? "#F5F5F5" : "transparent" }}>
                                                        <Select disabled={fsmState === "saved" && !isEditMode} value={item.unit} onChange={(e) => handleCellChange(index, "unit", e.target.value)} variant="standard" disableUnderline sx={{ fontFamily: "Calibri", fontSize: "15px", width: "100%", textAlign: "center" }}><MenuItem value="pcs">Pcs</MenuItem><MenuItem value="cts">Cts</MenuItem></Select>
                                                    </Box>

                                                    <Box sx={{ justifyContent: "center", width: "127px", height: "100%", display: "flex", alignItems: "center", borderRight: "1px solid #EDEDED" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "16px", fontWeight: 400, color: "#666666" }}>{item.diff_pcs || 0}</Typography></Box>
                                                    <Box sx={{ justifyContent: "center", width: "127px", height: "100%", display: "flex", alignItems: "center", borderRight: "1px solid #EDEDED" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "16px", fontWeight: 400, color: "#666666" }}>{item.diff_cts || 0}</Typography></Box>
                                                    <Box sx={{ justifyContent: "center", width: "185px", height: "100%", display: "flex", alignItems: "center", padding: "0 8px", bgcolor: (fsmState === "saved" && !isEditMode) ? "#F5F5F5" : "transparent" }}>
                                                        <TextField disabled={fsmState === "saved" && !isEditMode} value={item.remark} onChange={(e) => handleCellChange(index, "remark", e.target.value)} size="small" variant="standard" InputProps={{ disableUnderline: true }} placeholder="---" sx={{ "& .MuiInputBase-input": { fontFamily: "Calibri", fontSize: "16px", fontWeight: 400, color: "#666666" } }} />
                                                    </Box>
                                                </Box>
                                            ))
                                        ) : (
                                            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "60px", opacity: 0.6 }}>
                                                <Typography sx={{ fontSize: "20px", fontFamily: "Calibri", fontWeight: 700, color: "#9A9A9A" }}>No data</Typography>
                                                <Typography sx={{ fontSize: "14px", fontFamily: "Calibri", color: "#9A9A9A" }}>Please add items by clicking on "Stock" button</Typography>
                                            </Box>
                                        )}
                                    </Box>

                                    {/* Totals Footer */}
                                    {items.length > 0 && (
                                        <Box sx={{ display: "flex", height: "48px", bgcolor: "#FFFFFF", borderTop: "1px solid #EDEDED", alignItems: "center", minWidth: "max-content", gap: "4px", position: "sticky", bottom: 0, zIndex: 1 }}>
                                            <Box sx={{ width: "20px" }} /><Box sx={{ width: "50px" }} />
                                            <Box sx={{ width: "180px" }} /><Box sx={{ width: "30px" }} />
                                            <Box sx={{ justifyContent: "center", width: "113px", display: "flex" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "16px", fontWeight: 700, color: "#666666" }}>{totals.stock_pcs}</Typography></Box>
                                            <Box sx={{ justifyContent: "center", width: "114px", display: "flex" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "16px", fontWeight: 700, color: "#666666" }}>{formatNumberWithCommas(totals.stock_cts.toFixed(3))}</Typography></Box>
                                            <Box sx={{ justifyContent: "center", width: "121px", display: "flex" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "16px", fontWeight: 700, color: "#666666" }}>{totals.physical_pcs}</Typography></Box>
                                            <Box sx={{ justifyContent: "center", width: "121px", display: "flex" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "16px", fontWeight: 700, color: "#666666" }}>{formatNumberWithCommas(totals.physical_cts.toFixed(3))}</Typography></Box>
                                            <Box sx={{ width: "122px" }} /><Box sx={{ width: "122px" }} />
                                            <Box sx={{ justifyContent: "center", width: "127px", display: "flex" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "16px", fontWeight: 700, color: "#666666" }}>{totals.diff_pcs}</Typography></Box>
                                            <Box sx={{ justifyContent: "center", width: "127px", display: "flex" }}><Typography sx={{ fontFamily: "Calibri", fontSize: "16px", fontWeight: 700, color: "#666666" }}>{formatNumberWithCommas(totals.diff_cts.toFixed(3))}</Typography></Box>
                                            <Box sx={{ width: "185px" }} />
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        </Box>



                        <TextField
                            label="Remark"
                            placeholder="This remark will be shown on document"
                            variant="outlined"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}

                            InputLabelProps={{
                                shrink: true,
                            }}
                            multiline
                            rows={2.5}
                            sx={{
                                width: "600px",
                                height: "80px",
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px",
                                    height: "80px",
                                    backgroundColor: (fsmState === "saved" && !isEditMode) ? "#F5F5F5" : "#FFF",
                                },
                                marginTop: "30px",
                                marginBottom: "85px",
                                bgcolor: (fsmState === "saved" && !isEditMode) ? "#F5F5F5" : "#FFF",
                            }}
                            disabled={fsmState === "saved" && !isEditMode}
                        />
                    </Box>
                </Box>
            </Box>
        </Box >
    );
};

export default ConsignmentCheckBody;
