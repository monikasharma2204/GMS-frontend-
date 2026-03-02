import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  TextField,
  Autocomplete,
  Dialog,
} from "@mui/material";
import { useRecoilState } from "recoil";
import {
  QuotationtableRowsState,
  QuotationtableRowsDropdownData,
} from "recoil/MemoOutReturn/MemoReturn";
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
import { grandTotalState, memoInfoState } from "recoil/MemoOutReturn/MemoState";

import CustomTextField from "component/MemoIn/items/CustomTextField";

// Reusable TextField Component
// const CustomTextField = ({
//   value,
//   onChange,
//   width = 136,
//   disabled = false,
//   placeholder = "",
//   type = "text",
//   noDecimal = false,
//   alignLeft = false,
//   bgHighlight = false,
//   error = false,
//   decimal = 2,
// }) => {
//   const [internalValue, setInternalValue] = useState(value ?? "");

//   useEffect(() => {
//     if (value !== internalValue) {
//       setInternalValue(value ?? "");
//     }
//   }, [value]);

//   const handleInputChange = (e) => {
//     let newValue = e.target.value;

//     if (noDecimal) {
//       newValue = newValue.replace(/[^0-9]/g, "");
//     } else if (type === "number") {
//       // Allow only one dot, no multiple decimals
//       newValue = newValue.replace(/[^0-9.]/g, "").replace(/(\..*?)\..*/g, "$1"); // keep only first dot
//     }

//     setInternalValue(newValue);
//     onChange(newValue);
//   };

//   const handleBlur = () => {
//     if (!noDecimal && type === "number" && internalValue !== "") {
//       const num = parseFloat(internalValue);
//       const formatted = isNaN(num) ? "" : num.toFixed(decimal);

//       // Avoid setting if already same
//       if (formatted !== internalValue) {
//         setInternalValue(formatted);
//         onChange(formatted);
//       }
//     }
//   };

//   return (
//     <TextField
//       value={internalValue}
//       onChange={handleInputChange}
//       onBlur={handleBlur}
//       onKeyDown={(e) => {
//         if (["e", "E", "+", "-"].includes(e.key) && type === "number") {
//           e.preventDefault();
//         }
//         if ([".", "e", "E", "+", "-"].includes(e.key) && noDecimal) {
//           e.preventDefault();
//         }
//       }}
//       type="text" // to avoid native spinner & uncontrolled formatting
//       placeholder={placeholder}
//       variant="outlined"
//       fullWidth
//       disabled={disabled}
//       error={error}
//       inputProps={{
//         sx: {
//           textAlign: alignLeft ? "left" : "right",
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
//           backgroundColor: bgHighlight ? "#F0F0F0" : "inherit",
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
// };

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
    options.find((option) => option["value"] === value) || defaultOption;
  //  const selectedOption = value;

  return (
    <Autocomplete
      value={selectedOption} // Controlled value
      onChange={(_, newValue) => {
        onChange(newValue ? newValue.value : ""); // Update the parent state
      }}
      onBlur={(event) => {
        // Ensure the value is retained on blur
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
};

const TableRowComponent = React.memo(
  ({
    item,
    index,
    editMemoStatus,
    dropdownOptions = {},
    handleDelete,
    handleAddRow = () => {},
    selectedItems = [],
    disabled = false,
     formatNumberWithCommas, // Add formatNumberWithCommas prop
    // rows,
    // setRows,
  }) => {
    const [warningPopup, setWarningPopup] = useState(false);
    const [rows, setRows] = useRecoilState(QuotationtableRowsState);
    const [allDropdrownOptions, setAllDropdownOptions] = useRecoilState(
      QuotationtableRowsDropdownData
    );
    const [stones, setStones] = useState([]);
    const [memoInfo, setMemoInfo] = useRecoilState(memoInfoState);
    const isDayBookMode = memoInfo?.isDayBookEdit;
    const editableFieldKeys = useMemo(
      () => [
        "cer_type",
        "cer_no",
        "pcs",
        "weight_per_piece",
        "weight",
        "price",
        "unit",
        "discount_percent",
        "discount_amount",
        "remark",
      ],
      []
    );
    const editableFieldsInDayBook = useMemo(
      () => new Set(editableFieldKeys),
      [editableFieldKeys]
    );
    const memoPendingEditableFields = useMemo(
      () => new Set(editableFieldKeys),
      [editableFieldKeys]
    );

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

    const fdata = rows?.[index]?.isFromMemoPending
      ? memoInfo?.memoPendingData?.find(
          (mp) => mp._id === rows?.[index]?.uniqueId
        )
      : memoInfo?.memoReturnDayBookData?.find(
          (mp) => mp._id === rows?.[index]?.uniqueId
        );

    const isMemoPending = rows?.[index]?.isFromMemoPending;
    //  const isDayBook=rows?.[index]?.isFromDayBook

    const handleChange = useCallback(
      (index, field, val, item = {}) => {
        if (field === "pcs" && (isMemoPending || memoInfo?.isDayBookEdit)) {
          if (val > fdata?.pcs) {
            setWarningPopup(true);
          }
        }

        setRows((prevRows) => {
          const obj = {};
          let itm = { ...item };

          let value = val;

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

          if (field === "price" || field === "weight" || field === "pcs") {
            obj["discount_percent"] = 0;
            obj["discount_amount"] = 0;
          }

          const newRows = [...prevRows];
          newRows[index] = { ...newRows[index], [field]: value, ...obj };
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
      [
        setRows,
        isMemoPending,
        memoInfo?.memoPendingData,
        memoInfo?.isDayBookEdit,
        memoInfo?.memoReturnDayBookData,
      ]
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

      {
        key: "stone",
        component: CustomTextField,
        options: dropdownOptions?.stone || [],
        bgHighlight: true,
        disabled: true,
      },
      {
        key: "shape",
        component: CustomTextField,
        options: dropdownOptions?.shape || [],
        bgHighlight: true,
        disabled: true,
      },
      {
        key: "type",
        component: CustomTextField,
        options: dropdownOptions?.type || [],
        bgHighlight: true,
        disabled: true,
      },
      {
        key: "size",
        component: CustomTextField,
        options: dropdownOptions?.size || [],
        bgHighlight: true,
        disabled: true,
      },
      {
        key: "color",
        component: CustomTextField,
        options: dropdownOptions?.color || [],
        bgHighlight: true,
        disabled: true,
      },
      {
        key: "cutting",
        component: CustomTextField,
        options: dropdownOptions?.cutting || [],
        bgHighlight: true,
        disabled: true,
      },
      {
        key: "quality",
        component: CustomTextField,
        options: dropdownOptions?.quality || [],
        bgHighlight: true,
        disabled: true,
      },
      {
        key: "clarity",
        component: CustomTextField,
        options: dropdownOptions?.clarity || [],
        bgHighlight: true,
        disabled: true,
      },
      {
        key: "cer_type",
        component: CustomTextField,
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
        disabled: true,  formatWithCommas: true,
      },
      {
        key: "weight",
        component: CustomTextField,
        type: "number",
        disabled: true,
        decimal: 3,  formatWithCommas: true
      },
      // {
      //   key: "weight_per_piece",
      //   component: CustomTextField,
      //   type: "number",
      //   disabled: true,
      //   decimal: 2
      // },

      {
        key: "price",
        component: CustomTextField,
        type: "number",
        disabled: true,
        decimal: 2, formatWithCommas: true
      },
      {
        key: "unit",
        component: CustomSelectInput,
        options: dropdownOptions?.unit || [],
      },
      {
        key: "amount",
        component: CustomTextField,
        type: "number",
        bgHighlight: true,
        disabled: true,
        decimal: 2, formatWithCommas: true
      },
      { key: "discount_percent", component: CustomTextField, type: "number" ,  formatWithCommas: true},
      { key: "discount_amount", component: CustomTextField, type: "number" ,  formatWithCommas: true},
      {
        key: "totalAmount",
        component: CustomTextField,
        type: "number",
        bgHighlight: true,
        disabled: true,
        decimal: 2, formatWithCommas: true
      },
      {
        key: "ref_no",
        component: CustomTextField,
        bgHighlight: true,
        disabled: true,
      },

      {
        key: "remark",
        component: CustomTextField,
        width: 354,
        placeholder: "Description...........",
        alignLeft: true,
        disabled: true,
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
        <Dialog
          open={warningPopup}
          onClose={() => setWarningPopup(false)}
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
            Not allowed value greater than Consignment value
          </Typography>
        </Dialog>
        {/* Remove Button */}
        <Box
          className="sticky-col-5 sticky-col-text"
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
        <Box
          className="sticky-col-1 sticky-col-text"
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

        <Box
          className="sticky-col-2 sticky-col-text"
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
              key === "stone"
                ? "sticky-col-3 sticky-col-text"
                : key === "shape"
                ? "sticky-col-4 sticky-col-text"
                : ""
            }
            sx={{
              width: "140px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              // margin: "1px",
              padding: "1px",
              backgroundColor: [
                "stone_code",
                "location",
                "lot no.",
                "totalAmount",
                "amount",
              ].includes(key),
            }}
          >
            {(() => {
              const enableInDayBook =
                isDayBookMode && editableFieldsInDayBook.has(key);
              const enableForMemoPending =
                rows?.[index]?.isFromMemoPending &&
                memoPendingEditableFields.has(key);

              const baseDisabled = rest?.disabled ?? false;
              const computedDisabled =
                enableInDayBook || enableForMemoPending ? false : baseDisabled;

              return (
                <Component
                  value={valueFormat(
                    rows?.[index]?.[key] ?? "",
                    key,
                    rows?.[index]
                  )}
                  onChange={(value) =>
                    handleChange(index, key, value, rows?.[index])
                  }
                  onDropdownClick={() => {}}
                        formatNumberWithCommas={formatNumberWithCommas}
                  {...rest}
                  error={
                    key === "pcs" &&
                    (rows?.[index]?.isFromMemoPending || isDayBookMode) &&
                    rows?.[index]?.pcs > fdata?.pcs
                  }
                  disabled={(() => {
                    if (key === "amount" || key === "totalAmount") {
                      return true;
                    }

                    if (disabled) {
                      return true;
                    }

                    if (isDayBookMode && !editMemoStatus) {
                      return true;
                    }
                    const currentRow = rows?.[index];
                    const isFromMemoPending =
                      currentRow?.isFromMemoPending === true;
                    const isFromStock =
                      !isFromMemoPending &&
                      currentRow?.stock_id &&
                      currentRow?.isFromStock === true;

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

                    const stoneFields = [
                      "lot_no",
                      "stone",
                      "shape",
                      "size",
                      "color",
                      "cutting",
                      "quality",
                      "clarity",
                    ];

                    if (!editMemoStatus) {
                      if (isFromMemoPending && !isDayBookMode) {
                        return !editableFieldsInDaybook.includes(key);
                      }

                      return true;
                    }

                    if (editMemoStatus) {
                      if (isDayBookMode) {
                        if (stoneFields.includes(key)) {
                          return true;
                        }

                        return !editableFieldsInDaybook.includes(key);
                      }

                      if (!isFromMemoPending && !isFromStock) {
                        return false;
                      }

                      if (isFromMemoPending) {
                        return !editableFieldsInDaybook.includes(key);
                      }

                      if (isFromStock) {
                        return false;
                      }
                    }

                    return rest?.disabled || false;
                  })()}
                  rows={rows}
                />
              );
            })()}
          </Box>
        ))}
      </Box>
    );
  }
);

export default TableRowComponent;
