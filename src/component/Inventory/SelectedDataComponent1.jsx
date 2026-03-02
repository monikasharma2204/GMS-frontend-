import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableContainer,
  Button,
} from "@mui/material";
import TableHeaderComponent from "./items/TableHeaderComponent";
import TableRowComponent from "./items/TableRowComponent";
import TableForTotalComponent from "./items/TableForTotalComponent";
import PurchasePUModal from "./PurchasePUModal";
import {
  useTotalsCalculation,
  useAveragePrice,
} from "./hooks/useTotalsCalculation";
import { mapPUModalData } from "./utils/rowDataUtils";
import { FIRST_SECTION_HEADERS } from "./constants/tableHeaders";

const SelectedDataComponent1 = ({
  rows,
  setRows,
  handleDelete,
  operationType = "merge", // Default to merge, will be passed from parent
  selectedRowIndex = null,
  setSelectedRowIndex = () => {},
  setOperationType = () => {},
  setIsManualAdd = () => {},
  isApproved = false,
  disabledItems = [],
  setSelectedPUItems = () => {},
  triggerFSMDirty = () => {},
  disabled = false,
}) => {
 
  // Local state for row selection as fallback
  const [localSelectedRowIndex, setLocalSelectedRowIndex] = useState(null);

  const effectiveSelectedRowIndex =
    selectedRowIndex !== null ? selectedRowIndex : localSelectedRowIndex;
  const effectiveSetSelectedRowIndex =
    selectedRowIndex !== null ? setSelectedRowIndex : setLocalSelectedRowIndex;

  // Use custom hooks for calculations
  const totals = useTotalsCalculation(rows);
  const averagePrice = useAveragePrice(rows, totals);

  // Auto-select first row when rows are added
  useEffect(() => {
    if (rows.length > 0 && effectiveSelectedRowIndex === null) {
      // Always select first row when rows are added
      setSelectedRowIndex(0); // Update parent's state
    }
  }, [rows.length, effectiveSelectedRowIndex, setSelectedRowIndex]);

  // Handle row selection
  const handleRowSelection = (rowIndex) => {
    // Always update the parent's selectedRowIndex
    setSelectedRowIndex(rowIndex);
    setIsManualAdd(false); // Reset manual add flag when Load button is clicked
  };

  // Handle data from PU modal selection
  const handleStockSubmit = (selectedStockRows, operationTypeFromModal) => {
   
    
    const newRows = mapPUModalData(selectedStockRows);
    // Check for duplicates and only add new items
    setRows((prevRows) => {
      const existingIds = new Set(prevRows.map((row) => row._id));
      const uniqueNewRows = newRows.filter((row) => !existingIds.has(row._id));

      // If no new rows to add, return existing rows
      if (uniqueNewRows.length === 0) {
        return prevRows;
      }

      // Trigger FSM dirty state when PU data is selected
      triggerFSMDirty();

      return [...prevRows, ...uniqueNewRows];
    });

    // Note: selectedPUItems is NOT updated here - rows are only added to selectedPUItems
    // when the Load is saved (in Load.jsx save handler). This ensures rows are only
    // disabled after the Load is saved, not when they're just selected.

    // Update operation type if provided
    if (operationTypeFromModal) {
      setOperationType(operationTypeFromModal);
    }
  };

  // Use predefined headers
  const headers = FIRST_SECTION_HEADERS;

  return (
    <>
      {/* Item Section Header with PU Button */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography
          sx={{
            color: "var(--HeadPage,rgb(48, 47, 47))",
            fontFamily: "Calibri",
            fontSize: "18px",
            fontStyle: "normal",
            fontWeight: 600,
            lineHeight: "normal",
          }}
        >
          Item
        </Typography>
        <PurchasePUModal handleSubmit={handleStockSubmit} disabledItems={disabledItems || []} isApproved={isApproved} disabled={disabled} />
      </Box>

      {/* Table Container */}
      <Box sx={{ display: "flex" }}>
        <TableContainer
          sx={{
            height: "200px",
            borderRight: "1px solid var(--Line-Table, #C6C6C8)",
            width: "1583px",
            bgcolor: "#FFF",
            marginTop: "10px",
              "&::-webkit-scrollbar": {
                height: "5px",
                width: "5px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#FFF",
                borderRadius: "5px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#919191",
                borderRadius: "5px",
              },
            }}
          >
          <Table stickyHeader>
              <TableHeaderComponent headers={headers} />
            <TableBody>
                {rows.map((item, index) => (
                  <TableRowComponent
                    key={index}
                    item={item || {}}
                    index={index}
                    handleDelete={handleDelete}
                  operationType={operationType}
                  selectedRowIndex={effectiveSelectedRowIndex}
                  onRowClick={handleRowSelection}
                  isApproved={isApproved}
                  />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
              </Box>

      {/* Total Amount Row */}
      <TableForTotalComponent
        totalAmount={totals.totalAmount}
        totalPcs={totals.totalPcs}
        totalWeight={totals.totalWeight}
        totalPrice={averagePrice}
      />

      {/* Load Text and Row Numbers - Always show Load text, conditionally show buttons */}

        <Box
          sx={{
            display: "flex",
              alignItems: "center",
          gap: "45px",
          marginTop: "10px",
          marginBottom: "10px",
            }}
          >
            <Typography
              sx={{
            fontSize: "18px",
            fontWeight: 600,
                fontFamily: "Calibri",
            color: "#333",
              }}
            >
          Load
            </Typography>

        {/* Show warning text in merge mode only when there are rows */}
        {operationType === "merge" && rows.length > 0 && (
          <Typography
            sx={{
              fontSize: "14px",
              fontWeight: 400,
              fontFamily: "Calibri",
              color: "#B41E38",
            }}
          >
            * You're in merge mode. The loaded data will be combined.
          </Typography>
        )}

        {/* Show buttons only in normal mode */}
        {operationType !== "merge" && rows.length > 0 && (
          <Box sx={{ display: "flex", gap: "8px" }}>
            {rows.map((_, index) => (
              <Button
                key={index}
                onClick={() => handleRowSelection(index)}
        sx={{
                  minWidth: "39px",
                  height: "39px",
                  marginBottom: "-10px",
                  padding: "0",
                  borderRadius: "3px",
                  backgroundColor:
                    effectiveSelectedRowIndex === index ? "#E0E0E0" : "#F5F5F5",
                  color: effectiveSelectedRowIndex === index ? "#000" : "#666",
                  fontFamily: "Calibri",
                  fontSize: "14px",
                  fontWeight: 600,
                  textTransform: "none",
                  // border: effectiveSelectedRowIndex === index ? "1px solid #05595B" : "1px solid #E0E0E0",
                  "&:hover": {
                    backgroundColor:
                      effectiveSelectedRowIndex === index
                        ? "#E0E0E0"
                        : "#F5F5F5", // keep same color
                  },
                }}
              >
                {index + 1}
              </Button>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
};

export default SelectedDataComponent1;
