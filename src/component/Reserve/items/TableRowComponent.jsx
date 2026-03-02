import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography, TextField, Autocomplete, Dialog } from "@mui/material";
import { API_URL } from "config/config.js";
import { useRecoilState } from "recoil";
import {
  QuotationtableRowsState,
  QuotationtableRowsDropdownData,
} from "recoil/Reserve/ReserveState";
import { memoInfoState } from "recoil/Reserve/MemoState";
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
import CustomTextField from "./CustomTextField";



const CustomSelectInput = ({
  value,
  onChange,
  options = [],
  width = 138,
  disabled = false,
  onDropdownClick = () => { },
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
          onClick={(e) => disabled ? {} : onDropdownClick(e)}
          sx={{
            "& .MuiOutlinedInput-root": {
              width: `${width}px`,
              height: "34px",
              borderRadius: "4px",
              backgroundColor: disabled ? "#F0F0F0" : "#FFFFFF", // White background for editable fields
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
    handleAddRow = () => { },
    selectedItems = [],
    rows,
    setRows,
    rowData,
    disabled = false,
    triggerFSMDirty,
    formatNumberWithCommas
  }) => {
    const [warningPopup, setWarningPopup] = useState(false);
    const [memoInfo] = useRecoilState(memoInfoState);
    const isApprovedDoc = ((memoInfo?.status || "") + "").toLowerCase() === "approved" || ((memoInfo?.status_approve || "") + "").toLowerCase() === "approved";
    const shouldDisableFields = disabled || isApprovedDoc || (memoInfo?.isDayBookEdit && !editMemoStatus);
    // const [rows, setRows] = useRecoilState(QuotationtableRowsState);
    const [allDropdrownOptions, setAllDropdownOptions] = useRecoilState(
      QuotationtableRowsDropdownData
    );
    const [stones, setStones] = useState([]);
    const [localPreview, setLocalPreview] = useState(null);
    const MAX_IMAGE_BYTES = 500 * 1024; // 500KB
    
  
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
  

      if (field === "amount") {
        return calculateAmount(item || {});
      }

      if (field === "totalAmount") {
        return calculateAmountAfterDiscount(item || {});
      }
      return value;
    };

    const selIndex = index;
    const selectedData = rowData?.find((row) => row._id === rows[index]?._id)


    const handleChange = useCallback(
      (index, field, val, item = {}) => {

        if (field === 'pcs') {
          if (val > selectedData?.pcs) {
            setWarningPopup(true);

          }
        }

        setRows((prevRows) => {
          const obj = {};
          let itm = { ...item, };

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
            newRows[index]["discount_amount"] = calculateDiscount(newRows[index] || {});
          }
          return newRows;
        });
      },
      [setRows]
    );

    const handleAddRowOnClick = (key, index) => {
      if (key === "stone" && selIndex === rows.length - 1) {
        handleAddRow();
      }
    };

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
      { key: "stock_id", component: CustomTextField, bgHighlight: true, disabled: true },
      { key: "stone_code", component: CustomTextField, bgHighlight: true, disabled: true },
      {
        key: "stone",
        component: CustomTextField,
        bgHighlight: true, disabled: true

      },
      {
        key: "shape",
        component: CustomTextField,
        bgHighlight: true, disabled: true

      },
      {
        key: "size",
        component: CustomTextField, bgHighlight: true, disabled: true

      },
      {
        key: "color",
        component: CustomTextField, bgHighlight: true, disabled: true

      },
      {
        key: "cutting",
        component: CustomTextField, bgHighlight: true, disabled: true

      },
      {
        key: "quality",
        component: CustomTextField, bgHighlight: true, disabled: true

      },
      {
        key: "clarity",
        component: CustomTextField, bgHighlight: true, disabled: true

      },
      {
        key: "cer_type",
        component: CustomTextField, 

      },
      { key: "cer_no", component: CustomTextField},
      { key: "location", component: CustomTextField, bgHighlight: true, disabled: true },
      { key: "type", component: CustomTextField, bgHighlight: true, disabled: true },
      { key: "lot_no", component: CustomTextField, bgHighlight: true, disabled: true },
      { key: "pcs", component: CustomTextField, type: "number", noDecimal: true, formatWithCommas: true },
      // { key: "weight_per_piece", component: CustomTextField, type: "number",  decimal: 2 },
      { key: "weight", component: CustomTextField, type: "number", decimal: 3, formatWithCommas: true },
      { key: "price", component: CustomTextField, type: "number", decimal: 2, formatWithCommas: true },
      {
        key: "unit",
        component: CustomSelectInput,
        options: dropdownOptions?.unit || [],
      },
      { key: "amount", component: CustomTextField, type: "number", bgHighlight: true, decimal: 2, formatWithCommas: true },
      { key: "discount_percent", component: CustomTextField, type: "number", decimal: 2, formatWithCommas: true },
      { key: "discount_amount", component: CustomTextField, type: "number",  decimal: 2, formatWithCommas: true },
      { key: "totalAmount", component: CustomTextField, type: "number", bgHighlight: true, decimal: 2, formatWithCommas: true },
      {
        key: "labour",
        component: CustomSelectInput,
        options: dropdownOptions?.labour || [],
      },
      { key: "labour_price", component: CustomTextField, type: "number", decimal: 2, formatWithCommas: true },
      {
        key: "remark",
        component: CustomTextField,
        width: 336,
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
        <Box className="sticky-col-5 sticky-col-text "
          onClick={() => handleDelete(item._id)}
          sx={{
            width: "20px",
            height: "100%",
            /* marginLeft: "2px", */
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            backgroundColor: "#fff",
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
            backgroundColor: "#fff",
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

        {/* Image upload thumbnail + hidden input */}
        <Box
          className="sticky-col-2 sticky-col-text"
          onClick={() => {
            if (isApprovedDoc || shouldDisableFields) return;
            const input = document.getElementById(`reserve-pic-input-${index}`);
            if (input) input.click();
          }}
          sx={{
            width: "40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#fff",
          }}
        >
          <Box
            sx={{
              width: "34px",
              height: "34px",
              borderRadius: "4px",
              backgroundColor: "#F2F2F2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              cursor: (isApprovedDoc || shouldDisableFields) ? "not-allowed" : "pointer",
              opacity: (isApprovedDoc || shouldDisableFields) ? 0.6 : 1,
            }}
          >
            {(() => {
              let rawSrc = rows?.[index]?.image_preview || rows?.[index]?.image;
              if (rawSrc && typeof rawSrc === "string" && rawSrc.startsWith("/uploads/")) {
                rawSrc = `${API_URL}${rawSrc}`;
              }
              const src = rawSrc;
              if (src) {
                return (
                  <img
                    src={src}
                    alt="pic"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                );
              }
              return (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M21 19V6C21 4.89543 20.1046 4 19 4H5C3.89543 4 3 4.89543 3 6V19" stroke="#9E9E9E" strokeWidth="1.5"/>
                  <path d="M3 19L7.5 13.5C8.16667 12.6667 9.33333 12.6667 10 13.5L14 18.5" stroke="#9E9E9E" strokeWidth="1.5"/>
                  <path d="M13.5 15L15.5 12.5C16.1667 11.6667 17.3333 11.6667 18 12.5L21 16" stroke="#9E9E9E" strokeWidth="1.5"/>
                  <circle cx="8" cy="8" r="2" fill="#9E9E9E"/>
                </svg>
              );
            })()}
          </Box>
          <input
            id={`reserve-pic-input-${index}`}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            disabled={isApprovedDoc || shouldDisableFields}
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
            }}
          />
        </Box>

        {fields.map(({ key, component: Component, ...rest }) => {





          return (
            <Box
              key={key}
              className={
                
                key === "stock_id"
                  ? "sticky-col-3 sticky-col-text"
                  : key === "stone_code"
                    ? "sticky-col-4 sticky-col-text"
                    : key === "stone"
                      ? "sticky-col-6 sticky-col-text"
                      : key === "shape"
                        ? "sticky-col-7 sticky-col-text"
                        : ""
              }
              sx={{
                width: "140px",
                backgroundColor: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                /* margin: "1px", */
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
              <Component
                value={valueFormat(
                  rows?.[index]?.[key] ?? "",
                  key,
                  rows?.[index]
                )}
                onChange={(value) => handleChange(index, key, value, rows?.[index])}
                onDropdownClick={() => handleAddRowOnClick(key, index)}
                {...rest}
                formatNumberWithCommas={rest.formatWithCommas ? formatNumberWithCommas : undefined}

                error={key === 'pcs' && rows?.[index]?.pcs > selectedData?.pcs}


                disabled={(() => {
                  
                  if (key === "amount" || key === "totalAmount") {
                    return true;
                  }
                  
                  
                  if (shouldDisableFields) {
                    return true;
                  }
                  
                 
                  const isEditableFromStock = rows?.[index]?.isFromStock && [
                    "pcs", "weight", "price", "weight_per_piece", "unit", 
                    "discount_amount", "discount_percent", "labour", 
                    "labour_price", "remark", "cer_type", "cer_no"
                  ].includes(key);
                  
                  const isEditableFromDayBook = rows?.[index]?.isFromDayBook && [
                    "pcs", "weight", "price", "weight_per_piece", "unit", 
                    "discount_amount", "discount_percent", "labour", 
                    "labour_price", "remark", "cer_type", "cer_no"
                  ].includes(key);
                  
                 
                  return !(isEditableFromStock || isEditableFromDayBook) && rest?.disabled;
                })()}

               


                rows={rows}
              />
            </Box>
          )
        })}
      </Box>
    );
  }
);

export default TableRowComponent;
