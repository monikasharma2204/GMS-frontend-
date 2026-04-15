import React from "react";
import { Box, Typography, Table, TableBody, TableContainer, Paper, Button, TableHead, TableCell, TableRow, TableFooter, Skeleton } from "@mui/material";
import { LOCATION_TRANSFER_SOURCE_HEADERS } from "./constants/locationTransferHeaders";
import LocationTransferSourceTableRow from "./items/LocationTransferSourceTableRow";

const LocationTransferSourceTable = ({ rows, onRemove, onStockClick, onSearchClick, onUpdate, totals, disabled = false, isLoading = false }) => {
  const tableWidth = LOCATION_TRANSFER_SOURCE_HEADERS.reduce((sum, h) => sum + parseInt(h.width || "100"), 0);

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    bgcolor: "#F2F2F2",
    borderBottom: "1px solid #EDEDED",
    position: "sticky",
    top: 0,
    zIndex: 2,
    height: "32px",
    minHeight: "32px",
    maxHeight: "32px",
    padding: 0
  };

  const headerCellStyle = {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderBottom: "1px solid #EDEDED",
    fontFamily: "Calibri",
    fontSize: "14px",
    fontWeight: 700,
    color: "#343434",
    px: "8px",
    lineHeight: "1",
    textAlign: "center"
  };

  const footerStyle = {
    display: "flex",
    alignItems: "center",
    bgcolor: "#FFFFFF",
    height: "38px",
    position: "sticky",
    bottom: 0,
    zIndex: 1
  };

  const footerCellStyle = {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderTop: "1px solid #EDEDED",
    fontFamily: "Calibri",
    fontSize: "16px",
    fontWeight: 700,
    color: "#666666",
    px: 1,
    flex: "0 0 auto",
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <Box sx={{ width: "100%", display: "flex", alignItems: "center", gap: "16px", justifyContent: "space-between", flexDirection: "row" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Typography sx={{ lineHeight: "normal", fontSize: "20px", fontWeight: 700, fontFamily: "Calibri", color: "#05595B" }}>
              Item
            </Typography>
            <Button
              variant="contained"
              size="small"
              onClick={onStockClick}
              disabled={disabled}
              sx={{
                lineHeight: "normal",
                fontFamily: "Calibri",
                width: "96px",
                fontSize: "14px",
                fontWeight: "400",
                height: "24px",
                bgcolor: "#000",
                color: "#FFF",
                textTransform: "none",
                borderRadius: "4px",

                "&:hover": {
                  bgcolor: "#000",
                  boxShadow: "none"
                }
              }}
            >
              Stock
            </Button>
          </Box>



          <Box sx={{ display: "flex", gap: "16px" }}>
            <Box onClick={onSearchClick} sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.9963 21L16.6562 16.66L20.9963 21Z" fill="#666666" />
                <path d="M20.9963 21L16.6562 16.66" stroke="#666666" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#666666" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </Box>


            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.5 20C5.5 20.1427 5.452 20.2617 5.356 20.357C5.26 20.4523 5.14134 20.5 5 20.5H2.308C2.07934 20.5 1.88734 20.4227 1.732 20.268C1.57667 20.1133 1.49934 19.9213 1.5 19.692V17C1.5 16.858 1.548 16.7393 1.644 16.644C1.74 16.5487 1.859 16.5007 2.001 16.5C2.143 16.4993 2.26167 16.5473 2.357 16.644C2.45234 16.7407 2.5 16.8593 2.5 17V19.5H5C5.142 19.5 5.26067 19.548 5.356 19.644C5.45134 19.74 5.49934 19.858 5.5 20ZM22 16.5C22.1427 16.5 22.2617 16.548 22.357 16.644C22.4523 16.74 22.5 16.8587 22.5 17V19.692C22.5 19.9213 22.4227 20.1133 22.268 20.268C22.1133 20.4227 21.9213 20.5 21.692 20.5H19C18.858 20.5 18.7393 20.452 18.644 20.356C18.5487 20.26 18.5007 20.141 18.5 19.999C18.4993 19.857 18.5473 19.7383 18.644 19.643C18.7407 19.5477 18.8593 19.5 19 19.5H21.5V17C21.5 16.858 21.548 16.7393 21.644 16.644C21.74 16.5487 21.858 16.5007 22 16.5ZM4.404 18C4.296 18 4.20167 17.9597 4.121 17.879C4.04034 17.7983 4 17.704 4 17.596V6.404C4 6.296 4.04034 6.20167 4.121 6.121C4.20167 6.04034 4.296 6 4.404 6H5.596C5.704 6 5.79834 6.04034 5.879 6.121C5.95967 6.20167 6 6.296 6 6.404V17.596C6 17.704 5.95967 17.7983 5.879 17.879C5.79834 17.9597 5.704 18 5.596 18H4.404ZM7.5 18C7.36667 18 7.25 17.95 7.15 17.85C7.05 17.75 7 17.6333 7 17.5V6.5C7 6.36667 7.05 6.25 7.15 6.15C7.25 6.05 7.36667 6 7.5 6C7.63334 6 7.75 6.05 7.85 6.15C7.95 6.25 8 6.36667 8 6.5V17.5C8 17.6333 7.95 17.75 7.85 17.85C7.75 17.95 7.63334 18 7.5 18ZM10.404 18C10.296 18 10.2017 17.9597 10.121 17.879C10.0403 17.7983 10 17.704 10 17.596V6.404C10 6.296 10.0403 6.20167 10.121 6.121C10.2017 6.04034 10.296 6 10.404 6H11.596C11.704 6 11.7983 6.04034 11.879 6.121C11.9597 6.20167 12 6.296 12 6.404V17.596C12 17.704 11.9597 17.7983 11.879 17.879C11.7983 17.9597 11.704 18 11.596 18H10.404ZM13.404 18C13.296 18 13.2017 17.9597 13.121 17.879C13.0403 17.7983 13 17.704 13 17.596V6.404C13 6.296 13.0403 6.20167 13.121 6.121C13.2017 6.04034 13.296 6 13.404 6H15.596C15.704 6 15.7983 6.04034 15.879 6.121C15.9597 6.20167 16 6.296 16 6.404V17.596C16 17.704 15.9597 17.7983 15.879 17.879C15.7983 17.9597 15.704 18 15.596 18H13.404ZM17.5 18C17.3667 18 17.25 17.95 17.15 17.85C17.05 17.75 17 17.6333 17 17.5V6.5C17 6.36667 17.05 6.25 17.15 6.15C17.25 6.05 17.3667 6 17.5 6C17.6333 6 17.75 6.05 17.85 6.15C17.95 6.25 18 6.36667 18 6.5V17.5C18 17.6333 17.95 17.75 17.85 17.85C17.75 17.95 17.6333 18 17.5 18ZM19.5 18C19.3667 18 19.25 17.95 19.15 17.85C19.05 17.75 19 17.6333 19 17.5V6.5C19 6.36667 19.05 6.25 19.15 6.15C19.25 6.05 19.3667 6 19.5 6C19.6333 6 19.75 6.05 19.85 6.15C19.95 6.25 20 6.36667 20 6.5V17.5C20 17.6333 19.95 17.75 19.85 17.85C19.75 17.95 19.6333 18 19.5 18ZM5.5 4C5.5 4.14267 5.452 4.26167 5.356 4.357C5.26 4.45234 5.14134 4.5 5 4.5H2.5V7C2.5 7.142 2.452 7.26067 2.356 7.356C2.26 7.45134 2.141 7.49934 1.999 7.5C1.857 7.50067 1.73834 7.45267 1.643 7.356C1.54767 7.25934 1.5 7.14067 1.5 7V4.308C1.5 4.07934 1.57734 3.88734 1.732 3.732C1.88667 3.57667 2.07867 3.49934 2.308 3.5H5C5.142 3.5 5.26067 3.548 5.356 3.644C5.45134 3.74 5.49934 3.858 5.5 4ZM18.5 3.999C18.5 3.857 18.548 3.73834 18.644 3.643C18.74 3.54767 18.8587 3.5 19 3.5H21.692C21.9213 3.5 22.1133 3.57734 22.268 3.732C22.4227 3.88667 22.5 4.07867 22.5 4.308V7C22.5 7.142 22.452 7.26067 22.356 7.356C22.26 7.45134 22.141 7.49934 21.999 7.5C21.857 7.50067 21.7383 7.45267 21.643 7.356C21.5477 7.25934 21.5 7.14067 21.5 7V4.5H19C18.858 4.5 18.7393 4.452 18.644 4.356C18.5487 4.26 18.5007 4.141 18.5 3.999Z" fill="#666666" />
            </svg>


          </Box>
        </Box>
      </Box>

      <Box sx={{ border: "1px solid #EDEDED", borderRadius: "5px", bgcolor: "#FFF", overflow: "hidden" }}>
        <Box
          sx={{
            overflowX: "auto",
            overflowY: "hidden",
            maxWidth: "100%",
            "&::-webkit-scrollbar": { height: "6px" },
            "&::-webkit-scrollbar-thumb": {
              background: "#919191",
              borderRadius: "5px"
            }
          }}>
          <Box sx={{ width: `${tableWidth}px` }}>
            {/* Table Header */}
            <Box sx={headerStyle}>
              {LOCATION_TRANSFER_SOURCE_HEADERS.map((h, i) => (
                <Box key={i} sx={{
                  ...headerCellStyle,
                  flex: "0 0 auto",
                  width: h.width,
                  minWidth: h.width,
                  maxWidth: h.width,
                  boxSizing: "border-box",
                  borderRight: (h.label === "Weight" || h.label === "Cer No.") ? "1px solid #C6C6C8" : "1px solid #EDEDED"
                }}>
                  {h.label}
                </Box>
              ))}
            </Box>

            {/* Table Body */}
            <Box sx={{
              height: "114px",
              overflowY: "auto",
              overflowX: "hidden",


              scrollbarWidth: "none",
              msOverflowStyle: "none",
              "&::-webkit-scrollbar": {
                display: "none"
              }
            }}>
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <Box key={i} sx={{ display: "flex", alignItems: "center", height: "38px", borderBottom: "1px solid #EDEDED" }}>
                    {LOCATION_TRANSFER_SOURCE_HEADERS.map((h, j) => {
                      let sw = 72;
                      const label = h.label.trim();
                      if (label === "") sw = 18;
                      else if (label === "#" || label === "Img") sw = 16;
                      else if (["Stock ID", "Cer No.", "Cer Type", "Weight", "Color", "Cutting", "Quality", "Clarity"].includes(label)) sw = 72;
                      else if (["Stone Code", "Stone", "Shape", "Location", "Price", "Amount"].includes(label)) sw = 96;
                      else if (["Lot", "Pcs", "Unit"].includes(label)) sw = 56;
                      else if (label === "Size") sw = 112;
                      else if (label === "Remark") sw = 150;
                      else sw = 72;

                      return (
                        <Box key={j} sx={{
                          width: h.width,
                          minWidth: h.width,
                          maxWidth: h.width,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          px: 1
                        }}>
                          <Skeleton
                            variant="rounded"
                            width={sw}
                            height={24}
                            sx={{
                              borderRadius: "20px",
                              background: "linear-gradient(270deg, rgba(243, 243, 243, 0.05) 0%, #DBDBDB 50%)",
                              animation: "pulse 1.5s ease-in-out infinite"
                            }}
                          />
                        </Box>
                      );
                    })}
                  </Box>
                ))
              ) : rows.length === 0 ? (
                <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#999", fontFamily: "Calibri", textAlign: "center", px: 2 }}>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", }}>
                    <Box>  <svg width="47" height="36" viewBox="0 0 47 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M46.5 13.1653L36.354 1.74866C35.867 0.970482 35.156 0.5 34.407 0.5H12.593C11.844 0.5 11.133 0.970482 10.646 1.74767L0.5 13.1663V22.3367H46.5V13.1653Z" stroke="#D9D9D9" />
                      <path d="M33.113 16.3128C33.113 14.7197 34.107 13.4046 35.34 13.4036H46.5V31.4059C46.5 33.5132 45.18 35.2402 43.55 35.2402H3.45C1.82 35.2402 0.5 33.5122 0.5 31.4059V13.4036H11.66C12.893 13.4036 13.887 14.7167 13.887 16.3098V16.3317C13.887 17.9248 14.892 19.2111 16.124 19.2111H30.876C32.108 19.2111 33.113 17.9128 33.113 16.3198V16.3128Z" fill="#FAFAFA" stroke="#D9D9D9" />
                    </svg>
                    </Box>
                    <Typography sx={{ marginTop: "10px", marginBottom: "5px", fontWeight: 700, fontSize: "16px", fontFamily: "Calibri", color: "#343434" }}>No data</Typography>
                    <Typography
                      sx={{
                        fontSize: "12px",
                        fontFamily: "Calibri",
                        color: "#9A9A9A",
                        fontWeight: 700,
                      }}
                    >
                      Please add items by clicking on{" "}
                      <Box component="span" sx={{ lineHeight: "normal", fontWeight: 700, color: "#666666", fontSize: "12px", fontFamily: "Calibri" }}>
                        "Stock"
                      </Box>{" "}
                      button
                    </Typography>
                  </Box>
                </Box>
              ) : (
                rows.map((row, idx) => (
                  <LocationTransferSourceTableRow key={row.id || idx} item={row} index={idx} onRemove={onRemove} disabled={disabled} onUpdate={onUpdate} />
                ))
              )}
            </Box>

            {/* Table Footer */}
            <Box sx={{
              ...footerStyle,
              borderTop: isLoading ? "none" : footerStyle.borderTop,
            }}>
              {LOCATION_TRANSFER_SOURCE_HEADERS.map((h, i) => {
                let content = "";
                if (h.label === "Pcs") content = totals.pcs;
                else if (h.label === "Weight") content = totals.weight.toFixed(3);
                else if (h.label === "Amount") content = totals.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

                return (
                  <Box key={i} sx={{
                    ...footerCellStyle,
                    width: h.width,
                    minWidth: h.width,
                    maxWidth: h.width,
                    borderTop: isLoading ? "none" : footerCellStyle.borderTop,
                    borderBottom: isLoading ? "1px solid #EDEDED" : "none",
                  }}>
                    {isLoading ? (
                      (() => {
                        let sw = 72;
                        const label = h.label.trim();
                        if (label === "") sw = 18;
                        else if (label === "#" || label === "Img") sw = 16;
                        else if (["Stock ID", "Cer No.", "Cer Type", "Weight", "Color", "Cutting", "Quality", "Clarity"].includes(label)) sw = 72;
                        else if (["Stone Code", "Stone", "Shape", "Location", "Price", "Amount"].includes(label)) sw = 96;
                        else if (["Lot", "Pcs", "Unit"].includes(label)) sw = 56;
                        else if (label === "Size") sw = 112;
                        else if (label === "Remark") sw = 150;
                        else sw = 72;
                        return (
                          <Skeleton
                            variant="rounded"
                            width={sw}
                            height={24}
                            sx={{
                              borderRadius: "20px",
                              background: "linear-gradient(270deg, rgba(243, 243, 243, 0.05) 0%, #DBDBDB 50%)",
                              animation: "pulse 1.5s ease-in-out infinite"
                            }}
                          />
                        );
                      })()
                    ) : content}
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box >
  );
};

export default LocationTransferSourceTable;
