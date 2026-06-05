import React from "react";
import { Box, Typography, Button } from "@mui/material";

const ConsignmentCheckHeader = ({ onExportExcel, onAdjust, onDayBook, isEditMode, fsmState, hasUnsavedData, currentId, displayInvoiceNo, isApproved }) => {
    return (
        <>
            <Box
                sx={{

                    height: "64px",
                    flexShrink: 0,
                    backgroundColor: "#FFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: "0px 8px 8px -4px rgba(24, 39, 75, 0.08)",
                }}
            >
                <Box
                    sx={{
                        width: "388px",
                        alignItems: "center",
                    }}
                >
                    <Typography
                        sx={{
                            color: "#05595B",
                            fontFamily: "Calibri",
                            fontSize: "24px",
                            fontStyle: "normal",
                            fontWeight: 700,
                            lineHeight: "normal",
                            marginLeft: "32px",
                        }}
                    >
                        Stock ADJ
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>

                    <Box sx={{ display: "flex", alignItems: "center", gap: "12px", marginRight: "32px" }}>
                        <Button
                            disabled={isApproved || !currentId || isEditMode}
                            onClick={onAdjust}
                            sx={{
                                textTransform: "none",
                                height: "35px",
                                width: "100px",
                                padding: "12px",
                                borderRadius: "4px",
                                gap: "8px",
                                backgroundColor: !currentId
                                    ? "#E6E6E6"
                                    : isApproved
                                        ? "#00AA3A33"
                                        : "#C6A96933",
                                border: !currentId
                                    ? "1px solid #BFBFBF"
                                    : isApproved
                                        ? "1px solid #00AA3A80"
                                        : "1px solid #C6A96980",
                                color: !currentId
                                    ? "#57646E"
                                    : isApproved
                                        ? "#00AA3A"
                                        : "#C6A969",
                                fontFamily: "Calibri",
                                fontSize: "16px",
                                fontStyle: "normal",
                                fontWeight: 700,
                                lineHeight: "normal",
                                letterSpacing: "1px",
                                "&:hover": {
                                    backgroundColor: !currentId
                                        ? "#E6E6E6"
                                        : isApproved
                                            ? "#00AA3A33"
                                            : "#C6A96933",
                                },
                                "&.Mui-disabled": {
                                    backgroundColor: isEditMode || !currentId
                                        ? "#E6E6E6"
                                        : isApproved
                                            ? "#00AA3A33"
                                            : "#E6E6E6",
                                    color: isEditMode || !currentId
                                        ? "#57646E"
                                        : isApproved
                                            ? "#00AA3A"
                                            : "#57646E",
                                    border: isEditMode || !currentId
                                        ? "1px solid #BFBFBF"
                                        : isApproved
                                            ? "1px solid #00AA3A80"
                                            : "1px solid #BFBFBF",
                                },
                            }}
                        >
                            {isApproved ? "Adjusted" : "Adjust"}
                        </Button>
                        <Button
                            onClick={onDayBook}
                            sx={{
                                textTransform: "none",
                                height: "35px",
                                width: "115px",
                                borderRadius: "4px",
                                backgroundColor: "#C6A969",
                                color: "#FFF",
                                fontFamily: "Calibri",
                                fontSize: "16px",
                                fontStyle: "normal",
                                fontWeight: 700,
                                lineHeight: "normal",
                                letterSpacing: "1px",
                                "&:hover": {
                                    backgroundColor: "#B0955B",
                                }
                            }}
                        >
                            Daybook
                        </Button>
                    </Box>



                </Box>
            </Box>
        </>
    );
};

export default ConsignmentCheckHeader;
