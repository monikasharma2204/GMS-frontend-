import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Modal, Checkbox, FormControl, Select, MenuItem } from "@mui/material";
import apiRequest from "helpers/apiHelper.js";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1360,
    height: 842,
    bgcolor: "background.paper",
    borderRadius: "8px",
    boxShadow: 24,
    outline: 'none',
};

const textStyle = {
    color: "var(--Main-Text, #343434)",
    fontFamily: "Calibri",
    fontSize: "16px",
    fontStyle: "normal",
    fontWeight: 400,
};

const formatWeight = (weight) => {
  const value = Number(weight);
  return Number.isFinite(value) ? value.toFixed(3) : "0.000";
};

const formatCurrency = (amount) => {
  const num = parseFloat(amount);
  return isNaN(num) ? "0.00" : num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const StockCheckListModal = ({ open, handleClose, onSelect, locationType }) => {
    const [rowData, setRowData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        const fetchStock = async () => {
            if (!open || !locationType) return;
            try {
                setLoading(true);
                const response = await apiRequest("GET", `/stocks/by-location?location_type=${locationType}`);
                const data = Array.isArray(response) ? response : (response?.stocks || []);
                setRowData(data);
            } catch (error) {
                console.error("Error fetching stock check list:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStock();
    }, [open, locationType]);

    const handleCheckboxChange = (row) => {
        setSelectedRows((prev) => {
            const isSelected = prev.some((item) => item.id === row.id || item._id === row._id);
            if (isSelected) {
                return prev.filter((item) => (item.id !== row.id && item._id !== row._id));
            }
            return [...prev, row];
        });
    };

    const handleSelectAll = () => {
        if (selectedRows.length === rowData.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(rowData);
        }
    };

    const handleOkClick = () => {
        onSelect(selectedRows);
        setSelectedRows([]);
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                {/* Header */}
                <Box
                    sx={{

                        height: "56px",
                        backgroundColor: "#05595B",
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0 32px",
                    }}
                >
                    <Typography sx={{ color: "#FFF", fontFamily: "Calibri", fontSize: "24px", fontWeight: 700 }}>
                        Stock Check List
                    </Typography>
                    <Box
                        onClick={handleClose}
                        sx={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            "&:hover svg path": { fill: "#E00410" }
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M14.1535 12.0008L19.5352 6.61748C19.6806 6.47704 19.7966 6.30905 19.8764 6.12331C19.9562 5.93757 19.9982 5.7378 19.9999 5.53565C20.0017 5.3335 19.9632 5.13303 19.8866 4.94593C19.8101 4.75883 19.697 4.58885 19.5541 4.44591C19.4111 4.30296 19.2412 4.18992 19.0541 4.11337C18.867 4.03682 18.6665 3.9983 18.4644 4.00006C18.2622 4.00181 18.0624 4.04381 17.8767 4.1236C17.691 4.20339 17.523 4.31937 17.3825 4.46478L11.9992 9.84654L6.61748 4.46478C6.47704 4.31937 6.30905 4.20339 6.12331 4.1236C5.93757 4.04381 5.7378 4.00181 5.53565 4.00006C5.3335 3.9983 5.13303 4.03682 4.94593 4.11337C4.75883 4.18992 4.58885 4.30296 4.44591 4.44591C4.30296 4.58885 4.18992 4.75883 4.11337 4.94593C4.03682 5.13303 3.9983 5.3335 4.00006 5.53565C4.00181 5.7378 4.04381 5.93757 4.1236 6.12331C4.20339 6.30905 4.31937 6.47704 4.46478 6.61748L9.84654 11.9992L4.46478 17.3825C4.31937 17.523 4.20339 17.691 4.1236 17.8767C4.04381 18.0624 4.00181 18.2622 4.00006 18.4644C3.9983 18.6665 4.03682 18.867 4.11337 19.0541C4.18992 19.2412 4.30296 19.4111 4.44591 19.5541C4.58885 19.697 4.75883 19.8101 4.94593 19.8866C5.13303 19.9632 5.3335 20.0017 5.53565 19.9999C5.7378 19.9982 5.93757 19.9562 6.12331 19.8764C6.30905 19.7966 6.47704 19.6806 6.61748 19.5352L11.9992 14.1535L17.3825 19.5352C17.523 19.6806 17.691 19.7966 17.8767 19.8764C18.0624 19.9562 18.2622 19.9982 18.4644 19.9999C18.6665 20.0017 18.867 19.9632 19.0541 19.8866C19.2412 19.8101 19.4111 19.697 19.5541 19.5541C19.697 19.4111 19.8101 19.2412 19.8866 19.0541C19.9632 18.867 20.0017 18.6665 19.9999 18.4644C19.9982 18.2622 19.9562 18.0624 19.8764 17.8767C19.7966 17.691 19.6806 17.523 19.5352 17.3825L14.1535 12.0008Z" fill="white" />
                        </svg>
                    </Box>
                </Box>

                {/* Body Area */}
                <Box
                    sx={{
                        backgroundColor: "#F8F8F8",
                        width: "1294px",
                        height: "638px",
                        marginLeft: "33px",
                        marginTop: "33px",
                        paddingTop: "32px",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden"
                    }}
                >
                    {/* Title and Controls */}
                    <Box
                        sx={{
                            width: "1232px",
                            height: "40px",
                            marginLeft: "32px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexShrink: 0,
                            marginBottom: "16px"
                        }}
                    >
                        <Typography sx={{ color: "#343434", fontFamily: "Calibri", fontSize: "20px", fontWeight: 700 }}>
                            Inventory All
                        </Typography>
                        <Box sx={{ display: "flex", gap: "12px", alignItems: "center" }}>
                            <Typography sx={{ color: "#343434", fontFamily: "Calibri", fontSize: "16px" }}>Rows per page</Typography>
                            <FormControl sx={{ height: "40px", width: "69px" }}>
                                <Select
                                    value={rowsPerPage}
                                    onChange={(e) => setRowsPerPage(e.target.value)}
                                    sx={{ height: "40px", bgcolor: "#FFF" }}
                                >
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={20}>20</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                </Select>
                            </FormControl>
                            {/* Static Icons */}
                            <Box sx={{ display: "flex", gap: "8px" }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M17 17H19C19.5304 17 20.0391 16.7893 20.4142 16.4142C20.7893 16.0391 21 15.5304 21 15V11C21 10.4696 20.7893 9.96086 20.4142 9.58579C20.0391 9.21071 19.5304 9 19 9H5C4.46957 9 3.96086 9.21071 3.58579 9.58579C3.21071 9.96086 3 10.4696 3 11V15C3 15.5304 3.21071 16.0391 3.58579 16.4142C3.96086 16.7893 4.46957 17 5 17H7" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M17 9V5C17 4.46957 16.7893 3.96086 16.4142 3.58579C16.0391 3.21071 15.5304 3 15 3H9C8.46957 3 7.96086 3.21071 7.58579 3.58579C7.21071 3.96086 7 4.46957 7 5V9" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M15 13H9C7.89543 13 7 13.8954 7 15V19C7 20.1046 7.89543 21 9 21H15C16.1046 21 17 20.1046 17 19V15C17 13.8954 16.1046 13 15 13Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M14 2V8H20" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 13H8" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 17H8" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M10 9H8" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                            </Box>
                        </Box>
                    </Box>

                    {/* Table Container */}
                    <Box sx={{
                        flexGrow: 1,
                        overflow: "auto",
                        marginLeft: "32px",
                        marginRight: "32px",
                        border: "1px solid #C6C6C8",
                        bgcolor: "#FFF"
                    }}>
                        <Box sx={{ minWidth: "2200px" }}>

                            <Box sx={{
                                height: "42px",
                                bgcolor: "#EEE",
                                display: "flex",
                                borderBottom: "1px solid #C6C6C8",
                                position: "sticky",
                                top: 0,
                                zIndex: 1
                            }}>
                                <Box sx={{ width: "60px", display: "flex", alignItems: "center", paddingLeft: "8px" }}>
                                    <Checkbox checked={selectedRows.length === rowData.length && rowData.length > 0} onChange={handleSelectAll} />
                                    <Typography sx={{ ...textStyle, fontWeight: 700 }}>#</Typography>
                                </Box>
                                {[
                                    { label: "Location", width: "140px" },

                                    { label: "Stone Code", width: "250px" },
                                    { label: "Stock ID", width: "140px" },

                                    { label: "Stone", width: "120px" },
                                    { label: "Shape", width: "100px" },
                                    { label: "Size", width: "100px" },
                                    { label: "Color", width: "120px" },
                                    { label: "Cutting", width: "100px" },
                                    { label: "Quality", width: "100px" },
                                    { label: "Clarity", width: "100px" },
                                    { label: "Cer Type", width: "140px" },
                                    { label: "Cer No", width: "140px" },
                                    { label: "Lot", width: "90px" },
                                    { label: "Pcs", width: "60px" },
                                    { label: "Weight", width: "120px", align: "end" },
                                    { label: "Price", width: "120px", align: "end" },
                                    { label: "Unit", width: "60px" },
                                    { label: "Amount", width: "120px", align: "end" },
                                    { label: "Remark", width: "286px", align: "center" }
                                ].map((col, i) => (
                                    <Box key={i} sx={{
                                        width: col.width,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: col.align || "start",
                                        padding: "12px 8px",
                                        borderLeft: col.label === "Lot" || col.label === "Price" ? "1px solid #C6C6C8" : "none"
                                    }}>
                                        <Typography sx={{ ...textStyle, fontWeight: 700 }}>{col.label}</Typography>
                                        {(col.label === "Location" || col.label === "Type" || col.label === "Stone Code" || col.label === "Stock ID" || col.label === "Stone" || col.label === "Shape" || col.label === "Size" || col.label === "Color" || col.label === "Cutting" || col.label === "Quality" || col.label === "Clarity" || col.label === "Cer Type") && (
                                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginLeft: "4px" }}>
                                                <path d="M2 1.5H10C10.1326 1.5 10.2598 1.55268 10.3536 1.64645C10.4473 1.74021 10.5 1.86739 10.5 2V2.793C10.5 2.9256 10.4473 3.05275 10.3535 3.1465L7.1465 6.3535C7.05273 6.44725 7.00003 6.5744 7 6.707V9.8595C7 9.9355 6.98267 10.0105 6.94933 10.0788C6.91599 10.1471 6.86752 10.2069 6.80761 10.2537C6.74769 10.3004 6.6779 10.3329 6.60355 10.3486C6.52919 10.3644 6.45222 10.363 6.3785 10.3445L5.3785 10.0945C5.27038 10.0674 5.1744 10.005 5.10583 9.9171C5.03725 9.82923 5 9.72096 5 9.6095V6.707C4.99997 6.5744 4.94727 6.44725 4.8535 6.3535L1.6465 3.1465C1.55273 3.05275 1.50003 2.9256 1.5 2.793V2C1.5 1.86739 1.55268 1.74021 1.64645 1.64645C1.74021 1.55268 1.86739 1.5 2 1.5Z" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </Box>
                                ))}
                            </Box>

                            {/* Table Body */}
                            <Box sx={{ minWidth: "2200px" }}>
                                {loading ? (
                                    <Box sx={{ p: 4, textAlign: 'center' }}><Typography sx={textStyle}>Loading...</Typography></Box>
                                ) : rowData.length === 0 ? (
                                    <Box sx={{ p: 4, textAlign: 'center' }}><Typography sx={textStyle}>No data available</Typography></Box>
                                ) : (
                                    rowData.map((row, rowIndex) => (
                                        <Box key={rowIndex} sx={{ height: "42px", bgcolor: "#FFF", display: "flex", borderBottom: "1px solid #C6C6C8", "&:hover": { bgcolor: "#F5F8FF" } }}>
                                            <Box sx={{ width: "60px", display: "flex", alignItems: "center", paddingLeft: "8px" }}>
                                                <Checkbox
                                                    checked={selectedRows.some((sel) => sel._id === row._id || sel.id === row.id)}
                                                    onChange={() => handleCheckboxChange(row)}
                                                />
                                                <Typography sx={textStyle}>{rowIndex + 1}</Typography>
                                            </Box>
                                            <Box sx={{ width: "140px", display: "flex", alignItems: "center", padding: "12px 8px" }}>
                                                <Typography sx={textStyle}>
                                                    {row.location_name || (typeof row.location === 'object' ? row.location?.location_name : row.location)}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ width: "250px", display: "flex", alignItems: "center", padding: "12px 8px" }}><Typography sx={textStyle}>{row.stone_code}</Typography></Box>
                                            <Box sx={{ width: "140px", display: "flex", alignItems: "center", padding: "12px 8px" }}><Typography sx={textStyle}>{row.stock_id}</Typography></Box>

                                            <Box sx={{ width: "120px", display: "flex", alignItems: "center", padding: "12px 8px" }}><Typography sx={textStyle}>{row.stone}</Typography></Box>
                                            <Box sx={{ width: "100px", display: "flex", alignItems: "center", padding: "12px 8px" }}><Typography sx={textStyle}>{row.shape}</Typography></Box>
                                            <Box sx={{ width: "100px", display: "flex", alignItems: "center", padding: "12px 8px" }}><Typography sx={textStyle}>{row.size}</Typography></Box>
                                            <Box sx={{ width: "120px", display: "flex", alignItems: "center", padding: "12px 8px" }}><Typography sx={textStyle}>{row.color}</Typography></Box>
                                            <Box sx={{ width: "100px", display: "flex", alignItems: "center", padding: "12px 8px" }}><Typography sx={textStyle}>{row.cutting}</Typography></Box>
                                            <Box sx={{ width: "100px", display: "flex", alignItems: "center", padding: "12px 8px" }}><Typography sx={textStyle}>{row.quality}</Typography></Box>
                                            <Box sx={{ width: "100px", display: "flex", alignItems: "center", padding: "12px 8px" }}><Typography sx={textStyle}>{row.clarity}</Typography></Box>
                                            <Box sx={{ width: "140px", display: "flex", alignItems: "center", padding: "12px 8px" }}><Typography sx={textStyle}>{row.cer_type}</Typography></Box>
                                            <Box sx={{ width: "140px", display: "flex", alignItems: "center", padding: "12px 8px" }}><Typography sx={textStyle}>{row.cer_no}</Typography></Box>
                                            <Box sx={{ width: "90px", display: "flex", alignItems: "center", padding: "12px 8px", borderLeft: "1px solid #C6C6C8" }}><Typography sx={textStyle}>{row.lot_no}</Typography></Box>
                                            <Box sx={{ width: "60px", display: "flex", alignItems: "center", padding: "12px 8px" }}><Typography sx={textStyle}>{row.pcs}</Typography></Box>
                                            <Box sx={{ width: "120px", display: "flex", alignItems: "center", padding: "12px 8px", justifyContent: "flex-end" }}>
                                              
                                                <Typography sx={textStyle}>{formatWeight(row.weight)}</Typography>
                                                </Box>
                                            <Box sx={{ width: "120px", display: "flex", alignItems: "center", padding: "12px 8px", justifyContent: "flex-end", borderLeft: "1px solid #C6C6C8" }}>
                                     

                                                <Typography sx={textStyle}>
  {formatCurrency(
    row.type === "Pmr." ? row.sale_price : row.price
  )}
</Typography>

                                               

                                                </Box>
                                            <Box sx={{ width: "60px", display: "flex", alignItems: "center", padding: "12px 8px" }}><Typography sx={textStyle}>{row.unit_price || "Cts"}</Typography></Box>
                                            <Box sx={{ width: "120px", display: "flex", alignItems: "center", padding: "12px 8px", justifyContent: "flex-end" }}>
                                               
                                                 <Typography sx={textStyle}>{formatCurrency(row.amount)}</Typography>
                                                </Box>
                                            <Box sx={{ width: "286px", display: "flex", alignItems: "center", padding: "12px 8px", justifyContent: "center" }}><Typography sx={textStyle}>{row.remark}</Typography></Box>
                                        </Box>
                                    ))
                                )}
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* Footer */}
                <Box
                    sx={{
                        height: "83px",
                        display: "flex",
                        padding: "0 32px",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderBottomLeftRadius: "8px",
                        borderBottomRightRadius: "8px",
                        bgcolor: "#FFF"
                    }}
                >
                    <Button
                        onClick={handleClose}
                        sx={{
                            width: "79px",
                            height: "35px",
                            borderRadius: "4px",
                            border: "1px solid #BFBFBF",
                            bgcolor: "#FFF",
                            textTransform: "none",
                            color: "#343434",
                            fontFamily: "Calibri",
                            fontWeight: 700,
                            "&:hover": { bgcolor: "#EEE" }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleOkClick}
                        sx={{
                            width: "79px",
                            height: "35px",
                            borderRadius: "4px",
                            bgcolor: "#17C653",
                            textTransform: "none",
                            color: "#FFF",
                            fontFamily: "Calibri",
                            fontWeight: 700,
                            "&:hover": { bgcolor: "#17C653" }
                        }}
                    >
                        Ok
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default StockCheckListModal;
