import React, { useState, useMemo, useEffect } from "react";
import {
    Box,
    Typography,
    TextField,
    MenuItem,
    InputAdornment,
    FormControl,
    Select,
    Button,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Ref1 from "../Ref1";
import Ref2 from "../Ref2";

const ConsignmentCheckBody = ({
    invoiceNo,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    searchTerm,
    setSearchTerm,
    rowPP,
    setRowPP,
    handleChange,
    stockMovements = [],
    note,
    setNote,
}) => {
    const [tab, setTab] = useState("Item");
    const [ref1, setRef1] = useState("");
    const [ref2, setRef2] = useState("");

    const filteredStockMovements = useMemo(() => {
        if (!searchTerm) return stockMovements;
        return stockMovements.filter((item) =>
            item.stone_code?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [stockMovements, searchTerm]);

    return (
        <Box
            sx={{
                width: "1632px",
                padding: "9px 24px 32px 24px",
            }}
        >
            <Box sx={{ width: "1640px" }}>
                {/* Meta Info */}
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Typography
                        sx={{
                            color: "#9A9A9A",
                            fontFamily: "Calibri",
                            fontSize: "12px",
                            fontWeight: 400,
                        }}
                    >
                        Transaction Date : {dayjs().format('DD/MM/YYYY')} By : Super Admin
                    </Typography>
                </Box>

                {/* Header Fields Section */}
                <Box
                    sx={{
                        width: "1645px",
                        padding: "24px 32px",
                        borderRadius: "5px 5px 0px 0px",
                        bgcolor: "#FFF",
                        marginTop: "8px",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center"
                        }}
                    >
                        <Box
                            sx={{
                                width: "175px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
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
                                }}
                            >
                                SC2584334
                            </Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Doc Date :"
                                    defaultValue={dayjs()}
                                    format="DD/MM/YYYY"
                                    slotProps={{
                                        textField: {
                                            required: true,
                                        },
                                    }}
                                    sx={{
                                        "& .MuiInputLabel-asterisk": { color: "red" },
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "8px",
                                            backgroundColor: "#FFF",
                                            width: "220px",
                                            height: "42px",
                                            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#8BB4FF" },
                                            "&:hover": { backgroundColor: "#F5F8FF" },
                                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#8BB4FF" },
                                        },
                                        marginRight: "24px",
                                        marginLeft: "24px",
                                    }}
                                />
                            </LocalizationProvider>

                            <TextField
                                label="Main Location :"
                                select
                                value=""
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                    "& .MuiInputLabel-asterisk": { color: "red" },
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "8px",
                                        backgroundColor: "#FFF",
                                        width: "385px",
                                        height: "42px",
                                        "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#8BB4FF" },
                                        "&:hover": { backgroundColor: "#F5F8FF" },
                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#8BB4FF" },
                                    },
                                    marginRight: "24px",
                                }}
                            >
                                <MenuItem value="">Select Location</MenuItem>
                            </TextField>

                            <Ref1 width="385px" ref1={ref1} onRef1Change={setRef1} />
                            <Ref2 width="385px" ref2={ref2} onRef2Change={setRef2} />
                        </Box>
                    </Box>
                </Box>

                {/* Main Content Area */}
                <Box
                    sx={{
                        width: "1645px",
                        padding: "0px 32px 32px 32px",
                        borderTop: "1px solid #C6C6C8",
                        borderLeft: "1px solid #C6C6C8",
                        borderRight: "1px solid #C6C6C8",
                        bgcolor: "#F8F8F8",
                        minHeight: "687px",
                    }}
                >
                    {/* Item/Stock Selection Section */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", marginTop: "10px" }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
                            <Typography
                                sx={{
                                    lineHeight: "normal",
                                    fontSize: "18px",
                                    fontWeight: 600,
                                    fontFamily: "Calibri",
                                    color: "var(--HeadPage,rgb(48, 47, 47))"
                                }}
                            >
                                Item
                            </Typography>
                            <Button
                                variant="contained"
                                size="small"
                                onClick={() => setTab("Stock")}
                                sx={{
                                    lineHeight: "normal",
                                    fontFamily: "Calibri",
                                    width: "96px",
                                    fontSize: "14px",
                                    fontWeight: "400",
                                    height: "26px",
                                    bgcolor: "#000",
                                    color: "#FFF",
                                    textTransform: "none",
                                    borderRadius: "4px",
                                    "&:hover": {
                                        bgcolor: "#333",
                                        boxShadow: "none"
                                    }
                                }}
                            >
                                Stock
                            </Button>
                        </Box>

                        <Box sx={{ display: "flex", gap: "16px", alignItems: "center" }}>
                            <Box sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.9963 21L16.6562 16.66L20.9963 21Z" fill="#666666" />
                                    <path d="M20.9963 21L16.6562 16.66" stroke="#666666" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#666666" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Box>
                            <Box sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.5 20C5.5 20.1427 5.452 20.2617 5.356 20.357C5.26 20.4523 5.14134 20.5 5 20.5H2.308C2.07934 20.5 1.88734 20.4227 1.732 20.268C1.57667 20.1133 1.49934 19.9213 1.5 19.692V17C1.5 16.858 1.548 16.7393 1.644 16.644C1.74 16.5487 1.859 16.5007 2.001 16.5C2.143 16.4993 2.26167 16.5473 2.357 16.644C2.45234 16.7407 2.5 16.8593 2.5 17V19.5H5C5.142 19.5 5.26067 19.548 5.356 19.644C5.45134 19.74 5.49934 19.858 5.5 20ZM22 16.5C22.1427 16.5 22.2617 16.548 22.357 16.644C22.4523 16.74 22.5 16.8587 22.5 17V19.692C22.5 19.9213 22.4227 20.1133 22.268 20.268C22.1133 20.4227 21.9213 20.5 21.692 20.5H19C18.858 20.5 18.7393 20.452 18.644 20.356C18.5487 20.26 18.5007 20.141 18.5 19.999C18.4993 19.857 18.5473 19.7383 18.644 19.643C18.7407 19.5477 18.8593 19.5 19 19.5H21.5V17C21.5 16.858 21.548 16.7393 21.644 16.644C21.74 16.5487 21.858 16.5007 22 16.5" fill="#666666" />
                                </svg>
                            </Box>
                        </Box>
                    </Box>

                    {/* Table Control Area */}
                    <Box sx={{ marginTop: "24px" }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                            <TextField
                                placeholder="Search List ..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#57646F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M21 21L16.65 16.65" stroke="#57646F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: "8px",
                                        backgroundColor: "#FFF",
                                        width: "330px",
                                        height: "40px",
                                        "&:hover fieldset": { borderColor: "#8BB4FF" },
                                    },
                                }}
                            />
                            <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <Typography sx={{ fontFamily: "Calibri", fontSize: "16px" }}>Rows per page</Typography>
                                <FormControl sx={{ height: "40px", width: "70px" }}>
                                    <Select
                                        value={rowPP}
                                        onChange={handleChange}
                                        sx={{ height: "40px", width: "70px", bgcolor: "#FFF" }}
                                    >
                                        <MenuItem value={10}>10</MenuItem>
                                        <MenuItem value={20}>20</MenuItem>
                                        <MenuItem value={50}>50</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>

                        {/* Table Container */}
                        <Box
                            sx={{
                                border: "1px solid #C6C6C8",
                                borderRadius: "5px",
                                bgcolor: "#FFF",
                                overflow: "hidden"
                            }}
                        >
                            <Box
                                sx={{
                                    height: "550px",
                                    overflow: "auto",
                                    "&::-webkit-scrollbar": { height: "7px", width: "7px" },
                                    "&::-webkit-scrollbar-track": { background: "#F5F5F5" },
                                    "&::-webkit-scrollbar-thumb": { background: "#C1C1C1", borderRadius: "10px" },
                                }}
                            >
                                {/* Table Header */}
                                <Box sx={{ display: "flex", bgcolor: "#EDEDED", borderBottom: "1px solid #C6C6C8", minWidth: "max-content", position: "sticky", top: 0, zIndex: 1 }}>
                                    <Box sx={{ width: "50px", padding: "12px 8px", textAlign: "center", borderRight: "1px solid #C6C6C8" }}>
                                        <Typography sx={{ fontWeight: 700, fontFamily: "Calibri", fontSize: "16px" }}>#</Typography>
                                    </Box>
                                    <Box sx={{ width: "200px", padding: "12px 16px", borderRight: "1px solid #C6C6C8" }}>
                                        <Typography sx={{ fontWeight: 700, fontFamily: "Calibri", fontSize: "16px" }}>Stone Code</Typography>
                                    </Box>
                                    
                                    <Box sx={{ width: "240px", display: "flex", flexDirection: "column", borderRight: "1px solid #C6C6C8" }}>
                                        <Box sx={{ bgcolor: "rgba(5, 89, 91, 0.40)", padding: "4px 8px", textAlign: "center", borderBottom: "1px solid #C6C6C8" }}>
                                            <Typography sx={{ fontWeight: 700, fontFamily: "Calibri", fontSize: "14px" }}>Stock</Typography>
                                        </Box>
                                        <Box sx={{ display: "flex", bgcolor: "rgba(5, 89, 91, 0.10)" }}>
                                            <Box sx={{ flex: 1, padding: "8px", textAlign: "center", borderRight: "1px solid #C6C6C8" }}>
                                                <Typography sx={{ fontWeight: 700, fontFamily: "Calibri", fontSize: "14px" }}>Pcs</Typography>
                                            </Box>
                                            <Box sx={{ flex: 1, padding: "8px", textAlign: "center" }}>
                                                <Typography sx={{ fontWeight: 700, fontFamily: "Calibri", fontSize: "14px" }}>Cts</Typography>
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Box sx={{ width: "240px", display: "flex", flexDirection: "column", borderRight: "1px solid #C6C6C8" }}>
                                        <Box sx={{ bgcolor: "rgba(224, 4, 16, 0.40)", padding: "4px 8px", textAlign: "center", borderBottom: "1px solid #C6C6C8" }}>
                                            <Typography sx={{ fontWeight: 700, fontFamily: "Calibri", fontSize: "14px" }}>Physical</Typography>
                                        </Box>
                                        <Box sx={{ display: "flex", bgcolor: "rgba(224, 4, 16, 0.10)" }}>
                                            <Box sx={{ flex: 1, padding: "8px", textAlign: "center", borderRight: "1px solid #C6C6C8" }}>
                                                <Typography sx={{ fontWeight: 700, fontFamily: "Calibri", fontSize: "14px" }}>Pcs</Typography>
                                            </Box>
                                            <Box sx={{ flex: 1, padding: "8px", textAlign: "center" }}>
                                                <Typography sx={{ fontWeight: 700, fontFamily: "Calibri", fontSize: "14px" }}>Cts</Typography>
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Box sx={{ width: "240px", display: "flex", flexDirection: "column", borderRight: "1px solid #C6C6C8" }}>
                                        <Box sx={{ bgcolor: "rgba(139, 180, 255, 0.40)", padding: "4px 8px", textAlign: "center", borderBottom: "1px solid #C6C6C8" }}>
                                            <Typography sx={{ fontWeight: 700, fontFamily: "Calibri", fontSize: "14px" }}>Diff</Typography>
                                        </Box>
                                        <Box sx={{ display: "flex", bgcolor: "rgba(139, 180, 255, 0.10)" }}>
                                            <Box sx={{ flex: 1, padding: "8px", textAlign: "center", borderRight: "1px solid #C6C6C8" }}>
                                                <Typography sx={{ fontWeight: 700, fontFamily: "Calibri", fontSize: "14px" }}>Pcs</Typography>
                                            </Box>
                                            <Box sx={{ flex: 1, padding: "8px", textAlign: "center" }}>
                                                <Typography sx={{ fontWeight: 700, fontFamily: "Calibri", fontSize: "14px" }}>Cts</Typography>
                                            </Box>
                                        </Box>
                                    </Box>

                                    <Box sx={{ width: "120px", padding: "12px 16px", borderRight: "1px solid #C6C6C8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Typography sx={{ fontWeight: 700, fontFamily: "Calibri", fontSize: "16px" }}>Price</Typography>
                                    </Box>
                                    <Box sx={{ width: "100px", padding: "12px 16px", borderRight: "1px solid #C6C6C8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Typography sx={{ fontWeight: 700, fontFamily: "Calibri", fontSize: "16px" }}>Unit</Typography>
                                    </Box>
                                    <Box sx={{ width: "300px", padding: "12px 16px", display: "flex", alignItems: "center" }}>
                                        <Typography sx={{ fontWeight: 700, fontFamily: "Calibri", fontSize: "16px" }}>Remark</Typography>
                                    </Box>
                                </Box>

                                {/* Table Body */}
                                <Box sx={{ minWidth: "max-content" }}>
                                    {filteredStockMovements.length > 0 ? (
                                        filteredStockMovements.map((item, index) => (
                                            <Box key={index} sx={{ display: "flex", borderBottom: "1px solid #C6C6C8", "&:hover": { bgcolor: "#F5F8FF" }, cursor: "pointer" }}>
                                                <Box sx={{ width: "50px", padding: "10px 8px", textAlign: "center", borderRight: "1px solid #C6C6C8" }}>
                                                    <Typography sx={{ fontFamily: "Calibri", fontSize: "15px" }}>{index + 1}</Typography>
                                                </Box>
                                                <Box sx={{ width: "200px", padding: "10px 16px", borderRight: "1px solid #C6C6C8" }}>
                                                    <Typography sx={{ fontFamily: "Calibri", fontSize: "15px" }}>{item.stone_code || "---"}</Typography>
                                                </Box>
                                                <Box sx={{ width: "120px", padding: "10px 8px", textAlign: "right", borderRight: "1px solid #C6C6C8" }}>
                                                    <Typography sx={{ fontFamily: "Calibri", fontSize: "15px" }}>{item.in_pcs || 0}</Typography>
                                                </Box>
                                                <Box sx={{ width: "120px", padding: "10px 8px", textAlign: "right", borderRight: "1px solid #C6C6C8" }}>
                                                    <Typography sx={{ fontFamily: "Calibri", fontSize: "15px" }}>{item.in_weight || 0}</Typography>
                                                </Box>
                                                <Box sx={{ width: "120px", padding: "10px 8px", textAlign: "right", borderRight: "1px solid #C6C6C8" }}>
                                                    <Typography sx={{ fontFamily: "Calibri", fontSize: "15px" }}>{item.physical_pcs || 0}</Typography>
                                                </Box>
                                                <Box sx={{ width: "120px", padding: "10px 8px", textAlign: "right", borderRight: "1px solid #C6C6C8" }}>
                                                    <Typography sx={{ fontFamily: "Calibri", fontSize: "15px" }}>{item.physical_weight || 0}</Typography>
                                                </Box>
                                                <Box sx={{ width: "120px", padding: "10px 8px", textAlign: "right", borderRight: "1px solid #C6C6C8" }}>
                                                    <Typography sx={{ fontFamily: "Calibri", fontSize: "15px" }}>{item.diff_pcs || 0}</Typography>
                                                </Box>
                                                <Box sx={{ width: "120px", padding: "10px 8px", textAlign: "right", borderRight: "1px solid #C6C6C8" }}>
                                                    <Typography sx={{ fontFamily: "Calibri", fontSize: "15px" }}>{item.diff_weight || 0}</Typography>
                                                </Box>
                                                <Box sx={{ width: "120px", padding: "10px 16px", textAlign: "right", borderRight: "1px solid #C6C6C8" }}>
                                                    <Typography sx={{ fontFamily: "Calibri", fontSize: "15px" }}>{item.price || 0}</Typography>
                                                </Box>
                                                <Box sx={{ width: "100px", padding: "10px 16px", textAlign: "center", borderRight: "1px solid #C6C6C8" }}>
                                                    <Typography sx={{ fontFamily: "Calibri", fontSize: "15px" }}>{item.unit || "Cts"}</Typography>
                                                </Box>
                                                <Box sx={{ width: "300px", padding: "10px 16px" }}>
                                                    <Typography sx={{ fontFamily: "Calibri", fontSize: "15px" }}>{item.remark || ""}</Typography>
                                                </Box>
                                            </Box>
                                        ))
                                    ) : (
                                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "60px", opacity: 0.6 }}>
                                            <Box sx={{ width: "64px", height: "64px", mb: 2 }}>
                                                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M56 16H8C5.79086 16 4 17.7909 4 20V52C4 54.2091 5.79086 56 8 56H56C58.2091 56 60 54.2091 60 52V20C60 17.7909 58.2091 16 56 16Z" stroke="#9A9A9A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M4 24H60" stroke="#9A9A9A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M24 16V8C24 6.93913 24.4214 5.92172 25.1716 5.17157C25.9217 4.42143 26.9391 4 28 4H36C37.0609 4 38.0783 4.42143 38.8284 5.17157C39.5786 5.92172 40 6.93913 40 8V16" stroke="#9A9A9A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </Box>
                                            <Typography sx={{ fontSize: "20px", fontFamily: "Calibri", fontWeight: 700, color: "#9A9A9A" }}>No data</Typography>
                                            <Typography sx={{ fontSize: "14px", fontFamily: "Calibri", color: "#9A9A9A" }}>Please add the items by clicking on "Stock" button</Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    {/* Comment Section */}
                    <Box sx={{ marginTop: "32px" }}>
                        <TextField
                            placeholder="Write a comment..."
                            multiline
                            rows={4}
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            sx={{
                                width: "400px",
                                backgroundColor: "#FFF",
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px",
                                    "& fieldset": { borderColor: "#C6C6C8" },
                                }
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default ConsignmentCheckBody;
