import React from "react";
import { Box, Typography, Button, Skeleton } from "@mui/material";
import { LOCATION_TRANSFER_TARGET_HEADERS } from "./constants/locationTransferHeaders";
import LocationTransferTargetTableRow from "./items/LocationTransferTargetTableRow";

const LocationTransferTargetTable = ({ rows, onUpdate, onRemove, onAddRow, activeBatchIndex, setActiveBatchIndex, sourceRows = [], dropdownOptions, disabled = false, showErrors = false, isLoading = false }) => {
  const tableWidth = LOCATION_TRANSFER_TARGET_HEADERS.reduce((sum, h) => sum + parseInt(h.width), 0);

  const totals = React.useMemo(() => ({
    pcs: rows.reduce((sum, row) => sum + (Number(row.pcs) || 0), 0),
    weight: rows.reduce((sum, row) => sum + (Number(row.weight) || 0), 0),
    amount: rows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0)
  }), [rows]);

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    bgcolor: "#EDEDED",
    position: "sticky",
    top: 0,
    zIndex: 2,
    height: "42px",
    minHeight: "42px",
    maxHeight: "42px",
    padding: 0
  };

  const headerCellStyle = {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Calibri",
    fontSize: "16px",
    fontWeight: 700,
    color: "#343434",
    px: 0,
    padding: 0,
    lineHeight: "1",
    textAlign: "center"
  };

  const footerStyle = {
    display: "flex",
    alignItems: "center",
    bgcolor: "#FFFFFF",
    height: "42px",
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
    px: 0,
    flex: "0 0 auto",
    boxSizing: "border-box"
  };


  return (
    <Box sx={{}}>
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        mb: "16px"
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Typography sx={{ color: "#33", fontFamily: "Calibri", fontSize: "18px", fontWeight: 600 }}>
            Location Transfer
          </Typography>
          {sourceRows.length > 0 && (
            <Typography sx={{
              color: (showErrors && rows.reduce((sum, r) => sum + (Number(r.pcs) || 0), 0) !== Number(sourceRows[activeBatchIndex]?.pcs)) ? "#B41E38" : "#9A9A9A",
              fontFamily: "Calibri",
              fontSize: "14px",
              fontWeight: 400
            }}>
              Pcs fields are required ({rows.reduce((sum, r) => sum + (Number(r.pcs) || 0), 0)}/{sourceRows[activeBatchIndex]?.pcs} items)
            </Typography>
          )}
        </Box>

        {/* Batch Tabs */}
        {sourceRows.length > 0 && (
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Typography sx={{ color: "#333", fontFamily: "Calibri", fontSize: "18px", fontWeight: 600 }}>
              Batch :
            </Typography>
            <Box sx={{ display: "flex", gap: "8px" }}>
              {sourceRows.map((_, idx) => (
                <Button
                  key={idx}
                  onClick={() => setActiveBatchIndex(idx)}
                  sx={{
                    minWidth: "39px",
                    height: "39px",
                    padding: "0",
                    borderRadius: "3px",
                    backgroundColor: activeBatchIndex === idx ? "#E0E0E0" : "#F5F5F5",
                    color: activeBatchIndex === idx ? "#000" : "#666",
                    fontFamily: "Calibri",
                    fontSize: "14px",
                    fontWeight: 600,
                    textTransform: "none",
                    transition: "all 0.2s",
                    "&:hover": {
                      backgroundColor: activeBatchIndex === idx ? "#E0E0E0" : "#E8E8E8",
                    },
                  }}
                >
                  {idx + 1}
                </Button>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      <Box sx={{ border: "1px solid #C6C6C8", borderRadius: "5px", bgcolor: "#FFF", overflow: "hidden" }}>
        {/* Horizontal Scroll Scrollable Container */}
        <Box sx={{
          overflowX: "auto",
          overflowY: "hidden",

          "&::-webkit-scrollbar": {
            height: "6px"
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#919191",
            borderRadius: "5px"
          }
        }}>
          <Box sx={{ width: `${tableWidth}px` }}>
            {/* Table Header */}
            <Box sx={headerStyle}>
              {LOCATION_TRANSFER_TARGET_HEADERS.map((h, i) => (
                <Box key={i} sx={{
                  ...headerCellStyle,
                  flex: "0 0 auto",
                  width: parseInt(h.width),
                  minWidth: parseInt(h.width),
                  maxWidth: parseInt(h.width),
                  boxSizing: "border-box",
                  // borderRight: (h.label.includes("Cer No.") || h.label.includes("Color") || h.label.includes("Size") || h.label.includes("Weight")) ? "1px solid #C6C6C8" : "1px solid #D9D9D9"
                }}>
                  {h.label}
                </Box>
              ))}
            </Box>

            {/* Table Body - Vertical Scroll Container */}
            <Box sx={{
              height: "168px",
              overflowY: "auto",
              overflowX: "hidden",
              scrollbarWidth: "none",
              msOverflowStyle: "none",

              "&::-webkit-scrollbar": {
                width: "0px",
                height: "0px"
              }
            }}>
              {isLoading ? (
                [...Array(4)].map((_, i) => (
                  <Box key={i} sx={{ display: "flex", alignItems: "center", height: "42px", bgcolor: i % 2 === 0 ? "#F8F8F8" : "#FFF" }}>
                    {LOCATION_TRANSFER_TARGET_HEADERS.map((h, j) => {
                      let sw = 72;
                      const label = h.label.trim().replace(" *", "");
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
                          width: parseInt(h.width),
                          minWidth: parseInt(h.width),
                          maxWidth: parseInt(h.width),
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
                <Box sx={{ fontSize: "14px", fontWeight: 400, lineHeight: "normal", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#999", fontFamily: "Calibri" }}>

                </Box>
              ) : (
                rows.map((row, idx) => (
                  <LocationTransferTargetTableRow
                    key={row.id || idx}
                    item={row}
                    index={idx}
                    onUpdate={onUpdate}
                    onRemove={onRemove}
                    dropdownOptions={dropdownOptions}
                    disabled={disabled}
                    showErrors={showErrors}
                  />
                ))
              )}
            </Box>

            {/* Table Footer */}
            <Box sx={{
              ...footerStyle,
              borderTop: isLoading ? "none" : footerStyle.borderTop
            }}>
              {LOCATION_TRANSFER_TARGET_HEADERS.map((h, i) => {
                let content = "";
                const label = h.label.trim();
                if (label.includes("Pcs")) content = totals.pcs || "0";
                else if (label.includes("Weight")) content = (totals.weight || 0).toFixed(3);
                else if (label.includes("Amount")) content = (totals.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

                return (
                  <Box key={i} sx={{
                    ...footerCellStyle,
                    width: h.width,
                    minWidth: h.width,
                    maxWidth: h.width,
                    borderTop: isLoading ? "none" : "1px solid #C6C6C8",
                    borderBottom: isLoading ? "1px solid #EDEDED" : "none",
                  }}>
                    {isLoading ? (
                      (() => {
                        let sw = 72;
                        const label = h.label.trim().replace(" *", "");
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

      <Box sx={{ display: "flex", justifyContent: "flex-start", marginTop: "11px" }}>
        <Button
          onClick={onAddRow}
          disabled={disabled}
          sx={{
            display: "flex",
            cursor: "pointer",
            textTransform: "none",
            padding: 0,
            "&:hover": { bgcolor: "transparent" }
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 12.9961H13V17.9961C13 18.2613 12.8946 18.5157 12.7071 18.7032C12.5196 18.8907 12.2652 18.9961 12 18.9961C11.7348 18.9961 11.4804 18.8907 11.2929 18.7032C11.1054 18.5157 11 18.2613 11 17.9961V12.9961H6C5.73478 12.9961 5.48043 12.8907 5.29289 12.7032C5.10536 12.5157 5 12.2613 5 11.9961C5 11.7309 5.10536 11.4765 5.29289 11.289C5.48043 11.1015 5.73478 10.9961 6 10.9961H11V5.99609C11 5.73088 11.1054 5.47652 11.2929 5.28899C11.4804 5.10145 11.7348 4.99609 12 4.99609C12.2652 4.99609 12.5196 5.10145 12.7071 5.28899C12.8946 5.47652 13 5.73088 13 5.99609V10.9961H18C18.2652 10.9961 18.5196 11.1015 18.7071 11.289C18.8946 11.4765 19 11.7309 19 11.9961C19 12.2613 18.8946 12.5157 18.7071 12.7032C18.5196 12.8907 18.2652 12.9961 18 12.9961Z" fill="#1B84FF" />
          </svg>
          <Typography
            sx={{
              color: "#1B84FF",
              fontFamily: "Calibri",
              fontSize: "18px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "normal",
              marginLeft: "4px"
            }}
          >
            Add Row
          </Typography>
        </Button>
      </Box>
    </Box >
  );
};

export default LocationTransferTargetTable;
