import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography, TextField, Autocomplete, Dialog } from "@mui/material";
import { useRecoilState } from "recoil";
import {
  QuotationtableRowsDropdownData,
} from "recoil/Load/LoadState";
import { formatNumberWithCommas } from "../../../helpers/numberHelper.js";
import CustomTextField from "./CustomTextField";

// Reusable TextField Component (memoized for perf)
// const CustomTextField = React.memo(({ 
//   value,
//   onChange,
//   width = 136,
//   disabled = false,
//   placeholder = "",
//   type = "text",
//   noDecimal = false,
//   alignLeft = false,
//   bgHighlight = false,
//   hasError = false,
//   isFromDayBook = false,
// }) => {
//   const inputChange = (input) => {
//     // Only apply number validation if type is "number"
//     if (type === "number") {
//     if (noDecimal) {
//         // Matches positive integers only
//       return (input || "").replace(/[^0-9]/g, "");
//       }
//       // For decimal numbers, allow digits, decimal point, and commas
//       return (input || "").replace(/[^0-9.,]/g, "");
//     }

//     // For text fields, return input as-is
//     return input || "";
//   };

//   const handleChange = (e) => {
//     const newValue = e.target.value;

//     onChange(inputChange(newValue));
//   };

//   return (
//     <TextField
//       value={value}
//       onChange={handleChange}
//       error={hasError}
//       onKeyDown={(e) => {
//         if ([".", "e", "E", "+", "-"].includes(e.key) && noDecimal) {
//           e.preventDefault();
//         }
//       }}
//       type={type}
//       placeholder={placeholder}
//       variant="outlined"
//       fullWidth
//       disabled={disabled}
//       inputProps={{
//         sx: {
//           textAlign : alignLeft ? "left" : "right",
//           color: "black",
//           fontFamily: "Calibri",
//           fontSize: "16px",
//           fontStyle: "normal",
//           fontWeight: 400,
//           "&::-webkit-outer-spin-button": {
//             WebkitAppearance: "none",
//             margin: 0,
//           },
//           "&::-webkit-inner-spin-button": {
//             WebkitAppearance: "none",
//             margin: 0,
//           },
//           "&[type=number]": {
//             MozAppearance: "textfield", // Firefox
//           },
//         },
//       }}
//       sx={{
//         "& .MuiOutlinedInput-root": {
//           width: `${width}px`,
//           height: "34px",
//           borderRadius: "4px",
//           backgroundColor: bgHighlight ? "#F0F0F0" : (disabled && !isFromDayBook ? "#E6E6E6" : "inherit"),
//         },
        
//         "& .MuiOutlinedInput-root.Mui-error > fieldset": {
//           borderColor: "#E00410 !important",
//           borderWidth: "2px",
//         },
//         "& .MuiOutlinedInput-root.Mui-error.Mui-focused > fieldset": {
//           borderColor: "#E00410 !important",
//         },
//         "& .MuiOutlinedInput-root.Mui-error:hover > fieldset": {
//           borderColor: "#E00410 !important",
//         },
//         "& .MuiInputBase-root.Mui-disabled": {
//           "& > fieldset": {
//             borderColor: "#E6E6E6",
//           },
//           bgcolor: "#F0F0F0",
//           borderRadius: "4px",
//         },
//       }}
      
//     />
//   );
// }, (prev, next) => (
//   prev.value === next.value &&
//   prev.disabled === next.disabled &&
//   prev.width === next.width &&
//   prev.type === next.type &&
//   prev.noDecimal === next.noDecimal &&
//   prev.alignLeft === next.alignLeft &&
//   prev.bgHighlight === next.bgHighlight &&
//   prev.hasError === next.hasError
// ));

const CustomSelectInput = React.memo(({ 
  value,
  onChange,
  options = [],
  width = 138,
  disabled = false,
  onDropdownClick = () => {},
}) => {
  const defaultOption = {
    label: value,
    value: value,
  };
  const selectedOption =
    options.find((option) => option["value"] === value) || defaultOption;
  //  const selectedOption = value;

  return (
    <Autocomplete
      value={selectedOption} 
      onChange={(_, newValue) => {
        onChange(newValue ? newValue.value : ""); // Update the parent state
      }}
      onBlur={(event) => {
        
        if (!event.target.value && selectedOption) {
          onChange(selectedOption.value);
        }
      }}
      disabled={disabled}
      disableClearable
      options={options}
      getOptionLabel={(option) => option?.label || ""}
      isOptionEqualToValue={(option, value) => option.value === value.value} // Compare options by value
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          fullWidth
          disabled={disabled}
          onClick={(e) => (disabled ? {} : onDropdownClick(e))}
          sx={{
            "& .MuiOutlinedInput-root": {
              width: `${width}px`,
              height: "34px",
              borderRadius: "4px",
            },
            "& .MuiInputBase-root.Mui-disabled": {
              "& > fieldset": {
                borderColor: "#E6E6E6",
              },
              bgcolor: "#F0F0F0",
              borderRadius: "4px",
            },
          }}
        />
      )}
    />
  );
}, (prev, next) => (
  prev.value === next.value &&
  prev.disabled === next.disabled &&
  prev.width === next.width &&
  (prev.options?.length || 0) === (next.options?.length || 0)
));

const TableRowComponent = React.memo(
  ({
    item,
    index,
    editMemoStatus,
    dropdownOptions = {},
    handleDelete,
    handleAddRow = () => {},
    selectedItems = [],
    rows = [],
    setRows = () => {},
    originalPUtotals = { totalAmount: 0, totalWeight: 0, totalPcs: 0 }, 
    operationType = "normal", // Add operation type
    onChange = () => {}, // Add onChange prop
    isFromDayBook = false, // Add isFromDayBook prop
    isApproved = false, // Add isApproved prop
    isEditMode = false, // Add isEditMode prop
    formatNumberWithCommas
  }) => {
    const [allDropdrownOptions, setAllDropdownOptions] = useRecoilState(
      QuotationtableRowsDropdownData
    );
    const [stones, setStones] = useState([]);
    const [localPreview, setLocalPreview] = useState(null);
    const [imageError, setImageError] = useState(false);
    const MAX_IMAGE_BYTES = 500 * 1024; // 500KB

    // PCS validation state
    const [warningPopup, setWarningPopup] = useState(false);
    const [pcsValidationError, setPcsValidationError] = useState(false);

    // Helper to safely parse numbers with commas
    const parseNum = useCallback((val) => {
      if (val === null || val === undefined) return 0;
      const strMatch = String(val).replace(/,/g, '');
      const num = parseFloat(strMatch);
      return isNaN(num) ? 0 : num;
    }, []);


    
    const closePopup = useCallback(() => {
      // PCS field stays red until the value becomes valid.
      setWarningPopup(false);
    }, [index]);


  
    const validatePcsTotal = useCallback((newRows) => {
     
      
      // Only validate in normal mode (not merge mode)
      if (operationType === "merge") {
        setPcsValidationError(false);
        return true;
      }
      
      // Only validate if we have PU totals
      if (!originalPUtotals || originalPUtotals.totalPcs === 0) {
        
        setPcsValidationError(false);
        return true;
      }
      
      // Check total of ALL Load rows' PCS against individual PU row's PCS
      const totalLoadPcs = newRows.reduce((sum, row) => {
        return sum + parseNum(row.pcs);
      }, 0);
      const puPcs = parseNum(originalPUtotals.totalPcs);
      
    
      
      if (totalLoadPcs > puPcs) {
        setWarningPopup(true);
        setPcsValidationError(true);
        return false;
      } else {
        setPcsValidationError(false);
        return true;
      }
    }, [originalPUtotals, operationType, index]);
  
    useEffect(() => {
      if (selectedItems.length > 0) {
        const newRows = [...selectedItems];
        setRows(newRows);
      }
    }, [selectedItems]);

   
   
   

    // Close popup when validation passes
    useEffect(() => {
      if (!pcsValidationError && warningPopup) {
        setWarningPopup(false);
      }
    }, [pcsValidationError, warningPopup, index]);


    // Calculate stock amount based on stock price, stock unit, and pcs
    const calculateStockAmount = useCallback((currItem) => {
      const stockPrice = parseNum(currItem.stock_price);
      const pcs = parseNum(currItem.pcs);
      const weight = parseNum(currItem.weight);
      const stockUnit = currItem.stock_unit;
      
      let stockAmount = 0;
      if (stockPrice > 0 && stockUnit) {
        if (stockUnit === "pcs" || stockUnit.toLowerCase() === "pcs") {
          stockAmount = pcs * stockPrice;
        } else {
          stockAmount = weight * stockPrice;
        }
      }
      return parseFloat(stockAmount.toFixed(2));
    }, [parseNum]);

    // Calculate sale amount based on sale price, sale unit, and pcs
    const calculateSaleAmount = useCallback((currItem) => {
      const salePrice = parseNum(currItem.sale_price);
      const pcs = parseNum(currItem.pcs);
      const weight = parseNum(currItem.weight);
      const saleUnit = currItem.sale_unit;
      
      let saleAmount = 0;
      if (salePrice > 0 && saleUnit) {
        if (saleUnit === "pcs" || saleUnit.toLowerCase() === "pcs") {
          saleAmount = pcs * salePrice;
        } else {
          saleAmount = weight * salePrice;
        }
      }
      return parseFloat(saleAmount.toFixed(2));
    }, [parseNum]);
    //   this is subtotal

    // Calculate stock_amount and sale_amount when component loads or item changes
    useEffect(() => {
      if (item && rows && rows[index]) {
        const currentItem = rows[index];
        
        // Don't calculate if pcs or weight are empty (user is clearing the field)
        if (currentItem.pcs === "" || currentItem.weight === "") {
          return;
        }
        
        const stockAmount = calculateStockAmount(currentItem);
        const saleAmount = calculateSaleAmount(currentItem);
        
        // Only update if values have changed to avoid infinite loops
        if (currentItem.stock_amount !== stockAmount || currentItem.sale_amount !== saleAmount) {
          setRows(prevRows => {
            const updatedRows = [...prevRows];
            updatedRows[index] = {
              ...updatedRows[index],
              stock_amount: stockAmount,
              sale_amount: saleAmount
            };
            return updatedRows;
          });
        }
      }
    }, [item, rows, index, setRows, calculateStockAmount, calculateSaleAmount]);

    const valueFormat = (value, field, item = {}, index) => {
      if (field === "amount") {
        
        const amountValue = item?.amount !== undefined ? item.amount : 0;
        return formatNumberWithCommas(Number(amountValue).toFixed(2));
      }
     
      if (field === "stock_amount") {
        const stockAmountValue = item?.stock_amount !== undefined ? item.stock_amount : 0;
        
        return formatNumberWithCommas(Number(stockAmountValue).toFixed(2));
      }
      if (field === "sale_amount") {
        const saleAmountValue = item?.sale_amount !== undefined ? item.sale_amount : 0;
        
        return formatNumberWithCommas(Number(saleAmountValue).toFixed(2));
      }
      if (field === "weight") {
        const weightValue = item?.weight || 0;
        // Format weight to exactly 3 decimal places
        return formatNumberWithCommas(Number(weightValue).toFixed(3));
      }
      if (field === "price") {
        return formatNumberWithCommas(Number(item?.price || 0).toFixed(2));
      }
      if (field === "stock_price") {
        return formatNumberWithCommas(Number(item?.stock_price || 0).toFixed(2));
      }
      if (field === "sale_price") {
        return formatNumberWithCommas(Number(item?.sale_price || 0).toFixed(2));
      }
      return value;
    };

    const selIndex = index;
    const handleChange = useCallback(
      (index, field, val, item = {}) => {
        setRows((prevRows) => {
          const obj = {};
          let itm = { ...item };

          let value = val;

         
          if (field === "weight") {
           
            const cleanValue = val.toString().replace(/,/g, '');
            const numValue = parseFloat(cleanValue);
            value = isNaN(numValue) ? 0 : numValue;
           
          }

         
          if (field === "stock_price" || field === "sale_price") {
            // Remove commas and convert to number
            const cleanValue = val.toString().replace(/,/g, '');
            const numValue = parseFloat(cleanValue);
            value = isNaN(numValue) ? 0 : numValue;
            
          }

          const newRows = [...prevRows];
          newRows[index] = { ...newRows[index], [field]: value, ...obj };
          
          // Clear size field when shape changes
          if (field === "shape") {
            newRows[index]["size"] = "";
          }
          
          // Auto-calculate amount when weight or PCS changes
          if (field === "weight" || field === "pcs") {
            const item = newRows[index];
            const currentWeight = parseNum(item.weight);
            const currentPcs = parseNum(item.pcs);
            const currentPrice = parseNum(item.price);
            
            // Check if we're in merge mode (have original PU totals)
            const isMergeMode = originalPUtotals && parseNum(originalPUtotals.totalAmount) > 0 && parseNum(originalPUtotals.totalWeight) > 0;
            
            if (isMergeMode) {
              const totalAmountVal = parseNum(originalPUtotals.totalAmount);
              const totalWeightVal = parseNum(originalPUtotals.totalWeight);
              const averagePrice = totalAmountVal / totalWeightVal;
              newRows[index]["price"] = parseFloat(averagePrice.toFixed(2));
              
              const newAmount = (item.unit || "").toLowerCase() === "pcs" 
                ? currentPcs * averagePrice
                : currentWeight * averagePrice;
              newRows[index]["amount"] = parseFloat(newAmount.toFixed(2));
            } else {
              // Normal mode: Only calculate if user has entered values for weight or pcs
              if (currentPrice > 0 && (currentWeight > 0 || currentPcs > 0)) {
                const newAmount = (item.unit || "").toLowerCase() === "pcs" 
                  ? currentPcs * currentPrice
                  : currentWeight * currentPrice;
                newRows[index]["amount"] = parseFloat(newAmount.toFixed(2));
              }
            }
          }
          
          // Calculate amount when price changes
          if (field === "price") {
            const item = newRows[index];
            const calculatedAmount = item.unit === "pcs"
              ? (item.pcs || 0) * (item.price || 0)
              : (item.weight || 0) * (item.price || 0);
            newRows[index]["amount"] = parseFloat(calculatedAmount.toFixed(2));
          }
          
         
          
          // Calculate stock and sale amounts when relevant fields change
          if (field === "stock_price" || field === "stock_unit" || field === "pcs" || field === "weight") {
           
            const stockAmount = calculateStockAmount(newRows[index] || {});
           
            newRows[index]["stock_amount"] = stockAmount;
          }
          if (field === "sale_price" || field === "sale_unit" || field === "pcs" || field === "weight") {
           
            const saleAmount = calculateSaleAmount(newRows[index] || {});
            
            newRows[index]["sale_amount"] = saleAmount;
          }
          
          // Validate PCS total when PCS field changes
          if (field === "pcs") {
            
            validatePcsTotal(newRows);
          }
          
          // Call parent onChange to update parent state
          if (onChange) {
            onChange(index, field, value);
          }
          
          return newRows;
        });
      },
      [setRows, originalPUtotals, validatePcsTotal, onChange]
    );

    const handleAddRowOnClick = useCallback((key) => {
      if (key === "stone" && selIndex === rows.length - 1) {
        handleAddRow();
      }
    }, [rows.length, selIndex, handleAddRow]);

    useEffect(() => {
      if (rows.length > 0) {
        const stoneLists = rows.map((item) => ({
          label: item?.name || "",
          value: item?.code || "",
        }));
        setStones(stoneLists);
      }
    }, [allDropdrownOptions]);

    // Cleanup created object URL on unmount or change
    useEffect(() => {
      return () => {
        if (localPreview && typeof localPreview === "string" && localPreview.startsWith("blob:")) {
          URL.revokeObjectURL(localPreview);
        }
      };
    }, [localPreview]);

    // Reset image error when image src changes
    useEffect(() => {
      const src = (rows?.[index]?.image_preview) || (rows?.[index]?.image);
      if (src) {
        setImageError(false);
      }
    }, [rows?.[index]?.image, rows?.[index]?.image_preview, index]);

    const fields = React.useMemo(() => ([
      
      { key: "stone_code", component: CustomTextField, disabled: isApproved },
      
      {
        key: "location",
        component: CustomSelectInput,
        options: dropdownOptions?.location || [],
        disabled: isApproved,
       
      },
        {
        key: "stone",
        component: CustomSelectInput,
        options: dropdownOptions?.stone || [],
        disabled: isApproved,
    
      },
      {
        key: "shape",
        component: CustomSelectInput,
        options: dropdownOptions?.shape || [],
        disabled: isApproved,
      
      },
      {
        key: "size",
        component: CustomSelectInput,
        options: dropdownOptions?.size || [],
        disabled: isApproved,
       
      },
      {
        key: "color",
        component: CustomSelectInput,
        options: dropdownOptions?.color || [],
        disabled: isApproved,
        
      },
      {
        key: "cutting",
        component: CustomSelectInput,
        options: dropdownOptions?.cutting || [],
        disabled: isApproved,
       
      },
      {
        key: "quality",
        component: CustomSelectInput,
        options: dropdownOptions?.quality || [],
        disabled: isApproved,
       
      },
      {
        key: "clarity",
        component: CustomSelectInput,
        options: dropdownOptions?.clarity || [],
        disabled: isApproved,
        
      },
      {
        key: "cer_type",
        component: CustomSelectInput,
        options: dropdownOptions?.cerType || [],
        disabled: isApproved,
       
      },
      { key: "cer_no", component: CustomTextField, disabled: isApproved },
    
      { key: "lot_no", component: CustomTextField, disabled: isApproved },

      {
        key: "pcs",
        component: CustomTextField,
        type: "number",
        disabled: isApproved,
        noDecimal: true,
         formatWithCommas: true,
        
      },
      { key: "weight_per_piece", component: CustomTextField ,type:"number", disabled: isApproved ,  formatWithCommas: true,},
      { key: "weight", component: CustomTextField, type: "text", noDecimal: false, disabled: isApproved ,  formatWithCommas: true, },
      { key: "price", component: CustomTextField, type: "number", disabled: true ,  formatWithCommas: true,},
      {
        key: "unit",
        component: CustomSelectInput,
        options: dropdownOptions?.unit || [],
        disabled: true,
      
      },
      { key: "amount", component: CustomTextField, type: "number", formatWithCommas: true,  disabled: isFromDayBook || isApproved},
    
        { key: "stock_price", component: CustomTextField, type: "number", disabled: isApproved , formatWithCommas: true,},
         {
        key: "stock_unit",
        component: CustomSelectInput,
        options: dropdownOptions?.unit || [],
        disabled: isApproved,
      
      },
      { key: "stock_amount", component: CustomTextField, type: "number", disabled: true ,  formatWithCommas: true,},
         { key: "sale_price", component: CustomTextField, type: "number", disabled: isApproved ,  formatWithCommas: true,},
           {
        key: "sale_unit",
        component: CustomSelectInput,
        options: dropdownOptions?.unit || [],
        disabled: isApproved,
      
      },
      { key: "sale_amount", component: CustomTextField, type: "number", disabled: true ,  formatWithCommas: true,},
    
      {
        key: "remark",
        component: CustomTextField,
        width: 331,
        placeholder: "Description...........",
        disabled: isApproved,
        alignLeft: true,
      },
    ]), [dropdownOptions]);

    return (
      <React.Fragment>
      <Box
        sx={{
          height: "42px",
          bgcolor: "#FFF",
          border: "0px solid var(--Line-Table, #C6C6C8)",
          display: "flex",
        }}
      >
        {/* Remove Button */}
        <Box
          onClick={() => {
            if (isApproved || (isFromDayBook && !isEditMode)) return;
            if (item._id) {
              handleDelete(item._id);
            } else if (index !== undefined) {
              // Fallback: if no _id, use index
              handleDelete(`row-${index}`);
            }
          }}
          sx={{
            width: "20px",
            height: "100%",
            marginLeft: "2px",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            cursor: isApproved || (isFromDayBook && !isEditMode) ? "not-allowed" : "pointer",
            opacity: isApproved || (isFromDayBook && !isEditMode) ? 0.5 : 1,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              d="M6.1875 8.4375H11.8125C11.9617 8.4375 12.1048 8.49676 12.2102 8.60225C12.3157 8.70774 12.375 8.85082 12.375 9C12.375 9.14918 12.3157 9.29226 12.2102 9.39775C12.1048 9.50324 11.9617 9.5625 11.8125 9.5625H6.1875C6.03832 9.5625 5.89524 9.50324 5.78975 9.39775C5.68426 9.29226 5.625 9.14918 5.625 9C5.625 8.85082 5.68426 8.70774 5.78975 8.60225C5.89524 8.49676 6.03832 8.4375 6.1875 8.4375Z"
              fill="#E00410"
            />
            <path
              d="M9 15.75C9.88642 15.75 10.7642 15.5754 11.5831 15.2362C12.4021 14.897 13.1462 14.3998 13.773 13.773C14.3998 13.1462 14.897 12.4021 15.2362 11.5831C15.5754 10.7642 15.75 9.88642 15.75 9C15.75 8.11358 15.5754 7.23583 15.2362 6.41689C14.897 5.59794 14.3998 4.85382 13.773 4.22703C13.1462 3.60023 12.4021 3.10303 11.5831 2.76381C10.7642 2.42459 9.88642 2.25 9 2.25C7.20979 2.25 5.4929 2.96116 4.22703 4.22703C2.96116 5.4929 2.25 7.20979 2.25 9C2.25 10.7902 2.96116 12.5071 4.22703 13.773C5.4929 15.0388 7.20979 15.75 9 15.75ZM9 16.875C6.91142 16.875 4.90838 16.0453 3.43153 14.5685C1.95469 13.0916 1.125 11.0886 1.125 9C1.125 6.91142 1.95469 4.90838 3.43153 3.43153C4.90838 1.95469 6.91142 1.125 9 1.125C11.0886 1.125 13.0916 1.95469 14.5685 3.43153C16.0453 4.90838 16.875 6.91142 16.875 9C16.875 11.0886 16.0453 13.0916 14.5685 14.5685C13.0916 16.0453 11.0886 16.875 9 16.875Z"
              fill="#E00410"
            />
          </svg>
        </Box>
        <Box
          sx={{
            width: "25px",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              color: "var(--Main-Text, #343434)",
              fontFamily: "Calibri",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "normal",
            }}
          >
            {index + 1}
          </Typography>
        </Box>


           <Box
             sx={{
               width: "40px",
               display: "flex",
               justifyContent: "center",
               alignItems: "center",
             }}
           >
             <Box
               onClick={() => {
                 if (isApproved || (isFromDayBook && !isEditMode)) return;
                 const input = document.getElementById(`load2-pic-input-${index}`);
                 if (input) input.click();
               }}
               sx={{
                 width: "34px",
                 height: "34px",
                 borderRadius: "4px",
                 backgroundColor: "#F2F2F2",
                 display: "flex",
                 alignItems: "center",
                 justifyContent: "center",
                 overflow: "hidden",
                 cursor: isApproved || (isFromDayBook && !isEditMode) ? "not-allowed" : "pointer",
                 opacity: isApproved || (isFromDayBook && !isEditMode) ? 0.6 : 1,
               }}
             >
               {(() => {
                 const src = (rows?.[index]?.image_preview) || (rows?.[index]?.image);
                 if (src && !imageError) {
                   return (
                     <img
                       src={src}
                       alt="pic"
                       style={{ width: "100%", height: "100%", objectFit: "cover" }}
                       onError={(e) => {
                         console.error("Image failed to load:", src);
                         setImageError(true);
                         e.target.style.display = "none";
                       }}
                     />
                   );
                 }
                 // Show broken image icon if error or no src
                 return (
                   <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
                     {imageError ? (
                       // Broken image indicator
                       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                         <path d="M21 19V6C21 4.89543 20.1046 4 19 4H5C3.89543 4 3 4.89543 3 6V19" stroke="#E00410" strokeWidth="1.5"/>
                         <path d="M3 19L7.5 13.5C8.16667 12.6667 9.33333 12.6667 10 13.5L14 18.5" stroke="#E00410" strokeWidth="1.5"/>
                         <path d="M13.5 15L15.5 12.5C16.1667 11.6667 17.3333 11.6667 18 12.5L21 16" stroke="#E00410" strokeWidth="1.5"/>
                         <circle cx="8" cy="8" r="2" fill="#E00410"/>
                         <path d="M6 6L18 18M18 6L6 18" stroke="#E00410" strokeWidth="2" strokeLinecap="round"/>
                       </svg>
                     ) : (
                       // Default placeholder
                       <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                         <path d="M21 19V6C21 4.89543 20.1046 4 19 4H5C3.89543 4 3 4.89543 3 6V19" stroke="#9E9E9E" strokeWidth="1.5"/>
                         <path d="M3 19L7.5 13.5C8.16667 12.6667 9.33333 12.6667 10 13.5L14 18.5" stroke="#9E9E9E" strokeWidth="1.5"/>
                         <path d="M13.5 15L15.5 12.5C16.1667 11.6667 17.3333 11.6667 18 12.5L21 16" stroke="#9E9E9E" strokeWidth="1.5"/>
                         <circle cx="8" cy="8" r="2" fill="#9E9E9E"/>
                       </svg>
                     )}
                   </Box>
                 );
               })()}
             </Box>
             <input
               id={`load2-pic-input-${index}`}
               type="file"
               accept="image/*"
               style={{ display: "none" }}
               disabled={isApproved || (isFromDayBook && !isEditMode)}
              onChange={(e) => {
                const file = e.target.files && e.target.files[0];
                if (!file) return;
                if (file.size > MAX_IMAGE_BYTES) {
                  alert("Image must be 500KB or less.");
                  e.target.value = "";
                  return;
                }
                const previewUrl = URL.createObjectURL(file);
                if (localPreview && typeof localPreview === "string" && localPreview.startsWith("blob:")) {
                  URL.revokeObjectURL(localPreview);
                }
                setLocalPreview(previewUrl);
                setRows((prev) => {
                  const newRows = [...prev];
                  newRows[index] = {
                    ...newRows[index],
                    image_preview: previewUrl,
                    imageFile: file,
                  };
                  return newRows;
                });
                // Sync imageFile to allLoadItems via onChange
                onChange(index, "imageFile", file);
                onChange(index, "image_preview", previewUrl);
              }}
             />
           </Box>


        {fields.map(({ key, component: Component, ...rest }) => {
          // For amount, stock_amount, and sale_amount fields, use formatted value for display
          // For other fields, use raw value for CustomTextField to handle formatting
          const fieldValue = ["amount", "stock_amount", "sale_amount"].includes(key) ? valueFormat(item?.[key] ?? "", key, item) : (item?.[key] ?? "");
          return (
          <Box
            key={key}
            sx={{
              width: "140px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "1px",
              backgroundColor: [
                "stone_code",
                "location",
                "lot no.",
                "totalAmount",
                "amount",
              ].includes(key),
            }}
          >
            {["amount", "stock_amount", "sale_amount"].includes(key) ? (
              <TextField
                value={fieldValue}
                variant="outlined"
                fullWidth
                disabled={true}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    width: "136px",
                    height: "34px",
                    borderRadius: "4px",
                  },
                  "& .MuiInputBase-root.Mui-disabled": {
                    "& > fieldset": {
                      borderColor: "#E6E6E6",
                    },
                    bgcolor: "#F0F0F0",
                    borderRadius: "4px",
                  },
                }}
                inputProps={{
                  sx: {
                    textAlign: "right",
                    color: "black",
                    fontFamily: "Calibri",
                    fontSize: "16px",
                    fontStyle: "normal",
                    fontWeight: 400,
                  },
                }}
              />
            ) : (
            <Component
                value={fieldValue}
              onChange={(value) =>
                  handleChange(index, key, value, item)
              }
              onDropdownClick={() => handleAddRowOnClick(key, index)}

                formatNumberWithCommas={formatNumberWithCommas}
              {...rest}
              hasError={key === "pcs" && pcsValidationError}
              disabled={
                  isApproved || editMemoStatus || rest?.disabled || 
                  (isFromDayBook && !isEditMode) ||
                  (isEditMode && (key === "weight")) ||
                  (key === "amount" && isFromDayBook) ||
                  (key === "price" || key === "unit") // Always disable price and unit
                }
                isFromDayBook={isFromDayBook}
                rows={[item]}
              />
            )}
      </Box>
          );
        })}
        </Box>

        {/* Warning Popup for PCS Validation */}
      <Dialog
        open={warningPopup}
        
        onClose={(_, reason) => {
          if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            closePopup();
          }
        }}
        PaperProps={{
          sx: {
            borderRadius: "15px",
            width: "590px",
            height: "361px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
      >
        {/* Close Button */}
        <Box
          onClick={closePopup}
          sx={{
            position: "absolute",
            top: "16px",
            right: "16px",
            cursor: "pointer",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            backgroundColor: "#f5f5f5",
            "&:hover": {
              backgroundColor: "#e0e0e0",
            },
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4L4 12M4 4L12 12"
              stroke="#666"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Box>

        <Box sx={{ marginBottom: "24px" }}>
          <svg
            width="112"
            height="112"
            viewBox="0 0 112 112"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_472_206422)">
              <path
                d="M56 105C43.0044 105 30.541 99.8375 21.3518 90.6482C12.1625 81.4589 7 68.9956 7 56C7 43.0044 12.1625 30.541 21.3518 21.3518C30.541 12.1625 43.0044 7 56 7C68.9956 7 81.4589 12.1625 90.6482 21.3518C99.8375 30.541 105 43.0044 105 56C105 68.9956 99.8375 81.4589 90.6482 90.6482C81.4589 99.8375 68.9956 105 56 105ZM56 112C70.8521 112 85.0959 106.1 95.598 95.598C106.1 85.0959 112 70.8521 112 56C112 41.1479 106.1 26.9041 95.598 16.402C85.0959 5.89998 70.8521 0 56 0C41.1479 0 26.9041 5.89998 16.402 16.402C5.89998 26.9041 0 41.1479 0 56C0 70.8521 5.89998 85.0959 16.402 95.598C26.9041 106.1 41.1479 112 56 112Z"
                fill="#ED9738"
              />
              <path
                d="M49.0142 77.0001C49.0142 76.0808 49.1952 75.1706 49.547 74.3213C49.8988 73.472 50.4144 72.7004 51.0644 72.0503C51.7144 71.4003 52.4861 70.8847 53.3354 70.5329C54.1847 70.1811 55.0949 70.0001 56.0142 70.0001C56.9334 70.0001 57.8437 70.1811 58.6929 70.5329C59.5422 70.8847 60.3139 71.4003 60.9639 72.0503C61.6139 72.7004 62.1295 73.472 62.4813 74.3213C62.8331 75.1706 63.0142 76.0808 63.0142 77.0001C63.0142 78.8566 62.2767 80.6371 60.9639 81.9498C59.6512 83.2626 57.8707 84.0001 56.0142 84.0001C54.1576 84.0001 52.3772 83.2626 51.0644 81.9498C49.7517 80.6371 49.0142 78.8566 49.0142 77.0001ZM49.7002 34.9651C49.6069 34.082 49.7004 33.1891 49.9746 32.3445C50.2487 31.4998 50.6973 30.7223 51.2914 30.0622C51.8854 29.4021 52.6116 28.8743 53.4228 28.5131C54.234 28.1518 55.1121 27.9651 56.0002 27.9651C56.8882 27.9651 57.7663 28.1518 58.5775 28.5131C59.3887 28.8743 60.1149 29.4021 60.7089 30.0622C61.303 30.7223 61.7516 31.4998 62.0258 32.3445C62.2999 33.1891 62.3934 34.082 62.3002 34.9651L59.8502 59.5141C59.7678 60.4785 59.3266 61.3769 58.6137 62.0315C57.9007 62.6862 56.9681 63.0495 56.0002 63.0495C55.0323 63.0495 54.0996 62.6862 53.3867 62.0315C52.6737 61.3769 52.2325 60.4785 52.1502 59.5141L49.7002 34.9651Z"
                fill="#ED9738"
              />
            </g>
          </svg>
        </Box>
        <Typography
          sx={{
            marginBottom: "24px",
            color: "#343434",
            textAlign: "center",
            fontFamily: "Calibri",
            fontSize: "24px",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "normal",
          }}
        >
          Warning !
        </Typography>
        <Typography
          sx={{
            marginBottom: "24px",
            color: "#343434",
            textAlign: "center",
            fontFamily: "Calibri",
            fontSize: "18px",
            fontStyle: "normal",
            lineHeight: "normal",
          }}
        >
          Total Load PCS ({rows.reduce((sum, row) => sum + (parseFloat(row.pcs || 0)), 0)}) cannot exceed PU PCS ({originalPUtotals.totalPcs})
        </Typography>
      </Dialog>
      </React.Fragment>
    );
  }
);

export default TableRowComponent;
