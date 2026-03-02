import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography, TextField, Autocomplete } from "@mui/material";
import { useRecoilState } from "recoil";
import {
  QuotationtableRowsState,
  QuotationtableRowsDropdownData,
} from "recoil/PurchaseOrder/PurchaseOrderState";
import CustomTextField from "./CustomTextField";
import {

  calculateOtherPrice,
  getPriceValueFromPercent,
  getPricePercentageFromValue,
  calculateTotalAmountAfterDiscount,
  calculateGrandTotal,
  calculateTotalAfterDiscount,
  getSubTotal,
  getItemAmount,
} from "helpers/quotationHelper";




const CustomSelectInput = ({
  value,
  onChange,
  options = [],
  width = 138,
  disabled = false,
  onDropdownClick = () => {},
  rows,
}) => {
  const defaultOption = {
    label: value,
    value: value,
  };
  const selectedOption =
    options.find((option) => option["label"] === value) || defaultOption;
  //  const selectedOption = value;

  return (
    <Autocomplete
      value={selectedOption} // Controlled value
      onChange={(_, newValue) => {
        onChange(newValue ? newValue.label : ""); // Update the parent state with label (name) instead of value (code)
      }}
      onBlur={(event) => {
        // Ensure the value is retained on blur
        if (!event.target.value && selectedOption) {
          onChange(selectedOption.label);
        }
      }}
      disabled={disabled}
      disableClearable
      options={options}
      getOptionLabel={(option) => option?.label || ""}
      isOptionEqualToValue={(option, value) => option.label === value?.label} // Compare options by label
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
};

const TableRowComponent = (
  ({
    item,
    index,
    editMemoStatus,
    dropdownOptions = {},
    handleDelete,
    handleAddRow = () => {},
    selectedItems = [],
    rows,
    setRows,
     handleShapeChange, // Add this prop
     disabled = false, // Add disabled prop
     isDayBookEdit = false, // Add isDayBookEdit prop
      formatNumberWithCommas, // Add formatNumberWithCommas prop
  }) => {
    // const [rows, setRows] = useRecoilState(QuotationtableRowsState);
    const [allDropdrownOptions, setAllDropdownOptions] = useRecoilState(
      QuotationtableRowsDropdownData
    );
    const [stones, setStones] = useState([]);

   

    useEffect(() => {
      if (selectedItems.length > 0) {
        const newRows = [...selectedItems];
        setRows(newRows);
      }
    }, [selectedItems]);

    const calculateAmount = (currItem, key) => {
      const totalAmount =
        currItem.unit === "pcs"
          ? (currItem.pcs || 0) * (currItem.price || 0)
          : (currItem.weight || 0) * (currItem.price || 0);

      // UpdateItem(currItem,key,'amount',totalAmount)
     return parseFloat(totalAmount).toFixed(2);
    };
    //   this is subtotal
    const calculateAmountAfterDiscount = (currItem) => {
      const afterDiscount = parseFloat(
        calculateAmount(currItem || {}) -
          parseFloat(currItem?.discount_amount || 0)
      ).toFixed(2);

      return afterDiscount;
    };

    const calculateDiscount = (item) => {
      const amount = Number(calculateAmount(item || {}));
      const discountPercent = Number(item?.discount_percent || 0);
      const discount = (discountPercent / 100) * amount;
      return discount.toFixed(2);
    };

    const calculateDiscountPercentage = (item) => {
      const amount = calculateAmount(item || {});
      if (!amount) return 0;
      const discount = ((item.discount_amount || 0) / amount) * 100;
      return parseFloat(Number(discount || 0).toFixed(2));
    };

    const valueFormat = (value, field, item = {}, index) => {
      // if (field === "price") {
      //   return item.items?.length > 0 ? Number(item.items[0].price) : value;
      // }

      // if (field === "weight") {
      //   return item.items?.length > 0 ? item.items[0].weight : value;
      // }

      if (field === "amount") {
        return calculateAmount(item || {});
      }

      // if (field === "discount_amount") {
      //   return calculateDiscount(item || {});
      // }

      if (field === "totalAmount") {
        return calculateAmountAfterDiscount(item || {});
      }

      return value;
    };

    const selIndex = index;
    const handleChange = useCallback(
      (index, field, val, item = {}) => {

         // Special handling for shape changes
        if (field === "shape" && handleShapeChange) {
         
          handleShapeChange(index, val);
          return; // Don't proceed with normal change handling
        }


        setRows((prevRows) => {
          const obj = {};
          let itm = { ...item };

          let value = val;
          
          // Convert unit to lowercase to ensure consistency
          if (field === "unit" && typeof value === "string") {
            value = value.toLowerCase();
          }

          if (field === "discount_percent") {
            itm = { ...item, discount_percent: value };
            const val = calculateDiscount(itm || {});
            obj["discount_amount"] = val;
          }

          if (field === "discount_amount") {
            itm = { ...item, discount_amount: value };
            const val = calculateDiscountPercentage(itm || {});
            obj["discount_percent"] = val;
          }

          // Reset discount when price, weight, pcs, or unit changes
          if (field === "price" || field === "weight" || field === "pcs" || field === "unit") {
            obj["discount_percent"] = 0;
            obj["discount_amount"] = 0;
          }

          const newRows = [...prevRows];
          newRows[index] = { ...newRows[index], [field]: value, ...obj };
          // Always recalculate amount and totalAmount when any relevant field changes
          newRows[index]["amount"] = calculateAmount(newRows[index] || {});
          newRows[index]["totalAmount"] = calculateAmountAfterDiscount(
            newRows[index] || {}
          );
          if (field !== "discount_amount") {
            newRows[index]["discount_amount"] = calculateDiscount(
              newRows[index] || {}
            );
          }
          return newRows;
        });
      },
      [setRows , handleShapeChange]
    );

    // const handleAddRowOnClick = (key, index) => {
    //   if (key === "stone" && selIndex === rows.length - 1) {
    //     handleAddRow();
    //   }
    // };

    useEffect(() => {
      if (rows.length > 0) {
        const stoneLists = rows.map((item) => ({
          label: item?.name || "",
          value: item?.code || "",
        }));
        setStones(stoneLists);
      }
    }, [allDropdrownOptions]);

    const fields = [
      // { key: "stone_code", component: CustomTextField },
      { key: "lot_no", component: CustomTextField },
      {
        key: "stone",
        component: CustomSelectInput,
        options: dropdownOptions?.stone || [],
      },
      {
        key: "shape",
        component: CustomSelectInput,
        options: dropdownOptions?.shape || [],
      },
      {
        key: "size",
        component: CustomSelectInput,
        options: dropdownOptions?.size || [],
      },
      {
        key: "color",
        component: CustomSelectInput,
        options: dropdownOptions?.color || [],
      },
      {
        key: "cutting",
        component: CustomSelectInput,
        options: dropdownOptions?.cutting || [],
      },
      {
        key: "quality",
        component: CustomSelectInput,
        options: dropdownOptions?.quality || [],
      },
      {
        key: "clarity",
        component: CustomSelectInput,
        options: dropdownOptions?.clarity || [],
      },
      {
        key: "cer_type",
        component: CustomSelectInput,
        options: dropdownOptions?.cerType || [],
      },
      { key: "cer_no", component: CustomTextField },
      // { key: "location", component: CustomTextField },
      // { key: "type", component: CustomTextField },

      {
        key: "pcs",
        component: CustomTextField,
        type: "number",
        noDecimal: true,
          formatWithCommas: true,
      },
      { key: "weight_per_piece", component: CustomTextField ,type:"number" ,   formatWithCommas: true,},
      { key: "weight", component: CustomTextField, type: "number" ,  decimal: 3 ,   formatWithCommas: true,  },
      { key: "price", component: CustomTextField, type: "number" , decimal: 2 ,   formatWithCommas: true,},
      {
        key: "unit",
        component: CustomSelectInput,
        options: dropdownOptions?.unit || [],
      },
      { key: "amount", component: CustomTextField, type: "number" , bgHighlight: true  , disabled: true , decimal: 2,   formatWithCommas: true,},
      { key: "discount_percent", component: CustomTextField, type: "number" , decimal: 2,   formatWithCommas: true, },
      { key: "discount_amount", component: CustomTextField, type: "number" , decimal: 2,   formatWithCommas: true, },
      { key: "totalAmount", component: CustomTextField, type: "number" , bgHighlight: true , disabled : true , decimal: 2,   formatWithCommas: true,},
      { key: "ref_no", component: CustomTextField },
      // {
      //   key: "labour",
      //   component: CustomSelectInput,
      //   options: dropdownOptions?.labour || [],
      // },
      // { key: "labour_price", component: CustomTextField ,type:"number"},
      {
        key: "remark",
        component: CustomTextField,
        width: 354,
        placeholder: "Description...........",
        alignLeft: true,
      },
    ];

    return (
      <Box
        sx={{
          height: "42px",
          bgcolor: "#FFF",
          border: "0px solid var(--Line-Table, #C6C6C8)",
          display: "flex",
        }}
      >
        {/* Remove Button */}
        <Box className = "sticky-col-5 sticky-col-text" 
          onClick={() => handleDelete(item._id)}
          sx={{
            width: "20px",
            height: "100%",
            // marginLeft: "2px",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
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
        <Box className="sticky-col-1 sticky-col-text"
          sx={{
            width: "40px",
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

        <Box className="sticky-col-2 sticky-col-text"
          sx={{
            width: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            variant="outlined"
            fullWidth
            disabled="false"
            sx={{
              "& .MuiOutlinedInput-root": {
                width: "34px",
                height: "34px",
                borderRadius: "4px",
                backgroundColor: "#F2F2F2",
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
        </Box>

        {fields.map(({ key, component: Component, ...rest }) => (
          <Box
            key={key}

             className={
                key === "lot_no"
                  ? "sticky-col-3 sticky-col-text"
                  : key === "stone"
                  ? "sticky-col-4 sticky-col-text"
                   : key === "shape"
                      ? "sticky-col-6 sticky-col-text"
                      : ""
              }
            sx={{
              width: "140px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
                padding:"1px",
              backgroundColor: [
                "stone_code",
                "location",
                "lot no.",
                "totalAmount",
                "amount",
              ].includes(key),
            }}
          >
            <Component
              value={valueFormat(
                rows?.[index]?.[key] ?? "",
                key,
                rows?.[index]
              )}
              onChange={(value) =>
                handleChange(index, key, value, rows?.[index])
              }
              onDropdownClick={() => {
                
              }}
                   formatNumberWithCommas={formatNumberWithCommas}
              {...rest}
              disabled={(() => {
                // If disabled prop is true (includes isApproved or shouldDisableFields), disable all fields
                if (disabled) return true;
                
                // If in daybook mode: require editMemoStatus (Edit button clicked) to enable fields
                // This check must happen regardless of disabled prop to ensure daybook mode works correctly
                if (isDayBookEdit) {
                  if (key === "amount" || key === "totalAmount") {
                    return true;
                  }
                  
                  // In daybook mode without Edit button clicked, disable all fields
                  if (!editMemoStatus) return true;
                  
                  // In daybook mode with Edit button clicked:
                  const currentRow = rows?.[index];
                  const isFromMemoPending = currentRow?.isFromMemoPending === true;
                  const isFromStock = !isFromMemoPending && currentRow?.stock_id;
                  
                  // Fields that can be edited for memo pending rows
                  const editableFieldsForMemoPending = [
                    "cer_type",
                    "cer_no",
                    "pcs",
                    "weight_per_piece",
                    "weight",
                    "price",
                    "unit",
                    "discount_amount",
                    "discount_percent",
                    "labour",
                    "labour_price",
                    "remark",
                  ];
                  
                  // If row is from memo pending, allow editing only specific fields
                  if (isFromMemoPending) {
                    return !editableFieldsForMemoPending.includes(key);
                  }
                  
                 
                  if (isFromStock) {
                    return true;
                  }
                  
                  // If row is manually added (not from memo pending/stock), allow editing all fields
                  return false;
                }
              
              
                if (key === "amount" || key === "totalAmount") {
                  return true;
                }
                
                
                if (!isDayBookEdit && editMemoStatus) {
                  const currentRow = rows?.[index];
                  const isFromMemoPending = currentRow?.isFromMemoPending === true;
                  const isFromStock = !isFromMemoPending && currentRow?.stock_id;
                  
                 
                  if (!isFromMemoPending && !isFromStock) {
                    return false; // All fields editable
                  }
                  
                 
                  const editableFieldsInDaybook = [
                    "cer_type",
                    "cer_no",
                    "pcs",
                    "weight_per_piece",
                    "weight",
                    "price",
                    "unit",
                    "discount_amount",
                    "discount_percent",
                    "labour",
                    "labour_price",
                    "remark",
                  ];
                  return !editableFieldsInDaybook.includes(key);
                }
                
                // Fields that can be edited in daybook mode until approved
                const editableFieldsInDaybook = [
                  "cer_type",
                  "cer_no",
                  "pcs",
                  "weight_per_piece",
                  "weight",
                  "price",
                  "unit",
                  "discount_amount",
                  "discount_percent",
                  "labour",
                  "labour_price",
                  "remark",
                ];
                
                // In daybook mode (editMemoStatus), allow editing specified fields until approved
                if (editMemoStatus) {
                  return !editableFieldsInDaybook.includes(key);
                }
                
                // For memo pending or stock data, allow editing specified fields
                if (rows?.[index]?.isFromMemoPending || rows?.[index]?.stock_id) {
                  return !editableFieldsInDaybook.includes(key);
                }
                
                return false;
              })()}
              rows={rows}
            />
          </Box>
        ))}
      </Box>
    );
  }
);

export default React.memo(TableRowComponent);
