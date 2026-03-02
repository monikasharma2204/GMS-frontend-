import React, { useEffect, useMemo } from "react";
import { Box } from "@mui/material";
import TableHeaderComponent from "./items2/TableHeaderComponent";
import TableForTotalComponent from "./items2/TableForTotalComponent";
import TableRowComponent from "./items2/TableRowComponent";
import AddRowButtonComponent from "./items2/AddRowButtonComponent";
import { editMemoState } from "recoil/Load/MemoState.js";
import { useRecoilValue } from "recoil";
import { useDropdownOptions } from "./hooks/useDropdownOptions";
import { createMappedRowData, createCombinedRow } from "./utils/rowDataUtils";
import { SECOND_SECTION_HEADERS } from "./constants/tableHeaders";

const SelectedDataComponent2 = React.forwardRef(({
  state,
  handleNumberChange,
  handleSelectChange,
  onRemarkChange,
  calculateAmount,
  handleAddRow,
  handleDelete,
  formatNumberWithCommas,
  onLotChange,
  onStoneChange,
  onChange,
  rows,
  setRows,
  remark,
  firstSectionRows = [],
  selectedRowIndex = null,
  operationType = "merge",
  setSelectedRowIndex = () => {},
  setOperationType = () => {},
  isManualAdd = false,
  setIsManualAdd = () => {},
  isFromDayBook = false,
  isApproved = false,
  isEditMode = false,
  disabled = false,
  fsmState = "initial",
}, ref) => {
  const { dropdownOptions } = useDropdownOptions();
  const editMemoStatus = useRecoilValue(editMemoState);

  const [displayRows, setDisplayRows] = React.useState([]);
  const [allLoadItems, setAllLoadItems] = React.useState([]);
  const [isManuallyEdited, setIsManuallyEdited] = React.useState(false);
  const [isDaybookInitialized, setIsDaybookInitialized] = React.useState(false);
  const prevSelectedRowIndexRef = React.useRef(selectedRowIndex);
  

  const wrappedHandleDelete = React.useCallback((id) => {
    if (operationType === "normal" && selectedRowIndex !== null) {
      setAllLoadItems(prev => {
        const updated = [...prev];
        const tabRows = updated[selectedRowIndex];
        if (Array.isArray(tabRows)) {
          updated[selectedRowIndex] = tabRows.filter(r => r._id !== id);
        }
        return updated;
      });
      setDisplayRows(prev => prev.filter(r => r._id !== id));
    } else if (operationType === "merge") {
      setDisplayRows(prev => prev.filter(r => r._id !== id));
      setRows(prev => prev.filter(r => r._id !== id));
      setIsManuallyEdited(true);
    }

    handleDelete(id);
  }, [handleDelete, operationType, selectedRowIndex, setRows]);


  const wrappedSetDisplayRows = React.useCallback((updaterOrValue) => {
    if (operationType === "normal" && selectedRowIndex !== null && !isFromDayBook) {
      setDisplayRows(prevDisplay => {
        const newDisplay = typeof updaterOrValue === 'function' ? updaterOrValue(prevDisplay) : updaterOrValue;
        setAllLoadItems(prev => {
          const updated = [...prev];
          updated[selectedRowIndex] = newDisplay;
          return updated;
        });
        
        return newDisplay;
      });
    } else {
      setDisplayRows(updaterOrValue);
    }
  }, [operationType, selectedRowIndex, isFromDayBook]);


  const wrappedHandleAddRow = React.useCallback(() => {
    if (isFromDayBook && operationType === "normal" && selectedRowIndex !== null) {
      const selectedPUData = firstSectionRows[selectedRowIndex];
      if (!selectedPUData) {
        alert("Please select a PU row first by clicking on the numbered buttons in the first section.");
        return;
      }

      const newRow = {
        _id: `load-row-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        pic: "",
        pu_id: selectedPUData?.pu_id || "",
        pu_item_id: selectedPUData?.pu_item_id || "",
        pu_no: selectedPUData?.invoice_no || selectedPUData?.pu_no || "",
        stone_code: "",
        location: "",
        stone: "",
        shape: "",
        size: "",
        color: "",
        cutting: "",
        quality: "",
        clarity: "",
        cer_type: "",
        cer_no: "",
        lot_no: "",
        pcs: "",
        weight: selectedPUData?.weight || "",
        price: selectedPUData?.price || "",
        unit: selectedPUData?.unit || "",
        amount: selectedPUData?.amount || "",
        remark: "",
        totalAmount: selectedPUData?.totalAmount || selectedPUData?.amount || "",
        stock_price: "",
        stock_unit: "",
        stock_amount: 0,
        sale_price: "",
        sale_unit: "",
        sale_amount: 0,
      };

     
      setAllLoadItems(prev => {
        const updated = [...prev];
        const currentTabRows = Array.isArray(updated[selectedRowIndex]) ? updated[selectedRowIndex] : [];
        updated[selectedRowIndex] = [...currentTabRows, newRow];
        return updated;
      });

      setDisplayRows(prev => [...prev, newRow]);
    } else {
      handleAddRow();
    }
  }, [isFromDayBook, operationType, selectedRowIndex, firstSectionRows, handleAddRow]);
  
 
  React.useImperativeHandle(ref, () => ({
    getAllLoadItems: () => {
  
      if (operationType === "merge") {
        return displayRows || [];
      }
   
      if (!Array.isArray(allLoadItems)) return [];
      const flattened = [];
      for (const entry of allLoadItems) {
        if (!entry) continue;
        
        if (Array.isArray(entry)) {
          flattened.push(...entry.filter(Boolean));
        } else if (entry && typeof entry === 'object') {
          
          flattened.push(entry);
        }
      }
      return flattened;
    },
    setAllLoadItems: setAllLoadItems
  }));
  
  
  const handleLoadItemChange = (index, field, value) => {
    if (operationType === "normal" && selectedRowIndex !== null) {
     
      setAllLoadItems(prev => {
        const updated = [...prev];
        const tabRows = updated[selectedRowIndex];
        
        if (Array.isArray(tabRows)) {
    
          const updatedTabRows = [...tabRows];
          if (updatedTabRows[index]) {
            updatedTabRows[index] = {
              ...updatedTabRows[index],
              [field]: value
            };
          }
          updated[selectedRowIndex] = updatedTabRows;
        } else if (tabRows) {
         
          updated[selectedRowIndex] = {
            ...tabRows,
            [field]: value
          };
        }
       
        return updated;
      });
      
      
      setDisplayRows(prevRows => {
        const updatedRows = [...prevRows];
        if (updatedRows[index]) {
          updatedRows[index] = {
            ...updatedRows[index],
            [field]: value
          };
        }
        return updatedRows;
      });
    
      return;
    }
    
    
    if (operationType === "merge") {
      setIsManuallyEdited(true);
     
      setRows(prevRows => {
        const updatedRows = [...prevRows];
        if (updatedRows[index]) {
          updatedRows[index] = {
            ...updatedRows[index],
            [field]: value
          };
        }
        return updatedRows;
      });
      setDisplayRows(prevRows => {
        const updatedRows = [...prevRows];
        if (updatedRows[index]) {
          updatedRows[index] = {
            ...updatedRows[index],
            [field]: value
          };
        }
        return updatedRows;
      });
     
      return;
    }
    
    // Call the original onChange for other cases
    onChange(index, field, value);
  };

  const mappedRowData = useMemo(() => {
    if (
      firstSectionRows.length > 0 &&
      selectedRowIndex !== null &&
      selectedRowIndex < firstSectionRows.length
    ) {
      const sourceRow = firstSectionRows[selectedRowIndex];
      return sourceRow ? createMappedRowData(sourceRow) : null;
    }
    return null;
  }, [firstSectionRows, selectedRowIndex]);


  
  useEffect(() => {
    if (operationType === "normal" && firstSectionRows.length > 0 && !isFromDayBook) {
      const isViewMode = fsmState === "saved";
      
      if (isViewMode && rows && rows.length > 0) {
        console.log('[SelectedDataComponent2] View mode - Grouping load items');
        console.log('[SelectedDataComponent2] Total rows received:', rows.length);
        console.log('[SelectedDataComponent2] FirstSectionRows count:', firstSectionRows.length);
        console.log('[SelectedDataComponent2] Sample rows:', rows.slice(0, 2));
        console.log('[SelectedDataComponent2] All rows pu_item_ids:', rows.map(r => r.pu_item_id));
        
        // CRITICAL: In view mode, rows should contain ALL load items, not just current tab
        // If we only have 1 row but firstSectionRows has 2, something is wrong
        if (rows.length < firstSectionRows.length) {
          console.warn(`[SelectedDataComponent2] WARNING: Only received ${rows.length} rows but have ${firstSectionRows.length} PU items. This indicates rows prop was overwritten.`);
        }
        
        const groupedByPU = {};
        rows.forEach((loadItem) => {
          const key = loadItem.pu_item_id || loadItem.pu_id || loadItem.pu_item_ref || loadItem.pu_no;
          if (!groupedByPU[key]) groupedByPU[key] = [];
          groupedByPU[key].push(loadItem);
        });

        console.log('[SelectedDataComponent2] Grouped by PU:', Object.keys(groupedByPU).map(k => `${k}: ${groupedByPU[k].length} items`));
        console.log('[SelectedDataComponent2] All PU keys in groupedByPU:', Object.keys(groupedByPU));
        console.log('[SelectedDataComponent2] FirstSectionRows pu_item_ids:', firstSectionRows.map(r => r.pu_item_id || r.pu_id));

        const organizedLoadItems = [];
        const usedKeys = new Set();
        const allKeys = Object.keys(groupedByPU);

        for (let idx = 0; idx < firstSectionRows.length; idx++) {
          const puItem = firstSectionRows[idx];
          let itemsForTab = [];

          
          const puItemKey = puItem?.pu_item_id || puItem?.pu_id;
          if (puItemKey && groupedByPU[puItemKey] && !usedKeys.has(puItemKey)) {
            itemsForTab = groupedByPU[puItemKey];
            usedKeys.add(puItemKey);
            console.log(`[SelectedDataComponent2] Tab ${idx}: Matched ${itemsForTab.length} items for pu_item_id ${puItemKey}`);
          } else {
        
            for (const key of allKeys) {
              if (!usedKeys.has(key)) {
                itemsForTab = groupedByPU[key] || [];
                usedKeys.add(key);
                console.log(`[SelectedDataComponent2] Tab ${idx}: Assigned ${itemsForTab.length} items from key ${key} (fallback)`);
                break;
              }
            }
          }

          organizedLoadItems.push(itemsForTab);
        }

        console.log('[SelectedDataComponent2] Organized load items:', organizedLoadItems.map((arr, idx) => `Tab ${idx}: ${arr.length} items`));
        setAllLoadItems(organizedLoadItems);
      } else {
        // Add mode: Initialize from firstSectionRows (create mapped row data)
        setAllLoadItems(prev => {
          const newLoadItems = firstSectionRows.map((puItem, index) => {
            const existingItem = prev[index];
            if (existingItem && Array.isArray(existingItem) && existingItem.length > 0) {
              // Preserve existing load items for this PU tab
              return existingItem;
            } else if (existingItem && !Array.isArray(existingItem)) {
              // Convert single object to array format
              return [existingItem];
            } else {
              
              return createMappedRowData(puItem);
            }
          });
          return newLoadItems;
        });
      }
      
      if (selectedRowIndex === null) {
        setSelectedRowIndex(0);
      }
    }
  }, [firstSectionRows, operationType, isFromDayBook, rows, selectedRowIndex, setSelectedRowIndex, fsmState]);

 
  useEffect(() => {
    if (
      operationType === "normal" &&
      selectedRowIndex === null &&
      firstSectionRows.length > 0 &&
      !isFromDayBook
    ) {
      setSelectedRowIndex(0);
    }
  }, [operationType, selectedRowIndex, firstSectionRows.length, isFromDayBook, setSelectedRowIndex]);

  
  useEffect(() => {
    if (isFromDayBook && rows && rows.length > 0 && firstSectionRows.length > 0 && !isDaybookInitialized) {
      const groupedByPU = {};
      
      rows.forEach(loadItem => {
        const key = loadItem.pu_item_id;
        if (!groupedByPU[key]) {
          groupedByPU[key] = [];
        }
        groupedByPU[key].push(loadItem);
      });
      
      const allGroupKeys = Object.keys(groupedByPU);
      const usedGroupKeys = new Set(); 
      const organizedLoadItems = [];
      
      for (let idx = 0; idx < firstSectionRows.length; idx++) {
        const puItem = firstSectionRows[idx];
        let itemsForThisTab = [];
        
        if (puItem.pu_item_id && groupedByPU[puItem.pu_item_id] && !usedGroupKeys.has(puItem.pu_item_id)) {
          itemsForThisTab = groupedByPU[puItem.pu_item_id];
          usedGroupKeys.add(puItem.pu_item_id);
        } else {
      
          for (const key of allGroupKeys) {
            if (!usedGroupKeys.has(key)) {
              itemsForThisTab = groupedByPU[key] || [];
              usedGroupKeys.add(key);
          break;
      }
          }
        }
        
        organizedLoadItems.push(itemsForThisTab);
      }
      
      setAllLoadItems(organizedLoadItems);
      if (selectedRowIndex === null) {
        setSelectedRowIndex(0);
      }
      
      setIsDaybookInitialized(true);
    }
  }, [isFromDayBook, rows.length, isDaybookInitialized, firstSectionRows.length]); 

  useEffect(() => {
    if (operationType !== "normal") return;
    if (!isManualAdd) return;
    if (selectedRowIndex === null) return;
    if (!rows || rows.length === 0) return;
    if (isFromDayBook) return; 
    
    setAllLoadItems(prev => {
      const updated = [...prev];
      updated[selectedRowIndex] = [...rows];
      return updated;
    });
    
    setDisplayRows([...rows]);
    
    // Clear flag so subsequent effects work normally
    const timer = setTimeout(() => setIsManualAdd(false), 50);
    return () => clearTimeout(timer);
  }, [isManualAdd, rows, operationType, selectedRowIndex, isFromDayBook, setIsManualAdd]);

  
  useEffect(() => {
    if (operationType !== "normal") return;
    if (selectedRowIndex === null) return;
    if (isManualAdd) return; // Skip during manual add to avoid conflicts
    if (isFromDayBook) return; // Skip in daybook mode - data is already loaded
    if (fsmState === "saved") {
      // In view mode, NEVER overwrite parent's rows - they contain ALL load items
      console.log('[SelectedDataComponent2] Skipping setRows in view mode to preserve all load items');
      return;
    }
    
    // CRITICAL SAFEGUARD: If parent's rows has more items than we're about to set,
    // it means we're in view mode and shouldn't overwrite
    if (rows && rows.length > 0 && firstSectionRows.length > 0) {
      const currentTabData = allLoadItems[selectedRowIndex];
      if (currentTabData) {
        const dataArray = Array.isArray(currentTabData) ? currentTabData : [currentTabData];
        // If parent has more rows than what we're setting, don't overwrite (view mode scenario)
        if (rows.length > dataArray.length && rows.length >= firstSectionRows.length) {
          console.log(`[SelectedDataComponent2] WARNING: Parent has ${rows.length} rows but we're trying to set ${dataArray.length}. Skipping to preserve all items.`);
          return;
        }
      }
    }
    
    const currentTabData = allLoadItems[selectedRowIndex];
    if (currentTabData) {
      const dataArray = Array.isArray(currentTabData) ? currentTabData : [currentTabData];
      console.log('[SelectedDataComponent2] Setting rows with current tab data (add/edit mode), count:', dataArray.length);
      setRows(dataArray);
    }
  }, [allLoadItems, selectedRowIndex, operationType, isManualAdd, isFromDayBook, fsmState, setRows, rows, firstSectionRows]);


  useEffect(() => {
    const prevIndex = prevSelectedRowIndexRef.current;
    if (operationType === "normal" && prevIndex !== null && 
        prevIndex !== selectedRowIndex && 
        displayRows && displayRows.length > 0 && 
        !isManualAdd) {
      
      setAllLoadItems(prev => {
        const updated = [...prev];
        // Create a copy that preserves File objects and image_preview
        const savedRows = displayRows.map(item => ({
          ...item,
          // Preserve imageFile (File object) and image_preview (blob URL or path)
          imageFile: item.imageFile instanceof File ? item.imageFile : item.imageFile,
          image_preview: item.image_preview || item.image || null
        }));
        updated[prevIndex] = savedRows;
        return updated;
      });
    }
    prevSelectedRowIndexRef.current = selectedRowIndex;
  }, [selectedRowIndex, displayRows, operationType, isManualAdd]);

  // Track previous firstSectionRows to detect actual changes in merge mode
  const prevFirstSectionRowsRef = React.useRef(firstSectionRows);
  
  // Helper function to check if firstSectionRows actually changed (deep comparison)
  const hasFirstSectionRowsChanged = React.useCallback((prev, current) => {
    if (prev.length !== current.length) return true;
    // Compare by a unique identifier or key fields (like _id or index)
    return prev.some((prevRow, idx) => {
      const currentRow = current[idx];
      return !currentRow || prevRow._id !== currentRow._id || prevRow.amount !== currentRow.amount || prevRow.weight !== currentRow.weight || prevRow.pcs !== currentRow.pcs;
    });
  }, []);
  

  useEffect(() => {
    // Only clear data if we're not in view mode (saved state)
    // In view mode, we want to preserve the data even if rows is temporarily empty
    if (fsmState !== "saved" && (!rows || rows.length === 0) && (!firstSectionRows || firstSectionRows.length === 0)) {
      setDisplayRows([]);
      setAllLoadItems([]);
      setIsManuallyEdited(false);
      setIsDaybookInitialized(false);
    }
  }, [rows, firstSectionRows, fsmState]);

  useEffect(() => {
    if (operationType === "merge") {
     
      if (isFromDayBook) {
        setDisplayRows(rows || []);
        return;
      }
      
      const firstSectionRowsChanged = hasFirstSectionRowsChanged(prevFirstSectionRowsRef.current, firstSectionRows);
      if (firstSectionRowsChanged) {
        prevFirstSectionRowsRef.current = firstSectionRows;
      
        if (firstSectionRows.length > 0) {
          const combinedRow = createCombinedRow(firstSectionRows);
          setDisplayRows(combinedRow ? [combinedRow] : []);
          setRows(combinedRow ? [combinedRow] : []);
        } else {
          setDisplayRows([]);
          setRows([]);
        }
      }
    
    } else {
     
      if (isManualAdd) {
        setDisplayRows(rows || []);
        return;
      }
      
     
      if (selectedRowIndex !== null && allLoadItems[selectedRowIndex]) {
        const stored = allLoadItems[selectedRowIndex];
       
        const displayData = Array.isArray(stored) ? stored : (stored ? [stored] : []);
        const displayDataWithImages = displayData.map((item) => {
          
          if (item.imageFile instanceof File) {
            // Cleanup old blob URL if it exists
            if (item.image_preview && typeof item.image_preview === 'string' && item.image_preview.startsWith('blob:')) {
              try {
                URL.revokeObjectURL(item.image_preview);
              } catch (e) {
                // Ignore errors if URL was already revoked
              }
            }
            // Create new blob URL from File object
            return {
              ...item,
              image_preview: URL.createObjectURL(item.imageFile)
            };
          }
          return item;
        });
        setDisplayRows(displayDataWithImages);
      } else if (firstSectionRows.length === 0 && !isFromDayBook) {
        setDisplayRows([]);
      } else if (isFromDayBook && !isDaybookInitialized) {
        // Don't show data until daybook is properly initialized
        setDisplayRows([]);
      }
    }
  }, [rows, selectedRowIndex, allLoadItems, firstSectionRows, operationType, isManualAdd, isManuallyEdited, isFromDayBook, isDaybookInitialized, isApproved, setIsManualAdd, setRows, createCombinedRow, hasFirstSectionRowsChanged]);


  const headers = SECOND_SECTION_HEADERS;

  const currentPURow = useMemo(() => {
    if (operationType === "merge") {
      // In merge mode, use total of all rows
      if (firstSectionRows.length > 0) {
        const totals = {
          totalAmount: firstSectionRows.reduce(
            (sum, row) => sum + (Number(row.amount) || 0),
            0
          ),
          totalWeight: firstSectionRows.reduce(
            (sum, row) => sum + (Number(row.weight) || 0),
            0
          ),
          totalPcs: firstSectionRows.reduce(
            (sum, row) => sum + (Number(row.pcs) || 0),
            0
          ),
        };

        return totals;
      }
    } else {
      // In normal mode, use specific row data
      if (
        firstSectionRows.length > 0 &&
        selectedRowIndex !== null &&
        selectedRowIndex < firstSectionRows.length
      ) {
        const specificRow = firstSectionRows[selectedRowIndex];

        return {
          totalAmount: Number(specificRow.amount) || 0,
          totalWeight: Number(specificRow.weight) || 0,
          totalPcs: Number(specificRow.pcs) || 0,
        };
      }
    }

    return { totalAmount: 0, totalWeight: 0, totalPcs: 0 };
  }, [firstSectionRows, selectedRowIndex, operationType]);

  return (
    <>
      <Box
        sx={{
          height: "225px",
          overflowX: "scroll",
          overflowY: "hidden",
          width: "1433px",
          alignItems: "flex-start",
          border: "1px solid var(--Line-Table, #C6C6C8)",
          borderRadius: "5px",
          bgcolor: "#FFF",
          marginTop: "10px",
        }}
      >
        <Box
          sx={{
            display: "flex",
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
          <Box
            sx={{
              position: "relative",
              minHeight: "210px",
            }}
          >
            <TableHeaderComponent headers={headers} />
            <Box
              sx={{ height: "155px", overflowX: "hidden", overflowY: "scroll" }}
              className="pikachuuuu"
            >
              {displayRows.map((item, index) => {
                return (
                <TableRowComponent
                    key={item._id || `row-${selectedRowIndex}-${index}-${item.pu_item_id || item.pu_id || ''}`}
                  item={item || {}}
                  index={index}
                  handleNumberChange={handleNumberChange}
                  handleSelectChange={handleSelectChange}
                  onChange={handleLoadItemChange}
                  calculateAmount={calculateAmount}
                  editMemoStatus={editMemoStatus}
                  handleDelete={wrappedHandleDelete}
                  dropdownOptions={dropdownOptions}
                  selectedItems={state.selectedItems}
                  rows={displayRows}
                  setRows={wrappedSetDisplayRows}
                    originalPUtotals={currentPURow}
                    operationType={operationType}
                    isFromDayBook={isFromDayBook}
                    isApproved={isApproved}
                    isEditMode={isEditMode}
                      formatNumberWithCommas={formatNumberWithCommas}
                />
                );
              })}
            </Box>

            <TableForTotalComponent parentHeight={278} rows={displayRows}   formatNumberWithCommas={formatNumberWithCommas} />
          </Box>
        </Box>
      </Box>

      {/* Show Add Row button by default, hide only when explicitly in merge mode */}
      {operationType !== "merge" && (
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
            marginTop: "40px",
        }}
      >
        <AddRowButtonComponent handleAddRow={wrappedHandleAddRow} disabled={disabled} />
      </Box>
      )}
    </>
  );
});

export default SelectedDataComponent2;
