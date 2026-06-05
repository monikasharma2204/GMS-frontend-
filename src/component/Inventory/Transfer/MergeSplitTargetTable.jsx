import React from "react";
import { Box, Typography, Button, Skeleton } from "@mui/material";
import { MERGE_SPLIT_TARGET_HEADERS } from "./constants/mergeSplitHeaders";
import MergeSplitTargetTableRow from "./items/MergeSplitTargetTableRow";

const MergeSplitTargetTable = ({ rows, onUpdate, onRemove, onAddRow, sourceTotals, targetTotals, dropdownOptions, disabled = false, showErrors = false, isLoading = false }) => {
  const tableWidth = MERGE_SPLIT_TARGET_HEADERS.reduce((sum, h) => sum + parseInt(h.width), 0);

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
    fontFamily: "Calibri",
    fontSize: "16px",
    fontWeight: 700,
    color: "#666666",
    px: 0,
    flex: "0 0 auto",
    boxSizing: "border-box",
  };


  return (
    <Box sx={{}}>
      <Box sx={{ display: "flex", alignItems: "center", gap: "24px", paddingBottom: "16px" }}>
        <Typography sx={{ lineHeight: "26px", fontSize: "18px", fontWeight: 600, fontFamily: "Calibri", color: "#333" }}>
          Merge/Split Stock
        </Typography>
        {sourceTotals.pcs > 0 && (
          <Typography sx={{ lineHeight: "normal", fontSize: "16px", fontFamily: "Calibri", color: (targetTotals.pcs > 0 && targetTotals.pcs !== sourceTotals.pcs) ? "#B41E38" : "#666", fontWeight: 400 }}>
            {`Pcs fields are required (${targetTotals.pcs}/${sourceTotals.pcs} items)`}
          </Typography>
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
              {MERGE_SPLIT_TARGET_HEADERS.map((h, i) => (
                <Box key={i} sx={{
                  ...headerCellStyle,
                  flex: "0 0 auto",
                  width: parseInt(h.width),
                  minWidth: parseInt(h.width),
                  maxWidth: parseInt(h.width),
                  boxSizing: "border-box",
                  // borderRight: (h.label.includes("Cer No.") || h.label.includes("Color") || h.label.includes("Size") || h.label.includes("Weight")) ? "1px solid #C6C6C8" : "1px solid #D9D9D9"
                }}>
                  {h.label.includes("*") ? (
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {h.label.replace("*", "")}
                      <Typography component="span" sx={{ color: "red", fontSize: "17px", fontFamily: "inherit", ml: "2px" }}>*</Typography>
                    </Box>
                  ) : h.label}
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
                    {MERGE_SPLIT_TARGET_HEADERS.map((h, j) => {
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
                  <MergeSplitTargetTableRow
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
            }}>
              {MERGE_SPLIT_TARGET_HEADERS.map((h, i) => {
                let content = "";
                const headerLabel = h.label.trim();
                const isTotalColumn = headerLabel.includes("Pcs") || headerLabel.includes("Weight") || headerLabel.includes("Amount");
                const isLabelColumn = headerLabel === "Stock ID";

                if (headerLabel === "Pcs *") content = targetTotals.pcs;
                else if (headerLabel === "Weight *") content = targetTotals.weight.toFixed(3);
                else if (headerLabel === "Amount *") content = targetTotals.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                else if (isLabelColumn) content = "Total";

                return (
                  <Box key={i} sx={{
                    ...footerCellStyle,
                    width: h.width,
                    minWidth: h.width,
                    maxWidth: h.width,
                    borderTop: "1px solid #C6C6C8",
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

      {/* Add Row Button */}
      <Box>
        <Button
          onClick={onAddRow}
          disabled={disabled}
          startIcon={<svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 8H8V13C8 13.2652 7.89464 13.5196 7.70711 13.7071C7.51957 13.8946 7.26522 14 7 14C6.73478 14 6.48043 13.8946 6.29289 13.7071C6.10536 13.5196 6 13.2652 6 13V8H1C0.734784 8 0.48043 7.89464 0.292893 7.70711C0.105357 7.51957 0 7.26522 0 7C0 6.73478 0.105357 6.48043 0.292893 6.29289C0.48043 6.10536 0.734784 6 1 6H6V1C6 0.734784 6.10536 0.480429 6.29289 0.292893C6.48043 0.105357 6.73478 0 7 0C7.26522 0 7.51957 0.105357 7.70711 0.292893C7.89464 0.480429 8 0.734784 8 1V6H13C13.2652 6 13.5196 6.10536 13.7071 6.29289C13.8946 6.48043 14 6.73478 14 7C14 7.26522 13.8946 7.51957 13.7071 7.70711C13.5196 7.89464 13.2652 8 13 8Z" fill="currentColor" />
          </svg>
          }
          sx={{
            textTransform: "none",
            fontSize: "18px",
            lineHeight: "normal",
            fontFamily: "Calibri",
            color: "#1B84FF",
            fontWeight: 700,
            paddingLeft: 0,
          }}
        >
          Add Row
        </Button>
      </Box>
    </Box >
  );
};

export default MergeSplitTargetTable;
