import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { MERGE_SPLIT_TARGET_HEADERS } from "./constants/mergeSplitHeaders";
import MergeSplitTargetTableRow from "./items/MergeSplitTargetTableRow";

const MergeSplitTargetTable = ({ rows, onUpdate, onRemove, onAddRow, sourceTotals, targetTotals, dropdownOptions, disabled = false }) => {
  const tableWidth = MERGE_SPLIT_TARGET_HEADERS.reduce((sum, h) => sum + parseInt(h.width), 0);

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    bgcolor: "#F2F2F2",
    borderBottom: "1px solid #EDEDED",
    position: "sticky",
    top: 0,
    zIndex: 2,
    height: "42px"
  };

  const headerCellStyle = {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderBottom: "1px solid #EDEDED",
    borderRight: "1px solid #EDEDED",
    fontFamily: "Calibri",
    fontSize: "14px",
    fontWeight: 600,
    color: "#343434",
    px: 1,
    textAlign: "center"
  };

  const footerStyle = {
    display: "flex",
    alignItems: "center",
    bgcolor: "#F2F2F2",
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
    borderRight: "1px solid #EDEDED",
    fontFamily: "Calibri",
    fontSize: "14px",
    fontWeight: 700,
    color: "#343434",
    px: 1,
  };

  return (
    <Box sx={{}}>
      <Box sx={{ display: "flex", alignItems: "center", gap: "24px", paddingBottom: "16px" }}>
        <Typography sx={{ fontSize: "18px", fontWeight: 700, fontFamily: "Calibri", color: "#05595B" }}>
          Merge/Split Stock
        </Typography>
        {sourceTotals.pcs > 0 && (
          <Typography sx={{ fontSize: "16px", fontFamily: "Calibri", color: targetTotals.pcs > sourceTotals.pcs ? "#B41E38" : "#666", fontWeight: 400 }}>
            {`Pcs fields are required (${targetTotals.pcs}/${sourceTotals.pcs} items)`}
          </Typography>
        )}
      </Box>

      <Box sx={{ border: "1px solid #EDEDED", borderRadius: "5px", bgcolor: "#FFF", overflow: "hidden" }}>
        {/* Horizontal Scroll Scrollable Container */}
        <Box sx={{ overflowX: "auto", "&::-webkit-scrollbar": { height: "5px" }, "&::-webkit-scrollbar-thumb": { background: "#919191", borderRadius: "5px" } }}>
          <Box sx={{ width: `${tableWidth}px` }}>
            {/* Table Header */}
            <Box sx={headerStyle}>
              {MERGE_SPLIT_TARGET_HEADERS.map((h, i) => (
                <Box key={i} sx={{
                  ...headerCellStyle,
                  width: h.width,
                  borderRight: (h.label === "Lot" || h.label.includes("Weight")) ? "1px solid #C6C6C8" : "1px solid #EDEDED"
                }}>
                  {h.label}
                </Box>
              ))}
            </Box>

            {/* Table Body - Vertical Scroll Container */}
            <Box sx={{ height: "184px", overflowY: "auto" }}>
              {rows.length === 0 ? (
                <Box sx={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#999", fontFamily: "Calibri" }}>
                  Please add items to the table above before entering details here.
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
                  />
                ))
              )}
            </Box>

            {/* Table Footer */}
            <Box sx={footerStyle}>
              {MERGE_SPLIT_TARGET_HEADERS.map((h, i) => {
                let content = "";
                if (h.label.trim() === "Pcs *") content = targetTotals.pcs;
                else if (h.label.trim() === "Weight *") content = targetTotals.weight.toFixed(3);
                else if (h.label.trim() === "Amount *") content = targetTotals.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

                return (
                  <Box key={i} sx={{
                    ...footerCellStyle,
                    width: h.width,
                    borderRight: (h.label === "Lot" || h.label.includes("Weight")) ? "1px solid #C6C6C8" : "1px solid #EDEDED"
                  }}>
                    {content}
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Add Row Button */}
      <Box sx={{ mt: 1 }}>
        <Button
          onClick={onAddRow}
          disabled={disabled}
          startIcon={<span>+</span>}
          sx={{
            textTransform: "none",
            fontSize: "14px",
            fontFamily: "Calibri",
            color: "#05595B",
            fontWeight: 600,
            "&:hover": { bgcolor: "transparent", textDecoration: "underline" }
          }}
        >
          Add Row
        </Button>
      </Box>
    </Box>
  );
};

export default MergeSplitTargetTable;
